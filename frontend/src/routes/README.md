# Route Structure

TanStack Router with file-based routing - each file in this folder maps to a URL.

## Routes

- `index.tsx` → `/` (Home)
- `subject-selection.tsx` → `/subject-selection`
- `learn.tsx` → `/learn`
- `practice.tsx` → `/practice`
- `exam.tsx` → `/exam`
- `sign-in.tsx` → `/sign-in`
- `register.tsx` → `/register`
- `about.tsx` → `/about`
- `products.tsx` → `/products`
- `dashboard.tsx` → `/dashboard`
- `mode-selection.tsx` → `/mode-selection`
- `profile.tsx` → `/profile`

## Shared Layout

`__root.tsx` wraps every page with Nav Bar and Footer. Page content swaps in via `<Outlet />`.

It also provides the `ThemeProvider` (light / dark mode) and a `MotionConfig`
that respects the user's reduced-motion preference. Page content is wrapped in
a `PageTransition` for a subtle fade when the route changes.

## 404 Page

Handled by `notFoundComponent` in `__root.tsx`. Shows "Page not found" with a link home.

## Adding a New Route

1. Create a new `.tsx` file in this folder
2. Use `createFileRoute('/your-path')` with a component
3. Done - the route is automatically available

Tip: wrap page content in `<PageShell>` and use `<PageHeader>` for the title so
the new page matches the rest of the app.

## Design system

- Colour, typography and spacing tokens live in `src/styles.css`
  (`:root` for light mode, `.dark` for dark mode). Brand colours are the
  original Prep palette: periwinkle `#81A3F8`, mist `#F0F3FE` and action blue
  `#2563EB`.
- Reusable primitives are in `src/components/ui/`: `Button`, `Input`,
  `Textarea`, `Select`, `Label`, `Alert`, `Badge`, `Card`.
- Page layout helpers are in `src/components/page-shell.tsx`: `PageShell`,
  `PageHeader`, `StatusScreen`, `SelectionChips`.
- Motion helpers (built on motion.dev) are in `src/components/motion.tsx`:
  `Reveal`, `Stagger` / `StaggerItem`, `AnimatedProgress`, `FadePresence`,
  `Floating`, `PageTransition`.
- The theme toggle lives in `src/components/theme-toggle.tsx` and the theme
  context in `src/lib/theme.tsx`.
