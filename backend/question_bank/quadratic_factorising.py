"""AS91261 skill: solve a quadratic equation by factorising.

Built answer-first: pick the two factors (px + q)(rx + s), expand them to get
the equation, then check the roots satisfy it before returning. The answer is
therefore correct by construction.
"""
import random
from fractions import Fraction
from math import gcd

from models.question import QuestionCreate, Marking

SKILL = "solve_quadratic_factorising"
STANDARD = "AS91261"
GRADE_BAND = "achieved"
METHOD_AREA = "Forming and solving linear and quadratic equations"
VERSION = 1

LEADING_FACTORS = [1, 2, 3]
CONSTANTS = [n for n in range(-9, 10) if n != 0]
MAX_B = 30
MAX_C = 40

# How the equation is written: all terms on the left, constant moved to the
# right, or linear and constant terms moved to the right.
LAYOUTS = ["standard", "constant_right", "linear_right"]


def format_poly(coeffs: list[int]) -> str:
    """Format [a, b, c] (highest power first) as plain text, e.g. "2x^2 + x - 6"."""
    degree = len(coeffs) - 1
    terms = []
    for i, coeff in enumerate(coeffs):
        if coeff == 0:
            continue
        power = degree - i
        size = abs(coeff)
        if power == 0:
            body = str(size)
        else:
            var = "x" if power == 1 else f"x^{power}"
            body = var if size == 1 else f"{size}{var}"
        if not terms:
            terms.append(body if coeff > 0 else f"-{body}")
        else:
            terms.append(f"+ {body}" if coeff > 0 else f"- {body}")
    return " ".join(terms) if terms else "0"


def format_factor(p: int, q: int) -> str:
    return f"({format_poly([p, q])})"


def format_value(value: Fraction) -> str:
    if value.denominator == 1:
        return str(value.numerator)
    return f"{value.numerator}/{value.denominator}"


def _pick_factor(rng: random.Random) -> tuple[int, int]:
    while True:
        p = rng.choice(LEADING_FACTORS)
        q = rng.choice(CONSTANTS)
        if gcd(p, abs(q)) == 1:
            return p, q


def _is_valid(p: int, q: int, r: int, s: int) -> bool:
    a, b, c = p * r, p * s + q * r, q * s
    distinct_roots = Fraction(-q, p) != Fraction(-s, r)
    # a = 1 with the constant already on the right is below Level 2 achieved.
    return a > 1 and abs(b) <= MAX_B and abs(c) <= MAX_C and distinct_roots


def _equation(a: int, b: int, c: int, layout: str) -> str:
    if layout == "constant_right" and c != 0:
        return f"{format_poly([a, b, 0])} = {-c}"
    if layout == "linear_right" and b != 0:
        return f"{format_poly([a, 0, 0])} = {format_poly([-b, -c])}"
    return f"{format_poly([a, b, c])} = 0"


def generate(rng: random.Random) -> QuestionCreate:
    while True:
        p, q = _pick_factor(rng)
        r, s = _pick_factor(rng)
        if _is_valid(p, q, r, s):
            break

    a, b, c = p * r, p * s + q * r, q * s
    layout = rng.choice(LAYOUTS)
    roots = sorted([Fraction(-q, p), Fraction(-s, r)])

    for root in roots:
        if a * root**2 + b * root + c != 0:
            raise AssertionError(f"root {root} does not satisfy {a}x^2 + {b}x + {c} = 0")

    equation = _equation(a, b, c, layout)
    standard_form = f"{format_poly([a, b, c])} = 0"
    factored = f"{format_factor(p, q)}{format_factor(r, s)} = 0"
    root_text = [format_value(root) for root in roots]
    model_answer = f"x = {root_text[0]} or x = {root_text[1]}"

    if equation == standard_form:
        working = [standard_form, factored, model_answer]
        opening = f"{standard_form} factorises"
    else:
        working = [equation, standard_form, factored, model_answer]
        opening = f"Rearrange to {standard_form}, which factorises"
    explanation = f"{opening} to {factored}. Setting each factor to zero gives {model_answer}."

    return QuestionCreate(
        standard=STANDARD,
        skill=SKILL,
        grade_band=GRADE_BAND,
        source="generator",
        prompt=f"Solve {equation}.",
        marking=Marking(
            answer_type="solutions",
            answer=root_text,
            model_answer=model_answer,
            explanation=explanation,
            working=working,
            generator={
                "version": VERSION,
                "factors": [[p, q], [r, s]],
                "layout": layout,
            },
        ),
    )
