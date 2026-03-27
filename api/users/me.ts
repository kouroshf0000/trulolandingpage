import { methodNotAllowed, sendJson } from "../_lib/http.js";
import { getSalesSessionUser } from "../_lib/security.js";

export default async function handler(
  req: { headers: Record<string, string | string[] | undefined>; method?: string },
  res: { status: (code: number) => { json: (body: unknown) => void } }
): Promise<void> {
  if (req.method !== "GET") {
    methodNotAllowed(res as never, ["GET"]);
    return;
  }

  const user = getSalesSessionUser(req as never);
  if (!user) {
    sendJson(res as never, 401, { error: "Unauthorized" });
    return;
  }

  sendJson(res as never, 200, user);
}
