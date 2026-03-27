import { ensureSchema, getSql } from "../_lib/db";
import { emailBody, emailFooter, emailHeader, emailTemplate, sendEmail } from "../_lib/email";
import { getOptionalEnv } from "../_lib/env";
import { methodNotAllowed, readJsonBody, sendJson } from "../_lib/http";
import { checkRateLimit } from "../_lib/security";
import { sanitizeForEmailHeader, stripHtml } from "../_lib/text";
import { verifyTurnstile } from "../_lib/turnstile";
import { BOSTON_AREAS } from "../../src/shared/bostonAreas";
import { tenantsSubmitSchema } from "../../src/shared/tenantsSchema";

const TENANT_LABELS: Record<string, Record<string, string>> = {
  space: { office: "Office", retail: "Retail", restaurant: "Restaurant", studio: "Studio", industrial: "Industrial", mixed: "Mixed", other: "Other" },
  sqft: { under_500: "Under 500", "500_1000": "500–1,000", "1000_2500": "1,000–2,500", "2500_5000": "2,500–5,000", "5000_plus": "5,000+" },
  headcount: { "1-5": "1–5", "6-10": "6–10", "11-25": "11–25", "26-50": "26–50", "50+": "50+" },
  timeline: { asap: "ASAP", "1_3_months": "1–3 months", "3_6_months": "3–6 months", planning_ahead: "Planning ahead" },
  budget: { under_2k: "Under $2k", "2_5k": "$2–5k", "5_10k": "$5–10k", "10_20k": "$10–20k", "20k_plus": "$20k+" },
};

export default async function handler(req: { body?: unknown; method?: string; url?: string }, res: { status: (code: number) => { json: (body: unknown) => void } }): Promise<void> {
  if (req.method !== "POST") {
    methodNotAllowed(res as never, ["POST"]);
    return;
  }

  const path = new URL(req.url ?? "/api/tenants/submit", "https://trulo.local").pathname;
  if (!(await checkRateLimit(req as never, path))) {
    sendJson(res as never, 429, { error: "Too many requests. Please try again later." });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(req as never);
  } catch {
    sendJson(res as never, 400, { error: "Invalid JSON body" });
    return;
  }

  const turnstileToken = typeof body["cf-turnstile-response"] === "string" ? body["cf-turnstile-response"] : undefined;
  if (!(await verifyTurnstile(req as never, turnstileToken))) {
    sendJson(res as never, 403, { error: "Challenge failed" });
    return;
  }

  const parsed = tenantsSubmitSchema.safeParse(body);
  if (!parsed.success) {
    sendJson(res as never, 400, {
      error: "Validation failed",
      fields: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const data = parsed.data;

  try {
    await ensureSchema();
    const sql = getSql();

    await sql`
      insert into tenant_waitlist (
        full_name, email, phone, company_name, role,
        space_types, sqft_range, headcount, boston_areas, boston_areas_other,
        move_in_timeline, monthly_budget, how_heard, notes
      ) values (
        ${stripHtml(data.full_name)},
        ${stripHtml(data.email)},
        ${data.phone ?? null},
        ${stripHtml(data.company_name)},
        ${data.role},
        ${sql.json(data.space_types)},
        ${data.sqft_range},
        ${data.headcount ?? null},
        ${sql.json(data.boston_areas)},
        ${data.boston_areas_other ?? null},
        ${data.move_in_timeline},
        ${data.monthly_budget},
        ${data.how_heard ?? null},
        ${data.notes ?? null}
      )
    `;

    const tenantSpaceLabels = data.space_types.map((type) => TENANT_LABELS.space[type] ?? type).join(", ");
    const tenantBostonLabels = data.boston_areas.map((key) => BOSTON_AREAS[key] ?? key).join(", ") + (data.boston_areas_other ? ` (${stripHtml(data.boston_areas_other)})` : "");
    const rows = [
      ["Name", stripHtml(data.full_name)],
      ["Email", stripHtml(data.email)],
      ["Phone", data.phone ?? "—"],
      ["Company", stripHtml(data.company_name)],
      ["Role", data.role],
      ["Space types", tenantSpaceLabels],
      ["Sqft range", TENANT_LABELS.sqft[data.sqft_range] ?? data.sqft_range],
      ["Headcount", data.headcount ? TENANT_LABELS.headcount[data.headcount] ?? data.headcount : "—"],
      ["Boston neighborhoods", tenantBostonLabels],
      ["Move-in timeline", TENANT_LABELS.timeline[data.move_in_timeline] ?? data.move_in_timeline],
      ["Monthly budget", TENANT_LABELS.budget[data.monthly_budget] ?? data.monthly_budget],
      ["How heard", data.how_heard ?? "—"],
      ["Notes", data.notes ?? "—"],
    ] as const;

    const rowsHtml = rows
      .map(([label, value]) => `<tr><td style="padding:8px 12px 8px 0; color:#71717a; font-size:14px;">${label}</td><td style="padding:8px 0; font-size:14px; color:#18181b;">${stripHtml(String(value))}</td></tr>`)
      .join("");

    await sendEmail({
      to: getOptionalEnv("ADMIN_NOTIFICATION_EMAIL") ?? "kouroshf08@gmail.com",
      subject: sanitizeForEmailHeader(`New Tenant Interest: ${stripHtml(data.company_name)}`),
      html: emailTemplate(`
        ${emailHeader("New Tenant Early Access Request")}
        ${emailBody(`
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #71717a;">Form submitted and saved to tenant_waitlist.</p>
          <table style="width:100%; border-collapse: collapse;">${rowsHtml}</table>
        `)}
        ${emailFooter("Trulo — stored in tenant_waitlist")}
      `),
      text: `New tenant submission from ${stripHtml(data.full_name)}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}`,
    });

    sendJson(res as never, 200, { message: "Submission received" });
  } catch (error) {
    console.error("Tenants submit error:", error);
    sendJson(res as never, 500, { error: "Something went wrong" });
  }
}
