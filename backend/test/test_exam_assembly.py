import random

import pytest

from models.ai import ExamQuestion
from question_bank import quadratic_factorising as qf
from question_bank.exam import (
    Slot,
    assemble_exam,
    build_exam_slots,
    pick_bank_questions,
    to_exam_question,
)

SOLVING = "Forming and solving linear and quadratic equations"
BLUEPRINT = {
    "method_areas": [SOLVING, "Area B", "Area C", "Area D", "Area E"],
    "excellence_method_area": SOLVING,
}


def question(text: str, difficulty: str = "achieved", method_area: str = "any") -> ExamQuestion:
    return ExamQuestion(
        question=text, model_answer="a", explanation="e", difficulty=difficulty, method_area=method_area
    )


def bank_row(row_id: int, skill: str = qf.SKILL, grade_band: str = "achieved") -> dict:
    return {"id": row_id, "skill": skill, "grade_band": grade_band}


# build_exam_slots

@pytest.mark.parametrize(
    "count, achieved, merit, excellence",
    [(1, 1, 0, 0), (3, 1, 1, 1), (5, 2, 2, 1), (10, 4, 4, 2), (20, 8, 8, 4)],
)
def test_slot_difficulty_spread(count, achieved, merit, excellence):
    slots = build_exam_slots(BLUEPRINT, count)
    difficulties = [slot.difficulty for slot in slots]

    assert len(slots) == count
    assert difficulties == ["achieved"] * achieved + ["merit"] * merit + ["excellence"] * excellence


def test_slots_rotate_method_areas():
    slots = build_exam_slots(BLUEPRINT, 5)

    assert slots == [
        Slot("achieved", SOLVING),
        Slot("achieved", "Area B"),
        Slot("merit", "Area C"),
        Slot("merit", "Area D"),
        Slot("excellence", SOLVING),
    ]


# pick_bank_questions

def test_picks_matching_bank_question():
    slots = build_exam_slots(BLUEPRINT, 5)
    picked = pick_bank_questions("AS91261", slots, [bank_row(7)], random.Random(0))

    assert picked == [7, None, None, None, None]


def test_skips_wrong_grade_band_standard_and_unknown_skill():
    slots = [Slot("achieved", SOLVING)]
    candidates = [bank_row(1, grade_band="merit"), bank_row(2, skill="unknown_skill")]

    assert pick_bank_questions("AS91261", slots, candidates, random.Random(0)) == [None]
    assert pick_bank_questions("AS91262", slots, [bank_row(3)], random.Random(0)) == [None]


def test_each_skill_used_once_per_paper():
    slots = [Slot("achieved", SOLVING), Slot("achieved", SOLVING)]
    picked = pick_bank_questions("AS91261", slots, [bank_row(1), bank_row(2)], random.Random(0))

    assert picked[0] in {1, 2}
    assert picked[1] is None


def test_to_exam_question_uses_marking():
    generated = qf.generate(random.Random(3))
    row = {
        "id": 1,
        "skill": generated.skill,
        "grade_band": generated.grade_band,
        "prompt": generated.prompt,
        "marking": generated.marking.model_dump(),
    }

    result = to_exam_question(row)

    assert result.question == generated.prompt
    assert result.model_answer == generated.marking.model_answer
    assert result.explanation == generated.marking.explanation
    assert result.difficulty == "achieved"
    assert result.method_area == SOLVING


# assemble_exam

SLOTS = [Slot("achieved", SOLVING), Slot("achieved", "Area B"), Slot("merit", "Area C")]
FALLBACK = [
    question("fallback achieved", "achieved"),
    question("fallback merit", "merit"),
    question("fallback excellence", "excellence"),
]


def test_bank_questions_keep_their_slots_and_ai_fills_the_rest():
    bank = [question("bank"), None, None]
    requested = []

    def generate_ai(missing):
        requested.extend(missing)
        return [question("ai 1", "wrong"), question("ai 2", "wrong")]

    result = assemble_exam(SLOTS, bank, generate_ai, FALLBACK)

    assert requested == SLOTS[1:]
    assert [q.question for q in result] == ["bank", "ai 1", "ai 2"]
    # AI questions are relabelled to match their slot
    assert [(q.difficulty, q.method_area) for q in result[1:]] == [("achieved", "Area B"), ("merit", "Area C")]


def test_full_bank_skips_ai():
    def generate_ai(missing):
        raise AssertionError("AI should not be called")

    bank = [question("b1"), question("b2"), question("b3")]

    assert assemble_exam(SLOTS, bank, generate_ai, FALLBACK) == bank


def test_ai_failure_uses_fallback_matching_difficulty():
    def generate_ai(missing):
        raise ValueError("bad JSON")

    result = assemble_exam(SLOTS, [question("bank"), None, None], generate_ai, FALLBACK)

    assert [q.question for q in result] == ["bank", "fallback achieved", "fallback merit"]


def test_short_ai_response_is_topped_up_from_fallback():
    result = assemble_exam(SLOTS, [None, None, None], lambda missing: [question("ai 1")], FALLBACK)

    assert [q.question for q in result] == ["ai 1", "fallback achieved", "fallback merit"]


def test_fallback_reused_when_more_slots_than_fallback_questions():
    slots = [Slot("merit", "Area C")] * 4

    def generate_ai(missing):
        raise ValueError("down")

    result = assemble_exam(slots, [None] * 4, generate_ai, FALLBACK)

    assert len(result) == 4
    assert result[0].question == "fallback merit"
