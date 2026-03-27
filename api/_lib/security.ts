import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { ensureSchema, getSql } from "./db.js";
import { getEnv } from "./env.js";
import { firstHeader } from "./http.js";

type ApiRequest = {
  headers: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  setHeader: (name: string, value: string | string[]) => void;
};

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
export const SALES_SESSION_COOKIE = "trulo_sales_session";
const SALES_SESSION_MAX_AGE = 60 * 24 * 60 * 60;

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sessionSecret(): string {
  return getEnv("SALES_SESSION_SECRET", "dev-sales-session-secret-change-me");
}

function sign(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function serializeCookie(name: string, value: string, maxAge: number): string {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function issueSalesSession(res: ApiResponse, email: string): void {
  const payload = {
    email,
    exp: Date.now() + SALES_SESSION_MAX_AGE * 1000,
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const token = `${encoded}.${sign(encoded)}`;
  res.setHeader("Set-Cookie", serializeCookie(SALES_SESSION_COOKIE, token, SALES_SESSION_MAX_AGE));
}

export function clearSalesSession(res: ApiResponse): void {
  res.setHeader("Set-Cookie", serializeCookie(SALES_SESSION_COOKIE, "", 0));
}

export function parseCookies(req: ApiRequest): Record<string, string> {
  const raw = firstHeader(req.headers.cookie) ?? "";
  return raw
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, chunk) => {
      const eq = chunk.indexOf("=");
      if (eq === -1) return acc;
      const key = chunk.slice(0, eq).trim();
      const value = chunk.slice(eq + 1).trim();
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

export function getSalesSessionUser(req: ApiRequest): { email: string } | null {
  const token = parseCookies(req)[SALES_SESSION_COOKIE];
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }
  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as { email?: string; exp?: number };
    if (!payload.email || !payload.exp || payload.exp < Date.now()) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export function getClientIp(req: ApiRequest): string {
  const forwarded = firstHeader(req.headers["x-forwarded-for"]);
  if (forwarded) return forwarded.split(",")[0].trim();
  return firstHeader(req.headers["x-real-ip"]) ?? "unknown";
}

export async function checkRateLimit(req: ApiRequest, path: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const ip = getClientIp(req);
  const keyHash = createHash("sha256").update(`${ip}|${path}`).digest("hex");
  const minuteTs = Math.floor(Date.now() / RATE_WINDOW_MS);

  await sql`
    delete from rate_limits
    where minute_ts < ${minuteTs - 2}
  `;

  const existing = await sql<{ count: number }[]>`
    select count from rate_limits where key_hash = ${keyHash} and minute_ts = ${minuteTs}
  `;
  const count = existing[0]?.count ?? 0;
  if (count >= RATE_LIMIT) return false;

  await sql`
    insert into rate_limits (key_hash, minute_ts, count)
    values (${keyHash}, ${minuteTs}, 1)
    on conflict (key_hash, minute_ts)
    do update set count = rate_limits.count + 1
  `;

  return true;
}
