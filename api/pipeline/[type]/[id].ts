import { ensureSchema, getSql } from "../../_lib/db.js";
import { methodNotAllowed, queryValue, readJsonBody, sendJson } from "../../_lib/http.js";
import { getSalesSessionUser } from "../../_lib/security.js";

const TABLES: Record<string, string> = {
  host: "pipeline_hosts",
  hosts: "pipeline_hosts",
  tenant: "pipeline_tenants",
  tenants: "pipeline_tenants",
  booking: "pipeline_bookings",
  bookings: "pipeline_bookings",
};

export default async function handler(
  req: {
    body?: unknown;
    headers: Record<string, string | string[] | undefined>;
    method?: string;
    query: Record<string, string | string[] | undefined>;
  },
  res: { status: (code: number) => { json: (body: unknown) => void } }
): Promise<void> {
  if (!["PUT", "DELETE"].includes(req.method ?? "")) {
    methodNotAllowed(res as never, ["PUT", "DELETE"]);
    return;
  }

  if (!getSalesSessionUser(req as never)) {
    sendJson(res as never, 401, { error: "Unauthorized" });
    return;
  }

  const type = queryValue(req.query.type);
  const id = queryValue(req.query.id);
  const table = type ? TABLES[type] : undefined;
  if (!table || !id) {
    sendJson(res as never, 400, { error: "Invalid type" });
    return;
  }

  try {
    await ensureSchema();
    const sql = getSql();

    if (req.method === "DELETE") {
      await sql.unsafe(`delete from ${table} where id = $1`, [id]);
      sendJson(res as never, 200, { ok: true });
      return;
    }

    const body = await readJsonBody(req as never);
    if (body.notes != null) {
      await sql.unsafe(`update ${table} set notes = $1 where id = $2`, [String(body.notes), id]);
    }
    if (body.steps != null) {
      await sql.unsafe(`update ${table} set steps = $1 where id = $2`, [JSON.stringify(body.steps), id]);
    }

    sendJson(res as never, 200, { ok: true });
  } catch (error) {
    console.error(`Pipeline ${req.method} failed:`, error);
    sendJson(res as never, 500, { error: req.method === "DELETE" ? "Failed to delete" : "Failed to update" });
  }
}
