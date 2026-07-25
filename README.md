# Prep

A small full-stack starter project using TanStack Start on the frontend and FastAPI on the backend.

This repository currently contains:

- `frontend/` — React application built with TanStack Router, TypeScript, Tailwind, and generated OpenAPI types
- `backend/` — FastAPI backend with Supabase support and product routes

## What this project is now

This project is a modern frontend/backend starter, not a finished exam app. It demonstrates:

- file-based routing with `@tanstack/react-router`
- API typing with `openapi-fetch` and `src/types/api.ts`
- a FastAPI backend with route separation in `backend/routers`
- Supabase-backed CRUD operations for products

## Current features

- Home page (`frontend/src/routes/index.tsx`)
- About page (`frontend/src/routes/about.tsx`)
- Products page (`frontend/src/routes/products.tsx`)
- Backend FastAPI product CRUD routes in `backend/routers/products.py`
- Typed API client in `frontend/src/lib/api.ts`
- Auto-generated frontend API types in `frontend/src/types/api.ts`

## Project structure

```
Prep/
├── backend/
│   ├── core/                # Supabase client and config
│   ├── models/              # Pydantic models
│   ├── routers/             # FastAPI route modules
│   └── services/            # Backend service logic
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── lib/             # shared client helpers
│   │   ├── routes/          # file-based TanStack Router routes
│   │   ├── styles.css
│   │   └── types/           # OpenAPI-generated types
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Setup

### Backend

1. Create `backend/.env` with:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
```

2. Install dependencies:

```bash
python -m pip install fastapi uvicorn supabase python-dotenv slowapi google-generativeai
```

### Frontend

1. Install dependencies:

```bash
cd frontend
pnpm install
```

2. Start the frontend dev server:

```bash
pnpm run dev
```

3. Open `http://localhost:3000`

The backend will start on `http://localhost:8000` by default.

### Sync API types

The frontend uses generated API types from `frontend/src/types/api.ts`. If the backend OpenAPI schema changes, regenerate the types with:

```bash
cd frontend
pnpm run generate:types
```

## Example files for beginners

If you are new to this project, start with these files and examples:

- `frontend/src/routes/index.tsx` — the home route and navigation entry point for the app.
- `frontend/src/routes/products.tsx` — shows how the frontend fetches backend data and renders product rows.
- `frontend/src/lib/api.ts` — typed API client setup using `openapi-fetch`; this is the place to centralize backend HTTP calls.
- `frontend/src/types/api.ts` — auto-generated OpenAPI type definitions used by the frontend API client.
- `frontend/src/routes/about.tsx` — simple static route that demonstrates a second page.
- `frontend/src/routes/__root.tsx` — application shell and common layout for all routes.
- `backend/routers/products.py` — FastAPI route definitions for products and endpoint structure.
- `backend/services/product.py` — the backend business logic layer that connects FastAPI routes to Supabase.

### Quick beginner tasks

1. Add a new route in `frontend/src/routes/` and use `Link` from `@tanstack/react-router` to navigate to it.
2. Add a new backend endpoint in `backend/routers/` and mirror it with a typed frontend API call in `frontend/src/lib/api.ts`.
3. Regenerate `frontend/src/types/api.ts` after backend changes using `pnpm run generate:types`.
4. Keep UI and data logic separated: routes handle rendering, `lib` handles API calls, and `services` handles backend data access.

## Git workflow

Use a clear branch and PR workflow to keep development organized:

- Create branches under `feature/` for new work, e.g. `feature/add-products-page`.
- Keep branch names descriptive and scoped to a single feature.
- Commit early and often with meaningful commit messages.
- Open pull requests against the main branch when your feature is ready for review.
- Use review comments to iterate and keep PRs small when possible.
- Merge only after approvals and passing local checks.

### Recommended git commands

```bash
# Create a feature branch
git checkout -b feature/add-products-page

# Stage and commit changes
git add .
git commit -m "Add products page and typed API client"

# Push branch and open a PR
git push -u origin feature/add-products-page
```

### Suggested PR workflow

- Describe what the change does and why it was made.
- Link related issues or tasks if available.
- Keep the PR focused on one feature or fix.
- Mention any setup steps or important notes for reviewers.

## Notes

- `frontend/src/types/api.ts` is auto-generated and should not be edited directly.
- Keep API calls centralized through `frontend/src/lib/api.ts` or small wrapper modules.
- The current frontend uses `@tanstack/react-router` for routing; new routes are added by creating files under `frontend/src/routes`.

## Running the app

1. Start the backend: `cd backend && uvicorn main:app --reload`
2. Start the frontend: `cd frontend && pnpm run dev`
3. Visit `http://localhost:3000`

## Learn more

- `frontend/src/routes/__root.tsx` shows the root layout and app shell.
- `frontend/src/routes/about.tsx` shows a simple static route.

## License

This repository is private and intended as a starter template for the current Prep frontend/backend project.
