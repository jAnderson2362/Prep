# Route Structure

TanStack Router with file-based routing — each file in this folder maps to a URL.

## Routes

- `index.tsx` → `/` (Home)
- `subject-selection.tsx` → `/subject-selection`
- `learn.tsx` → `/learn`
- `practice.tsx` → `/practice`
- `exam.tsx` → `/exam`
- `sign-in.tsx` → `/sign-in`
- `register.tsx` → `/register`

## Shared Layout

`__root.tsx` wraps every page with Nav Bar and Footer. Page content swaps in via `<Outlet />`.

## 404 Page

Handled by `notFoundComponent` in `__root.tsx`. Shows "Page not found" with a link home.

## Adding a New Route

1. Create a new `.tsx` file in this folder
2. Use `createFileRoute('/your-path')` with a component
3. Done — the route is automatically available