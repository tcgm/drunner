# Hero Abilities System

## Overview

The abilities system provides each hero with active abilities that can be used during dungeon runs. Abilities have cooldowns that reset based on floor progression (not depth), allowing strategic gameplay decisions.

## System Architecture

### Core Components

1. **Ability Manager** (`src/systems/abilities/abilityManager.ts`)
   - Core logic for ability usage and cooldown tracking
   - Ability effect application (heal, damage, buff, debuff, special)
   - Target selection (self, ally, all-allies, enemy, all-enemies)

2. **Ability Data** (`src/data/abilities/`)
   - Individual files for each hero class
   - Reusable ability definitions
   - Organized by class (warrior.ts, mage.ts, etc.)

3. **Game Store Integration** (`src/store/gameStore.ts`)
   - `useAbility(heroId, abilityId)` action
   - Returns `{ success: boolean, message: string }`

4. **UI Components** (`src/components/party/PartyMemberCard.tsx`)
   - Ability buttons displayed below hero stats
   - Visual cooldown indicators
   - Hover tooltips with ability info

## How It Works

### Cooldown System

- Abilities track `lastUsedFloor` instead of `currentCooldown`
- Cooldowns are measured in **floors** (not depths/events)
- When floor increases, abilities become available if: `currentFloor - lastUsedFloor >= cooldown`
- This means abilities reset when advancing to a new floor (after completing floor boss)

### Ability Usage

```typescript
// In a component:
const { useAbility } = useGameStore()

const handleUseAbility = (heroId: string, abilityId: string) => {
  const result = useAbility(heroId, abilityId)
  if (result.success) {
    console.log(result.message) // "Gandalf used Fireball! Dealt 25 damage!"
  } else {
    console.log(result.message) // "Fireball is on cooldown (2 floors remaining)"
  }
}
```

### Ability Manager Functions

```typescript
// Check if ability is ready to use
canUseAbility(ability, currentFloor): boolean

// Get remaining cooldown
getRemainingCooldown(ability, currentFloor): number

// Check charges remaining (if limited)
hasChargesRemaining(ability): boolean

// Get complete status for UI
getAbilityStatus(ability, currentFloor): {
  canUse: boolean
  cooldownRemaining: number
  chargesRemaining: number | null
  statusText: string
}

// Use an ability
useAbility(hero, abilityId, currentFloor, party): {
  hero: Hero
  party: (Hero | null)[]
  message: string
  success: boolean
}
```

## Ability Types

### Effect Types

1. **Heal** - Restore HP to target(s)
   - Example: Cleric's Heal (25 HP to ally)

2. **Damage** - Deal damage to enemy
   - Example: Warrior's Power Strike (20 damage)

3. **Buff** - Increase ally stats temporarily
   - Example: Warrior's Defend (+10 defense for 1 turn)

4. **Debuff** - Decrease enemy stats temporarily
   - Example: Bard's Discordant Note (-4 to enemy)

5. **Special** - Unique effects
   - Example: Necromancer's Summon Skeleton

### Target Types

- `self` - Only the caster
- `ally` - Random ally (excluding self)
- `all-allies` - Entire party
- `enemy` - Single enemy
- `all-enemies` - All enemies

## Example Abilities by Class

### Warrior
- **Power Strike** (2 floor cooldown) - High damage single attack
- **Defend** (3 floor cooldown) - Reduce incoming damage
- **Taunt** (4 floor cooldown) - Draw enemy attention

### Mage
- **Fireball** (2 floor cooldown) - Magic damage to enemy
- **Magic Missile** (1 floor cooldown) - Guaranteed hit
- **Mana Shield** (4 floor cooldown) - Temporary protection

### Cleric
- **Heal** (2 floor cooldown) - Restore 25 HP to ally
- **Bless** (4 floor cooldown) - Buff ally stats
- **Holy Light** (3 floor cooldown) - Damage enemy

