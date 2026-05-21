# AAU Moodle Redesign: Critical Standardization & Alignment Gaps

This report focuses strictly on active inconsistencies, styling gaps, architectural layout weaknesses, and anti-patterns present across all layers of the AAU Moodle application. It serves as our absolute negative-only roadmap to systematically audit and perfect code quality and visual craft.

---

## 🎨 1. UI & Visual System Gaps (Checklist)

### Spacing & Layout Arbitrariness
- [x] **Pixel Spacing Hardcoding**: Standardize all arbitrary Tailwind spacing values (`p-4`, `m-2`, `gap-5`, `h-[300px]`, `w-72`) in visual layouts. Every component must strictly leverage CSS Custom Property tokens (`var(--space-md)`, `var(--space-lg)`, etc.) defined in `global.css` to prevent fluid-design drifts.
- [x] **Chaotic Height Baselines**: Dashboard widgets (like `ForumWidget`, `DeadlinesWidget`, `RecentGradesWidget`) declare hardcoded baseline heights or unequal inner borders. This produces a messy visual rhythm when widgets are side-by-side. Layouts must lock onto shared modular grid height steps.
- [x] **Scrollbar Visual Drifts**: List elements in `Messages.tsx` and custom scroll panels on Dashboard grids use uneven browser-default scrollbars or varying inline styles. Standardized custom track, width, and thumb colors must be forced layout-wide via global custom scroll rules in CSS.
- [x] **Dynamic Wave Background Inconsistencies**: The `DynamicWaveBackground` behaves unpredictably on deeply nested forms (like `Support.tsx`). The wave background requires a unified containment standard of layout wrapping rather than per-page instantiation.
- [x] **Responsive Breakpoint Layout Shrinkage**: High-destruct widgets set with custom widths on the 24-column container shrink and clip text details on tablet viewport transitions. Breaks fluid horizontal layout proportions.
- [x] **Hardcoded Limit Values**: Favorite constraints limit counts are hardcoded (like limit `12` inside `Favorites.tsx`) directly in presentation layer logic instead of referencing a central dashboard config file/constant module.

### Typographic Hierarchy & Color Drifts
- [x] **Hardcoded AAU Hex Directives**: AAU's signature primary brand blue color is hardcoded as `#211a52` in multiple custom lists or backgrounds. Direct hex references must be forbidden; they must point to the central `--aau-blue` custom theme property.
- [x] **Fragile Header Typography Drift**: Page headers declare direct component overrides or raw `<h1>`/`<h2>` structures with distinct tracker properties. They should all be unified under a standardized, abstract `<PageHeader />` or `Typography` structure to guarantee visual parity.
- [x] **Badge Styling Drift**: Badges, user profile avatars, and visual pill indicators use distinct border-radius metrics (`rounded-full` vs `rounded-md`) and mismatched light weights. They must strictly inherit values from unified standard elements.
- [x] **Diverging Icon Uniformity**: SVG icons imported from `lucide-react` carry varying stroke-width sizes, widths, and structural wrappers across layout sidebars, top navigation bars, and widget title components. Ensure a strict wrapper class rule (e.g., standard sizing classes and `strokeWidth={2}`).

---

## ⚙️ 2. Architectural & Code Modularity Gaps (Checklist)

### Module Imports & Path Gaps
- [x] **Relative Style Import Traversal**: Various test suites (`Favorites.test.tsx`, `QuickToolsWidget.test.tsx`, etc.) traverse workspace files using fragile multi-step relative paths (e.g. `../store/useStore` or `../utils/favorites`). ALL internal modules must bind to central path-alias imports starting with `@/` to safeguard relocation operations.
- [x] **Scattered Static Structures**: Static arrays (like mock profiles, support location accordions, contacts lists, or system tools resources) are declared inside page codes or local files. This splits true data state. Static mock items must move into uniform configuration JSON structures.
- [x] **State Handler Duplication**: The unread notification count decrement rules in `Messages.tsx` or `Topbar.tsx` are handled via custom logic blocks before modifying lists. Centralized Zustand store actions should host those decrements via encapsulated event dispatch handlers.

