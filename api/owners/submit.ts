import { ensureSchema, getSql } from "../_lib/db.js";
import { emailBody, emailFooter, emailHeader, emailTemplate, sendEmail } from "../_lib/email.js";
import { getOptionalEnv } from "../_lib/env.js";
import { methodNotAllowed, readJsonBody, sendJson } from "../_lib/http.js";
import { checkRateLimit } from "../_lib/security.js";
import { sanitizeForEmailHeader, stripHtml } from "../_lib/text.js";
import { verifyTurnstile } from "../_lib/turnstile.js";
import { BOSTON_AREAS } from "../../src/shared/bostonAreas.js";
import { ownersSubmitSchema } from "../../src/shared/ownersSchema.js";

export default async function handler(req: { body?: unknown; method?: string; url?: string }, res: { status: (code: number) => { json: (body: unknown) => void } }): Promise<void> {
  if (req.method !== "POST") {
    methodNotAllowed(res as never, ["POST"]);
    return;
  }

  const path = new URL(req.url ?? "/api/owners/submit", "https://trulo.local").pathname;
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

  const parsed = ownersSubmitSchema.safeParse(body);
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
      insert into property_submissions (
        waitlist_email, full_name, company_name, role, phone,
        property_address, unit_floor, space_type, sqft, num_units,
        vacancy_status, min_term_months, portfolio_count, boston_areas, ma_areas_other
      ) values (
        ${stripHtml(data.waitlist_email)},
        ${stripHtml(data.full_name)},
        ${data.company_name ? stripHtml(data.company_name) : null},
        ${data.role},
        ${data.phone ?? null},
        ${stripHtml(data.property_address)},
        ${data.unit_floor ?? null},
        ${data.space_type},
        ${data.sqft},
        ${data.num_units},
        ${data.vacancy_status},
        ${data.min_term_months},
        ${data.portfolio_count},
        ${sql.json(data.boston_areas)},
        ${data.ma_areas_other ?? null}
      )
    `;

    const ownerBostonLabels = data.boston_areas.map((key) => BOSTON_AREAS[key] ?? key).join(", ");
    const ownerRows = [
      ["Name", stripHtml(data.full_name)],
      ["Email", stripHtml(data.waitlist_email)],
      ["Phone", data.phone ?? "—"],
      ["Role", data.role],
      ["Company", data.company_name ? stripHtml(data.company_name) : "—"],
      ["Property address", stripHtml(data.property_address)],
      ["Suite / floor", data.unit_floor ?? "—"],
      ["Space type", data.space_type],
      ["Square footage", String(data.sqft)],
      ["Units available", String(data.num_units)],
      ["Vacancy status", { vacant_now: "Vacant now", available_soon: "Available within 3 months", planning_ahead: "Planning ahead" }[data.vacancy_status] ?? data.vacancy_status],
      ["Portfolio count", data.portfolio_count],
      ["Boston neighborhoods", ownerBostonLabels],
      ["Other MA areas", data.ma_areas_other ?? "—"],
    ] as const;

    const rowsHtml = ownerRows
      .map(([label, value]) => `<tr><td style="padding:8px 12px 8px 0; color:#71717a; font-size:14px;">${label}</td><td style="padding:8px 0; font-size:14px; color:#18181b;">${stripHtml(String(value))}</td></tr>`)
      .join("");

    await sendEmail({
      to: getOptionalEnv("ADMIN_NOTIFICATION_EMAIL") ?? "kouroshf08@gmail.com",
      subject: sanitizeForEmailHeader(`New Property Submission: ${stripHtml(data.property_address)}`),
      html: emailTemplate(`
        ${emailHeader("New Landlord Property Submission")}
        ${emailBody(`<table style="width:100%; border-collapse: collapse;">${rowsHtml}</table>`)}
        ${emailFooter("Trulo — stored in property_submissions")}
      `),
      text: `New property submission from ${stripHtml(data.full_name)}\n\n${ownerRows.map(([label, value]) => `${label}: ${value}`).join("\n")}`,
    });

    sendJson(res as never, 200, { message: "Submission received" });
  } catch (error) {
    console.error("Owners submit error:", error);
    sendJson(res as never, 500, { error: "Something went wrong" });
  }
}
