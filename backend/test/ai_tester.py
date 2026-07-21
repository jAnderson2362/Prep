import json

from backend.models.ai import GeneratePracticeRequest
from backend.services.ai import generate_practice_questions


with open("backend/test/prompt_import_test.json") as f:
    data = json.load(f)


request = GeneratePracticeRequest(**data)

response = generate_practice_questions(request)

print(response.model_dump_json(indent=2))

with open("backend/test/output.json", "w") as f:
    f.write(response.model_dump_json(indent=2))