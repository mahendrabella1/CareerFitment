-- OneGrasp job portal (Launchpad): job listings imported daily from permitted
-- sources, plus sync logs and listing reports.
--
-- Safe to run more than once: every object is created only if missing and no
-- existing table is dropped or rewritten. Run it in the Supabase SQL editor
-- (or with the Supabase CLI) before the first import. See docs/JOB_PORTAL.md.
--
-- Access model
--   jobs             anyone (anon + signed-in) may READ active listings only;
--                    nobody but the service role (server-side importer) writes.
--   job_sources      server-only (sync status, permission records).
--   job_sync_runs    server-only (importer logs).
--   job_reports      server-only (reports go through /api/jobs/report).

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------ sources
create table if not exists public.job_sources (
  id                    text primary key,            -- 'remotive', 'greenhouse:acme', ...
  name                  text not null,
  kind                  text not null check (kind in ('aggregator', 'employer', 'onegrasp', 'school')),
  terms_url             text,                        -- where the permission was reviewed
  permission_note       text,
  reviewed_on           date,
  complete_snapshot     boolean not null default false,  -- one fetch returns ALL of the source's live jobs
  stale_days            integer not null default 21,     -- fallback expiry when it doesn't
  last_run_at           timestamptz,
  last_success_at       timestamptz,
  last_complete_sync_at timestamptz,
  last_status           text check (last_status in ('ok', 'partial', 'failed', 'skipped')),
  last_message          text,                        -- short, no secrets or stack traces
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ------------------------------------------------------------------ jobs
create table if not exists public.jobs (
  id              uuid primary key default gen_random_uuid(),
  source          text not null references public.job_sources(id),
  external_id     text not null,
  title           text not null,
  company         text not null,
  company_logo    text,
  location        text,
  employment_type text not null default 'Unknown'
                  check (employment_type in ('Full-time', 'Part-time', 'Internship', 'Contract', 'Temporary', 'Unknown')),
  workplace_type  text not null default 'Unknown'
                  check (workplace_type in ('Remote', 'Hybrid', 'On-site', 'Unknown')),
  -- Read from the title only ("Senior ...", "... Intern"); shown as a hint, never as a requirement.
  experience_hint text check (experience_hint in ('internship', 'entry', 'senior')),
  is_fresher      boolean not null default false,  -- the listing itself says fresher / entry level / graduate
  description     text,                            -- plain text, only from sources whose terms allow it
  salary_text     text,                            -- only when the source states it
  apply_url       text not null check (apply_url like 'https://%'),
  source_url      text check (source_url is null or source_url like 'https://%'),
  attribution     text,                            -- e.g. 'via Remotive' - shown on every card
  category        text,                            -- one of the 17 OneGrasp career clusters
  role_match      text,                            -- a OneGrasp roadmap role the title matches
  trust_level     text not null default 'standard' check (trust_level in ('verified', 'standard', 'caution')),
  trust_flags     text[] not null default '{}',
  reported_count  integer not null default 0,      -- open reports; set by /api/jobs/report, never by the importer
  posted_at       timestamptz,                     -- when the source says it was posted (may be null)
  first_seen_at   timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),  -- last import that saw it live
  is_active       boolean not null default true,
  inactive_reason text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  search          tsvector generated always as (
                    to_tsvector('simple',
                      coalesce(title, '') || ' ' || coalesce(company, '') || ' ' || coalesce(location, '') || ' ' ||
                      coalesce(category, '') || ' ' || coalesce(role_match, '') || ' ' || coalesce(left(description, 3000), ''))
                  ) stored,
  unique (source, external_id)
);

create index if not exists jobs_active_posted_idx on public.jobs (is_active, posted_at desc nulls last);
create index if not exists jobs_category_idx      on public.jobs (category) where is_active;
create index if not exists jobs_type_idx          on public.jobs (employment_type, workplace_type) where is_active;
create index if not exists jobs_role_idx          on public.jobs (role_match) where is_active;
create index if not exists jobs_source_seen_idx   on public.jobs (source, last_seen_at);
create index if not exists jobs_search_idx        on public.jobs using gin (search);

-- ------------------------------------------------------------------ logs
create table if not exists public.job_sync_runs (
  id          uuid primary key default gen_random_uuid(),
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  status      text check (status in ('ok', 'partial', 'failed')),
  trigger     text,                                -- 'cron', 'manual'
  results     jsonb not null default '[]'::jsonb   -- per source: fetched, upserted, expired, status, message
);

-- ------------------------------------------------------------------ reports
create table if not exists public.job_reports (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid not null references public.jobs(id) on delete cascade,
  reason        text not null check (reason in ('scam', 'expired', 'wrong_info', 'duplicate', 'other')),
  details       text check (char_length(details) <= 500),
  reporter_hash text not null,                     -- salted hash of the reporter's IP, for rate limiting
  status        text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at    timestamptz not null default now()
);
create index if not exists job_reports_job_idx      on public.job_reports (job_id, status);
create index if not exists job_reports_reporter_idx on public.job_reports (reporter_hash, created_at);

-- ------------------------------------------------------------------ row-level security
alter table public.job_sources   enable row level security;
alter table public.jobs          enable row level security;
alter table public.job_sync_runs enable row level security;
alter table public.job_reports   enable row level security;

-- Public visitors and signed-in users may read ACTIVE listings - nothing else.
-- No insert/update/delete policies exist, so only the service role (which
-- bypasses RLS, server-side only) can write. job_sources, job_sync_runs and
-- job_reports have no policies at all: no public read or write.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'jobs' and policyname = 'Active jobs are public') then
    create policy "Active jobs are public" on public.jobs for select to anon, authenticated using (is_active);
  end if;
end $$;

revoke insert, update, delete on public.jobs from anon, authenticated;
revoke all on public.job_sources, public.job_sync_runs, public.job_reports from anon, authenticated;
