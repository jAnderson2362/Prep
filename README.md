# Prep

**Your exam mastered**

Prep is an AI-powered exam preparation app that helps students revise for their specific exams through structured, syllabus-aligned content. No chatbot, no free prompts just pick your exam, pick your topic, and start learning.

---

## What is Prep?

Prep uses constrained AI to generate exam-style questions, revision notes, worked examples, and full practice exams all tailored to specific exam systems and syllabuses.

Unlike general AI tools, Prep doesn't hallucinate or go off-topic. Every interaction is locked to the student's selected syllabus, ensuring accuracy and relevance.

### How it works

1. **Pick your exam system** → NCEA, GCSE, AP, etc.
2. **Pick your subject** → Mathematics, Biology, Chemistry, etc.
3. **Pick your topic** → Quadratic Equations, Cell Structure, etc.
4. **Pick what you need** → Learn, Practice Quiz, or Full Exam
5. **Start revising** → Accurate, exam-style content in seconds

### Core Features

- **Learn Mode** — Concept explanations, worked examples, simplified breakdowns, exam-specific tips
- **Practice Mode** — Quick quizzes, topic tests, mixed difficulty questions
- **Exam Mode** — Full timed practice exams that mirror real exam structure, mark allocations, and question types
- **Progress Tracking** — Readiness scores, weak topic identification, improvement over time

---

## Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React             |
| Backend     | Python (FastAPI)   |
| Database    | PostgreSQL        |
| AI          | Claude / OpenAI API |
| Hosting     | TBD               |

---

## Project Structure

```
prep/
├── client/          # React frontend
├── server/          # Python FastAPI backend
├── database/        # Schema and migrations
├── content/         # Syllabus data, exam blueprints, prompt templates
├── tests/           # Test suite
└── docs/            # Documentation
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.10+)
- PostgreSQL
- API key for Claude or OpenAI

### Setup

```bash
# Clone the repo
git clone https://github.com/your-org/prep.git
cd prep

# Frontend
cd client
pnpm install
pnpm run dev

# Backend
cd ../server
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Content Architecture

Prep's accuracy comes from constrained AI — the model only generates content from verified syllabus material.

```
Exam System (e.g. NCEA)
  └── Level (e.g. Level 2)
       └── Subject (e.g. Mathematics)
            └── Standard (e.g. AS91261 - Algebra)
                 └── Topics
                      ├── Algebraic Expressions
                      ├── Exponents
                      ├── Quadratic Roots
                      ├── Exponential Equations & Logs
                      └── Linear & Quadratic Equations
```

Each topic contains:
- **Syllabus content** — Learning objectives extracted from official specifications
- **Exam blueprint** — Question structure, mark allocations, achievement levels
- **Prompt templates** — Pre-tested prompts for each question type and learning mode

---

## Roadmap

- [x] Team assembled
- [x] Product vision defined
- [ ] First prompt templates tested
- [ ] MVP — Single subject quiz generation
- [ ] User accounts and progress tracking
- [ ] Multiple NCEA Level 2 subjects
- [ ] Launch for NCEA exam season 2026
- [ ] Expand to Australia (HSC / VCE)
- [ ] Expand to UK (GCSE / A-Level)
- [ ] Native iOS and Android app

---

## Team

| Role               | Focus                                      |
|--------------------|---------------------------------------------|
| Founder            | Product, content, marketing, development    |
| Co-founder         | Backend, data, API integration              |
| Tech Lead          | Architecture, mentorship, technical decisions|
| Developer          | Development support                         |
| Frontend Lead      | UI/UX design, frontend development          |

---

## Contributing

This is currently a private project. If you're interested in contributing content for specific exam systems, reach out to the team.

---

## License

All rights reserved. © 2026 Prep
