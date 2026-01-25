# UI Animations Documentation

**Phase 2 - Enhanced UI Animations**  
**Implementation Date:** January 25, 2026  
**Status:** ✅ Complete

---

## Overview

Added comprehensive Framer Motion animations throughout the UI to create a polished, professional feel. All animations use spring physics for natural movement and are GPU-accelerated for smooth performance.

---

## Animation Catalog

### 1. Item Slots ([ItemSlot.tsx](../src/components/ui/ItemSlot.tsx))

**Features:**
- **Entrance:** Fade + scale from 0.8 to 1.0 (300ms)
- **Hover State:**
  - Scale to 1.08x
  - Rarity-colored glow (24px blur, pulsing)
  - Icon wiggle animation (-5° to +5° rotation)
  - Radial gradient background glow
- **Tap:** Scale to 0.95x
- **Rarity Indicator:** Pulsing dot animation (scale 1.0 to 1.3)

**Technical:**
```tsx
- Spring physics: stiffness=300, damping=20
- Glow uses boxShadow with rarity colors
- AnimatePresence for conditional glow layer
```

**Rarity Glows:**
- Junk: Gray #4A5568
- Common: Green #22C55E
- Uncommon: Blue #3B82F6
- Rare: Purple #A855F7
- Epic: Pink #EC4899
- Legendary: Orange #F97316
- Mythic: Red #EF4444

---

### 2. Health Bars ([StatBar.tsx](../src/components/ui/StatBar.tsx))

**Features:**
- **Value Animation:** Smooth counting from old to new value (500ms eased)
- **Damage Flash:** Red glow (0 → 8px → 0, 500ms)
- **Healing Flash:** Green glow (0 → 8px → 0, 500ms)
- **Bar Pulse:** Scale animation (1.0 → 0.97/1.03 → 1.0)
- **Progress Bar:** Smooth width transition (cubic-bezier)

**Technical:**
```tsx
- Uses requestAnimationFrame for smooth counting
- Cubic easing: cubic-bezier(0.4, 0, 0.2, 1)
- Tracks prev/current values to determine flash color
```

---

### 3. Floating Numbers ([FloatingNumber.tsx](../src/components/ui/FloatingNumber.tsx))

**New Component** - Ready for combat integration

**Features:**
- Float upward animation (0 to -60px)
- Opacity curve: 0 → 1 → 1 → 0
- Scale curve: 0.5 → 1.2 → 1.0 → 0.8
- Type-specific styling

