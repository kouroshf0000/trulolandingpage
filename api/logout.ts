import { clearSalesSession } from "./_lib/security.js";
import { methodNotAllowed, requireTrustedOrigin, sendJson } from "./_lib/http.js";

export default async function handler(
  req: { headers: Record<string, string | string[] | undefined>; method?: string },
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

  clearSalesSession(res as never);
  sendJson(res as never, 200, { success: true });
}
