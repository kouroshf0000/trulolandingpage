import { ensureSchema, getSql } from "./_lib/db.js";
import { emailBody, emailFooter, emailHeader, emailTemplate, sendEmail, truloEmailTemplate } from "./_lib/email.js";
import { getOptionalEnv } from "./_lib/env.js";
import { methodNotAllowed, readJsonBody, sendJson } from "./_lib/http.js";
import { checkRateLimit } from "./_lib/security.js";
import { sanitizeForEmailHeader, stripHtml } from "./_lib/text.js";
import { verifyTurnstile } from "./_lib/turnstile.js";

const VALID_USER_TYPES = ["has-space", "needs-space"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[a-zA-Z\u00C0-\u024F\s\-]{1,60}$/;

function normalizePhone(value: string): string | null {
  const digits = value.trim().replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === "1") return `+${digits}`;
  return `+${digits}`;
}

export default async function handler(req: { body?: unknown; method?: string; url?: string }, res: { status: (code: number) => { json: (body: unknown) => void } }): Promise<void> {
  if (req.method !== "POST") {
    methodNotAllowed(res as never, ["POST"]);
    return;
  }

  const path = new URL(req.url ?? "/api/waitlist", "https://trulo.local").pathname;
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

  const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const rawUserType = typeof body.userType === "string" ? body.userType.trim().toLowerCase() : "";
  const rawName = typeof body.name === "string" ? body.name.trim() : "";
  const rawPhone = typeof body.phone === "string" ? body.phone : "";
  const turnstileToken = typeof body["cf-turnstile-response"] === "string" ? body["cf-turnstile-response"] : undefined;

  if (!rawEmail) {
    sendJson(res as never, 400, { error: "Email is required" });
    return;
  }
  if (!rawUserType) {
    sendJson(res as never, 400, { error: "User type is required" });
    return;
  }
  if (!EMAIL_RE.test(rawEmail) || rawEmail.length > 254) {
    sendJson(res as never, 400, { error: "Please enter a valid email address" });
    return;
  }
  if (!VALID_USER_TYPES.includes(rawUserType as (typeof VALID_USER_TYPES)[number])) {
    sendJson(res as never, 400, { error: "Invalid user type" });
    return;
  }

  const name = rawName ? (NAME_RE.test(rawName) ? rawName : null) : undefined;
  const phone = rawPhone ? normalizePhone(rawPhone) : undefined;
  if (rawName && !name) {
    sendJson(res as never, 400, { error: "Name can only contain letters, spaces, and hyphens (max 60 chars)" });
    return;
  }
  if (rawPhone && !phone) {
    sendJson(res as never, 400, { error: "Please enter a valid phone number (10+ digits)" });
    return;
  }

  if (!(await verifyTurnstile(req as never, turnstileToken))) {
    sendJson(res as never, 403, { error: "Bot challenge failed" });
    return;
  }

  try {
    await ensureSchema();
    const sql = getSql();

    await sql`
      insert into waitlist_signups (email, user_type, name, phone)
      values (${rawEmail}, ${rawUserType}, ${name ?? null}, ${phone ?? null})
      on conflict (email) do nothing
    `;

    const userTypeLabel = rawUserType === "has-space" ? "has empty space" : "needs space";
    const adminEmail = getOptionalEnv("ADMIN_NOTIFICATION_EMAIL") ?? "kouroshf08@gmail.com";
    const safeEmail = stripHtml(rawEmail);
    const safeName = name ? stripHtml(name) : null;
    const safePhone = phone ?? null;

    await sendEmail({
      to: adminEmail,
      subject: sanitizeForEmailHeader(`New Trulo Waitlist Signup: ${safeEmail}`),
      html: emailTemplate(`
        ${emailHeader("New Waitlist Signup")}
        ${emailBody(`
          <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;">
            Someone just joined the Trulo waitlist.
          </p>
          <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a;">Email</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #18181b;">${safeEmail}</p>
            ${safeName ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a;">Name</p><p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #18181b;">${safeName}</p>` : ""}
            ${safePhone ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a;">Phone</p><p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #18181b;">${safePhone}</p>` : ""}
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a;">Type</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #18181b;">${userTypeLabel}</p>
          </div>
        `)}
        ${emailFooter("Trulo Waitlist Notification")}
      `),
      text: `New waitlist signup.\n\nEmail: ${safeEmail}${safeName ? `\nName: ${safeName}` : ""}${safePhone ? `\nPhone: ${safePhone}` : ""}\nType: ${userTypeLabel}`,
    });

    const firstName = name ? stripHtml(name).split(/\s+/)[0] : "";
    const greeting = firstName ? `Hey ${stripHtml(firstName)}` : "Hey there";
    const isLandlord = rawUserType === "has-space";
    const appUrl = getOptionalEnv("PUBLIC_APP_URL") ?? "https://jointrulo.com";
    const ownersUrl = `${appUrl}/owners?email=${encodeURIComponent(rawEmail)}`;
    const subject = isLandlord ? "You're on the list. Tell us about your space." : "Welcome to the Trulo Waitlist";
    const landlordCtaBlock = isLandlord
      ? `
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: rgba(255,255,255,0.7);">
          To help us match you faster, take 2 minutes to tell us about your property. We review every submission personally.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${ownersUrl}" style="display: inline-block; background: #E67451; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 0; font-size: 15px; font-weight: 600;">List Your Space</a>
        </div>
      `
      : "";

    await sendEmail({
      to: rawEmail,
      subject,
      html: truloEmailTemplate(`
        <div style="text-align: center; padding: 40px 40px 32px 40px;">
          <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Trulo</h1>
        </div>
        <div style="background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 40px; margin: 0 20px;">
          <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 600; color: #ffffff;">${greeting}, you're on the list.</h2>
          <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: rgba(255,255,255,0.7);">
            Thank you for joining the Trulo waitlist. You're now among the first to experience the future of flexible space sharing.
          </p>
          ${landlordCtaBlock}
          <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
            <p style="margin: 0; font-size: 15px; line-height: 24px; color: rgba(255,255,255,0.8);">
              <strong style="color: #ffffff;">What's next?</strong> Keep an eye on your inbox for updates from the Trulo team.
            </p>
          </div>
        </div>
        <div style="text-align: center; padding: 32px 40px;">
          <p style="margin: 0 0 12px 0; font-size: 13px; color: rgba(255,255,255,0.5);">Questions? Reply to this email and we'll get back to you.</p>
          <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.3);">© ${new Date().getFullYear()} Trulo. All rights reserved.</p>
        </div>
      `),
      text: `${greeting}, you're on the list.\n\nThank you for joining the Trulo waitlist.\n\nQuestions? Reply to this email and we'll get back to you.`,
    });

    sendJson(res as never, 200, { success: true, message: "You're on the list!" });
  } catch (error) {
    console.error("Waitlist signup error:", error);
    sendJson(res as never, 500, { error: "Failed to join waitlist" });
  }
}
