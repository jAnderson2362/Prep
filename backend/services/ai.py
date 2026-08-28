import json
import os
from dotenv import load_dotenv
from google import genai
from models.ai import GeneratePracticeRequest, GenerateResponse, PracticeQuestion, GenerateLearnRequest, GenerateLearnResponse, GenerateExamRequest, GenerateExamResponse, ExamQuestion

load_dotenv()

print("ENV TEST:")
print("Current directory:", os.getcwd())
print("Key:", os.getenv("GEMINI_API_KEY"))

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def build_practice_prompt(request: GeneratePracticeRequest) -> str:
    return f"""
You are a study assistant that creates NCEA-style multiple choice practice quizzes.

Generate {request.question_count} multiple choice practice questions.

Subject: {request.subject}
Level: {request.level}
Topic: {request.topic}
Difficulty: {request.difficulty}
Student Note: {request.optional_note if request.optional_note else "None"}

Rules: 
- Do not follow the exact wording of the question or closely paraphrase real past exam questions.
- Keep every question strictly aligned to the selected subject, level, and topic.
- Use the student note only to choose emphasis. Do not generate content outside the selected topic.
- Each question must have exactly four answer options.
- Option ids must be exactly "A", "B", "C", and "D" for every question.
- Only one option may be correct.
- correct_option_id must exactly match the id of the correct option.
- Explanations must be clear and concise, no more than 2 sentences each.
- Write all maths in plain text only. Do not use LaTeX, markdown math, $ signs, \( \), \[ \], backslash commands, superscript notation, or em dashes.
- Use plain text maths such as "3x^2 - 10x - 8", "(x - 3)(x + 3)", "x = -1", and "y = 2x + 3".
- Return valid JSON only. Do not include markdown, commentary, or code fences.

Return exactly this JSON shape:
{{
    "questions": [
        {{
            "question": "string",
            "options": [
                {{ "id": "A", "text": "string" }},
                {{ "id": "B", "text": "string" }},
                {{ "id": "C", "text": "string" }},
                {{ "id": "D", "text": "string" }}
            ],
            "correct_option_id": "A",
            "explanation": "string"
        }}
    ]
}}
    """

def generate_practice_questions(request: GeneratePracticeRequest) -> GenerateResponse:
    prompt = build_practice_prompt(request)
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
    )

    text = response.text

    text = text.replace("```json", "").replace("```", "").strip()

    print("RAW GEMINI RESPONSE:")
    print(repr(text))

    data = json.loads(text)
    return GenerateResponse(**data)

def build_learn_prompt(request: GenerateLearnRequest) -> str:
    return f"""
You are a study assistant that focuses on NCEA-style study.

Generate a clear concept explanation and worked examples for the following topic.

Subject: {request.subject}
Level: {request.level}
Standard: {request.standard}
Topic: {request.topic}

Rules:
- Explain the concept in plain language a high school student would understand
- Keep the explanation concise but thorough
- Write all maths in plain text (e.g. "y = 2x + 3", not LaTeX). Do not use $ signs or backslash notation, or em dashes
- Provide 2-3 worked examples with step-by-step solutions
- Include key points the student should remember for exams
- Stay aligned to the NCEA syllabus and style
- Return JSON only.

Return exactly this JSON shape:
{{
    "title": "string",
    "explanation": "string",
    "worked_examples": [
        {{
            "problem": "string",
            "steps": ["string"],
            "answer": "string"
        }}
    ],
    "key_points": ["string"]
}}
    """

def generate_learn_content(request: GenerateLearnRequest) -> GenerateLearnResponse:
    prompt = build_learn_prompt(request)
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
    )

    text = response.text

    text = text.replace("```json", "").replace("```", "").strip()

    print("RAW GEMINI RESPONSE:")
    print(repr(text))

    data = json.loads(text)
    return GenerateLearnResponse(**data)

AS91261_BLUEPRINT = {
    "standard_code": "AS91261",
    "title": "Apply algebraic methods in solving problems",
    "level": 2,
    "credits": 4,
    "num_questions": 3,
    "method_areas": [
        "Manipulating algebraic and rational expressions",
        "Exponents including fractional and negative exponents",
        "Nature of the roots of a quadratic (discriminant)",
        "Exponential equations and logarithms",
        "Forming and solving linear and quadratic equations",
    ],
    "difficulty_spread": {
        "achieved": "Direct single-method application",
        "merit": "Multi-step, relational thinking, connecting concepts",
        "excellence": "Real-world modelling with a quadratic; extended abstract reasoning",
    },
    "signature_feature": (
        "Each paper closes with an applied modelling problem: a real-world "
        "scenario described in bullet points, modelled with a quadratic, "
        "answering a yes/no or find-a-value question."
    ),
}

