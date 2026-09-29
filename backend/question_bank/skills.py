"""Registry of question bank skills.

Each skill maps to one blueprint method area, which is how generate-exam
decides whether a bank question can fill a slot.
"""
import random
from dataclasses import dataclass
from typing import Callable

from models.question import QuestionCreate
from question_bank import quadratic_factorising


@dataclass(frozen=True)
class Skill:
    id: str
    standard: str
    method_area: str
    grade_band: str
    generate: Callable[[random.Random], QuestionCreate]


SKILLS: dict[str, Skill] = {
    module.SKILL: Skill(
        id=module.SKILL,
        standard=module.STANDARD,
        method_area=module.METHOD_AREA,
        grade_band=module.GRADE_BAND,
        generate=module.generate,
    )
    for module in [quadratic_factorising]
}


def generate_batch(skill_id: str, count: int, seed: int | None = None) -> list[QuestionCreate]:
    """Generate up to `count` questions with unique prompts."""
    skill = SKILLS[skill_id]
    rng = random.Random(seed)
    questions: dict[str, QuestionCreate] = {}
    attempts = 0
    while len(questions) < count and attempts < count * 50:
        question = skill.generate(rng)
        questions.setdefault(question.prompt, question)
        attempts += 1
    return list(questions.values())
