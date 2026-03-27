import { ensureSchema, getSql } from "../_lib/db.js";
import { methodNotAllowed, readJsonBody, sendJson } from "../_lib/http.js";
import { getSalesSessionUser } from "../_lib/security.js";

type PipelineRow = {
  id: string;
  name: string;
  contact: string | null;
  detail: string | null;
  notes: string | null;
  steps: Record<string, { done: boolean; doneAt: string | null }> | null;
  created_at: string | Date;
  host_id?: string | null;
  tenant_id?: string | null;
  monthly_fee?: number | null;
};

function requireUser(req: { headers: Record<string, string | string[] | undefined> }, res: { status: (code: number) => { json: (body: unknown) => void } }): boolean {
  if (!getSalesSessionUser(req as never)) {
    sendJson(res as never, 401, { error: "Unauthorized" });
    return false;
  }
  return true;
}

function mapRow(row: PipelineRow) {
  return {
    id: row.id,
    name: row.name,
    contact: row.contact ?? "",
    detail: row.detail ?? "",
    notes: row.notes ?? "",
    steps: row.steps ?? {},
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    ...(row.host_id != null ? { hostId: row.host_id } : {}),
    ...(row.tenant_id != null ? { tenantId: row.tenant_id } : {}),
    ...(row.monthly_fee != null ? { monthlyFee: row.monthly_fee } : {}),
  };
}

export default async function handler(
  req: { body?: unknown; headers: Record<string, string | string[] | undefined>; method?: string },
  res: { status: (code: number) => { json: (body: unknown) => void } }
): Promise<void> {
  if (!["GET", "POST"].includes(req.method ?? "")) {
    methodNotAllowed(res as never, ["GET", "POST"]);
    return;
  }
  if (!requireUser(req, res)) return;

  try {
    await ensureSchema();
    const sql = getSql();

    if (req.method === "GET") {
      const [hosts, tenants, bookings] = await Promise.all([
        sql<PipelineRow[]>`select * from pipeline_hosts order by created_at desc`,
        sql<PipelineRow[]>`select * from pipeline_tenants order by created_at desc`,
        sql<PipelineRow[]>`select * from pipeline_bookings order by created_at desc`,
      ]);
      sendJson(res as never, 200, {
        hosts: hosts.map(mapRow),
        tenants: tenants.map(mapRow),
        bookings: bookings.map(mapRow),
      });
      return;
    }

    const body = await readJsonBody(req as never);
    const type = typeof body.type === "string" ? body.type : "";
    const id = typeof body.id === "string" ? body.id : "";
    const name = typeof body.name === "string" ? body.name : "";
    const contact = typeof body.contact === "string" ? body.contact : "";
    const detail = typeof body.detail === "string" ? body.detail : "";
    const notes = typeof body.notes === "string" ? body.notes : "";
    const steps = typeof body.steps === "object" && body.steps ? body.steps : {};

    if (!type || !id || !name) {
      sendJson(res as never, 400, { error: "type, id, name required" });
      return;
    }

    if (type === "host") {
      await sql`
        insert into pipeline_hosts (id, name, contact, detail, notes, steps)
        values (${id}, ${name}, ${contact}, ${detail}, ${notes}, ${sql.json(steps as never)})
      `;
    } else if (type === "tenant") {
      await sql`
        insert into pipeline_tenants (id, name, contact, detail, notes, steps)
        values (${id}, ${name}, ${contact}, ${detail}, ${notes}, ${sql.json(steps as never)})
      `;
    } else if (type === "booking") {
      const hostId = typeof body.hostId === "string" ? body.hostId : null;
      const tenantId = typeof body.tenantId === "string" ? body.tenantId : null;
      const monthlyFee = typeof body.monthlyFee === "number" ? body.monthlyFee : null;
      await sql`
        insert into pipeline_bookings (id, name, contact, detail, notes, steps, host_id, tenant_id, monthly_fee)
        values (${id}, ${name}, ${contact}, ${detail}, ${notes}, ${sql.json(steps as never)}, ${hostId}, ${tenantId}, ${monthlyFee})
      `;
    } else {
      sendJson(res as never, 400, { error: "Invalid type" });
      return;
    }

    sendJson(res as never, 200, { ok: true });
  } catch (error) {
    console.error(`Pipeline ${req.method} failed:`, error);
    sendJson(res as never, 500, { error: req.method === "GET" ? "Failed to load pipeline" : "Failed to save" });
  }
}