### Rogue
- **Backstab** (2 floor cooldown) - High critical damage
- **Dodge** (3 floor cooldown) - Avoid next attack
- **Poison Blade** (3 floor cooldown) - Damage over time

### Ranger
- **Aimed Shot** (2 floor cooldown) - High accuracy attack
- **Quick Shot** (1 floor cooldown) - Fast attack
- **Track** (5 floor cooldown) - Reveal event info

### Paladin
- **Smite** (2 floor cooldown) - Holy damage
- **Lay on Hands** (4 floor cooldown) - Heal ally
- **Divine Shield** (6 floor cooldown) - Invulnerability

### Necromancer
- **Summon Skeleton** (5 floor cooldown) - Create minion
- **Curse** (3 floor cooldown) - Debuff enemy
- **Drain Life** (2 floor cooldown) - Damage and heal

### Bard
- **Inspire** (4 floor cooldown) - Buff all allies
- **Song of Rest** (5 floor cooldown) - Heal over time
- **Discordant Note** (3 floor cooldown) - Debuff enemy

## Adding New Abilities

1. Create ability definition in `src/data/abilities/<class>.ts`:
```typescript
export const NEW_ABILITY: Ability = {
  id: 'new-ability',
  name: 'New Ability',
  description: 'Does something cool',
  cooldown: 3,
  currentCooldown: 0,
  effect: {
    type: 'damage',
    value: 20,
    target: 'enemy',
  },
}
```

2. Add to hero class definition in `src/data/classes/<class>.ts`:
```typescript
abilities: [
  // ... existing abilities
  {
    id: 'new-ability',
    name: 'New Ability',
    // ... (copy from ability data file)
  }
]
```

3. Export from `src/data/abilities/index.ts` if needed

## UI Integration

### Party Member Card

Abilities appear as small purple icons below the hero's XP bar:
- **Ready**: Purple with sparkle icon
- **On Cooldown**: Gray with cooldown number badge
- **Disabled**: Reduced opacity when hero is dead

### Tooltips

Hover over ability icons to see:
- Ability name
- Description
- Current status ("Ready", "Cooldown: X floors", "Charges: X/Y")

## Future Enhancements

### Possible Features
- [ ] Ability upgrade system (power increases at certain levels)
- [ ] Ultimate abilities (unlock at level 10+)
- [ ] Passive abilities (always active)
- [ ] Combo abilities (use multiple abilities together)
- [ ] Ability charges (limited uses per run)
- [ ] Ability targeting UI (select specific ally/enemy)
- [ ] Visual effects for ability usage
- [ ] Ability cooldown reduction items
- [ ] Class-specific ability trees

### Balance Considerations
- Cooldowns are in floors (5-10 events per floor typical)
- Strong abilities have longer cooldowns
- Healing abilities balanced against consumables
- Support abilities benefit full party composition

## Technical Notes

### Cooldown Tracking
- Uses `lastUsedFloor` instead of decrementing counters
- Simplifies logic and prevents sync issues
- Automatically works with floor progression system

### State Management
- Abilities stored in hero object
- Updated through gameStore.useAbility()
- Changes persist through auto-save system

### Performance
- Ability checks are O(1) calculations
- No performance impact on large parties
- UI updates only when floor changes

## Testing

To test abilities:
1. Start a new game
2. Select heroes with different abilities
3. Enter dungeon
4. Click ability icons on party cards
5. Check console for ability messages
6. Verify cooldowns update on floor progression

## Troubleshooting

**Abilities not appearing?**
- Check hero has abilities defined in class
- Verify PartyMemberCard is rendering abilities section
- Check console for errors

**Cooldowns not resetting?**
- Cooldowns reset on FLOOR increase, not depth
- Complete floor boss to advance floor
- Check `dungeon.floor` in game state

**Abilities have no effect?**
- Some abilities target enemies (combat events only)
- Check ability effect type matches intended action
- Verify abilityManager is applying effects correctly
