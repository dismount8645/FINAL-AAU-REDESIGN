import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const files = [
  'src/components/Topbar.tsx',
  'src/components/DeadlinesWidget.tsx',
  'src/components/FavoritesWidget.tsx',
  'src/components/ForumActivityWidget.tsx',
  'src/components/ForumWidget.tsx',
  'src/components/QuickOverviewWidget.tsx',
  'src/components/RecentGradesWidget.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Courses.tsx',
  'src/pages/Grades.tsx',
  'src/pages/NotFound.tsx',
  'src/pages/Notifications.tsx',
  'src/pages/Submission.tsx',
  'src/components/ProfileTab.tsx',
  'src/components/Layout.tsx',
  'src/pages/Course.tsx',
  'src/pages/Favorites.tsx',
  'src/pages/ForumPost.tsx',
  'src/pages/SearchResults.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Support.tsx',
]

function findIfBlockExtent(lines, ifIdx) {
  const ifLine = lines[ifIdx]
  let depth = (ifLine.match(/\{/g) || []).length - (ifLine.match(/\}/g) || []).length
  let end = ifIdx
  while (end + 1 < lines.length && depth > 0) {
    end++
    depth += (lines[end].match(/\{/g) || []).length
    depth -= (lines[end].match(/\}/g) || []).length
  }
  return end
}

let modified = 0

for (const relPath of files) {
  const fullPath = path.resolve(root, relPath)
  let content = fs.readFileSync(fullPath, 'utf-8')
  const lines = content.split('\n')

  const vitestIdx = lines.findIndex(l => l.trim().startsWith('if (import.meta.vitest)'))
  if (vitestIdx === -1) {
    console.log(`  SKIP (no if): ${relPath}`)
    continue
  }

  const blockEnd = findIfBlockExtent(lines, vitestIdx)
  const blockLines = lines.slice(vitestIdx + 1, blockEnd)

  // Find all `const mockXxx = vi.fn()` or `const mockToast = {`
  // that are followed by a vi.mock factory referencing them
  const toLift = []
  const seen = new Set()

  for (let i = 0; i < blockLines.length; i++) {
    const raw = blockLines[i]
    const trimmed = raw.trim()

    const fnMatch = trimmed.match(/^const\s+(mock\w+)\s*=\s*vi\.fn\(\)\s*$/)
    const objMatch = trimmed.match(/^const\s+(mockToast)\s*=\s*\{$/)
    const match = fnMatch || objMatch
    if (!match) continue

    const varName = match[1]
    if (seen.has(varName)) continue
    seen.add(varName)

    // Check if this var is referenced in a vi.mock factory later in the block
    const afterContent = blockLines.slice(i + 1).join('\n')
    if (afterContent.includes(varName) && afterContent.includes('vi.mock(')) {
      toLift.push({ varName, blockLineIdx: vitestIdx + 1 + i })
    }
  }

  if (toLift.length === 0) {
    console.log(`  SKIP (no lift vars): ${relPath}`)
    continue
  }

  // Apply lifts: change `const var =` to `var =`, add `let var` before if block
  let shift = 0
  for (const v of toLift) {
    const lineIdx = v.blockLineIdx + shift
    lines[lineIdx] = lines[lineIdx].replace(/^const\s+(mock\w+\s*=\s*)/, '$1')

    // Find current vitest position
    const curVitest = lines.findIndex(l => l.trim().startsWith('if (import.meta.vitest)'))
    const prevLine = lines[curVitest - 1].trim()
    if (prevLine === '') {
      lines[curVitest - 1] = `let ${v.varName}`
    } else {
      lines.splice(curVitest, 0, `let ${v.varName}`)
      shift++
    }
  }

  content = lines.join('\n')
  fs.writeFileSync(fullPath, content, 'utf-8')
  console.log(`  LIFTED: ${relPath} (${toLift.map(v => v.varName).join(', ')})`)
  modified++
}

console.log(`\nDone: ${modified} files modified`)
