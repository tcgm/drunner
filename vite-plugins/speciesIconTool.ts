import fs from 'fs'
import path from 'path'
import type http from 'http'
import type { Plugin, Connect } from 'vite'

// Dev-only backend for the "Icons" tab in DevTools (SpeciesIconEditor): lets the
// developer browse the hand-drawn species art under Dungeon Runner/HeroIconOverlay
// (or upload their own), position it with offsets, and have the chosen file +
// offsets written straight into the game's assets/data on save. Never included
// in a production build.

const REPO_ROOT = path.resolve(__dirname, '..', '..')
const HERO_ICON_ROOT = path.join(REPO_ROOT, 'Dungeon Runner', 'HeroIconOverlay')
const UPLOADS_DIR = path.join(HERO_ICON_ROOT, 'uploads')
const DRUNNER_ROOT = path.resolve(__dirname, '..')
const SPECIES_DATA_DIR = path.join(DRUNNER_ROOT, 'src', 'data', 'heroes', 'species')
const ASSETS_DIR = path.join(DRUNNER_ROOT, 'src', 'assets', 'icons', 'species')

const VARIANTS = ['v1', 'v2_frame', 'v3_addon', 'v4_badge'] as const
type Variant = (typeof VARIANTS)[number]
const FORMATS = ['svg', 'png'] as const
type Format = (typeof FORMATS)[number]
const SIDES = ['background', 'foreground'] as const
type Side = (typeof SIDES)[number]

const SOURCE_DIR_NAME: Record<Format, string> = { svg: 'extracted_svg', png: 'extracted' }
const CONTENT_TYPE: Record<Format, string> = { svg: 'image/svg+xml', png: 'image/png' }

const VALID_SPECIES_ID = /^[a-z]+$/
const VALID_CLASS_ID = /^[a-z]+$/
const VALID_NUMBER = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n)

function isVariant(v: unknown): v is Variant {
  return typeof v === 'string' && (VARIANTS as readonly string[]).includes(v)
}
function isFormat(f: unknown): f is Format {
  return f === 'svg' || f === 'png'
}
function isSide(s: unknown): s is Side {
  return s === 'background' || s === 'foreground'
}
function isSpeciesId(id: unknown): id is string {
  return typeof id === 'string' && VALID_SPECIES_ID.test(id) && fs.existsSync(path.join(SPECIES_DATA_DIR, `${id}.ts`))
}

// Classes live under several files (core + unique) so there's no 1:1 filename check
// like isSpeciesId - just guard against anything that isn't a safe object-key string,
// since classId ends up written verbatim as a key in the species data file.
function isClassId(id: unknown): id is string {
  return typeof id === 'string' && VALID_CLASS_ID.test(id)
}

function presetSourcePath(format: Format, variant: Variant, speciesId: string): string {
  return path.join(HERO_ICON_ROOT, SOURCE_DIR_NAME[format], `species_${variant}`, `${speciesId}.${format}`)
}

function customSourcePath(side: Side, format: Format, speciesId: string): string {
  return path.join(UPLOADS_DIR, side, `${speciesId}.${format}`)
}

function listSources() {
  const presets: Record<Format, Record<Variant, string[]>> = { svg: {} as never, png: {} as never }
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
      presets[format][variant] = ids
    }
  }

  const custom: Record<Side, Record<Format, string[]>> = {
    background: { svg: [], png: [] },
    foreground: { svg: [], png: [] },
  }
  for (const side of SIDES) {
    for (const format of FORMATS) {
      const dir = path.join(UPLOADS_DIR, side)
      if (fs.existsSync(dir)) {
        custom[side][format] = fs
          .readdirSync(dir)
          .filter(f => f.endsWith(`.${format}`))
          .map(f => f.slice(0, -(format.length + 1)))
          .sort()
      }
    }
  }

  return { presets, custom }
}

