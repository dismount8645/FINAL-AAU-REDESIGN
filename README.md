# AAU Redesign

Modern React + TypeScript portal for AAU students.

## Quick start

```bash
npm install
cp .env.example .env   # fill in secrets (see .env.example for required vars)
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

## Stack

React 18 · TypeScript · Vite · Tailwind v4 · Zustand · Vitest · Lucide · Zod · Framer Motion
