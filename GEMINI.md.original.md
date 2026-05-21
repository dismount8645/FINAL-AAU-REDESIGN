# Project Instructions

This project follows a clean, component-based architecture with a focus on type safety and comprehensive testing.

## Conventions

- **Components:** Use functional components with TypeScript. Prefer `export default` for main component files.
- **Testing:**
    - Use `vitest` and `@testing-library/react`.
    - Every component should have a corresponding `.test.tsx` file.
    - Use `@/test/test-utils` for rendering components with all necessary providers.
- **Styling:** Use Tailwind CSS for component-level styling. Define global design tokens in `src/styles/global.css`.
- **State:** Use Zustand for global application state.
- **Imports:** Use the `@/` alias for `src/` directory imports.

## Workflows

- **Code Cleanup:** Maintain zero TypeScript errors and zero ESLint errors (ignoring unavoidable warnings).
- **Git:** 
    - Keep commits focused and descriptive.
    - Ensure `.gitignore` is up to date with environment and build artifacts.
