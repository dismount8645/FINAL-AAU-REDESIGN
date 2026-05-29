# AAU Redesign UI/UX Architecture Plan & Agent Guidelines

## Agent Rules & Guidelines

Respond terse like smart caveman. All technical substance stay. Default: ultra.

Rules:
- Drop: articles, filler, pleasantries, hedging, conjunctions
- Abbreviations: DB, auth, config, req, res, fn, impl. causality: X → Y.
- Fragments OK. Short synonyms. Exact code/terms.
- Pattern: [thing] [action] [reason]. [next step].

Commands:
- /caveman [lite|full|ultra|wenyan]: set response compression.
- /caveman-commit: conventional commit. brief subject. why over what.
- /caveman-review: one-line PR comment: `[LineNum]: 🔴 bug: user null. Add guard.`
- /caveman-stats: show token usage + savings.
- /caveman-compress <file>: rewrite memory files (.md/.txt) to caveman.
- cavecrew: spawn subagent (investigator/builder/reviewer) for task.

Auto-Clarity: normal prose for safety, irreversible actions, user confused.

---

## 1. Env
- Core: React, TS strict.
- Style: Tailwind, CVA, tailwind-merge.
- UI: @base-ui/react (unstyleable primitives, ref/slot, use data-* states).
- State: Zustand (slices, immutable, atomic selectors).
- Router/Build: Modern React Router, Vite.
- Test/Motion: Framer Motion (<AnimatePresence>), Vitest + RTL, Playwright.

## 2. Tokens & Layout (Cohesive Systems Focus)
- Colors: Rely STRICTLY on predefined CSS variables (e.g., brand tokens). Never hardcode hex values.
- Theming: Enforce a cohesive Dark Mode. Use semantic dark variants to invert surfaces/text gracefully. Maintain WCAG contrast ratios in all states.
- Breakpoints & Grid: Mobile-first. Use stacked layouts with tighter horizontal padding on mobile, transitioning to fluid grids on tablet, and max-width constrained grids with generous horizontal padding on desktop.
- Spacing System: Enforce a strict, proportional spacing scale. Use standard Tailwind spacing tokens uniformly across all gaps, margins, and paddings. Do not use arbitrary or mixed magic numbers.
- Geometry: Apply a cohesive, progressive border-radius and shadow scale based on component hierarchy (e.g., soft shadows/radii for inner elements, larger for floating cards).
- Typography: Use the 'Barlow' stack. Enforce a strict hierarchy: Headings are bold/tight; body text uses comfortable line-heights. Clamp text logically to prevent visual overflow.
- Motion Physics: Standardize a unified transition system. Use one consistent speed for micro-interactions (hovers) and one for layout shifts. Enforce uniform elevation physics.
- A11y: Strict adherence to WCAG minimum touch targets and cohesive high-contrast focus-visible rings.

## 3. Execution Rules
- No code in chat. Apply changes directly to files.
- Chat: Provide only a brief bulleted list of fixed architectural flaws.

## 4. Core Principles
1. TS: No implicit any. Use Zod schemas and strict interfaces.
2. Decouple: Extract logic to hooks/pure functions. Ensure unit testability.
3. Theme/Tokens: Enforce the cohesive spacing scale and brand variables. Zero magic CSS values.
4. UI States: Handle Loading/Error/Empty robustly. Use <AnimatePresence> for smooth state crossfades.
5. Base UI: Proper forwardRef + slot composition. Target data-[state] attributes for styling behavior.
6. Responsive: Bulletproof text-overflow and zero CLS. Ensure layouts reflow elegantly across the responsive matrix without padding collapse.
7. DOM: Semantic HTML. Eliminate "div soup". Leverage CVA + tailwind-merge for variant scalability.
8. UX Flow: Handle double-clicks (idempotency), disabled states, and router-native semantics. Apply cohesive motion physics.
9. Perf: Interact with Zustand via atomic selectors ONLY. Memoize heavy computations.
10. Architecture: Maintain highly decoupled, cohesive, modern React patterns.

---

## 5. Status
- All visual, modular, and UX gaps resolved. Codebase is clean and compliant.

---

## 6. Completed Audits & Tasks
- [x] **Focus Ring Standardization**: Unified `TeaserCard`, `FavoriteItem`, and `CalendarMonthView` focus rings using `--shadow-focus`.
- [x] **Accessibility Refactoring**: Converted interactive deadline divs in `DeadlinesWidget` to semantic `<button>` elements with keyboard focus support.
- [x] **Semantic HTML fixes**: Modified `Text` tags in `Sidebar` (`NavItem`) and `Topbar` (breadcrumbs) to render as `span` instead of block `p` inside links.
- [x] **Form Inputs Audit**: Verified `Input`, `Textarea`, `SearchInput`, and `FormField` compliance (min 44px height, WCAG attributes, focus shadows).
- [x] **Zustand State Audit**: Validated store slices, selectors, and fallback validation parser (`zod.catch()`).
- [x] **i18n Dictionary Audit**: Verified nested key resolver and language suffix loaders.
- [x] **Motion Audit**: Verified hover durations (150ms) and layout shifts (300ms) matching guidelines.