# AAU Moodle Redesign: Standardization Gaps

Audit inconsistencies, styling, arch weaknesses.

---

## 🎨 1. UI & Visual Gaps

### Spacing & Layout
- [x] **Tailwind Spacing**: No hardcoded `p-4`, `m-2`. Use `var(--space-*)` in `global.css`.
- [x] **Widget Heights**: Dashboard widgets (`Forum`, `Deadlines`, `Grades`) use shared grid height. No arbitrary `h-[]`.
- [x] **Scrollbars**: Standardize via global CSS. No browser-default/inline styles.
- [x] **Wave BG**: Unified layout wrap for `DynamicWaveBackground`.
- [x] **Breakpoint Layout**: Fix widget shrink/clip on tablet.
- [x] **Hardcoded Limits**: Move `Favorites` limit to central config.

### Typography & Color
- [x] **AAU Hex**: No `#211a52`. Use `--aau-blue`.
- [x] **Header Type**: Use `<PageHeader />` / `Typography`. No direct overrides.
- [x] **Badges/Pills**: Unified `rounded-*` + weight.
- [x] **Icons**: Lucide icons + strict wrapper (`strokeWidth={2}`, standard size).

---

## ⚙️ 2. Arch & Modularity Gaps

### Imports & Paths
- [x] **Path Alias**: `Favorites.test.tsx` etc. use `@/`. No `../../`.
- [x] **Static Data**: Move mocks/tools to JSON config. No inline arrays.
- [x] **State Logic**: Centralize notification logic in Zustand store.

### Store & API
- [x] **Store Slices**: Split monolithic store (UI vs Data).
- [x] **Memoization**: `useMemo` for widget metrics (grades, deadlines).
- [x] **Storage**: Zod validation for local storage. No silent corruptions.
- [x] **Mock API**: Unified `ApiClient`. No scattered mocks.

---

## 🌍 3. UX, i18n & A11y

### Translation & i18n
- [x] **Fallbacks**: `SearchResults` must use i18n. No English strings.
- [x] **Dict Structure**: Group keys by page/domain (e.g., `settings.profile.title`).
- [x] **Date Format**: Localized i18n helpers only.
- [x] **Ternary Text**: No inline strings (`'Remove all'`). Use i18n keys.

### A11y & Interactive
- [x] **Skip-to-Content**: Add global skip-nav.
- [x] **Form Mapping**: `id` + `htmlFor`. No implicit wraps.
- [x] **Touch Targets**: Min 44px. Boost padding.
- [x] **Focus States**: High-contrast rings for keyboard nav.

### Transitions & Perf
- [x] **Animators**: Standardize (Motion vs CSS) in central hook.
- [x] **CLS**: Skeletons/placeholders for dynamic loads.
- [x] **Drag/Drop**: Add drop zone visual placeholders.

---

*Checklist = visual/tech quality register.*
