# Setup Instructions

Development environment setup for Dungeon Runner.

---

## Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm** or **yarn** or **pnpm**
- **Git**
- **VS Code** (recommended) or any text editor

---

## Initial Setup

### 1. Clone Repository
```powershell
git clone https://github.com/yourusername/drunner.git
cd drunner
```

### 2. Install Dependencies
```powershell
npm install
```

**Core Dependencies:**
- `react` (18+)
- `react-dom`
- `@chakra-ui/react` (v2)
- `@emotion/react`
- `@emotion/styled`
- `framer-motion`
- `zustand`
- `react-icons`

**Dev Dependencies:**
- `vite`
- `typescript`
- `@vitejs/plugin-react`
- `@types/react`
- `@types/react-dom`

### 3. Run Development Server
```powershell
npm run dev
```

Open browser to `http://localhost:5173` (default Vite port)

---

## Project Initialization (From Scratch)

If starting fresh without a repository:

### 1. Create Vite Project
```powershell
npm create vite@latest drunner -- --template react-ts
cd drunner
npm install
```

### 2. Install Chakra UI
```powershell
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### 3. Install State Management
```powershell
npm install zustand
```

### 4. Install Icons
```powershell
npm install react-icons
```

### 5. Configure TypeScript
Edit `tsconfig.json` to add path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@systems/*": ["src/systems/*"],
      "@store/*": ["src/store/*"],
      "@data/*": ["src/data/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@theme/*": ["src/theme/*"]
    }
  }
}
```

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@systems': path.resolve(__dirname, './src/systems'),
      '@store': path.resolve(__dirname, './src/store'),
      '@data': path.resolve(__dirname, './src/data'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
});
```

### 6. Create Directory Structure
```powershell
mkdir src/components; mkdir src/components/screens; mkdir src/components/ui
mkdir src/components/party; mkdir src/components/dungeon
mkdir src/systems; mkdir src/systems/events; mkdir src/systems/loot
mkdir src/store; mkdir src/data; mkdir src/data/classes; mkdir src/data/events
mkdir src/types; mkdir src/utils; mkdir src/hooks; mkdir src/theme
```

### 7. Setup Chakra UI Provider
Edit `src/main.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@theme';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
```

---

## Optional: Electron Setup

### 1. Install Electron Dependencies
```powershell
npm install --save-dev electron electron-builder concurrently wait-on
```

### 2. Create Electron Entry File
Create `electron/main.ts`:
```typescript
import { app, BrowserWindow } from 'electron';
import path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

### 3. Update package.json
```json
{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder"
  }
}
```

---

## Development Workflow

### Running the App
```powershell
# Web development server
npm run dev

# Electron development (if configured)
npm run electron:dev
```

### Building for Production
```powershell
# Web build (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Electron build (if configured)
npm run electron:build
```

### Linting & Formatting
```powershell
# Install ESLint and Prettier
npm install --save-dev eslint prettier eslint-config-prettier

# Run linter
npm run lint

# Format code
npm run format
```

---

## Testing Setup (Optional)

### Install Testing Libraries
```powershell
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Configure Vitest
Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
  },
});
```

### Add Test Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## Recommended VS Code Extensions

- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript + JavaScript** - IntelliSense
- **ES7+ React/Redux snippets** - Code snippets
- **Chakra UI Snippets** - Component snippets
- **GitLens** - Git history

---

## Environment Variables

Create `.env.local` (not committed):
```
VITE_APP_NAME=Dungeon Runner
VITE_VERSION=0.1.0
VITE_DEV_MODE=true
```

Access in code:
```typescript
const appName = import.meta.env.VITE_APP_NAME;
```

---

## Troubleshooting

### Port Already in Use
```powershell
# Change Vite port in vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
});
```

### Module Resolution Errors
- Ensure `tsconfig.json` paths match `vite.config.ts` aliases
- Restart TypeScript server in VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Chakra UI Not Styled
- Verify `ChakraProvider` wraps `<App>` in `main.tsx`
- Check theme import path
- Clear browser cache

---

See [roadmap.md](./roadmap.md) for development phases and [deployment.md](./deployment.md) for production build instructions.
