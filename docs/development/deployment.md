# Deployment Guide

Build and deployment instructions for Dungeon Runner.

---

## Web Deployment

### Build for Production
```powershell
npm run build
```

This creates an optimized production build in the `dist/` folder.

**Output includes:**
- Minified JavaScript bundles
- CSS files
- Static assets (images, fonts, etc.)
- `index.html` entry point

---

### Deploy to Static Hosting

#### Vercel (Recommended)
1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Deploy**
   ```powershell
   vercel
   ```

3. **Production Deployment**
   ```powershell
   vercel --prod
   ```

**Or use Vercel GitHub Integration:**
- Connect repository to Vercel
- Auto-deploy on push to `main` branch
- Environment variables in Vercel dashboard

---

#### Netlify
1. **Install Netlify CLI**
   ```powershell
   npm install -g netlify-cli
   ```

2. **Build & Deploy**
   ```powershell
   npm run build
   netlify deploy --prod --dir=dist
   ```

**Or use Netlify UI:**
- Drag and drop `dist/` folder to netlify.com
- Or connect GitHub repository for auto-deploy

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

#### GitHub Pages
1. **Install gh-pages**
   ```powershell
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/drunner",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```powershell
   npm run deploy
   ```

4. **Configure vite.config.ts for GitHub Pages**
   ```typescript
   export default defineConfig({
     base: '/drunner/', // Repository name
     // ... rest of config
   });
   ```

---

#### AWS S3 + CloudFront
1. **Build**
   ```powershell
   npm run build
   ```

2. **Upload to S3**
   ```powershell
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Set default root object to `index.html`
   - Configure error pages to redirect to `index.html` (for SPA routing)

---

## Electron Desktop App

### Build Desktop Application

#### 1. Install electron-builder
```powershell
npm install --save-dev electron-builder
```

#### 2. Configure package.json
```json
{
  "name": "dungeon-runner",
  "version": "1.0.0",
  "main": "electron/main.js",
  "scripts": {
    "electron:build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.yourname.dungeonrunner",
    "productName": "Dungeon Runner",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*"
    ],
    "win": {
      "target": ["nsis", "portable"],
      "icon": "public/icon.ico"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "public/icon.icns"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "public/icon.png"
    }
  }
}
```

#### 3. Build for Current Platform
```powershell
npm run electron:build
```

Output in `release/` folder:
- **Windows**: `.exe` installer (NSIS) and portable `.exe`
- **macOS**: `.dmg` and `.zip`
- **Linux**: `.AppImage` and `.deb`

---

### Multi-Platform Builds

#### Build for All Platforms (requires platform-specific tools)
```powershell
# Windows
npm run electron:build -- --win --mac --linux

# Or specific platforms
npm run electron:build -- --win
npm run electron:build -- --mac
npm run electron:build -- --linux
```

**Note**: Cross-platform builds require additional setup:
- **macOS builds**: Require macOS or CI/CD with macOS runner
- **Linux builds**: Work on any platform
- **Windows builds**: Work on any platform with Wine on macOS/Linux

---

### Code Signing (Optional)

#### Windows Code Signing
```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/certificate.pfx",
      "certificatePassword": "password"
    }
  }
}
```

#### macOS Code Signing
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAM_ID)"
    }
  }
}
```

---

### Auto-Update Setup (Advanced)

#### 1. Configure electron-updater
```powershell
npm install electron-updater
```

#### 2. Update main.ts
```typescript
import { autoUpdater } from 'electron-updater';

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

#### 3. Configure Publishing
```json
{
  "build": {
    "publish": [
      {
        "provider": "github",
        "owner": "yourusername",
        "repo": "drunner"
      }
    ]
  }
}
```

#### 4. Publish Release
```powershell
npm run electron:build -- --publish always
```

---

## CI/CD Pipelines

### GitHub Actions (Web Deployment)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

### GitHub Actions (Electron Multi-Platform)

Create `.github/workflows/build.yml`:
```yaml
name: Build Electron App

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build Electron App
        run: npm run electron:build
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: release/*
```

---

## Environment-Specific Builds

### Development Build
```powershell
npm run dev
```
- Hot module replacement
- Source maps
- Dev server on `localhost:5173`

### Preview Build
```powershell
npm run build
npm run preview
```
- Production-optimized code
- Local preview server
- Test before deployment

### Production Build
```powershell
npm run build
```
- Minified and optimized
- Tree-shaken dependencies
- Ready for deployment

---

## Performance Optimization

### Vite Build Optimizations
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          chakra: ['@chakra-ui/react'],
          icons: ['react-icons'],
        },
      },
    },
  },
});
```

### Asset Optimization
- Compress images with `vite-plugin-imagemin`
- Use SVG icons where possible
- Lazy load routes and components
- Enable gzip/brotli compression on hosting

---

## Post-Deployment Checklist

- [ ] Test deployed app in production environment
- [ ] Verify all routes work correctly
- [ ] Check save/load functionality
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify responsive design on mobile devices
- [ ] Monitor error logs (Sentry, LogRocket, etc.)
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Configure custom domain (if applicable)
- [ ] Enable HTTPS
- [ ] Test auto-updates (Electron only)

---

## Rollback Strategy

### Web (Vercel/Netlify)
- Both platforms keep deployment history
- Instant rollback from dashboard
- Or re-deploy previous Git commit

### Electron
- Users can download previous releases from GitHub Releases
- Disable auto-update temporarily if critical bug found
- Push hotfix and publish new version

---

See [setup.md](./setup.md) for development environment and [roadmap.md](./roadmap.md) for feature planning.
