-- OneGrasp Assessment Platform — core schema
-- Normalized: journey -> blueprint_parameter -> sub_trait -> question
-- Sessions capture what was generated, what was answered, and what was scored.

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. JOURNEYS
-- ============================================================
create table journeys (
  id               uuid primary key default gen_random_uuid(),
  code             text unique not null,            -- e.g. 'career_discovery'
  name             text not null,                    -- e.g. 'Career Discovery'
  age_group        text not null,                    -- e.g. 'Class 6-8'
  total_questions  int not null,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- 2. BLUEPRINT PARAMETERS (the weighted line-items per journey)
-- ============================================================
create table blueprint_parameters (
  id                  uuid primary key default gen_random_uuid(),
  journey_id          uuid not null references journeys(id) on delete cascade,
  name                text not null,                 -- e.g. 'Personality'
  weight_pct          numeric(5,2) not null,
  question_count      int not null,
  min_per_subtrait    int not null default 4,
  ideal_per_subtrait  int not null default 6,
  max_per_subtrait    int not null default 8,
  sort_order          int not null default 0,
  unique (journey_id, name)
);
create index idx_bp_journey on blueprint_parameters(journey_id);

-- ============================================================
-- 3. SUB-TRAITS (the psychometric scales inside a parameter)
-- ============================================================
create table sub_traits (
  id            uuid primary key default gen_random_uuid(),
  parameter_id  uuid not null references blueprint_parameters(id) on delete cascade,
  name          text not null,
  unique (parameter_id, name)
);
create index idx_st_parameter on sub_traits(parameter_id);

-- ============================================================
-- 4. QUESTIONS (the pool — never referenced directly by the frontend)
-- ============================================================
create table questions (
  id               uuid primary key default gen_random_uuid(),
  sub_trait_id     uuid not null references sub_traits(id) on delete cascade,
  question_text    text not null,
  question_type    text not null check (question_type in ('likert5','yes_no','mcq')),
  options          jsonb,             -- mcq: ["opt A","opt B","opt C","opt D"]; else null
  correct_answer   text,              -- mcq only ('A'|'B'|'C'|'D')
  reverse_scored   boolean not null default false,
  is_active        boolean not null default true,
  version          int not null default 1,
  created_at       timestamptz not null default now()
);
create index idx_q_subtrait_active on questions(sub_trait_id) where is_active;

-- ============================================================
-- 5. ASSESSMENT SESSIONS
-- ============================================================
create table assessment_sessions (
  id            uuid primary key default gen_random_uuid(),
  journey_id    uuid not null references journeys(id),
  user_id       uuid,                 -- nullable: anonymous sessions allowed
  status        text not null default 'in_progress'
                  check (status in ('in_progress','completed','abandoned')),
  generated_at  timestamptz not null default now(),
  completed_at  timestamptz
);
create index idx_sessions_user on assessment_sessions(user_id);

-- Which exact questions were assigned to a session.
-- The unique constraint is the hard, DB-enforced version of "no duplicate
-- questions in a session" — the app-layer Set() is a first line of defense,
-- this is the one that can't be bypassed by a bug.
create table session_questions (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references assessment_sessions(id) on delete cascade,
  question_id    uuid not null references questions(id),
  parameter_id   uuid not null references blueprint_parameters(id),
  sub_trait_id   uuid not null references sub_traits(id),
  display_order  int not null,
  unique (session_id, question_id)
);
create index idx_sq_session on session_questions(session_id, display_order);

-- ============================================================
-- 6. RESPONSES
-- ============================================================
create table assessment_responses (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references assessment_sessions(id) on delete cascade,
  question_id  uuid not null references questions(id),
  raw_value    text not null,          -- '1'-'5' | 'Y'/'N' | 'A'-'D'
  answered_at  timestamptz not null default now(),
  unique (session_id, question_id)
);

-- ============================================================
-- 7. SCORES (per sub-trait and rolled up per parameter)
-- ============================================================
create table session_scores (
  id                 uuid primary key default gen_random_uuid(),
  session_id         uuid not null references assessment_sessions(id) on delete cascade,
  parameter_id       uuid not null references blueprint_parameters(id),
  sub_trait_id       uuid references sub_traits(id),   -- null = parameter-level rollup
  raw_score          numeric,
  normalized_score    numeric,          -- 0-100
  scoring_strategy   text not null,     -- e.g. 'likert_average', 'riasec_code'
  computed_at        timestamptz not null default now()
);
create index idx_scores_session on session_scores(session_id);

-- ============================================================
-- Row Level Security — locked down by default.
-- Question banks and blueprints are readable by anyone (needed to render
-- the assessment); sessions/responses/scores are only visible to their
-- owner. Service-role key (used by API routes) bypasses RLS entirely.
-- ============================================================
alter table journeys enable row level security;
alter table blueprint_parameters enable row level security;
alter table sub_traits enable row level security;
alter table questions enable row level security;
alter table assessment_sessions enable row level security;
alter table session_questions enable row level security;
alter table assessment_responses enable row level security;
alter table session_scores enable row level security;

create policy "public read journeys" on journeys for select using (is_active);
create policy "public read parameters" on blueprint_parameters for select using (true);
create policy "public read subtraits" on sub_traits for select using (true);
create policy "public read questions" on questions for select using (is_active);

create policy "owner reads own sessions" on assessment_sessions
  for select using (auth.uid() = user_id or user_id is null);
create policy "owner reads own session_questions" on session_questions
  for select using (
    exists (select 1 from assessment_sessions s
            where s.id = session_questions.session_id
            and (s.user_id = auth.uid() or s.user_id is null))
  );
create policy "owner reads own responses" on assessment_responses
  for select using (
    exists (select 1 from assessment_sessions s
            where s.id = assessment_responses.session_id
            and (s.user_id = auth.uid() or s.user_id is null))
  );
create policy "owner reads own scores" on session_scores
  for select using (
    exists (select 1 from assessment_sessions s
            where s.id = session_scores.session_id
            and (s.user_id = auth.uid() or s.user_id is null))
  );
