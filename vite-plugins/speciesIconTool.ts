import fs from 'fs'
import path from 'path'
import type http from 'http'
import type { Plugin, Connect } from 'vite'

// Dev-only backend for the "Icons" tab in DevTools (SpeciesIconEditor): lets the
// developer browse the hand-drawn species art under Dungeon Runner/HeroIconOverlay,
// position it with offsets, and have the chosen file + offsets written straight
// into the game's assets/data on save. Never included in a production build.

const REPO_ROOT = path.resolve(__dirname, '..', '..')
const HERO_ICON_ROOT = path.join(REPO_ROOT, 'Dungeon Runner', 'HeroIconOverlay')
const DRUNNER_ROOT = path.resolve(__dirname, '..')
const SPECIES_DATA_DIR = path.join(DRUNNER_ROOT, 'src', 'data', 'heroes', 'species')
const ASSETS_DIR = path.join(DRUNNER_ROOT, 'src', 'assets', 'icons', 'species')

const VARIANTS = ['v1', 'v2_frame', 'v3_addon', 'v4_badge'] as const
type Variant = (typeof VARIANTS)[number]
const FORMATS = ['svg', 'png'] as const
type Format = (typeof FORMATS)[number]
type Side = 'background' | 'foreground'

const SOURCE_DIR_NAME: Record<Format, string> = { svg: 'extracted_svg', png: 'extracted' }
const CONTENT_TYPE: Record<Format, string> = { svg: 'image/svg+xml', png: 'image/png' }

const VALID_SPECIES_ID = /^[a-z]+$/
const VALID_NUMBER = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n)

function isVariant(v: unknown): v is Variant {
  return typeof v === 'string' && (VARIANTS as readonly string[]).includes(v)
}
function isFormat(f: unknown): f is Format {
  return f === 'svg' || f === 'png'
}
function isSpeciesId(id: unknown): id is string {
  return typeof id === 'string' && VALID_SPECIES_ID.test(id) && fs.existsSync(path.join(SPECIES_DATA_DIR, `${id}.ts`))
}

function sourceFilePath(format: Format, variant: Variant, speciesId: string): string {
  return path.join(HERO_ICON_ROOT, SOURCE_DIR_NAME[format], `species_${variant}`, `${speciesId}.${format}`)
}

function listSources() {
  const result: Record<Format, Record<Variant, string[]>> = { svg: {} as never, png: {} as never }
  for (const format of FORMATS) {
    for (const variant of VARIANTS) {
      const dir = path.join(HERO_ICON_ROOT, SOURCE_DIR_NAME[format], `species_${variant}`)
      let ids: string[] = []
      if (fs.existsSync(dir)) {
        ids = fs
          .readdirSync(dir)
          .filter(f => f.endsWith(`.${format}`))
          .map(f => f.slice(0, -(format.length + 1)))
          .sort()
      }
      result[format][variant] = ids
    }
  }
  return result
}

