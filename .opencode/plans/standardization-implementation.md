# AAU Moodle: Standardization Gaps Implementation Plan

## Status: Ready to Execute
- 799 tests must stay green
- All 8 items from gap registry

## Open Questions Resolved
- **Badge pill**: Keep rounded-full only, pill prop stays but unused (redundant)
- **Translation nesting**: Full restructure - group ALL keys by page/domain

---

## 1. Spacing Token Alignment

### 1.1 global.css changes
**Add `--space-4xs: 1px` to `@theme` block (line 2)**

Current `@theme` block 1 (lines 1-22):
```css
@theme {
  --radius-pill: 9999px;
  --space-3xs: 0.25rem;  /* 4px */
  --space-2xs: 0.5rem;   /* 8px */
  --space-xs: 0.75rem;   /* 12px */
  --space-sm: 1rem;      /* 16px */
  --space-md: 1.5rem;    /* 24px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 3rem;      /* 48px */
  --space-2xl: 4rem;     /* 64px */
  --space-3xl: 6rem;     /* 96px */
  --space-4xl: 8rem;     /* 128px */
  ...
}
```

Add after `--radius-pill`:
```css
--space-4xs: 1px;
```

**Add `--space-4xs: 1px` to `:root` block (line 254)**

Current `:root` spacing (lines 254-261):
```css
--space-2xs: 2px;
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

Add before `--space-2xs`:
```css
--space-4xs: 1px;
```

### 1.2 Migration mapping for Tailwind classes

| Raw Tailwind | Pixel | Token class |
|---|---|---|
| gap-1, p-1, m-1 | 4px | gap-3xs, p-3xs, m-3xs |
| gap-2, p-2, m-2 | 8px | gap-2xs, p-2xs, m-2xs |
| gap-3, p-3, m-3 | 12px | gap-xs, p-xs, m-xs |
| gap-4, p-4, m-4 | 16px | gap-sm, p-sm, m-sm |
| gap-5, p-5 | 20px | keep as-is |
| gap-6, p-6, m-6 | 24px | gap-md, p-md, m-md |
| gap-8, p-8, m-8 | 32px | gap-lg, p-lg, m-lg |

Also applies to: px-, py-, pt-, pb-, pl-, pr-, mt-, mb-, ml-, mr-, space-x-, space-y-

### 1.3 Files to modify (76+ instances found)

**High count files:**
- Settings.tsx (~40 instances)
- Support.tsx (~30)
- Grades.tsx (~30)
- Course.tsx (~25)
- Notifications.tsx (~25)
- Messages.tsx (~20)
- Dashboard.tsx (~15)
- Courses.tsx (~16)

**Widget files (~5-10 each):**
- FavoritesWidget.tsx
- QuickToolsWidget.tsx
- DeadlinesWidget.tsx
- ForumActivityWidget.tsx
- RecentGradesWidget.tsx
- QuickOverviewWidget.tsx

**Layout components:**
- Topbar.tsx
- Sidebar.tsx
- Footer.tsx

**UI components:**
- Badge.tsx
- Button.tsx
- Card.tsx
- Dialog.tsx
- Input.tsx
- Tabs.tsx
- Accordion.tsx
- TeaserCard.tsx
- StatusItem.tsx
- FavoriteItem.tsx
- InfoCard.tsx
- SearchInput.tsx
- Textarea.tsx
- ModuleHeader.tsx

**Pages:**
- SearchResults.tsx
- NotFound.tsx

**Features:**
- Calendar.tsx

**Other:**
- ErrorBoundary.tsx

### 1.4 Specific replacements needed

From grep results, these are the raw classes to replace:

**gap replacements:**
- `gap-1` → `gap-3xs`
- `gap-1.5` → keep (6px, no exact token)
- `gap-2` → `gap-2xs`
- `gap-3` → `gap-xs`
- `gap-4` → `gap-sm`
- `gap-5` → keep (20px)
- `gap-6` → `gap-md`
- `gap-8` → `gap-lg`

**p replacements:**
- `p-1` → `p-3xs`
- `p-1.5` → keep (6px)
- `p-2` → `p-2xs`
- `p-3` → `p-xs`
- `p-4` → `p-sm`
- `p-5` → keep
- `p-6` → `p-md`
- `p-8` → `p-lg`

**px replacements:**
- `px-1` → `px-3xs`
- `px-1.5` → keep
- `px-2` → `px-2xs`
- `px-2.5` → keep (10px)
- `px-3` → `px-xs`
- `px-4` → `px-sm`
- `px-5` → keep
- `px-6` → `px-md`
- `px-8` → `px-lg`

**py replacements:**
- `py-0.5` → keep (2px)
- `py-1` → `py-3xs`
- `py-1.5` → keep
- `py-2` → `py-2xs`
- `py-2.5` → keep
- `py-3` → `py-xs`
- `py-4` → `py-sm`
- `py-6` → `py-md`
- `py-8` → `py-lg`

**m replacements:**
- `m-1` → `m-3xs`
- `m-2` → `m-2xs`
- `m-3` → `m-xs`
- `m-4` → `m-sm`
- `m-6` → `m-md`
- `m-8` → `m-lg`

**ml replacements:**
- `ml-1` → `ml-3xs`
- `ml-2` → `ml-2xs`
- `ml-3` → `ml-xs`
- `ml-4` → `ml-sm`
- `ml-6` → `ml-md`

**mr replacements:**
- `mr-1` → `mr-3xs`
- `mr-2` → `mr-2xs`
- `mr-3` → `mr-xs`
- `mr-4` → `mr-sm`

**mt replacements:**
- `mt-0.5` → keep
- `mt-1` → `mt-3xs`
- `mt-2` → `mt-2xs`
- `mt-3` → `mt-xs`
- `mt-4` → `mt-sm`

**mb replacements:**
- `mb-1` → `mb-3xs`
- `mb-2` → `mb-2xs`
- `mb-3` → `mb-xs`
- `mb-4` → `mb-sm`

**pt replacements:**
- `pt-0` → keep (0)
- `pt-2` → `pt-2xs`

**pb replacements:**
- `pb-2` → `pb-2xs`
- `pb-4` → `pb-sm`

---

## 2. Chaotic Height Baselines & Responsive Breakpoint Shrinkage

### 2.1 mockData.json changes
Add `tabletSpan` field to each widget config in `widgetConfig`:
```json
{
  "widgetConfig": {
    "favorites":     { "allowedSpans": [4, 6, 8, 12], "tabletSpan": 6, "rowSpan": 3 },
    "quickOverview": { "allowedSpans": [4, 6, 8, 12], "tabletSpan": 6, "rowSpan": 4 },
    "deadlines":     { "allowedSpans": [4, 6, 8, 12], "tabletSpan": 6, "rowSpan": 3 },
    "recentGrades":  { "allowedSpans": [4, 6, 8, 12], "tabletSpan": 6, "rowSpan": 3 },
    "forumActivity": { "allowedSpans": [4, 6, 8, 12], "tabletSpan": 6, "rowSpan": 3 }
  }
}
```

### 2.2 Dashboard.tsx changes
- Read `tabletSpan` from widget config instead of computing it
- Set `--tablet-span` from data, not heuristic
- Widgets with rowSpan: 2 get bumped to 3

---

## 3. Badge Styling Drift

### 3.1 Badge.tsx changes
- `pill` prop already in interface (line 29) but never used
- Keep as-is (rounded-full only per user decision)
- Can remove `pill` from interface or leave it for future use

### 3.2 Files with raw badge spans to replace with `<Badge>`

**Courses.tsx** (line ~315):
```tsx
// Replace:
<span className="inline-flex items-center gap-1.5 px-md py-xs rounded-[var(--radius-pill)] bg-warning/20 text-warning text-xs font-bold uppercase tracking-wider">
// With:
<Badge variant="warning">
```

**Grades.tsx**: Similar pattern

**FavoriteItem.tsx** (line 77):
```tsx
// Replace:
className="inline-flex items-center text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-[var(--radius-pill)] mt-0.5"
// With:
<Badge variant="...">
```

**SearchResults.tsx**: Category pills

**ForumPost.tsx**: Status tags (uses rounded-md — verify if intentional)

---

## 4. Diverging Icon Uniformity

### 4.1 Changes across ~20 files
- Add explicit `strokeWidth={2}` to all lucide-react imports
- Standardize sizes to: 14, 16, 18, 20, 24
- Remove outlier sizes like `size={22}` → normalize to 20 or 24

### 4.2 Files to check
Search for all lucide-react imports and verify strokeWidth/size props.

---

## 5. Mock API Proxy Contracts

### 5.1 Create new files

**src/api/support.ts**:
```ts
import { api } from '@/api'
import type { SupportFormData } from '@/types'

