# Project Instructions

Clean component-based architecture. Focus: type safety + tests.

## Conventions

- **Components:** Functional components + TypeScript. Prefer `export default` for main files.
- **Testing:**
    - Use `vitest` + `@testing-library/react`.
    - Component need `.test.tsx` file.
    - Render with `@/test/test-utils` for providers.
- **Styling:** Tailwind CSS for component styling. Define global tokens in `src/styles/global.css`.
- **State:** Zustand for global state.
- **Imports:** Use `@/` alias for `src/` imports.

## Workflows

- **Code Cleanup:** Zero TypeScript errors + zero ESLint errors.
- **Git:**
    - Focused, descriptive commits.
    - `.gitignore` up to date with env + build artifacts.
