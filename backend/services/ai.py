import json
import os
from dotenv import load_dotenv
from google import genai
from backend.models.ai import GeneratePracticeRequest, GenerateResponse, PracticeQuestion

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