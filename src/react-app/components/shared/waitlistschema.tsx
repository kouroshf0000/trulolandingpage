import { z } from "zod";

function normalizePhone(s: string): string | null {
  const digits = s.trim().replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === "1") return `+${digits}`;
  return `+${digits}`;
}

export const waitlistSubmitSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address").transform((s) => s.trim().toLowerCase()),
    userType: z.preprocess(
      (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
      z.enum(["has-space", "needs-space"], { errorMap: () => ({ message: "Invalid user type" }) })
    ),
    name: z
      .union([
        z.string().max(60).regex(/^[a-zA-Z\u00C0-\u024F\s\-]*$/, "Name can only contain letters, spaces, and hyphens (max 60 chars)"),
        z.literal(""),
        z.undefined(),
      ])
      .optional()
      .transform((s) => (!s || (typeof s === "string" && s.trim() === "") ? undefined : (typeof s === "string" ? s.trim() : undefined))),
    phone: z.union([z.string(), z.literal(""), z.undefined()]).optional(),
    "cf-turnstile-response": z.string().optional(),
  })
  .refine((data) => !data.name || data.name.length >= 1, { message: "Name can only contain letters, spaces, and hyphens (max 60 chars)", path: ["name"] })
  .refine((data) => !data.phone || normalizePhone(data.phone) !== null, { message: "Please enter a valid phone number (10+ digits)", path: ["phone"] })
  .transform((data) => ({
    ...data,
    name: data.name || undefined,
    phone: data.phone ? normalizePhone(data.phone) ?? undefined : undefined,
  }));

export type WaitlistSubmitInput = z.output<typeof waitlistSubmitSchema>;
