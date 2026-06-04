import { readdirSync, copyFileSync, mkdirSync, existsSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const srcDir = join(root, 'public', 'assets', 'img')
const outDir = join(root, 'public', 'images')

const CATEGORY_MAP = {
  'Bygninger og campus': 'campus',
  'Forskning': 'research',
  'Studerende og studieliv': 'student-life',
  'Undervisning': 'teaching',
  'logoer': 'logos',
  'bølger': 'waves',
  'skitser': 'sketches',
  'flags': 'flags',
}

function toKebab(name) {
  let s = name
    .toLowerCase()
    .replace(/ø/g, 'oe')
    .replace(/[()]/g, '')
    .replace(/^_+|_+$/g, '')
    .replace(/[_\.\s]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-{2,}/g, '-')
    .replace(/-$/, '')
  return s
}

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else files.push(full)
  }
  return files
}

const allFiles = walk(srcDir)
const mapping = []

for (const filePath of allFiles) {
  const rel = filePath.replace(srcDir + '\\', '').replace(srcDir + '/', '')
  const parts = rel.split(/[\\/]/)
  const fileName = parts.pop()
  const ext = extname(fileName)
  const baseName = fileName.slice(0, -ext.length)

  let category
  // Handle the grafik/billeder/ nesting
  if (parts[0] === 'grafik') {
    if (parts[1] === 'billeder') category = parts[2]
    else category = parts[1] // logoer, skitser
  } else {
    category = parts[0] // flags
  }
  const targetCat = CATEGORY_MAP[category]
  if (!targetCat) {
    console.error(`No mapping for category "${category}" (${rel})`)
    process.exit(1)
  }

  const newName = toKebab(baseName) + ext
  const targetDir = join(outDir, targetCat)
  const targetPath = join(targetDir, newName)

  mkdirSync(targetDir, { recursive: true })
  copyFileSync(filePath, targetPath)

  const oldRel = '/assets/img/' + rel.replace(/\\/g, '/')
  const newRel = '/images/' + targetCat + '/' + newName
  mapping.push({ old: oldRel, new: newRel })
}

console.log(JSON.stringify(mapping, null, 2))
console.error(`\nCopied ${mapping.length} files`)
