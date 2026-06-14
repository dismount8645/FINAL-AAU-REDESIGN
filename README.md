# AAU Redesign

Modern React + TypeScript portal for AAU students.

## Quick start

```bash
npm install
cp .env.example .env   # then edit .env
npm run dev            # → localhost:3000
```

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Prod build → `dist/` |
| `npm test` | Run Vitest |
| `npm run lint` | Type check (`tsc --noEmit`) |
| `npm run preview` | Preview build |
| `npm run optimize` | Convert JPG/PNG → WebP |

## Env vars

| Var | Required | Description |
|-----|----------|-------------|
| `GEMINI_API_KEY` | Yes | Gemini AI key |
| `APP_URL` | Yes | Hosted URL for callbacks |
| `GITHUB_TOKEN` | Push only | GitHub PAT |
| `GITHUB_REPO` | Push only | Repo slug |

## Stack

React 18 · TypeScript · Vite · Tailwind v4 · Zustand · Vitest · Lucide · Zod · Framer Motion
