"""Generate question bank instances and insert them into the questions table.

Run from the backend directory:

    python -m scripts.seed_questions --skill solve_quadratic_factorising --count 50
    python -m scripts.seed_questions --skill solve_quadratic_factorising --count 10 --dry-run

Re-running is safe: prompts that already exist for the standard are skipped.
"""
import argparse
import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from question_bank.skills import SKILLS, generate_batch


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--skill", required=True, choices=sorted(SKILLS))
    parser.add_argument("--count", type=int, required=True)
    parser.add_argument("--seed", type=int, default=None, help="random seed, for a reproducible batch")
    parser.add_argument("--dry-run", action="store_true", help="print questions instead of inserting them")
    args = parser.parse_args()

    questions = generate_batch(args.skill, args.count, args.seed)
    if len(questions) < args.count:
        print(f"Only {len(questions)} unique questions could be generated.", file=sys.stderr)

    rows = [q.model_dump() for q in questions]

    if args.dry_run:
        print(json.dumps(rows, indent=2))
        return

    from core.database import supabase_admin

    if supabase_admin is None:
        sys.exit("SUPABASE_SERVICE_KEY is not set in backend/.env.")

    response = (
        supabase_admin.table("questions")
        .upsert(rows, on_conflict="standard,prompt", ignore_duplicates=True)
        .execute()
    )
    print(f"Generated {len(rows)}, inserted {len(response.data)} new questions for {args.skill}.")


if __name__ == "__main__":
    main()
