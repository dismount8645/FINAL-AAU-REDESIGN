# Dashboard Layout Fix — Execute Plan

## Files to edit (5 files, all exact edits)

---

### 1. `src/pages/Dashboard.tsx`

**A) DEFAULT_WIDGETS spans (line 6-12):**
OLD:
```tsx
const DEFAULT_WIDGETS = [
  { id: 'favorites', span: 6 },
  { id: 'quickOverview', span: 8 },
  { id: 'deadlines', span: 4 },
  { id: 'recentGrades', span: 4 },
  { id: 'forumActivity', span: 4 },
]
```
NEW:
```tsx
const DEFAULT_WIDGETS = [
  { id: 'favorites', span: 8 },
  { id: 'quickOverview', span: 8 },
  { id: 'deadlines', span: 8 },
  { id: 'forumActivity', span: 24 },
  { id: 'recentGrades', span: 12 },
  { id: 'support', span: 12 },
]
```

**B) Container className (line 26):**
OLD:
```tsx
      <div className="w-full max-w-[1600px] mx-auto px-[var(--space-md)] md:px-[var(--space-lg)] pt-[var(--space-lg)] pb-[var(--space-2xl)]">
```
NEW:
```tsx
      <div className="w-full px-[var(--space-sm)] md:px-[var(--space-md)] pt-[var(--space-md)] pb-[var(--space-2xl)]">
```

---

### 2. `src/components/Widgets/DashboardWidgets.tsx`

**A) Add import (after line 3, with other lucide imports):**
OLD: (line 4-5)
```tsx
  Calendar, ChevronRight, Clock, AlertCircle, CheckCircle2,
  Star, BookOpen, Trophy, Hourglass
```
NEW:
```tsx
  Calendar, ChevronRight, Clock, AlertCircle, CheckCircle2,
  Star, BookOpen, Trophy, Hourglass, Headphones, ExternalLink
```

**B) Add env import (after line 14):**
OLD:
```tsx
import { env } from '@/lib/env';
```
NEW: (already exists, just need to ensure — it's there at line 14)

**C) Add SupportWidget component (before line 319 export, after RecentGradesWidget):**
OLD:
```tsx
export { DeadlinesWidget, FavoritesWidget, RecentGradesWidget }
```
NEW:
```tsx
// --- SupportWidget ---

function SupportWidget() {
  const t = useStore(state => state.t)
  return (
    <Card className="support-widget h-full w-full flex flex-col group/widget overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border-[var(--border-color)]/60">
      <Card.Header padding="compact" className="border-b border-[var(--border-color)]/40 bg-bg-highlight/50 backdrop-blur-sm">
        <Stack direction="row" align="center" gap="sm">
          <div className="p-[var(--space-2xs)] bg-primary text-white rounded-[var(--radius-md)] shadow-sm">
            <Headphones size={18} strokeWidth={2} />
          </div>
          <Heading level={2} as="h2" className="m-0 text-sm font-bold text-main">
            {t('contact_its_support')}
          </Heading>
        </Stack>
      </Card.Header>
      <Card.Body padding="compact" className="p-[var(--space-md)] flex-1 flex flex-col justify-center">
        <Text size="sm" className="text-text-muted mb-md leading-relaxed">
          {t('aau_it_services')}
        </Text>
        <Button
          variant="primary"
          full
          iconRight={ExternalLink}
          onClick={() => env.open('https://support.its.aau.dk/')}
          className="normal-case tracking-normal font-bold text-sm"
        >
          {t('contact_support')}
        </Button>
      </Card.Body>
    </Card>
  )
}

export { DeadlinesWidget, FavoritesWidget, RecentGradesWidget, SupportWidget }
```

---

### 3. `src/components/Widgets/WidgetGrid.tsx`

**A) Update import (line 4):**
OLD:
```tsx
import { DeadlinesWidget, FavoritesWidget, RecentGradesWidget } from './DashboardWidgets'
```
NEW:
```tsx
import { DeadlinesWidget, FavoritesWidget, RecentGradesWidget, SupportWidget } from './DashboardWidgets'
```

**B) Add case (after line 49, before default):**
OLD:
```tsx
          default:
            return null
```
NEW:
```tsx
          case 'support':
            return (
              <Grid.Item key={widget.id} span={widget.span}>
                <SupportWidget />
              </Grid.Item>
            )
          default:
            return null
```

---

### 4. `src/global.css`

**A) `.page-header--card` padding (line 460):**
OLD:
```css
  padding: var(--space-lg) var(--space-lg);
```
NEW:
```css
  padding: var(--space-lg) var(--space-md);
```

**B) Remove `--dashboard-row-height` (line 265):**
OLD:
```css
  --dashboard-row-height: 100px;
```
NEW: (delete this line)

**C) Remove `grid-auto-rows` override (line 503-505):**
OLD:
```css
.grid-container.dashboard__grid {
  grid-auto-rows: var(--dashboard-row-height);
}
```
NEW: (delete the entire block, lines 503-505)

---

### 5. `src/components/Layout/Footer.tsx`

**Remove support-card section (lines 14-29):**
OLD:
```tsx
      <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
          {/* Support Card - Left Anchor */}
          <Stack gap="sm" className="bg-bg-card p-lg rounded-xl border border-border shadow-sm col-span-12 md:col-span-5 lg:col-span-4 w-full isolate relative overflow-hidden group/footer-card">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-60" />
            <Heading level={2} as="h2" className="font-bold text-main transition-colors group-hover/footer-card:text-primary text-lg">
              {t('contact_its_support')}
            </Heading>
            <Stack gap="xs">
              <Text size="sm" weight="bold" className="text-main">
                Tel: <a href="tel:+4599402020" className="text-primary hover:text-accent hover:underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:shadow-focus rounded-sm px-2xs">+45 9940 2020</a>
              </Text>
            <Text size="xs" className="text-text-muted" weight="medium">
                {t('aau_it_services')}
              </Text>
            </Stack>
          </Stack>
          
          {/* Navigation & Copyright - Right Anchor */}
```
NEW:
```tsx
      <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
          {/* Navigation & Copyright */}
```

Also remove unused imports from Footer.tsx:
OLD:
```tsx
import Button from '@/components/ui/Button';
import { Stack } from '@/components/Layout/LayoutPrimitives';
import { Heading, Text } from '@/components/ui';
```
NEW:
```tsx
import { Text } from '@/components/ui';
```

---

## Test after changes

```bash
npx vitest run --reporter=verbose src/components/Layout/ 2>&1
npx vitest run --reporter=verbose src/pages/Dashboard.tsx 2>&1
npx vitest run --reporter=verbose src/components/Widgets/ 2>&1
```
