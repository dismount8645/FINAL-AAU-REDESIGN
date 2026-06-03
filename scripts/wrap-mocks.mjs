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
  'src/components/NotificationItemRow.tsx',
  'src/components/ProfileTab.tsx',
  'src/components/WidgetWrapper.tsx',
  'src/components/Layout.tsx',
  'src/pages/Course.tsx',
  'src/pages/Favorites.tsx',
  'src/pages/ForumPost.tsx',
  'src/pages/SearchResults.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Support.tsx',
  'src/components/GradesFilter.tsx',
  'src/components/SubmissionDropzone.tsx',
]

function isTestConstruct(t) {
  if (t.startsWith('vi.mock(')) return true
  if (t.startsWith('vi.fn(')) return true
  if (/^(const|let|var)\s+mock/.test(t)) return true
  if (/^const\s+\w+\s*=\s*vi\.fn\(/.test(t)) return true
  if (t.startsWith('function render')) return true
  if (t.startsWith('function mock')) return true
  if (t.startsWith('beforeEach')) return true
  if (t.startsWith('afterEach')) return true
  if (t.startsWith('// Mock') || t.startsWith('// mock')) return true
  return false
}

function findBlockStart(lines, vitestIdx) {
  let earliestTest = -1
  for (let i = vitestIdx - 1; i >= 0; i--) {
    const t = lines[i].trim()
    if (t.startsWith('export default') && !t.startsWith('export default function')) {
      return earliestTest > 0 ? earliestTest : i + 1
    }
    if (isTestConstruct(t)) {
      earliestTest = i
    }
  }
  return Math.max(0, earliestTest)
}

function findLiftVars(lines, ifLineIdx) {
  const result = []
  if (ifLineIdx < 0) return result

  const seen = new Set()
  let i = ifLineIdx + 1

  while (i < lines.length) {
    const trimmed = lines[i].trim()
    if (trimmed === '') { i++; continue }
    if (trimmed.startsWith('describe(') || trimmed.startsWith('}')) break

    const fnMatch = trimmed.match(/^const\s+(mock\w+)\s*=\s*vi\.fn\(\)\s*$/)
    const objMatch = trimmed.match(/^const\s+(mockToast)\s*=\s*\{$/)

    if (fnMatch || objMatch) {
      const varName = (fnMatch || objMatch)[1]
      const fullContent = lines.slice(i + 1).join('\n')
      if (fullContent.includes(varName) && fullContent.includes('vi.mock(')) {
        if (!seen.has(varName)) {
          seen.add(varName)
          result.push({ varName, lineIdx: i, isFn: !!fnMatch })
        }
      }
    }
    i++
  }
  return result
}

let fixed = 0
let skipped = 0

for (const relPath of files) {
  const fullPath = path.resolve(root, relPath)
  if (!fs.existsSync(fullPath)) { skipped++; continue }

  let content = fs.readFileSync(fullPath, 'utf-8')
  const lines = content.split('\n')

  const vitestIdx = lines.findIndex(l => l.trim().startsWith('if (import.meta.vitest)'))
  if (vitestIdx === -1) { skipped++; continue }

  const blockStart = findBlockStart(lines, vitestIdx)
  if (blockStart <= 0 || blockStart >= vitestIdx) { skipped++; continue }

  let blockEnd = vitestIdx - 1
  while (blockEnd >= blockStart && lines[blockEnd].trim() === '') blockEnd--
  if (blockStart > blockEnd) { skipped++; continue }

  const block = lines.slice(blockStart, blockEnd + 1)
  const indented = block.map(l => '  ' + l)

  lines.splice(blockStart, block.length)

  const newVitest = lines.findIndex(l => l.trim().startsWith('if (import.meta.vitest)'))
  if (newVitest === -1) { skipped++; continue }

  const vtLine = lines[newVitest]
  const bracePos = vtLine.indexOf('{')
  const beforeBrace = vtLine.substring(0, bracePos + 1)
  const afterBrace = vtLine.substring(bracePos + 1).trim()

  lines[newVitest] = beforeBrace
  lines.splice(newVitest + 1, 0, ...indented)

  if (afterBrace.length > 0) {
    const indent = vtLine.match(/^\s*/)[0] || ''
    const afterLines = afterBrace.split('\n')
    for (let i = afterLines.length - 1; i >= 0; i--) {
      lines.splice(newVitest + 2, 0, indent + afterLines[i])
    }
  }

  const reVitest = lines.findIndex(l => l.trim().startsWith('if (import.meta.vitest)'))
  const liftVars = findLiftVars(lines, reVitest)

  const unique = []
  const seen = new Set()
  for (const v of liftVars) {
    if (!seen.has(v.varName)) { seen.add(v.varName); unique.push(v) }
  }

  let inserted = 0
  for (const v of unique) {
    const adjLineIdx = v.lineIdx + inserted
    lines[adjLineIdx] = lines[adjLineIdx].replace(/const\s+(mock\w+\s*=\s*)/, '$1')

    const curVitest = lines.findIndex(l => l.trim().startsWith('if (import.meta.vitest)'))
    if (curVitest > 0) {
      const prev = lines[curVitest - 1].trim()
      if (prev === '') {
        lines[curVitest - 1] = `let ${v.varName}`
      } else {
        lines.splice(curVitest, 0, `let ${v.varName}`)
        inserted++
      }
    }
  }

  content = lines.join('\n')
  fs.writeFileSync(fullPath, content, 'utf-8')
  console.log(`  OK: ${relPath} (${block.length} lines, ${unique.length} lifted: ${unique.map(v => v.varName).join(', ') || 'none'})`)
  fixed++
}

console.log(`\nDone: ${fixed} fixed, ${skipped} skipped`)
