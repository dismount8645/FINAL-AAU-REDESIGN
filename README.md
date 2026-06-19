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
| `npm test` | Vitest tests |
| `npm run lint` | `tsc --noEmit` |
| `npm run preview` | Preview production build |

## Structure

```
client/src/
├── components/   UI primitives + layout + widgets
├── config/       Settings categories
├── hooks/        Custom hooks
├── lib/          Utils, schemas, translations, types
├── pages/        Route pages (dashboard, courses, calendar…)
├── store/        Zustand state (slices per domain)
└── test/         Shared setup + test utils
```

## Stack

React 18 · TypeScript · Vite · Tailwind v4 · Zustand · Vitest · Lucide

## License

MIT — see `package.json`.