### State Store & API Logic Parity
- [x] **Monolithic Store State Over-reliance**: All data changes, user selections, and transient modal structures are stacked inside a single monolithic store state block. We need store segmentation with focused, isolated slices for UI states vs course data updates.
- [x] **Lack of Component Re-rendering Cache (Memoization)**: Various layout widgets compute metrics (like sorting grades, filtering upcoming deadlines, or classifying months) inline during initial render cycles. They must reside inside structured `useMemo` hooks or standardized external state helpers to block redundant rendering.
- [x] **Silent Errors & Brittle Storage Initializations**: Parsing of local storage values inside `useStore.ts` or course hooks drops silent warnings or partial states if keys are corrupted. Safely sandbox all custom storage retrieval actions using strict schema validators.
- [x] **Fragile Mock API Proxy Contracts**: Mocks for fetching or saving form structures exist as localized mock behaviors scattered across components. Real, standardized mock API client instances (`ApiClient`) must always back actions to ensure production readiness.

---

## 🌍 3. UX, Localization & Accessibility Gaps (Checklist)

### Translation (i18n) & Localized Drifts
- [x] **Mixed Danish-English Structural Fallbacks**: Fallback text states inside `SearchResults.tsx` or empty state displays occasionally fall back to English expressions dynamically. Translation logic must block raw text strings completely and fail gracefully using standard localization identifiers.
- [x] **Unstructured Local Translation Dictionary**: Key definitions inside translation resource dictionaries lack clear grouping, with random root keys used for layout, settings pages, and custom components. Group translation keys by pages or domains (e.g., `settings.profile.title`).
- [x] **Mismatched Date Formatting Rules**: The Calendar widget and upcoming deadlines widgets parse and display date-time stamps using distinct inline patterns. Standardize date visualization using localized i18n helpers.
- [x] **Inline Ternary Translation Gaps**: Conditional layout text expressions bypass standard translation definitions via local conditional logic (e.g. `'Fjern alle'`/`'Remove all'` inline in `Favorites.tsx`, or conditional alert blocks) which limits maintainable key audits.

### Accessibility (a11y) & Interactive Elements
- [x] **No Interactive Skip-to-Content Action**: Keyboard-only and assistive-tech screen readers are forced to step through heavy global side menus, breadcrumbs, and profile links first on every page load. Introduce a global skip-navigation element.
- [x] **Implicit Target Form Mappings**: Various form elements inside settings pages or support panels rely on wrapper alignments instead of explicit `id` and `htmlFor` mappings. This degrades modern access and breaks raw label mouse targeting.
- [x] **Sub-44px Interaction Surfaces**: Select action nodes (such as close items, delete tabs, favoriting stars, or small search button clear elements) fall below the 44px mobile touch threshold. Boost outer bounds padding to optimize layout interfaces.
- [x] **Vague Active Focus Visual States**: Diverse elements across forms, buttons, and calendar day pills fail to render highly contrasting focus-ring indicators on keyboard navigation.

### Visual Transitions & Layout Performance
- [x] **Inconsistent Layout Animators**: Dynamic tabs, dashboard reorganizations, and page transitions execute using unequal animation configurations (e.g. standard Tailwind `transition-all` vs custom Framer Motion dynamics). Standardize all interaction animations through common preset configs in a central custom hook framework.
- [x] **Layout-Shift on Dynamic Element Loads**: As dynamic components (like dashboard widgets or loaded files) enter the DOM, adjacent elements jump abruptly. Ensure all dynamic wrappers maintain clean placeholder dimensions or skeleton loaders to prevent layout shifts.
- [x] **Draggable Drop Zone Tactility**: Elements with `draggable` characteristics (such as Dashboard layout widgets or favorite index items) lack strong visual drop zone placeholders, making ordering maneuvers feel slightly less responsive on trackpads.

---

*This standardization checklist is our primary visual and technical quality register. No new layout or feature changes should proceed without auditing items against this active gap checker.*
