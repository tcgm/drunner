# ── Dungeon Runner – Vite dev server (with HMR) ─────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Install deps first (cached layer; only re-runs when package files change)
COPY package*.json ./
RUN npm install

# Copy source — in dev the whole /app dir is volume-mounted over this,
# so this layer is mainly for production builds or first-run without a mount.
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
