/** Boston neighborhood keys for property submissions — shared between React and worker */
export const BOSTON_AREAS: Record<string, string> = {
  downtown: "Downtown / Financial District",
  back_bay: "Back Bay / Newbury St",
  south_end: "South End",
  seaport: "Seaport / Innovation District",
  fenway: "Fenway / Kenmore",
  allston_brighton: "Allston / Brighton",
  jamaica_plain: "Jamaica Plain",
  roxbury_dorchester: "Roxbury / Dorchester",
  south_boston: "South Boston / Broadway",
  east_boston: "East Boston",
  cambridge: "Cambridge",
  somerville: "Somerville",
  other: "Other",
};

export const BOSTON_AREA_KEYS = Object.keys(BOSTON_AREAS) as (keyof typeof BOSTON_AREAS)[];
