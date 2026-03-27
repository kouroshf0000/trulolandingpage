import postgres from "postgres";
import { getEnv } from "./env.js";

declare global {
  // eslint-disable-next-line no-var
  var __truloSql: ReturnType<typeof postgres> | undefined;
  // eslint-disable-next-line no-var
  var __truloSchemaReady: Promise<void> | undefined;
}

function connectionString(): string {
  return (
    process.env.SUPABASE_DB_URL ??
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL ??
    getEnv("SUPABASE_DB_URL")
  );
}

export function getSql() {
  if (!globalThis.__truloSql) {
    globalThis.__truloSql = postgres(connectionString(), {
      idle_timeout: 20,
      max: 1,
      prepare: false,
      ssl: "require",
    });
  }
  return globalThis.__truloSql;
}

export async function ensureSchema(): Promise<void> {
  if (!globalThis.__truloSchemaReady) {
    globalThis.__truloSchemaReady = initializeSchema();
  }
  await globalThis.__truloSchemaReady;
}

async function initializeSchema(): Promise<void> {
  const sql = getSql();

  await sql`
    create table if not exists waitlist_signups (
      id bigserial primary key,
      email text not null unique,
      user_type text not null,
      name text,
      phone text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists idx_waitlist_signups_email on waitlist_signups (email)`;

  await sql`
    create table if not exists property_submissions (
      id bigserial primary key,
      waitlist_email text not null,
      full_name text not null,
      company_name text,
      role text not null,
      phone text,
      property_address text not null,
      unit_floor text,
      space_type text not null,
      sqft integer not null,
      num_units integer not null,
      vacancy_status text not null,
      min_term_months integer not null default 1,
      portfolio_count text not null,
      boston_areas jsonb not null,
      ma_areas_other text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists tenant_waitlist (
      id bigserial primary key,
      full_name text not null,
      email text not null,
      phone text,
      company_name text not null,
      role text not null,
      space_types jsonb not null,
      sqft_range text not null,
      headcount text,
      boston_areas jsonb not null,
      boston_areas_other text,
      move_in_timeline text not null,
      monthly_budget text not null,
      how_heard text,
      notes text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists rate_limits (
      key_hash text not null,
      minute_ts bigint not null,
      count integer not null default 1,
      primary key (key_hash, minute_ts)
    )
  `;

  await sql`
    create table if not exists pipeline_hosts (
      id text primary key,
      name text not null,
      contact text,
      detail text,
      notes text,
      steps jsonb,
      created_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists pipeline_tenants (
      id text primary key,
      name text not null,
      contact text,
      detail text,
      notes text,
      steps jsonb,
      created_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists pipeline_bookings (
      id text primary key,
      name text not null,
      contact text,
      detail text,
      notes text,
      steps jsonb,
      host_id text,
      tenant_id text,
      monthly_fee double precision,
      created_at timestamptz not null default now()
    )
  `;
}
