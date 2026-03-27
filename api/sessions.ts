import { getOptionalEnv } from "./_lib/env.js";
import { methodNotAllowed, readJsonBody, sendJson } from "./_lib/http.js";
import { issueSalesSession } from "./_lib/security.js";

const DEFAULT_EMAIL = "contact@jointrulo.com";
const DEFAULT_PASSWORD = "FillSpace1";

export default async function handler(
  req: { body?: unknown; method?: string },
  res: {
    setHeader: (name: string, value: string | string[]) => void;
    status: (code: number) => { json: (body: unknown) => void };
  }
): Promise<void> {
  if (req.method !== "POST") {
    methodNotAllowed(res as never, ["POST"]);
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(req as never);
  } catch {
    sendJson(res as never, 400, { error: "Invalid JSON" });
    return;
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const validEmail = getOptionalEnv("SALES_LOGIN_EMAIL") ?? DEFAULT_EMAIL;
  const validPassword = getOptionalEnv("SALES_LOGIN_PASSWORD") ?? DEFAULT_PASSWORD;

  if (email !== validEmail || password !== validPassword) {
    sendJson(res as never, 401, { error: "Invalid email or password" });
    return;
  }

  issueSalesSession(res as never, validEmail);
  sendJson(res as never, 200, { success: true, user: { email: validEmail } });
}
