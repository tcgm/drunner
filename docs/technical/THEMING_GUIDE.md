# Dungeon Runner - Theming & Visual Design Guide

## Overview
Dungeon Runner uses a **dark dungeon-crawler aesthetic** with **orange/fire accent colors**, **glowing effects**, and **decorative border elements**. The design emphasizes a refined, modern UI with subtle atmospheric touches.

## Color Palette

### Primary Colors
- **Background**: `gray.900`, `gray.800` (dark gradients)
- **Primary Accent**: `orange.400`, `orange.500` (fire/warmth)
- **Secondary Accent**: `yellow.400` (victory/treasure)
- **Success**: `green.400`, `green.700` (healing/survival)
- **Danger**: `red.400`, `red.700` (damage/death)

### Text Colors
- **Primary Text**: `gray.200`, `gray.100` (high contrast)
- **Secondary Text**: `gray.400`, `gray.500` (de-emphasized)
- **Accent Text**: `orange.400`, `orange.300` (highlights)

## Visual Elements

### Background Treatment
```tsx
<Box
  bgGradient="linear(to-b, gray.900, gray.800, gray.900)"
  position="relative"
  _before={{
    content: '""',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    bgImage: 'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.03), transparent 50%)',
    pointerEvents: 'none',
  }}
/>
```

### Decorative Corner Borders
Four corner decorative elements with nested accents:
```tsx
<Box
  position="absolute"
  top="0" left="0"
  width="200px" height="200px"
  borderLeft="3px solid"
  borderTop="3px solid"
  borderColor="orange.500"
  opacity={0.3}
  _after={{
    content: '""',
    position: 'absolute',
    top: '10px', left: '10px',
    width: '20px', height: '20px',
    borderLeft: '2px solid',
    borderTop: '2px solid',
    borderColor: 'orange.400',
  }}
/>
```
Repeat for all four corners (top-left, top-right, bottom-left, bottom-right).

### Glowing Titles
```tsx
<Heading
  color="orange.400"
  textShadow="0 0 20px rgba(251, 146, 60, 0.5), 0 0 40px rgba(251, 146, 60, 0.3)"
  letterSpacing="wider"
  textTransform="uppercase"
/>
```

### Decorative Icons
Use semi-transparent large icons as backdrops:
```tsx
<Icon 
  as={GiSomeIcon} 
  boxSize={32} 
  color="orange.500"
  opacity={0.15}
  position="absolute"
  filter="blur(1px)"
/>
```

Use smaller icons with glow as accents:
```tsx
<Icon 
  as={GiWings} 
  boxSize={16} 
  color="orange.400"
  opacity={0.6}
  filter="drop-shadow(0 0 8px rgba(251, 146, 60, 0.4))"
/>
```

### Gradient Dividers
```tsx
<Box 
  width="300px" 
  height="2px" 
  bgGradient="linear(to-r, transparent, orange.500, transparent)" 
/>
```

## Interactive Elements

### Primary Buttons
```tsx
<Button
  colorScheme="orange"
  size="lg"
  height="60px"
  boxShadow="0 0 15px rgba(251, 146, 60, 0.4)"
  _hover={{
    transform: 'scale(1.05)',
    boxShadow: '0 0 25px rgba(251, 146, 60, 0.6)',
  }}
  transition="all 0.2s"
  letterSpacing="wide"
  fontWeight="bold"
/>
```

### Secondary Buttons (Outlined)
```tsx
<Button
  colorScheme="orange"
  variant="outline"
  borderWidth="2px"
  _hover={{
    transform: 'scale(1.05)',
    boxShadow: '0 0 20px rgba(251, 146, 60, 0.4)',
  }}
  transition="all 0.2s"
/>
```

### Ghost Buttons (Tertiary)
```tsx
<Button
  colorScheme="gray"
  variant="ghost"
  opacity={0.5}
  _hover={{
    transform: 'scale(1.05)',
    borderColor: 'orange.400',
    color: 'orange.400',
  }}
/>
```

## Animation Patterns

### Entry Animations (Framer Motion)
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", stiffness: 100, damping: 15 }}
/>
```

### Bobbing/Floating Animation
```tsx
<motion.div
  animate={{ y: [0, -10, 0] }}
  transition={{
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }}
/>
```

### Staggered Entry
```tsx
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: 0.3 + (index * 0.1) }}
```

## Content Boxes

### Primary Content Box
```tsx
<MotionBox
  bg="rgba(0,0,0,0.4)"
  p={5}
  borderRadius="lg"
  border="2px solid"
  borderColor="yellow.600" // or appropriate color
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.3 }}
/>
```

### Secondary Content Box
```tsx
<Box
  bg="rgba(0,0,0,0.3)"
  borderRadius="lg"
  border="1px solid"
  borderColor="gray.700"
  _hover={{ borderColor: 'orange.500', bg: 'rgba(0,0,0,0.5)' }}
  transition="all 0.2s"
/>
```

## Screen Layout Pattern

Full-screen overlays (Victory, Defeat, Modals) should:
1. Use full viewport (`h="100vh" w="100vw"`)
2. Center content with flex
3. Apply dark background with gradient
4. Add radial overlay effect
5. Include decorative corner borders
6. Use `position="relative"` with `zIndex={1}` for content

## Typography

### Headers
- Size: `2xl` to `4xl`
- Weight: `bold`
- Letter Spacing: `wider`
- Text Transform: `uppercase` (for major headings)
- Text Shadow: Glowing effect for emphasis

### Body Text
- Size: `md` to `lg`
- Color: `gray.200` (readable), `gray.400` (secondary)
- Letter Spacing: Normal or `wide` for emphasis

### Labels/Tags
- Size: `sm` to `xs`
- Text Transform: `uppercase` for tags
- Letter Spacing: `widest` for small caps

## Spacing & Layout

### Container Gaps
- Major sections: `spacing={8}` or `gap={8}`
- Minor sections: `spacing={4}` or `gap={4}`
- Tight sections: `spacing={2}` or `gap={2}`

### Padding
- Major containers: `p={8}`
- Content boxes: `p={5}` or `p={4}`
- Compact elements: `p={3}` or `p={2}`

### Max Width
- Main content: `maxW="1800px"` (wide screens)
- Menu screens: `maxW="400px"` (focused content)
- Modals: `size="lg"` to `size="xl"`

## Implementation Checklist

When creating new screens or major UI elements:
- [ ] Full viewport background with gradient
- [ ] Radial overlay effect
- [ ] Decorative corner borders (4 corners)
- [ ] Glowing title with text shadow
- [ ] Decorative backdrop icon (large, blurred, low opacity)
- [ ] Gradient divider line
- [ ] Buttons with hover effects and glow
- [ ] Content boxes with borders and dark backgrounds
- [ ] Framer Motion entry animations
- [ ] Proper spacing and typography
- [ ] Orange/fire accent colors
- [ ] Icons from react-icons/gi (game-icons)
