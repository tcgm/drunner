// Strips the hardcoded fill from src/assets/icons/classes/*.svg so the icons
// have no opinion on their own color - whatever `fill` the SVG inherits from
// its rendering context (see HeroIcon.tsx) wins.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/assets/icons/classes')

for (const name of readdirSync(dir).filter((f) => f.endsWith('.svg'))) {
  const file = path.join(dir, name)
  const original = readFileSync(file, 'utf8')
  const fixed = original.replace(/\s*fill="(?:#[0-9a-fA-F]{3,8}|currentColor)"/g, '')
  if (fixed !== original) {
    writeFileSync(file, fixed)
    console.log(`fixed ${name}`)
  } else {
    console.log(`unchanged ${name}`)
  }
}
