import { getOptionalEnv } from "./_lib/env.js";
import { methodNotAllowed, readJsonBody, requireTrustedOrigin, sendJson } from "./_lib/http.js";
import { checkRateLimit, issueSalesSession, safeEqual } from "./_lib/security.js";

export default async function handler(
  req: { body?: unknown; headers: Record<string, string | string[] | undefined>; method?: string; url?: string },
  res: {
    setHeader: (name: string, value: string | string[]) => void;
    status: (code: number) => { json: (body: unknown) => void };
  }
): Promise<void> {
  if (req.method !== "POST") {
    methodNotAllowed(res as never, ["POST"]);
    return;
  }
  if (!requireTrustedOrigin(req as never, res as never)) return;

  const path = req.url ? new URL(req.url, "https://trulo.local").pathname : "/api/sessions";
  if (!(await checkRateLimit(req as never, path))) {
    sendJson(res as never, 429, { error: "Too many requests. Please try again later." });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(req as never);
  } catch {
    sendJson(res as never, 400, { error: "Invalid JSON" });
    return;
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const validEmail = getOptionalEnv("SALES_LOGIN_EMAIL");
  const validPassword = getOptionalEnv("SALES_LOGIN_PASSWORD");

  if (!validEmail || !validPassword) {
    sendJson(res as never, 503, { error: "Sales authentication is not configured" });
    return;
  }

  if (!safeEqual(email, validEmail.toLowerCase()) || !safeEqual(password, validPassword)) {
    sendJson(res as never, 401, { error: "Invalid email or password" });
    return;
  }

  issueSalesSession(res as never, validEmail.toLowerCase());
  sendJson(res as never, 200, { success: true, user: { email: validEmail.toLowerCase() } });
}
