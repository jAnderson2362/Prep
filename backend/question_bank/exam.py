"""Build an exam paper from blueprint slots, bank questions first.

Pure functions only (no database or AI calls) so the slot logic is testable.
"""
import random
from dataclasses import dataclass
from typing import Callable

from models.ai import ExamQuestion
from question_bank.skills import SKILLS


@dataclass(frozen=True)
class Slot:
    difficulty: str
    method_area: str


def build_exam_slots(blueprint: dict, count: int) -> list[Slot]:
    """Split `count` questions into ~40% achieved, ~40% merit, ~20% excellence.

    Achieved and merit slots rotate through the method areas in blueprint
    order. Excellence slots use the blueprint's modelling method area.
    """
    excellence = round(count * 0.2)
    merit = round(count * 0.4)
    achieved = count - merit - excellence
    areas = blueprint["method_areas"]
    rotation = [areas[i % len(areas)] for i in range(achieved + merit)]

    return (
        [Slot("achieved", area) for area in rotation[:achieved]]
        + [Slot("merit", area) for area in rotation[achieved:]]
        + [Slot("excellence", blueprint["excellence_method_area"])] * excellence
    )


def pick_bank_questions(
    standard: str, slots: list[Slot], candidates: list[dict], rng: random.Random
) -> list[int | None]:
    """Choose a bank question id for each slot, or None where nothing matches.

    `candidates` are rows with id, skill and grade_band. Each skill is used at
    most once per paper so one generator cannot fill the whole exam.
    """
    used_skills: set[str] = set()
    picked: list[int | None] = []
    for slot in slots:
        eligible = [
            row for row in candidates
            if row["grade_band"] == slot.difficulty
            and row["skill"] not in used_skills
            and row["skill"] in SKILLS
            and SKILLS[row["skill"]].standard == standard
            and SKILLS[row["skill"]].method_area == slot.method_area
        ]
        if not eligible:
            picked.append(None)
            continue
        row = rng.choice(eligible)
        used_skills.add(row["skill"])
        picked.append(row["id"])
    return picked


def to_exam_question(row: dict) -> ExamQuestion:
    marking = row["marking"]
    return ExamQuestion(
        question=row["prompt"],
        model_answer=marking["model_answer"],
        explanation=marking["explanation"],
        difficulty=row["grade_band"],
        method_area=SKILLS[row["skill"]].method_area,
    )


def assemble_exam(
    slots: list[Slot],
    bank: list[ExamQuestion | None],
    generate_ai: Callable[[list[Slot]], list[ExamQuestion]],
    fallback: list[ExamQuestion],
) -> list[ExamQuestion]:
    """Keep bank questions in their slots and fill the rest with AI questions.

    If AI generation fails or returns too few questions, the remaining slots
    are filled from the fixed fallback paper.
    """
    missing = [slot for slot, question in zip(slots, bank) if question is None]
    generated: list[ExamQuestion] = []
    if missing:
        try:
            generated = generate_ai(missing)[: len(missing)]
        except Exception as e:
            print(f"Exam generation failed, serving fallback: {e}")
            generated = []
        generated = [
            question.model_copy(update={"difficulty": slot.difficulty, "method_area": slot.method_area})
            for slot, question in zip(missing, generated)
        ]
        generated += _fallback_for(missing[len(generated):], fallback)

    remaining = iter(generated)
    return [question if question is not None else next(remaining) for question in bank]


def _fallback_for(slots: list[Slot], fallback: list[ExamQuestion]) -> list[ExamQuestion]:
    """Pick fallback questions matching each slot's difficulty where possible."""
    picked: list[ExamQuestion] = []
    remaining: list[ExamQuestion] = []
    for slot in slots:
        if not remaining:
            remaining = list(fallback)
        match = next((q for q in remaining if q.difficulty == slot.difficulty), remaining[0])
        remaining.remove(match)
        picked.append(match)
    return picked
