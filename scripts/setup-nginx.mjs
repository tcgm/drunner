#!/usr/bin/env node
/**
 * Sets up the Dungeon Runner multiplayer relay in an EXISTING nginx.
 *
 * It renders deploy/nginx/drunner-relay.conf.template (the same site the
 * docker-compose.hosting.yml nginx uses) and installs it: WebSocket-ready proxying
 * to the relay, only /socket.io/ and the status page public (the relay's /room and
 * /info helpers stay off the internet), real client addresses behind a proxy, and a
 * per-client connection cap. Nothing else in your nginx is touched.
 *
 * Usage
 *   node scripts/setup-nginx.mjs --server-name relay.example.com --upstream 192.168.1.10:3001
 *       print the config (default; changes nothing)
 *   ... --container nginxui        install into a running Docker container (works on Windows too)
 *   ... --local                    install into nginx on this machine (Linux; run as root)
 *
 * Options
 *   --server-name <host>   public host name the site answers to (required)
 *   --upstream <host:port> where the relay listens (default 127.0.0.1:3001)
 *   --resolver <ip>        DNS server; needed only if --upstream is a host name, not an IP
 *   --name <file>          site file name (default drunner-relay)
 *   --nginx-dir <dir>      nginx config directory (default /etc/nginx)
 *   --no-reload            install and test, but do not reload nginx
 *   --dry-run              show what would happen without changing anything
 *
 * Installing backs up any existing file, runs `nginx -t`, and rolls back on failure.
 * TLS is not configured here: terminate it in front (Caddy, Cloudflare) or run
 * `certbot --nginx -d <host>` afterwards. One relay site per nginx instance.
 */

import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import net from 'node:net'

const TEMPLATE = join(dirname(fileURLToPath(import.meta.url)), '..', 'deploy', 'nginx', 'drunner-relay.conf.template')

// ── Arguments ────────────────────────────────────────────────────────────────

const VALUE_FLAGS = new Set(['server-name', 'upstream', 'resolver', 'name', 'nginx-dir', 'container'])
const BOOL_FLAGS = new Set(['local', 'no-reload', 'dry-run', 'help'])

function parseArgs(argv) {
  const opts = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) fail(`Unexpected argument "${arg}". Use --help.`)
    const key = arg.slice(2)
    if (BOOL_FLAGS.has(key)) opts[key] = true
    else if (VALUE_FLAGS.has(key)) {
      const value = argv[++i]
      if (value === undefined || value.startsWith('--')) fail(`--${key} needs a value.`)
      opts[key] = value
    } else fail(`Unknown option --${key}. Use --help.`)
  }
  return opts
}

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}

function showHelp() {
  const text = readFileSync(fileURLToPath(import.meta.url), 'utf8')
  console.log(text.slice(text.indexOf('/**') + 4, text.indexOf('*/')).replace(/^ \* ?/gm, '').trim())
}

// ── Validation and rendering ─────────────────────────────────────────────────

const HOST_RE = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i

function validate(opts) {
  const serverName = opts['server-name']
  if (!serverName) fail('--server-name is required (the public host name, e.g. relay.example.com).')
  if (!HOST_RE.test(serverName)) fail(`"${serverName}" is not a valid host name.`)

  const upstream = opts.upstream ?? '127.0.0.1:3001'
  const match = /^(.+):(\d{1,5})$/.exec(upstream)
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 65535) fail(`--upstream must look like host:port, got "${upstream}".`)
  const upstreamHost = match[1]
  const isIp = net.isIP(upstreamHost) !== 0
  if (net.isIPv6(upstreamHost)) fail('IPv6 upstreams are not supported; use a host name or an IPv4 address.')
  if (!isIp && !HOST_RE.test(upstreamHost)) fail(`"${upstreamHost}" is not a valid upstream host.`)
  if (!isIp && !opts.resolver) fail(`--upstream uses a host name (${upstreamHost}), so nginx needs a DNS server to look it up: add --resolver <ip> (inside Docker that is 127.0.0.11), or use an IP address.`)
  if (opts.resolver && net.isIPv4(opts.resolver) === false) fail('--resolver must be an IPv4 address.')

  const name = opts.name ?? 'drunner-relay'
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(name)) fail(`--name "${name}" may only contain letters, digits, dot, dash and underscore.`)

  if (opts.local && opts.container) fail('Choose --local or --container, not both.')
  if (opts.local && process.platform === 'win32') fail('--local installs into nginx on this machine and is for Linux. On Windows use --container <name> with your nginx container.')
  return { serverName, upstream, name, resolver: opts.resolver ?? '127.0.0.11' }
}

function render({ serverName, upstream, resolver }) {
  if (!existsSync(TEMPLATE)) fail(`Template not found: ${TEMPLATE}`)
  const vars = { RELAY_HOSTNAME: serverName, RELAY_UPSTREAM: upstream, RELAY_RESOLVER: resolver }
  return readFileSync(TEMPLATE, 'utf8').replace(/\$\{(RELAY_[A-Z]+)\}/g, (whole, key) => vars[key] ?? whole)
}

// ── Where nginx runs ─────────────────────────────────────────────────────────

