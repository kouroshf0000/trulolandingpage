import { clearSalesSession } from "./_lib/security";
import { methodNotAllowed, sendJson } from "./_lib/http";

export default async function handler(
  req: { method?: string },
  res: {
    setHeader: (name: string, value: string | string[]) => void;
    status: (code: number) => { json: (body: unknown) => void };
  }
): Promise<void> {
  if (req.method !== "GET") {
    methodNotAllowed(res as never, ["GET"]);
    return;
  }

  clearSalesSession(res as never);
  sendJson(res as never, 200, { success: true });
}
