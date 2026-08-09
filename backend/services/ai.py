import json
import os
from dotenv import load_dotenv
from google import genai
from models.ai import GeneratePracticeRequest, GenerateResponse

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
