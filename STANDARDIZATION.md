# AAU Moodle Redesign: Critical Standardization & Alignment Gaps

Report on active inconsistencies, styling gaps, architectural layout weaknesses, and anti-patterns in AAU Moodle. negative-only roadmap to audit code/visual quality.

---

## 🎨 1. UI & Visual System Gaps (Checklist)

### Spacing & Layout Arbitrariness
- [x] **Pixel Spacing Hardcoding**: Standardize arbitrary Tailwind spacing (`p-4`, `m-2`, `gap-5`, `h-[300px]`, `w-72`) in layouts. Components must use CSS property tokens (`var(--space-md)`, `var(--space-lg)`, etc.) in `global.css` to prevent drifts.
- [x] **Chaotic Height Baselines**: Dashboard widgets (`ForumWidget`, `DeadlinesWidget`, `RecentGradesWidget`) declare hardcoded heights / unequal borders → messy rhythm when side-by-side. Lock layouts to shared modular grid height steps.
- [x] **Scrollbar Visual Drifts**: Lists in `Messages.tsx` + custom scroll panels on Dashboard grids use uneven browser-default scrollbars / inline styles. Force standard track, width, thumb colors via global rules in CSS.
- [x] **Dynamic Wave Background Inconsistencies**: `DynamicWaveBackground` unpredictable on deep nested forms (like `Support.tsx`). Require unified layout wrapping containment, not per-page instantiations.
- [x] **Responsive Breakpoint Layout Shrinkage**: High-destruct widgets with custom width on 24-column container shrink + clip text details on tablet. Breaks fluid layout proportions.
- [x] **Hardcoded Limit Values**: Favorite constraints counts hardcoded (limit `12` in `Favorites.tsx`) in presentation logic. Reference central dashboard config/constants.

### Typographic Hierarchy & Color Drifts
- [x] **Hardcoded AAU Hex Directives**: Brand blue `#211a52` hardcoded in custom lists / backgrounds. Hex direct refs forbidden; use `--aau-blue`.
- [x] **Fragile Header Typography Drift**: Page headers declare direct overrides or raw `<h1>`/`<h2>` with distinct tracker properties. Unified under standard `<PageHeader />` or `Typography` structure.
- [x] **Badge Styling Drift**: Badges, user profile avatars, pill indicators use distinct border-radius (`rounded-full` vs `rounded-md`) / mismatched weights. Inherit from unified standard elements.
- [x] **Diverging Icon Uniformity**: SVG icons from `lucide-react` carry varying stroke-width, width, wrappers across sidebars, topbar, widgets. Force strict wrapper rule (standard sizes + `strokeWidth={2}`).

---

## ⚙️ 2. Architectural & Code Modularity Gaps (Checklist)

### Module Imports & Path Gaps
- [x] **Relative Style Import Traversal**: Test suites (`Favorites.test.tsx`, `QuickToolsWidget.test.tsx`, etc.) traverse files via relative paths (`../store/useStore`, `../utils/favorites`). internal modules must bind to `@/` alias.
- [x] **Scattered Static Structures**: Static arrays (mock profiles, support locations, contacts, tools) declared inside page codes or local files. Move to uniform configuration JSON structures.
- [x] **State Handler Duplication**: Unread notification count decrement rules in `Messages.tsx` or `Topbar.tsx` use custom logic before modifying lists. Centralize in Zustand store actions via events.

### State Store & API Logic Parity
- [x] **Monolithic Store State Over-reliance**: Data, selections, and transient modals stacked in single monolithic store block. Segment store with isolated slices for UI states vs course data updates.
- [x] **Lack of Component Re-rendering Cache (Memoization)**: Widgets compute metrics (sort grades, filter deadlines, classify months) inline during render. Wrap in `useMemo` hooks or standard external state helpers to block redundant renders.
- [x] **Silent Errors & Brittle Storage Initializations**: Local storage parsing in `useStore.ts` / hooks drops silent warnings/partial states if keys corrupt. Sandbox retrieval using schema validators.
- [x] **Fragile Mock API Proxy Contracts**: Mocks for fetching/saving forms scattered across components. Standardized mock API client (`ApiClient`) must back actions.

---

## 🌍 3. UX, Localization & Accessibility Gaps (Checklist)

### Translation (i18n) & Localized Drifts
- [x] **Mixed Danish-English Structural Fallbacks**: Fallback states in `SearchResults.tsx` / empty states use English. translation logic must block raw strings, fail via standard i18n identifiers.
- [x] **Unstructured Local Translation Dictionary**: Translation keys lack grouping, random root keys for layout/settings/components. Group keys by pages/domains (e.g., `settings.profile.title`).
- [x] **Mismatched Date Formatting Rules**: Calendar widget + upcoming deadlines widget display dates using distinct inline patterns. Standardize using localized i18n helpers.
- [x] **Inline Ternary Translation Gaps**: Conditional texts bypass translation rules via inline logic (`'Fjern alle'`/`'Remove all'` in `Favorites.tsx`, or conditional alert blocks). Limits key audits.

### Accessibility (a11y) & Interactive Elements
- [x] **No Interactive Skip-to-Content Action**: Keyboard-only / screen readers must step through side menus, breadcrumbs, profile links on every page load. Introduce global skip-navigation element.
- [x] **Implicit Target Form Mappings**: Form elements in settings/support use wrapper alignments, not explicit `id` + `htmlFor` mappings. Degrades access, breaks mouse targeting.
- [x] **Sub-44px Interaction Surfaces**: Action nodes (close, delete tabs, favorite stars, search clear buttons) under 44px touch threshold. Boost padding for layout interfaces.
- [x] **Vague Active Focus Visual States**: Elements in forms, buttons, calendar day pills lack high-contrast focus rings on keyboard navigation.

### Visual Transitions & Layout Performance
- [x] **Inconsistent Layout Animators**: Dynamic tabs, dashboard reorganizations, page transitions use unequal animations (Tailwind `transition-all` vs Framer Motion). Standardize in central hook framework.
- [x] **Layout-Shift on Dynamic Element Loads**: Adjacent elements jump when widgets/files load. Maintain placeholder dimensions or skeleton loaders to prevent layout shifts.
- [x] **Draggable Drop Zone Tactility**: Draggable elements (Dashboard widgets, favorites) lack visual drop zone placeholders. Makes ordering feel less responsive.

---

*Standardization checklist = primary visual/technical quality register. Audit new changes against this gap checker.*
