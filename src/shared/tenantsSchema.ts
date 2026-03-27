import { z } from "zod";
import { BOSTON_AREAS } from "./bostonAreas";

const validBostonKeys = new Set(Object.keys(BOSTON_AREAS));

const optionalString = (max: number) =>
  z.union([z.string().max(max), z.literal(""), z.undefined()]).optional().transform((s) => (!s || s === "" ? undefined : s));

export const tenantsSubmitSchema = z.object({
  full_name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z
    .union([z.string().regex(/^\+?[1-9]\d{7,14}$/), z.literal(""), z.undefined()])
    .optional()
    .transform((s) => (!s || s === "" ? undefined : s)),
  company_name: z.string().min(1).max(100),
  role: z.string().min(1).max(80),
  space_types: z.array(z.enum(["office", "retail", "restaurant", "studio", "industrial", "mixed", "other"])).min(1),
  sqft_range: z.enum(["under_500", "500_1000", "1000_2500", "2500_5000", "5000_plus"]),
  headcount: z.enum(["1-5", "6-10", "11-25", "26-50", "50+"]).optional(),
  boston_areas_other: optionalString(200),
  boston_areas: z.array(z.string()).min(1).max(20).refine(
    (arr) => arr.every((k) => validBostonKeys.has(k)),
    { message: "Invalid boston_areas" }
  ),
  move_in_timeline: z.enum(["asap", "1_3_months", "3_6_months", "planning_ahead"]),
  monthly_budget: z.enum(["under_2k", "2_5k", "5_10k", "10_20k", "20k_plus"]),
  how_heard: optionalString(200),
  notes: optionalString(1000),
  "cf-turnstile-response": z.string().min(1),
}).refine(
  (data) => !data.boston_areas.includes("other") || (data.boston_areas_other && data.boston_areas_other.trim().length > 0),
  { message: "Specify neighborhood when selecting Other", path: ["boston_areas_other"] }
);

export type TenantsSubmitInput = z.infer<typeof tenantsSubmitSchema>;
