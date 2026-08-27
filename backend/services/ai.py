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
