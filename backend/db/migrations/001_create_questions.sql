-- Question bank for Exam mode.
-- Run once in the Supabase SQL editor (dev first, then prod).
-- Questions are original; NZQA past papers are reference only and no NZQA text is stored.

create table if not exists public.questions (
    id bigserial primary key,
    standard text not null,
    skill text not null,
    grade_band text not null check (grade_band in ('achieved', 'merit', 'excellence')),
    source text not null check (source in ('generator', 'authored')),
    prompt text not null,
    marking jsonb not null check (jsonb_typeof(marking) = 'object'),
    active boolean not null default true,
    created_at timestamptz not null default now(),
    unique (standard, prompt)
);

create index if not exists questions_bank_lookup_idx
    on public.questions (standard, grade_band, skill)
    where active;

-- No policies: only the backend (service role key) can read or write.
-- Clients never query this table directly, so answers are not exposed.
alter table public.questions enable row level security;
