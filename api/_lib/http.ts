import { getOptionalEnv } from "./env.js";

type ApiRequest = {
  body?: unknown;
  method?: string;
  headers: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  send: (body: string) => void;
  setHeader: (name: string, value: string | string[]) => void;
};

export async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body) as Record<string, unknown>;
  }
  if (Buffer.isBuffer(req.body)) {
    return JSON.parse(req.body.toString("utf8")) as Record<string, unknown>;
  }
  if (typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
  throw new Error("Invalid JSON body");
}

export function sendJson(res: ApiResponse, status: number, body: unknown): void {
  applyApiSecurityHeaders(res);
  res.status(status).json(body);
}

export function methodNotAllowed(res: ApiResponse, methods: string[]): void {
  res.setHeader("Allow", methods.join(", "));
  sendJson(res, 405, { error: "Method not allowed" });
}

export function firstHeader(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function queryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function applyApiSecurityHeaders(res: ApiResponse): void {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
}

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function requestOrigin(req: ApiRequest): string | null {
  const origin = firstHeader(req.headers.origin);
  return origin ? normalizeOrigin(origin) : null;
}

function requestHostOrigin(req: ApiRequest): string | null {
  const host = firstHeader(req.headers["x-forwarded-host"]) ?? firstHeader(req.headers.host);
  if (!host) return null;
  const proto = firstHeader(req.headers["x-forwarded-proto"]) ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${proto}://${host}`;
}

export function hasTrustedOrigin(req: ApiRequest): boolean {
  const origin = requestOrigin(req);
  if (!origin) return true;

  const publicAppUrl = getOptionalEnv("PUBLIC_APP_URL");
  if (publicAppUrl && normalizeOrigin(publicAppUrl) === origin) {
    return true;
  }

  if (requestHostOrigin(req) === origin) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function requireTrustedOrigin(req: ApiRequest, res: ApiResponse): boolean {
  if (hasTrustedOrigin(req)) return true;
  sendJson(res, 403, { error: "Untrusted origin" });
  return false;
}