function readRawBody(req: Connect.IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

async function readJsonBody(req: Connect.IncomingMessage): Promise<unknown> {
  const buf = await readRawBody(req)
  return buf.length ? JSON.parse(buf.toString('utf8')) : {}
}

function upsertField(content: string, fieldName: string, fieldLine: string): string {
  // Files may have CRLF line endings (Windows checkouts) - `\r?\n` matches either.
  const fieldRe = new RegExp(`^[ \\t]*${fieldName}\\b.*\\r?\\n`, 'm')
  if (fieldRe.test(content)) {
    return content.replace(fieldRe, fieldLine)
  }
  const lastBrace = content.lastIndexOf('}')
  return content.slice(0, lastBrace) + fieldLine + content.slice(lastBrace)
}

function formatOffset(o: OffsetInput): string {
  return `{ x: ${o.x}, y: ${o.y}, scale: ${o.scale} }`
}

// Reads the existing `${fieldName}: { classId: { x, y, scale }, ... }` map (written
// entirely on one line by this same function), merges in classId's new offset, and
// re-serializes it back onto one line so the plain-text upsertField regex still matches.
function upsertOffsetByClass(content: string, fieldName: string, classId: string, offset: OffsetInput): string {
  const fieldRe = new RegExp(`^[ \\t]*${fieldName}\\s*:\\s*(\\{.*\\}),?[ \\t]*\\r?\\n`, 'm')
  const match = content.match(fieldRe)
  const existing: Record<string, OffsetInput> = match ? new Function(`return ${match[1]}`)() : {}
  existing[classId] = offset
  const entries = Object.entries(existing)
    .map(([id, o]) => `${id}: ${formatOffset(o)}`)
    .join(', ')
  return upsertField(content, fieldName, `  ${fieldName}: { ${entries} },\n`)
}

function upsertImport(content: string, varName: string, importPath: string): string {
  const importLine = `import ${varName} from '${importPath}'\n`
  const importRe = new RegExp(`^import ${varName} from '.*'\\r?\\n`, 'm')
  if (importRe.test(content)) {
    return content.replace(importRe, importLine)
  }
  const importMatches = [...content.matchAll(/^import .*\r?\n/gm)]
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

type SideSelection =
  | { kind: 'preset'; format: Format; variant: Variant }
  | { kind: 'custom'; format: Format }

function applySide(speciesId: string, side: Side, selection: SideSelection, offset: OffsetInput, classId: string | null): void {
  const src =
    selection.kind === 'preset'
      ? presetSourcePath(selection.format, selection.variant, speciesId)
      : customSourcePath(side, selection.format, speciesId)
  if (!fs.existsSync(src)) {
    throw new Error(`Source art not found: ${src}`)
  }

  const destDir = path.join(ASSETS_DIR, side)
  fs.mkdirSync(destDir, { recursive: true })
  // Remove any stale file for this species under a different extension.
  for (const f of fs.readdirSync(destDir)) {
    if (f.startsWith(`${speciesId}.`)) fs.unlinkSync(path.join(destDir, f))
  }
  const destFile = path.join(destDir, `${speciesId}.${selection.format}`)
  fs.copyFileSync(src, destFile)

  const dataFile = path.join(SPECIES_DATA_DIR, `${speciesId}.ts`)
  let content = fs.readFileSync(dataFile, 'utf8')

  const varName = `${side}Image`
  const importPath = `@/assets/icons/species/${side}/${speciesId}.${selection.format}`

  content = upsertImport(content, varName, importPath)
  content = upsertField(content, varName, `  ${varName},\n`)

  if (classId) {
    content = upsertOffsetByClass(content, `${side}OffsetsByClass`, classId, offset)
  } else {
    content = upsertField(content, `${side}Offset`, `  ${side}Offset: ${formatOffset(offset)},\n`)
  }

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
        const kind = url.searchParams.get('kind') ?? 'preset'
        const format = url.searchParams.get('format')
        const id = url.searchParams.get('id')
        if (!isFormat(format) || !isSpeciesId(id)) {
          res.statusCode = 400
          res.end('Invalid parameters')
          return
        }

        let filePath: string
        if (kind === 'custom') {
          const side = url.searchParams.get('side')
          if (!isSide(side)) {
            res.statusCode = 400
            res.end('Invalid parameters')
            return
          }
          filePath = customSourcePath(side, format, id)
        } else {
          const variant = url.searchParams.get('variant')
          if (!isVariant(variant)) {
            res.statusCode = 400
            res.end('Invalid parameters')
            return
          }
          filePath = presetSourcePath(format, variant, id)
        }

        if (!fs.existsSync(filePath)) {
          res.statusCode = 404
          res.end('Not found')
          return
        }
        res.setHeader('Content-Type', CONTENT_TYPE[format])
        fs.createReadStream(filePath).pipe(res)
      })

      server.middlewares.use('/__species-tool/upload', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        const url = new URL(req.url ?? '', 'http://localhost')
        const speciesId = url.searchParams.get('speciesId')
        const side = url.searchParams.get('side')
        const format = url.searchParams.get('format')
        if (!isSpeciesId(speciesId) || !isSide(side) || !isFormat(format)) {
          sendJson(res, 400, { ok: false, error: 'Invalid parameters' })
          return
        }
        readRawBody(req)
          .then(buf => {
            if (!buf.length) throw new Error('Empty upload')
            const destDir = path.join(UPLOADS_DIR, side)
            fs.mkdirSync(destDir, { recursive: true })
            fs.writeFileSync(customSourcePath(side, format, speciesId), buf)
            sendJson(res, 200, { ok: true })
          })
          .catch(err => {
            sendJson(res, 500, { ok: false, error: err instanceof Error ? err.message : String(err) })
          })
      })

      server.middlewares.use('/__species-tool/save', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        readJsonBody(req)
          .then(body => {
            const { speciesId, sides, classId } = body as {
              speciesId?: unknown
              sides?: Partial<Record<Side, { kind: unknown; format: unknown; variant?: unknown; offset: unknown } | null>>
              classId?: unknown
            }
            if (!isSpeciesId(speciesId)) {
              sendJson(res, 400, { ok: false, error: 'Invalid speciesId' })
              return
            }
            if (!sides || typeof sides !== 'object') {
              sendJson(res, 400, { ok: false, error: 'Missing sides' })
              return
            }
            // null/undefined classId means "edit the species-wide default offset" rather than a per-class override.
            if (classId !== null && classId !== undefined && !isClassId(classId)) {
              sendJson(res, 400, { ok: false, error: 'Invalid classId' })
              return
            }
            for (const side of SIDES) {
              const sel = sides[side]
              if (!sel) continue
              const { kind, format, variant, offset } = sel
              if (!isFormat(format) || (kind !== 'preset' && kind !== 'custom')) {
                sendJson(res, 400, { ok: false, error: `Invalid ${side} selection` })
                return
              }
              if (kind === 'preset' && !isVariant(variant)) {
                sendJson(res, 400, { ok: false, error: `Invalid ${side} selection` })
                return
              }
              const o = offset as Partial<OffsetInput> | undefined
              if (!o || !VALID_NUMBER(o.x) || !VALID_NUMBER(o.y) || !VALID_NUMBER(o.scale)) {
                sendJson(res, 400, { ok: false, error: `Invalid ${side} offset` })
                return
              }
              const selection: SideSelection =
                kind === 'preset' ? { kind, format, variant: variant as Variant } : { kind, format }
              applySide(speciesId, side, selection, { x: o.x, y: o.y, scale: o.scale }, (classId as string | undefined) ?? null)
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