FALLBACK_EXAM = {
    "questions": [
        {
            "question": "Simplify, writing your answer with positive exponents: (27x^9 / y^-3)^(1/3)",
            "model_answer": "3x^3 * y",
            "explanation": "Apply the 1/3 power to each factor: 27^(1/3) = 3, (x^9)^(1/3) = x^3, and (y^-3)^(1/3) = y^-1. Rewriting with a positive exponent gives 3x^3 * y.",
            "difficulty": "achieved",
            "method_area": "Exponents including fractional and negative exponents",
        },
        {
            "question": "Simplify fully: (3x^2 - 5x - 2) / (x^2 - 4)",
            "model_answer": "(3x + 1) / (x + 2)",
            "explanation": "Factorise the numerator to (3x + 1)(x - 2) and the denominator to (x - 2)(x + 2). Cancel the common factor (x - 2).",
            "difficulty": "achieved",
            "method_area": "Manipulating algebraic and rational expressions",
        },
        {
            "question": "Find the range of values of k for which the equation x^2 + kx + 9 = 0 has no real roots.",
            "model_answer": "-6 < k < 6",
            "explanation": "For no real roots the discriminant is negative: k^2 - 4(1)(9) < 0, so k^2 < 36, giving -6 < k < 6.",
            "difficulty": "merit",
            "method_area": "Nature of the roots of a quadratic (discriminant)",
        },
        {
            "question": "Solve the equation 3^(2x) - 12 * 3^x + 27 = 0.",
            "model_answer": "x = 1 or x = 2",
            "explanation": "Let u = 3^x, giving u^2 - 12u + 27 = 0, which factorises to (u - 3)(u - 9) = 0. So 3^x = 3 gives x = 1, and 3^x = 9 gives x = 2.",
            "difficulty": "merit",
            "method_area": "Exponential equations and logarithms",
        },
        {
            "question": "A rectangular vegetable plot has a length 5 metres greater than its width. A path of uniform width 1 metre is laid around the outside of the plot. The total area of the plot and path combined is 84 square metres. Find the width of the plot.",
            "model_answer": "width = 5 metres",
            "explanation": "Let the width be w, so the length is w + 5. Including the 1 m path on all sides, the outer dimensions are (w + 2) by (w + 7). Then (w + 2)(w + 7) = 84 gives w^2 + 9w - 70 = 0, which factorises to (w - 5)(w + 14) = 0. Since width must be positive, w = 5.",
            "difficulty": "excellence",
            "method_area": "Forming and solving linear and quadratic equations",
        },
    ]
}

def build_exam_prompt(request: GenerateExamRequest, blueprint: dict) -> str:
    method_areas = "\n".join("- " + m for m in blueprint["method_areas"])
    return f"""
You are an NCEA exam author creating an ORIGINAL practice exam.

Standard: {blueprint['standard_code']} - {blueprint['title']}
Level: {blueprint['level']}, Credits: {blueprint['credits']}

Generate {request.question_count} short-answer exam questions that follow the
structure and style of this standard's real external exam.

Content must be drawn from these method areas, spread across them:
{method_areas}

Difficulty distribution (mirror a real paper):
- About 40% achieved: {blueprint['difficulty_spread']['achieved']}
- About 40% merit: {blueprint['difficulty_spread']['merit']}
- About 20% excellence: {blueprint['difficulty_spread']['excellence']}

For excellence questions, use this signature style:
{blueprint['signature_feature']}

Rules:
- Write ENTIRELY ORIGINAL questions. Do not copy or closely paraphrase any real
  NZQA past exam question. Use the structure and style only.
- These are SHORT ANSWER questions, not multiple choice. Do not provide options.
- Match NCEA phrasing: formal and imperative ("Simplify...", "Solve...",
  "Find the value of...", "Write ... in the form ...").
- model_answer must be the full correct answer a student would work towards.
- explanation must show the key working or reasoning, no more than 3 sentences.
- difficulty must be exactly one of: "achieved", "merit", "excellence".
- method_area must be one of the method areas listed above.
- Write all maths in plain text (e.g. "3x^2 - 10x - 8", "x = -1", "sqrt(x)").
  Do not use LaTeX, $ signs, backslash commands, or em dashes.
- Return valid JSON only. No markdown, commentary, or code fences.

Return exactly this JSON shape:
{{
    "questions": [
        {{
            "question": "string",
            "model_answer": "string",
            "explanation": "string",
            "difficulty": "achieved",
            "method_area": "string"
        }}
    ]
}}
    """

def generate_exam_questions(request: GenerateExamRequest) -> GenerateExamResponse:
    try:
        prompt = build_exam_prompt(request, AS91261_BLUEPRINT)
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
        )

        text = response.text
        text = text.replace("```json", "").replace("```", "").strip()

        print("RAW GEMINI RESPONSE:")
        print(repr(text))

        data = json.loads(text)
        return GenerateExamResponse(**data)
    except Exception as e:
        print(f"Exam generation failed, serving fallback: {e}")
        return GenerateExamResponse(**FALLBACK_EXAM)
