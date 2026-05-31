# AAU Redesign Web Portal

![CI](https://github.com/dismount8645/aau-redesign/actions/workflows/ci.yml/badge.svg)

A modern, responsive web portal for Aalborg University students, built with React, TypeScript, and Vite.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `0.0.0.0:3000` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run clean` | Build with clean output directory |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |
| `npm test` | Run tests with Vitest |
| `npm run optimize` | Convert JPG/PNG assets to WebP |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | — | Gemini AI API key ([secrets panel](https://aistudio.google.com)) |
| `APP_URL` | Yes | — | Hosted URL for callbacks/endpoints |
| `GITHUB_TOKEN` | Push only | — | GitHub personal access token |
| `GITHUB_REPO` | Push only | `dismount8645/aau-redesign` | Target repository |
| `GIT_USER` | Push only | `AI Assistant` | Commit author name |
| `GIT_EMAIL` | Push only | `assistant@aistudio.google` | Commit author email |
| `GIT_COMMIT_MESSAGE` | Push only | `Update` | Default commit message |

## Project Structure

- `src/api` — API services and mock data
- `src/components` — Shared UI (buttons, cards) and layout (sidebar, topbar)
- `src/constants` — App-wide constants (waves, assets, categories)
- `src/context` — React context for modals and toasts
- `src/data` — Mock data, course data, translations
- `src/features/calendar` — Calendar module with own api, components, hooks
- `src/hooks` — Custom React hooks (courses, filters, drag, resize)
- `src/lib` — Zod schemas, utility functions, classname merging
- `src/pages` — Route pages (dashboard, courses, calendar, grades, etc.)
- `src/scripts` — Utility scripts (e.g., git checker)
- `src/store` — Zustand state management with slices
- `src/styles` — Global CSS with Tailwind v4 theme
- `src/test` — Test setup, utilities, mocks
- `src/types` — Global type definitions
- `src/utils` — Pure utility functions (dates, storage, favorites, theme)
- `src/widgets` — Dashboard widgets (deadlines, grades, forums, favorites)
- `scripts/` — Build/CI scripts (push, image optimization)
- `public/assets/` — Static images (WebP, SVG), logo variants

## Technologies

- **React 18**
- **TypeScript 6**
- **Vite 6**
- **Tailwind CSS v4**
- **Zustand** (state management)
- **Vitest** (testing)
- **Lucide React** (icons)
- **Zod** (validation)
- **Framer Motion** (animations)
