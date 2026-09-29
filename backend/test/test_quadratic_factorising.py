import random
from fractions import Fraction

import pytest

from question_bank import quadratic_factorising as qf
from question_bank.skills import SKILLS, generate_batch


def parse_value(text: str) -> Fraction:
    return Fraction(text)


def evaluate_side(side: str, x: Fraction) -> Fraction:
    """Evaluate a plain text polynomial like "2x^2 - x + 6" at x."""
    total = Fraction(0)
    for term in side.replace("- ", "+ -").split("+ "):
        term = term.strip()
        if not term:
            continue
        if "x" not in term:
            total += Fraction(term)
            continue
        coeff_text, _, power_text = term.partition("x")
        coeff = {"": 1, "-": -1}.get(coeff_text)
        coeff = Fraction(coeff_text) if coeff is None else coeff
        power = int(power_text[1:]) if power_text else 1
        total += coeff * x**power
    return total


@pytest.mark.parametrize(
    "coeffs, expected",
    [
        ([2, 1, -6], "2x^2 + x - 6"),
        ([1, -1, 0], "x^2 - x"),
        ([-3, 0, 9], "-3x^2 + 9"),
        ([0, 0, -4], "-4"),
        ([0, 0, 0], "0"),
    ],
)
def test_format_poly(coeffs, expected):
    assert qf.format_poly(coeffs) == expected


@pytest.mark.parametrize("seed", range(300))
def test_answers_solve_the_prompt(seed):
    question = qf.generate(random.Random(seed))
    equation = question.prompt.removeprefix("Solve ").removesuffix(".")
    left, right = equation.split(" = ")

    roots = [parse_value(v) for v in question.marking.answer]
    assert len(set(roots)) == 2
    for root in roots:
        assert evaluate_side(left, root) == evaluate_side(right, root)


@pytest.mark.parametrize("seed", range(300))
def test_difficulty_bounds(seed):
    question = qf.generate(random.Random(seed))
    (p, q), (r, s) = question.marking.generator["factors"]
    a, b, c = p * r, p * s + q * r, q * s

    assert 1 < a <= 9
    assert abs(b) <= qf.MAX_B
    assert 0 < abs(c) <= qf.MAX_C
    assert question.grade_band == "achieved"
    assert question.source == "generator"


def test_marking_shape():
    question = qf.generate(random.Random(1))

    assert question.prompt.startswith("Solve ")
    assert question.marking.answer_type == "solutions"
    assert question.marking.model_answer == f"x = {question.marking.answer[0]} or x = {question.marking.answer[1]}"
    assert question.marking.working[-1] == question.marking.model_answer
    for text in [question.prompt, question.marking.explanation]:
        assert "$" not in text and "\\" not in text


def test_generate_batch_is_unique_and_reproducible():
    batch = generate_batch(qf.SKILL, 50, seed=7)

    assert len(batch) == 50
    assert len({q.prompt for q in batch}) == 50
    assert [q.prompt for q in batch] == [q.prompt for q in generate_batch(qf.SKILL, 50, seed=7)]


def test_skill_registered():
    skill = SKILLS[qf.SKILL]

    assert skill.standard == "AS91261"
    assert skill.method_area == qf.METHOD_AREA
