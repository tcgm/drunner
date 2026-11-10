# Hosting the multiplayer relay

Multiplayer runs through a small Socket.IO relay (`server/`). Players connect to it
either with a 4-character room code (through a public relay URL baked into the
client build as `VITE_MULTIPLAYER_URL`) or with a 7-character direct code that
encodes the host's LAN address (direct/LAN mode connects to port **3001**).

Everything needed to host it is in this repo. You need Docker, or an existing nginx.

## Option 1: friends on your network (relay only)

```
docker compose -f docker-compose.hosting.yml up -d
```

Starts the relay on port 3001 (`RELAY_PORT` to change it). In the client choose
**Direct / LAN** when hosting; guests enter the 7-character code. The port is reachable
on your local network only, unless you forward it on your router.

## Option 2: public HTTPS with Caddy and nginx

Caddy gets and renews a Let's Encrypt certificate and hands traffic to nginx, which
applies the filtering and limits from `deploy/nginx/drunner-relay.conf.template`, which
forwards to the relay.

1. Point a DNS record for your host name at this machine and make ports 80 and 443
   reachable from the internet (Caddy needs both to get a certificate).
2. `cp .env.example .env` and set `RELAY_HOSTNAME=relay.example.com`.
3. `docker compose -f docker-compose.hosting.yml --profile public up -d`
4. Build the client with `VITE_MULTIPLAYER_URL=https://relay.example.com`.

Ports 80 and 443 already in use (or reserved by Windows)? Set `PROXY_HTTP_PORT` and
`PROXY_HTTPS_PORT` in `.env`. With `RELAY_HOSTNAME=localhost` Caddy serves a local test
certificate, which is handy for trying the whole chain on one machine.

## Option 3: you already run nginx

`scripts/setup-nginx.mjs` installs the same site into an existing nginx. It prints the
config by default and changes nothing until you tell it where to install:

```
# see what it would write
node scripts/setup-nginx.mjs --server-name relay.example.com --upstream 192.168.1.10:3001

# install into a running nginx container (also works from Windows)
node scripts/setup-nginx.mjs --server-name relay.example.com --upstream 192.168.1.10:3001 --container nginxui

# install into nginx on this Linux machine (run as root)
node scripts/setup-nginx.mjs --server-name relay.example.com --upstream 127.0.0.1:3001 --local
```

It writes into `sites-available` and `sites-enabled` if your nginx uses them, otherwise
`conf.d`. Installing backs up any existing file (to `drunner-setup-backups/` inside the
nginx config directory), runs `nginx -t`, reloads, and **restores the old file if nginx
rejects the new one**. `--dry-run` shows the plan, `--no-reload` skips the reload.
Run `node scripts/setup-nginx.mjs --help` for every option.

TLS is not set up by the script. Terminate it in front of nginx (Caddy, Cloudflare), or
run `certbot --nginx -d relay.example.com` afterwards. The script supports one relay
site per nginx instance, because the site defines shared names (a `map` and a
connection-limit zone).

## What the nginx site does

- Proxies WebSockets and long-polling to the relay, with timeouts that suit a game session.
- Makes only `/socket.io/` and the status page `/` public. Everything else is a 404,
  including the relay's `/room` and `/info` helpers, which exist for LAN mode and would
  otherwise hand a room code and your LAN address to anyone on the internet.
- Takes the real client address from `X-Forwarded-For` when the proxy in front is on a
  private network, and caps simultaneous connections per client address at 50.
- Re-resolves the relay's address as DNS changes, so recreating the relay container does
  not leave nginx pointing at the old one.

## Already behind your own proxy or tunnel?

Point it at the relay (port 3001). It must forward WebSocket upgrades, and it should
only expose `/socket.io/` (block `/room` and `/info`).

## Checking it works

```
curl -i https://relay.example.com/                              # 200, status page
curl -i "https://relay.example.com/socket.io/?EIO=4&transport=polling"   # 200
curl -i https://relay.example.com/room                          # 404
curl -i https://relay.example.com/info                          # 404
```

## Known limits

The relay itself has no authentication and several weaknesses (forged host events, crashes
on malformed input, guessable room codes). The proxy filtering above reduces exposure but
does not fix them. A crashed relay restarts automatically (`restart: unless-stopped`).
Until the relay is hardened, treat a public relay as suitable for friends, not strangers.
