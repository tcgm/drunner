# Custom SVG Icons

This folder contains custom SVG icons for items and equipment.

## Usage

### 1. Add SVG files
Place your SVG files in this folder. Ensure they:
- Use `currentColor` for fills/strokes so they inherit text color
- Have a `viewBox` attribute (typically `0 0 24 24`)
- Are optimized (use SVGO or similar tools)

### 2. Export from index.ts
Add the icon to `index.ts`:
```typescript
export { default as MyIcon } from './my-icon.svg?react'
```

### 3. Use in item definitions
```typescript
import { MyIcon } from '@/assets/icons'

export const MY_ITEM_BASE: BaseItemTemplate = {
  icon: MyIcon, // Works exactly like react-icons
  // ...rest of config
}
```

## Mixing with react-icons

You can use both custom SVGs and react-icons:
```typescript
import { GiBattleAxe } from 'react-icons/gi' // External icon
import { CustomSword } from '@/assets/icons'  // Custom SVG
```

Both work the same way since Vite's `?react` suffix converts SVGs to React components.
