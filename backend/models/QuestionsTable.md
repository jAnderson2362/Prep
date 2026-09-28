## Questions Table

The questions table is the pre-built question bank that Exam mode draws from before falling back to AI generation.
Questions are original. NZQA past papers are used as reference only and no NZQA text is stored.

Migration: `backend/db/migrations/001_create_questions.sql` (run in the Supabase SQL editor)

# id
- bigserial, unique identifier for each question
# standard
- text, the achievement standard code, e.g. `AS91261`
# skill
- text, the generator or authored skill id, e.g. `solve_quadratic_factorising`. The skill decides which blueprint method area the question fills (see `backend/question_bank/skills.py`)
# grade_band
- text, one of `achieved`, `merit`, `excellence`
# source
- text, `generator` (built by a script, answer-first) or `authored` (written by a person)
# prompt
- text, the question shown to the student. Unique per standard
# marking
- jsonb, how the question is marked:
  - `answer_type` - kind of answer, e.g. `solutions`
  - `answer` - canonical answer values as strings, e.g. `["-2", "3/2"]`
  - `model_answer` - the answer shown to the student, e.g. `x = -2 or x = 3/2`
  - `explanation` - short worked reasoning shown after the exam
  - `working` - list of working steps
  - `generator` - for generated questions, the generator version and parameters used, so any question can be rebuilt and checked
# active
- boolean, inactive questions are never served. Defaults to true
# created_at
- timestamptz, defaults to the current timestamp

## Row Level Security

- RLS is enabled with no policies, so only the backend (service role key) can read or write. Clients never query this table directly, so answers are not exposed

## Purpose

- Serving bank questions is cheaper than generating with AI, and computable questions are guaranteed correct because they are built answer-first
