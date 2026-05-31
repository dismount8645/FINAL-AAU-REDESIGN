import sharp from 'sharp'
import { readdirSync, statSync, existsSync } from 'fs'
import { join, extname, dirname, basename } from 'path'

const ASSETS = 'public/assets/img'
const QUALITY_JPG = 80
const QUALITY_PNG = 85

function walk(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path).forEach(f => files.push(f))
    else files.push(path)
  }
  return files
}

async function main() {
  const files = walk(ASSETS).filter(f => /\.(jpe?g|png)$/i.test(f))
  console.log(`Found ${files.length} images (${(files.reduce((s, f) => s + statSync(f).size, 0) / 1024 / 1024).toFixed(1)}MB)`)

  let converted = 0
  let skipped = 0
  let saved = 0

  for (const file of files) {
    const ext = extname(file).toLowerCase()
    const outFile = join(dirname(file), basename(file, ext) + '.webp')
    const quality = ext === '.png' ? QUALITY_PNG : QUALITY_JPG
    const inSize = statSync(file).size

    if (existsSync(outFile)) {
      skipped++
      continue
    }

    try {
      await sharp(file).webp({ quality }).toFile(outFile)
      const outSize = statSync(outFile).size
      const ratio = ((1 - outSize / inSize) * 100).toFixed(1)
      saved += inSize - outSize
      console.log(`  ${basename(file)} → ${basename(outFile)}  ${(inSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB  (-${ratio}%)`)
      converted++
    } catch (err) {
      console.error(`  FAIL ${file}:`, err)
    }
  }

  const totalMB = (saved / 1024 / 1024).toFixed(1)
  console.log(`\nDone: ${converted} converted, ${skipped} skipped, saved ${totalMB}MB`)
}

main()
