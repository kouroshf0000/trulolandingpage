import { z } from "zod";
import { BOSTON_AREAS } from "./bostonAreas";

const validBostonKeys = new Set(Object.keys(BOSTON_AREAS));

const optionalString = (max: number) =>
  z.union([z.string().max(max), z.literal(""), z.undefined()]).optional().transform((s) => (!s || s === "" ? undefined : s));

export const ownersSubmitSchema = z.object({
  waitlist_email: z.string().email(),
  full_name: z.string().min(2).max(80),
  phone: z
    .union([z.string().regex(/^\+?[1-9]\d{7,14}$/), z.literal(""), z.undefined()])
    .optional()
    .transform((s) => (!s || s === "" ? undefined : s)),
  role: z.enum(["owner", "property_manager", "broker"]),
  company_name: optionalString(100),
  property_address: z.string().min(5).max(200),
  unit_floor: optionalString(50),
  space_type: z.enum(["office", "retail", "restaurant", "studio", "industrial", "mixed", "other"]),
  sqft: z.number().int().positive().max(500000),
  num_units: z.number().int().positive().default(1),
  vacancy_status: z.enum(["vacant_now", "available_soon", "planning_ahead"]),
  min_term_months: z.number().int().min(1).max(12).optional().default(1),
  portfolio_count: z.enum(["1", "2-5", "6-10", "10+"]),
  boston_areas: z.array(z.string()).min(1).max(20).refine(
    (arr) => arr.every((k) => validBostonKeys.has(k)),
    { message: "Invalid boston_areas" }
  ),
  ma_areas_other: optionalString(200),
  "cf-turnstile-response": z.string().min(1),
});

export type OwnersSubmitInput = z.infer<typeof ownersSubmitSchema>;
