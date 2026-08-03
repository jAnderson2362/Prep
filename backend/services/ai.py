import json
import os
from dotenv import load_dotenv
from google import genai
from models.ai import GeneratePracticeRequest, GenerateResponse, PracticeQuestion, GenerateLearnRequest, GenerateLearnResponse

load_dotenv()

print("ENV TEST:")
print("Current directory:", os.getcwd())
print("Key:", os.getenv("GEMINI_API_KEY"))

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def build_practice_prompt(request: GeneratePracticeRequest) -> str:
    return f"""
You are a study assistant that focuses on NCEA-style study.PracticeQuestion

Generate {request.question_count} practice questions.

Subject: {request.subject}
Level: {request.level}
Topic: {request.topic}
Difficulty: {request.difficulty}
Student Note: {request.optional_note if request.optional_note else "None"}

Rules: 
- Do not follow the exact wording of the question or closely paraphrase real past exam questions.
- Keep questions inline with the NCEA style and format.
- Give clear and concise answers less than 3 sentences each
- Return JSON only.

Return exactly this JSON shape:
{{
    "questions": [
        {{
            "question": "string",
            "answer": "string",
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