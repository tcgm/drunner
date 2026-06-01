# Deployment Guide

## Overview

Dungeon Runner is a static SPA (GitHub Pages) + a Node.js relay server (Docker).  
Multiplayer works without any port forwarding thanks to Cloudflare Tunnel.

```
Players' browsers  ──HTTPS──▶  Cloudflare Edge
                                      │
                               Cloudflare Tunnel (outbound only)
                                      │
                              [Docker host machine]
                               ┌──────────────┐
                               │  cloudflared │  (container)
                               │  server:31337│  (relay container)
                               └──────────────┘
```

---

## Production Setup

### Prerequisites
- Docker Desktop (Windows) with WSL2 backend
- A domain with DNS managed by Cloudflare
- A GitHub repo with Actions enabled

---

### 1. Cloudflare Tunnel

The relay server is exposed publicly via Cloudflare Tunnel — no inbound ports or
port forwarding required on your router.

#### Create the tunnel
1. Go to [one.dash.cloudflare.com](https://one.dash.cloudflare.com) → **Networks → Tunnels → Create tunnel**
2. Name it `drunner-relay`, choose **Cloudflared** type
3. Copy the **tunnel token** (the long `eyJ...` string shown in the install command)
4. **Do not** install cloudflared on Windows — it runs in Docker

#### Add a Public Hostname
In the tunnel dashboard → **Public Hostname** tab → **Add a hostname**:
| Field | Value |
|---|---|
| Subdomain | `multiplayer` (or anything you like) |
| Domain | your domain |
| Service type | `HTTP` |
| URL | `server:31337` |

This maps `https://multiplayer.yourdomain.com` → the relay container inside Docker.

---

### 2. Local server machine

Copy `.env.example` → `.env` in the repo root and fill in the token:

```
CLOUDFLARE_TUNNEL_TOKEN=eyJ...your full token here...
```

Start everything (relay + tunnel):

```powershell
cd c:\repos\drunner-master
docker compose --profile tunnel up -d
```

Without `--profile tunnel` the game runs in local/LAN dev mode with no tunnel (port 31337 still exposed on localhost for LAN play).

The Cloudflare dashboard should show the tunnel as **Connected** within ~10 seconds.

---

### 3. GitHub Actions — deploy frontend to GitHub Pages

Set these **repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `VITE_MULTIPLAYER_URL` | `https://multiplayer.yourdomain.com` |
| `BASE_URL` | `/your-repo-name/` (e.g. `/drunner-master/`) — omit if using a custom domain |

The workflow at `.github/workflows/deploy.yml` triggers on pushes to the **`multiplayer`** branch and bakes `VITE_MULTIPLAYER_URL` into the JS bundle at build time.

Enable Pages in repo **Settings → Pages → Source: GitHub Actions**.

---

## Multiplayer connection modes

| Mode | Code length | How it connects | Port forward needed? |
|---|---|---|---|
| Relay | 4 chars | Via Cloudflare tunnel → relay server | No |
| Direct / LAN | 7 chars | Guest connects directly to host IP | LAN only (or forward `31337`) |

For internet play, always share the **relay (4-char) code**. Direct mode is for local LAN sessions.

---

## Dev / local-only mode

No `.env` or Cloudflare setup needed:

```powershell
cd c:\repos\drunner-master
docker compose up
```

Client at `http://localhost:5173`, relay at `http://localhost:31337`.  
LAN guests can connect using the host machine's LAN IP and port 31337 (direct mode).
