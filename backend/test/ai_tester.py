import json
import sys
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from models.ai import GeneratePracticeRequest
from services.ai import generate_practice_questions


with open(Path(__file__).with_name("prompt_import_test.json")) as f:
    data = json.load(f)


request = GeneratePracticeRequest(**data)

response = generate_practice_questions(request)

print(response.model_dump_json(indent=2))

with open(Path(__file__).with_name("output.json"), "w") as f:
    f.write(response.model_dump_json(indent=2))
