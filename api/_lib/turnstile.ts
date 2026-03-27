import { getClientIp } from "./security.js";

type ApiRequest = {
  headers: Record<string, string | string[] | undefined>;
};

export async function verifyTurnstile(req: ApiRequest, token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: getClientIp(req),
    }),
  });

  const data = (await response.json()) as { success?: boolean };
  return Boolean(data.success);
}