function readJsonBody(req: Connect.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function upsertField(content: string, fieldName: string, fieldLine: string): string {
  const fieldRe = new RegExp(`^[ \\t]*${fieldName}\\b.*\\n`, 'm')
  if (fieldRe.test(content)) {
    return content.replace(fieldRe, fieldLine)
  }
  const lastBrace = content.lastIndexOf('}')
  return content.slice(0, lastBrace) + fieldLine + content.slice(lastBrace)
}

function upsertImport(content: string, varName: string, importPath: string): string {
  const importLine = `import ${varName} from '${importPath}'\n`
  const importRe = new RegExp(`^import ${varName} from '.*'\\n`, 'm')
  if (importRe.test(content)) {
    return content.replace(importRe, importLine)
  }
  const importMatches = [...content.matchAll(/^import .*\n/gm)]
  const last = importMatches[importMatches.length - 1]
  if (last && last.index !== undefined) {
    const insertPos = last.index + last[0].length
    return content.slice(0, insertPos) + importLine + content.slice(insertPos)
  }
  return importLine + content
}

interface OffsetInput {
  x: number
  y: number
  scale: number
}

function applySide(speciesId: string, side: Side, format: Format, variant: Variant, offset: OffsetInput): void {
  const src = sourceFilePath(format, variant, speciesId)
  if (!fs.existsSync(src)) {
    throw new Error(`Source art not found: ${src}`)
  }

  const destDir = path.join(ASSETS_DIR, side)
  fs.mkdirSync(destDir, { recursive: true })
  // Remove any stale file for this species under a different extension.
  for (const f of fs.readdirSync(destDir)) {
    if (f.startsWith(`${speciesId}.`)) fs.unlinkSync(path.join(destDir, f))
  }
  const destFile = path.join(destDir, `${speciesId}.${format}`)
  fs.copyFileSync(src, destFile)

  const dataFile = path.join(SPECIES_DATA_DIR, `${speciesId}.ts`)
  let content = fs.readFileSync(dataFile, 'utf8')

  const varName = `${side}Image`
  const offsetVarName = `${side}Offset`
  const importPath = `@/assets/icons/species/${side}/${speciesId}.${format}`

  content = upsertImport(content, varName, importPath)
  content = upsertField(content, varName, `  ${varName},\n`)
  content = upsertField(
    content,
    offsetVarName,
    `  ${offsetVarName}: { x: ${offset.x}, y: ${offset.y}, scale: ${offset.scale} },\n`
  )

  fs.writeFileSync(dataFile, content, 'utf8')
}

function sendJson(res: http.ServerResponse, status: number, body: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export function speciesIconToolPlugin(): Plugin {
  return {
    name: 'species-icon-tool',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__species-tool/sources', (_req, res) => {
        sendJson(res, 200, listSources())
      })

      server.middlewares.use('/__species-tool/preview', (req, res) => {
        const url = new URL(req.url ?? '', 'http://localhost')
        const format = url.searchParams.get('format')
        const variant = url.searchParams.get('variant')
        const id = url.searchParams.get('id')
        if (!isFormat(format) || !isVariant(variant) || !isSpeciesId(id)) {
          res.statusCode = 400
          res.end('Invalid parameters')
          return
        }
        const filePath = sourceFilePath(format, variant, id)
        if (!fs.existsSync(filePath)) {
          res.statusCode = 404
          res.end('Not found')
          return
        }
        res.setHeader('Content-Type', CONTENT_TYPE[format])
        fs.createReadStream(filePath).pipe(res)
      })

      server.middlewares.use('/__species-tool/save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        readJsonBody(req)
          .then(body => {
            const { speciesId, sides } = body as {
              speciesId?: unknown
              sides?: Partial<Record<Side, { format: unknown; variant: unknown; offset: unknown } | null>>
            }
            if (!isSpeciesId(speciesId)) {
              sendJson(res, 400, { ok: false, error: 'Invalid speciesId' })
              return
            }
            if (!sides || typeof sides !== 'object') {
              sendJson(res, 400, { ok: false, error: 'Missing sides' })
              return
            }
            for (const side of ['background', 'foreground'] as Side[]) {
              const sel = sides[side]
              if (!sel) continue
              const { format, variant, offset } = sel
              if (!isFormat(format) || !isVariant(variant)) {
                sendJson(res, 400, { ok: false, error: `Invalid ${side} selection` })
                return
              }
              const o = offset as Partial<OffsetInput> | undefined
              if (!o || !VALID_NUMBER(o.x) || !VALID_NUMBER(o.y) || !VALID_NUMBER(o.scale)) {
                sendJson(res, 400, { ok: false, error: `Invalid ${side} offset` })
                return
              }
              applySide(speciesId, side, format, variant, { x: o.x, y: o.y, scale: o.scale })
            }
            sendJson(res, 200, { ok: true })
          })
          .catch(err => {
            sendJson(res, 500, { ok: false, error: err instanceof Error ? err.message : String(err) })
          })
      })
    },
  }
}
