import random

from core.database import supabase
from models.ai import ExamQuestion
from question_bank.exam import Slot, pick_bank_questions, to_exam_question


def fill_slots_from_bank(standard: str, slots: list[Slot]) -> list[ExamQuestion | None]:
    """Return a bank question for each slot, or None where the bank has none.

    Never raises: if the bank cannot be read, every slot falls back to AI.
    """
    try:
        candidates = (
            supabase.table("questions")
            .select("id, skill, grade_band")
            .eq("standard", standard)
            .eq("active", True)
            .execute()
            .data
        )
        ids = pick_bank_questions(standard, slots, candidates, random.Random())
        chosen = [question_id for question_id in ids if question_id is not None]
        if not chosen:
            return [None] * len(slots)

        rows = (
            supabase.table("questions")
            .select("id, skill, grade_band, prompt, marking")
            .in_("id", chosen)
            .execute()
            .data
        )
        by_id = {row["id"]: row for row in rows}
        return [to_exam_question(by_id[i]) if i in by_id else None for i in ids]
    except Exception as e:
        print(f"Question bank lookup failed, using AI for all slots: {e}")
        return [None] * len(slots)
