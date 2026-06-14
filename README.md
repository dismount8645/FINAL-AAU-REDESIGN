# AAU Redesign

Modern React + TypeScript student portal for Aalborg University.  
Replaces Moodle frontend with responsive dashboard, course overview, calendar, and messaging.

## Quick start

```bash
node --version   # must match .nvmrc
npm install
cp .env.example .env   # fill secrets (see .env.example)
npm run dev            # → localhost:3000
```

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Prod build → `dist/` |
| `npm test` | Vitest (inline + .test.tsx) |
| `npm run lint` | `tsc --noEmit` |
| `npm run preview` | Preview production build |
| `npm run optimize` | Convert JPG/PNG → WebP |

## Structure

```
src/
├── api/          API services + mock data
├── components/   UI primitives + layout + widgets
├── lib/          Utils, schemas, translations
├── pages/        Route pages (dashboard, courses, calendar…)
├── store/        Zustand state (slices per domain)
├── test/         Shared setup + test utils
├── types/        Global TS declarations
└── styles/       Tailwind v4 theme + globals
```

## Stack

React 18 · TypeScript · Vite · Tailwind v4 · Zustand · Vitest · Lucide · Zod · Framer Motion

## License

MIT — see `package.json`.
