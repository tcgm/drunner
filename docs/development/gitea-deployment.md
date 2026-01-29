# Gitea Deployment Guide

Guide for setting up automatic deployment from your Gitea server.

---

## Overview

Gitea doesn't have a built-in "Pages" feature like GitHub, but you can achieve automatic deployment using:
- **Gitea Actions** (CI/CD workflows)
- A static file server (nginx, Apache, or Caddy)
- Automatic build and deploy on push to `main`

---

## Prerequisites

1. **Gitea Actions enabled** on your Gitea instance (v1.19+)
2. **Static web server** configured (nginx/Apache/Caddy)
3. **SSH access** to deployment target (if deploying to separate server)

---

## Setup Methods

### Method 1: Deploy to Same Server as Gitea

**Best if:** Your Gitea server can also host the static site.

#### 1. Configure Web Server

**Nginx configuration** (`/etc/nginx/sites-available/drunner`):
```nginx
server {
    listen 80;
    server_name drunner.yourdomain.com;  # Or use IP
    
    root /var/www/drunner;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/drunner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 2. Create Deployment Directory

```bash
sudo mkdir -p /var/www/drunner
sudo chown -R git:git /var/www/drunner  # or your gitea user
```

#### 3. Create Gitea Actions Workflow

File: `.gitea/workflows/deploy.yaml`

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to web directory
        run: |
          rm -rf /var/www/drunner/*
          cp -r dist/* /var/www/drunner/
          echo "Deployed to http://drunner.yourdomain.com"
```

---

### Method 2: Deploy to Remote Server via SSH

**Best if:** You want to deploy to a different server than Gitea.

#### 1. Generate Deploy SSH Key

On your local machine or Gitea server:
```bash
ssh-keygen -t ed25519 -C "gitea-deploy" -f ~/.ssh/gitea_deploy
```

Copy public key to target server:
```bash
ssh-copy-id -i ~/.ssh/gitea_deploy.pub user@your-deploy-server
```

#### 2. Add SSH Key to Gitea Secrets

1. Go to your repository in Gitea
2. Settings → Secrets → Add Secret
3. Name: `DEPLOY_SSH_KEY`
4. Value: Contents of `~/.ssh/gitea_deploy` (private key)

Add another secret:
- Name: `DEPLOY_HOST`
- Value: `user@your-server-ip`

#### 3. Create Gitea Actions Workflow

File: `.gitea/workflows/deploy.yaml`

```yaml
name: Build and Deploy via SSH

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.DEPLOY_SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $(echo "${{ secrets.DEPLOY_HOST }}" | cut -d'@' -f2) >> ~/.ssh/known_hosts

      - name: Deploy via rsync
        run: |
          rsync -avz --delete \
            -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" \
            dist/ ${{ secrets.DEPLOY_HOST }}:/var/www/drunner/

      - name: Cleanup
        run: rm -f ~/.ssh/deploy_key
```

---

### Method 3: Deploy to External Hosting (Netlify/Vercel)

Use Gitea Actions to deploy to external services.

#### Netlify Deployment

File: `.gitea/workflows/deploy.yaml`

```yaml
name: Deploy to Netlify

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

**Setup:**
1. Create Netlify account and site
2. Get Site ID and Auth Token from Netlify
3. Add as secrets in Gitea repository

---

### Method 4: Simple Webhook Deployment

If Gitea Actions isn't available, use webhooks.

#### 1. Create Deploy Script on Server

File: `/opt/deploy-drunner.sh`

```bash
#!/bin/bash
REPO_URL="http://192.168.1.11:14000/TCGM/drunner.git"
DEPLOY_DIR="/var/www/drunner"
BUILD_DIR="/tmp/drunner-build"

# Clone or pull latest
if [ -d "$BUILD_DIR" ]; then
    cd "$BUILD_DIR" && git pull
else
    git clone "$REPO_URL" "$BUILD_DIR"
fi

cd "$BUILD_DIR"

# Build
npm install
npm run build

# Deploy
rm -rf "$DEPLOY_DIR"/*
cp -r dist/* "$DEPLOY_DIR"/

echo "Deployed at $(date)"
```

Make executable:
```bash
chmod +x /opt/deploy-drunner.sh
```

#### 2. Create Webhook Endpoint

Simple webhook receiver (`webhook-server.js`):

```javascript
const express = require('express');
const { execSync } = require('child_process');
const app = express();

app.use(express.json());

app.post('/deploy/drunner', (req, res) => {
    // Verify it's from your Gitea (optional: check secret token)
    if (req.body.ref === 'refs/heads/main') {
        try {
            execSync('/opt/deploy-drunner.sh', { stdio: 'inherit' });
            res.json({ status: 'deployed' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.json({ status: 'skipped' });
    }
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

#### 3. Configure Gitea Webhook

1. Go to repository Settings → Webhooks
2. Add webhook:
   - URL: `http://your-server:3000/deploy/drunner`
   - Content Type: `application/json`
   - Event: Push events
   - Active: ✓

---

## Accessing Your Deployed Site

After setup, your site will be available at:

- **Same server:** `http://your-gitea-ip/drunner` or subdomain
- **Separate server:** `http://your-deploy-server/`
- **Custom domain:** Configure DNS to point to your server

---

## Web Server Configuration Examples

### Nginx (Subdirectory)

```nginx
location /drunner {
    alias /var/www/drunner;
    try_files $uri $uri/ /drunner/index.html;
}
```

### Apache (VirtualHost)

```apache
<VirtualHost *:80>
    ServerName drunner.yourdomain.com
    DocumentRoot /var/www/drunner
    
    <Directory /var/www/drunner>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Handle SPA routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

### Caddy (Simplest)

```caddy
drunner.yourdomain.com {
    root * /var/www/drunner
    file_server
    try_files {path} /index.html
}
```

---

## Vite Configuration for Subdirectory Deployment

If deploying to a subdirectory like `/drunner`, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/drunner/', // Add base path
  plugins: [react()],
  // ... rest of config
})
```

---

## Troubleshooting

### Gitea Actions not running

1. Check if Actions are enabled in Gitea config:
   ```ini
   [actions]
   ENABLED = true
   ```

2. Check if runner is registered and online:
   - Admin → Actions → Runners

### Permission denied on deployment

```bash
# Fix ownership
sudo chown -R git:git /var/www/drunner

# Or for specific user
sudo chown -R $USER:$USER /var/www/drunner
```

### Site shows blank page

1. Check browser console for errors
2. Verify `base` path in `vite.config.ts`
3. Check nginx/apache error logs
4. Ensure all files copied: `ls -la /var/www/drunner`

---

## Recommended Setup

For your scenario (local network Gitea at 192.168.1.11):

1. **Use Method 1** (same server deployment) - simplest
2. Configure nginx subdomain: `drunner.local` or use IP-based access
3. Gitea Actions workflow copies build to `/var/www/drunner`
4. Access at: `http://192.168.1.11/drunner` or `http://drunner.local`

This gives you GitHub Pages-like functionality with automatic deployment on every push to `main`.