/** Run a shell command against the target (a container, or this machine). */
function makeTarget(container) {
  const where = container ? `container "${container}"` : 'this machine'
  const sh = (command) => {
    const result = container
      ? spawnSync('docker', ['exec', container, 'sh', '-c', command], { encoding: 'utf8' })
      : spawnSync('sh', ['-c', command], { encoding: 'utf8' })
    if (result.error) fail(`Could not run ${container ? 'docker' : 'sh'}: ${result.error.message}`)
    return { ok: result.status === 0, out: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() }
  }
  /** Replace a file on the target with the given text. */
  const writeFile = (path, content) => {
    const dir = mkdtempSync(join(tmpdir(), 'drunner-nginx-'))
    const tmp = join(dir, 'site.conf')
    try {
      writeFileSync(tmp, content)
      if (container) {
        const copy = spawnSync('docker', ['cp', tmp, `${container}:${path}`], { encoding: 'utf8' })
        if (copy.status !== 0) fail(`docker cp failed: ${(copy.stderr || copy.stdout || '').trim()}`)
      } else {
        const copy = sh(`cp '${tmp}' '${path}'`)
        if (!copy.ok) fail(`Could not write ${path}: ${copy.out}`)
      }
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  return { where, sh, writeFile }
}

// ── Install ──────────────────────────────────────────────────────────────────

function install(config, opts) {
  const { where, sh, writeFile } = makeTarget(opts.container)
  const root = (opts['nginx-dir'] ?? '/etc/nginx').replace(/\/+$/, '')
  const dry = Boolean(opts['dry-run'])
  const step = (message) => console.log(`- ${message}`)

  if (!dry) {
    const probe = sh('nginx -v')
    if (!probe.ok) fail(`nginx is not available on ${where}: ${probe.out || 'command failed'}`)
  }

  // Debian-style layout (sites-available + sites-enabled) if present, otherwise conf.d.
  const sitesMode = sh(`test -d '${root}/sites-available' && test -d '${root}/sites-enabled'`).ok
  const file = sitesMode ? `${root}/sites-available/${config.name}` : `${root}/conf.d/${config.name}.conf`
  const link = sitesMode ? `${root}/sites-enabled/${config.name}` : null
  step(`target: ${where}, ${file}${link ? ` (enabled via ${link})` : ''}`)

  const existing = sh(`test -f '${file}' && cat '${file}'`)
  const hadFile = existing.ok
  if (hadFile && existing.out.replace(/\r/g, '').trim() === config.rendered.replace(/\r/g, '').trim()) {
    step('already up to date, nothing to change')
    return
  }

  const backup = `${root}/drunner-setup-backups/${config.name}.${new Date().toISOString().replace(/[:.]/g, '-')}`
  if (dry) {
    if (hadFile) step(`would back up the existing file to ${backup}`)
    step(`would write ${file}${link ? ` and link ${link}` : ''}`)
    step(`would run nginx -t${opts['no-reload'] ? '' : ' and reload nginx'}`)
    return
  }

  if (hadFile) {
    const saved = sh(`mkdir -p '${root}/drunner-setup-backups' && cp -p '${file}' '${backup}'`)
    if (!saved.ok) fail(`Could not back up the existing file: ${saved.out}`)
    step(`backed up the existing file to ${backup}`)
  } else if (!sitesMode) {
    sh(`mkdir -p '${root}/conf.d'`)
  }

  writeFile(file, config.rendered)
  step(`wrote ${file}`)
  let linkedByUs = false
  if (link && !sh(`test -e '${link}' -o -L '${link}'`).ok) {
    const linked = sh(`ln -s '../sites-available/${config.name}' '${link}'`)
    if (!linked.ok) fail(`Could not enable the site: ${linked.out}`)
    linkedByUs = true
    step(`enabled ${link}`)
  }

  const test = sh('nginx -t')
  if (!test.ok) {
    console.error(`\nnginx rejected the new configuration:\n${test.out}\n`)
    if (hadFile) sh(`cp -p '${backup}' '${file}'`)
    else sh(`rm -f '${file}'${linkedByUs ? ` '${link}'` : ''}`)
    console.error(hadFile ? `Rolled back: restored the previous ${file}.` : `Rolled back: removed ${file}.`)
    process.exit(1)
  }
  step('nginx -t passed')

  if (opts['no-reload']) {
    step('not reloading (--no-reload); reload nginx to apply')
    return
  }
  const reload = sh('nginx -s reload')
  if (!reload.ok) fail(`Config is installed and valid, but reloading nginx failed: ${reload.out}\nReload it yourself to apply.`)
  step('reloaded nginx')
}

// ── Main ─────────────────────────────────────────────────────────────────────

const opts = parseArgs(process.argv.slice(2))
if (opts.help) {
  showHelp()
  process.exit(0)
}
const config = validate(opts)
config.rendered = render(config)

if (opts.container || opts.local) {
  install(config, opts)
  if (!opts['dry-run']) console.log(`\nDone. Test: curl -i https://${config.serverName}/socket.io/?EIO=4\\&transport=polling  (expect 200; /room and /info should be 404)`)
} else {
  process.stdout.write(config.rendered)
}