export const submitSupportTicket = (data: SupportFormData) =>
  api.post('/support/tickets', data, () => ({ success: true, ticketId: 'MOCK-001' }))
```

**src/api/submissions.ts**:
```ts
import { api } from '@/api'
import type { SubmissionData } from '@/types'

export const submitAssignment = (data: SubmissionData) =>
  api.post('/submissions', data, () => ({ success: true, submissionId: 'MOCK-001' }))
```

**src/api/settings.ts**:
```ts
import { api } from '@/api'
import type { SettingsData } from '@/types'

export const saveSettings = (data: SettingsData) =>
  api.put('/settings', data, () => ({ success: true }))
```

### 5.2 Update page files
Replace inline setTimeout form handlers with API client calls in:
- Support.tsx
- Submission.tsx
- Settings.tsx

---

## 6. Mixed Danish-English Fallbacks & Translation Structure

### 6.1 Full restructure of translations.ts

Group ALL keys by page/domain. Proposed structure:

```ts
export const translations: Translations = {
  da: {
    // Common/Global
    common: {
      close: 'Luk',
      cancel: 'Annuller',
      save: 'Gem',
      edit: 'Rediger',
      delete: 'Slet',
      back: 'Tilbage',
      next: 'Næste',
      previous: 'Forrige',
      done: 'Færdig',
      reset: 'Nulstil',
      all: 'Alle',
      today: 'I dag',
      tomorrow: 'I morgen',
      yesterday: 'I går',
      // ... etc
    },
    
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      calendar: 'Kalender',
      courses: 'Moduler',
      resources: 'Værktøjskassen',
      support: 'Support',
      settings: 'Indstillinger',
      messages: 'Beskeder',
      notifications: 'Notifikationer',
      profile: 'Profil',
      logout: 'Log ud',
    },
    
    // Categories (settings)
    categories: {
      user_account: 'Brugerkonto',
      edit_profile: 'Rediger profil',
      select_language: 'Vælg sprog',
      // ... all cat_* keys
    },
    
    // Dashboard
    dashboard: {
      welcome: 'Velkommen tilbage, Jacob',
      assignments_count: 'Du har 2 afleveringer i denne uge.',
      edit_mode_active: 'Redigeringstilstand aktiveret',
      // ... etc
    },
    
    // Settings
    settings: {
      subtitle: 'Opdater dine personlige oplysninger og præferencer.',
      // ... all settings keys
    },
    
    // Courses
    courses: {
      // ... all course keys
    },
    
    // Course (single)
    course: {
      // ... all single course keys
    },
    
    // Support
    support: {
      // ... all support keys
    },
    
    // Submission
    submission: {
      // ... all submission keys
    },
    
    // Messages
    messages: {
      // ... all message keys
    },
    
    // Notifications
    notifications: {
      // ... all notification keys
    },
    
    // Grades
    grades: {
      // ... all grade keys
    },
    
    // Resources/Toolbox
    resources: {
      // ... all resource keys
    },
    
    // Forum
    forum: {
      // ... all forum keys
    },
    
    // Calendar
    calendar: {
      // ... all calendar keys
    },
    
    // Search
    search: {
      // ... all search keys
    },
    
    // Favorites
    favorites: {
      // ... all favorite keys
    },
    
    // NotFound
    notFound: {
      // ... all not found keys
    },
    
    // Error
    error: {
      // ... all error keys
    },
    
    // Theme
    theme: {
      light: 'Lys',
      dark: 'Mørk',
      system: 'System',
    },
    
    // Progress
    progress: {
      '0': 'Klar til at starte?',
      '25': 'Du er i gang!',
      // ... etc
    },
    
    // Months/Days
    months: { ... },
    days: { ... },
    
    // Course data
    courses_data: {
      // course titles, sections, items
    },
    
    // Notification data
    notifications_data: {
      // notif texts
    },
    
    // Message data
    messages_data: {
      // message texts
    },
  },
  en: { ... }
}
```

### 6.2 Update store's t() method
The store's t() method already supports dot-path traversal. No infra changes needed.

### 6.3 Update all call sites
Change all `t('key')` to `t('domain.key')` across all files.

Files to update:
- Sidebar.tsx
- Settings.tsx
- Courses.tsx
- SearchResults.tsx
- Dashboard.tsx
- Course.tsx
- Support.tsx
- Messages.tsx
- Notifications.tsx
- Grades.tsx
- Resources.tsx
- Favorites.tsx
- NotFound.tsx
- Submission.tsx
- ForumPost.tsx
- Topbar.tsx
- Calendar.tsx
- All widget files
- All UI components using translations

### 6.4 Add missing translation keys
Add missing keys for hardcoded strings in:
- SearchResults.tsx (~10 keys)
- ForumPost.tsx (~5 keys)
- NotFound.tsx (~3 keys)
- Submission.tsx (~3 keys)
- Resources.tsx (~3 keys)
- Grades.tsx (~2 keys)
- Topbar.tsx search placeholder (~1 key)

---

## 7. Accessibility Fixes

### 7.1 Implicit Form Mappings

**Settings.tsx**:
- Add `id` to radio inputs, selects, time inputs
- Add `htmlFor` to their labels
- Toggle switches: add `aria-labelledby` pointing to adjacent label text

**Course.tsx, Grades.tsx**:
- Add `id` to `<select>` elements
- Pair with `<label htmlFor="...">`

### 7.2 Sub-44px Touch Targets

**InfoCard.tsx**:
- Help/star buttons — add `after:absolute after:inset-[-12px]` touch expansion

**QuickToolsWidget.tsx**:
- Star button — same

**Settings.tsx**:
- Toggle switches — increase height to 28px min, add touch expansion

### 7.3 Focus Ring Standardization

Replace problematic patterns in ~8 files:
- `outline-none` → `outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] focus-visible:outline-offset-2`
- `focus:outline-none` → remove (let global rule handle it)
- `focus:ring-2` → `focus-visible:ring-2` (keyboard-only)

Files:
- Topbar.tsx
- Sidebar.tsx
- Course.tsx
- Grades.tsx
- Settings.tsx
- Tabs.tsx

---

## 8. Animation & Layout Shift Fixes

### 8.1 Create useAnimation.ts (enhance existing)

Current useAnimations.ts already has TRANSITIONS and ANIMATION_VARIANTS.

Add:
```ts
export const ANIMATION_PRESETS = {
  fast: { duration: 150, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  normal: { duration: 200, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  slow: { duration: 300, ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
} as const

export const TRANSITION_CLASSES = {
  fast: 'transition-all duration-150 ease-default',
  normal: 'transition-all duration-200 ease-default',
  slow: 'transition-all duration-300 ease-default',
} as const
```

### 8.2 Update files with inline animation configs
Replace hardcoded Framer Motion transition objects with ANIMATION_PRESETS.* references.
Replace inline `style={{ transition: '...' }}` with Tailwind classes from TRANSITION_CLASSES.

### 8.3 Dynamic content areas - add min-height
- Dashboard.tsx: Edit banner → reserve height with `min-h-[60px]`
- Support.tsx: Form toggle → use `min-h-[200px]` on container
- Course.tsx: Tab content → add `min-h-[300px]`

### 8.4 Drag/drop improvements
- Favorites.tsx: Add onDragOver visual feedback on drop targets (border highlight, subtle bg change)
- Submission.tsx: Add dragover active state class toggle on file drop zone

---

## Verification Plan

### Automated Tests
```bash
npm run test
```
All 799 tests must pass.

### Manual Verification
1. Build dev server (npm run dev)
2. Spot-check spacing hasn't visually changed (pixel values preserved)
3. Tab through key pages with keyboard — verify focus rings visible
4. Test drag/drop on Dashboard and Favorites
5. Switch language and verify no hardcoded strings remain
6. Resize browser to tablet width — verify widget layout