**Types:**
- **Damage:** Red (#f56565), XL font, "-" prefix
- **Heal:** Green (#48bb78), LG font, "+" prefix  
- **XP:** Purple (#9f7aea), MD font, "+" prefix
- **Gold:** Yellow (#f6e05e), MD font, "+" prefix

**Technical:**
```tsx
- Duration: 1.5s total
- Supports delay parameter for staggering
- Text shadow for visibility on any background
```

**Usage Example:**
```tsx
<FloatingNumber 
  value={25} 
  type="damage" 
  isVisible={showDamage} 
  delay={0.2}
/>
```

---

### 4. Event Outcomes ([OutcomeDisplay.tsx](../src/components/dungeon/OutcomeDisplay.tsx))

**Features:**
- **Outcome Text:** Slide from left with spring (x: -20 → 0)
- **Effect Cards:** Staggered cascade entrance
  - Delay: index × 50ms
  - Scale: 0.8 → 1.0
  - Opacity: 0 → 1
  - Y-position: 20 → 0
- **Effect Icons:** Rotate entrance (-180° → 0°) + scale
- **Hover:** Card scale to 1.02x with rarity glow
- **Continue Button:** Delayed fade-in based on effect count

**Technical:**
```tsx
- Uses useState to track visible effects
- AnimatePresence with mode="popLayout"
- Icon delay: base + 100ms per effect
```

---

### 5. Event Display ([EventDisplay.tsx](../src/components/dungeon/EventDisplay.tsx))

**Features:**
- **Header:** Fade down (y: -10 → 0, 300ms)
- **Choice Buttons:** Staggered slide from left
  - Delay: index × 50ms
  - X-position: -20 → 0
- **Hover (enabled buttons):**
  - Slide right (+4px)
  - Orange glow (0 → 12px)
  - Background color fade
- **Tap:** Scale to 0.98x

**Technical:**
```tsx
- Spring: stiffness=300, damping=20
- Disabled buttons have no hover effects
- whileHover uses state-based colors
```

---

### 6. Screen Transitions ([App.tsx](../src/App.tsx))

**Features:**
- **AnimatePresence:** Wait mode for clean transitions
- **Enter:** Slide from right + fade (x: 20 → 0, opacity: 0 → 1)
- **Exit:** Slide to left + fade (x: 0 → -20, opacity: 1 → 0)
- **Timing:** 
  - Enter: 400ms spring
  - Exit: 200ms linear

**Technical:**
```tsx
- Each screen wrapped in MotionBox with unique key
- Prevents simultaneous screen rendering
- Spring: stiffness=100, damping=15
```

---

### 7. Party Member Cards ([PartyMemberCard.tsx](../src/components/party/PartyMemberCard.tsx))

**Features:**
- **Hover:**
  - Slide right (+4px)
  - Glow based on alive state
    - Alive: Orange glow
    - Dead: Red glow
- **Icon:** Wiggle animation (-5° to +5° + scale 1.1x)
- **Tap:** Scale to 0.98x

**Technical:**
```tsx
- Spring: stiffness=300, damping=20
- Icon animation: 500ms ease-in-out
- Conditional boxShadow based on hero.isAlive
```

---

### 8. Game Over Screen ([GameOverScreen.tsx](../src/components/dungeon/GameOverScreen.tsx))

**Features:**
- **Container:** Scale entrance (0.9 → 1.0 with spring)
- **Skull Icon:**
  - Rotate entrance (-180° → 0°, 600ms)
  - Scale entrance (0 → 1 with spring)
  - Continuous float (y: 0 → -10 → 0, 2s loop)
- **Heading:** Fade + slide up (y: -20 → 0, delay 200ms)
- **Subtext:** Fade in (delay 400ms)
- **Penalty Box:** Fade + slide up (y: 20 → 0, delay 600ms)
- **Penalty Cards:** Staggered cascade (delay: 800ms + index × 100ms)
- **Button:** Fade + slide up (delay 1200ms)

**Technical:**
```tsx
- Skull float uses infinite repeat with reverse
- Stagger creates dramatic reveal effect
- Total animation sequence: ~2 seconds
```

---

## Animation Principles

### Timing
- **Fast:** 200ms (exits, taps)
- **Standard:** 300-500ms (most animations)
- **Slow:** 1000-2000ms (dramatic moments, continuous)

### Easing
- **Spring Physics:** Natural, bouncy feel (primary choice)
  - Stiffness: 200-300 (higher = faster)
  - Damping: 15-25 (higher = less bounce)
- **Ease Out:** Quick start, slow end (entrances)
- **Ease In-Out:** Smooth both ends (loops)

### Stagger Delays
- **Small lists:** 50ms per item
- **Large lists:** 100ms per item
- **Dramatic reveals:** 200ms+ per item

### Scale Values
- **Entrance:** 0.8-0.9 → 1.0
- **Hover:** 1.02-1.08
- **Tap:** 0.95-0.98
- **Exit:** 1.0 → 0.8-0.9

### Distance Values
- **Slide (subtle):** 4-10px
- **Slide (entrance):** 20-40px
- **Float:** 60px (damage numbers)

---

## Performance Considerations

✅ **GPU-Accelerated Properties:**
- `opacity`
- `transform` (translate, scale, rotate)
- `boxShadow` (when properly used)

❌ **Avoid Animating:**
- `width`, `height` (use `scale` instead)
- `top`, `left` (use `translate` instead)
- `background-color` (OK in moderation)

**Best Practices:**
- All animations use transform/opacity
- Spring physics are CPU-efficient
- AnimatePresence prevents memory leaks
- Animations respect `prefers-reduced-motion`

---

## Browser Support

- **Framer Motion:** React 18+
- **GPU Acceleration:** All modern browsers
- **Fallbacks:** Graceful degradation (no motion = instant)

---

## Next Steps

### Integration Opportunities
1. **FloatingNumber Component:**
   - Add to combat resolution
   - Show damage above affected heroes
   - Show XP/gold rewards after events

2. **Loading States:**
   - Add skeleton loaders with pulse animation
   - Spinner for async operations

3. **Micro-interactions:**
   - Button press sounds (Phase 3)
   - Haptic feedback for mobile
   - Particle effects for critical hits

4. **Additional Polish:**
   - Level-up celebration animation
   - Death animation for heroes
   - Floor transition animation
   - Victory screen animations

---

## Code Examples

### Basic Spring Animation
```tsx
<MotionBox
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 20
  }}
>
  {/* Content */}
</MotionBox>
```

### Staggered List
```tsx
{items.map((item, index) => (
  <MotionBox
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: index * 0.05,
      type: "spring"
    }}
  >
    {/* Item content */}
  </MotionBox>
))}
```

### Conditional Animation
```tsx
<AnimatePresence>
  {isVisible && (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Conditional content */}
    </MotionBox>
  )}
</AnimatePresence>
```

---

**Last Updated:** January 25, 2026  
**Author:** Phase 2 Development Team  
**Status:** Production Ready ✅
