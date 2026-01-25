# UI Design with Chakra UI

UI/UX guidelines and Chakra UI implementation for Dungeon Runner.

---

## Theme Configuration

```typescript
// src/theme/index.ts
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { colors } from './colors';
import { components } from './components';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors,
  components,
  fonts: {
    heading: '"Press Start 2P", monospace',
    body: '"VT323", monospace',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'gray.100',
      },
    },
  },
});
```

### Color Palette
```typescript
// src/theme/colors.ts
export const colors = {
  rarity: {
    junk: '#6B7280',      // Gray
    common: '#FFFFFF',    // White
    uncommon: '#10B981',  // Green
    rare: '#3B82F6',      // Blue
    epic: '#A855F7',      // Purple
    legendary: '#F59E0B', // Orange
    mythic: '#EF4444',    // Red
    artifact: '#14F195',  // Cyan
    cursed: '#8B0000',    // Dark Red
    set: '#FFD700',       // Gold
  },
  class: {
    warrior: '#DC2626',
    mage: '#3B82F6',
    rogue: '#6B7280',
    cleric: '#FBBF24',
    ranger: '#10B981',
    paladin: '#F59E0B',
    necromancer: '#7C3AED',
    bard: '#EC4899',
  },
  dungeon: {
    depth: '#1F2937',
    floor: '#374151',
    danger: '#DC2626',
  },
};
```

---

## Screen Layouts

### Main Menu Screen
```typescript
import { Box, VStack, Heading, Button, Image } from '@chakra-ui/react';

export function MainMenuScreen() {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, gray.900, gray.800)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={8}>
        <Heading size="2xl" fontFamily="heading">
          Dungeon Runner
        </Heading>
        
        <VStack spacing={4} w="300px">
          <Button w="full" colorScheme="red" size="lg">
            New Game
          </Button>
          <Button w="full" colorScheme="blue" size="lg">
            Load Game
          </Button>
          <Button w="full" colorScheme="gray" size="lg">
            Settings
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
```

### Dungeon Screen Layout
```typescript
import { Grid, GridItem, Box } from '@chakra-ui/react';

export function DungeonScreen() {
  return (
    <Grid
      templateAreas={`
        "header header"
        "party event"
        "party actions"
      `}
      gridTemplateRows="80px 1fr auto"
      gridTemplateColumns="350px 1fr"
      h="100vh"
      gap={4}
      p={4}
      bg="gray.900"
    >
      {/* Header - Depth & Resources */}
      <GridItem area="header">
        <DepthTracker />
      </GridItem>
      
      {/* Left Sidebar - Party */}
      <GridItem area="party" overflowY="auto">
        <PartyList />
      </GridItem>
      
      {/* Center - Current Event */}
      <GridItem area="event" overflowY="auto">
        <EventCard />
      </GridItem>
      
      {/* Bottom - Actions */}
      <GridItem area="actions">
        <ActionBar />
      </GridItem>
    </Grid>
  );
}
```

### Combat Screen Layout (Stretch Goal)
```typescript
export function CombatScreen() {
  return (
    <Grid
      templateAreas={`
        "header header header"
        "heroes battlefield enemies"
        "log log log"
        "actions actions actions"
      `}
      gridTemplateRows="60px 1fr 150px 100px"
      gridTemplateColumns="300px 1fr 300px"
      h="100vh"
      gap={4}
      p={4}
    >
      <GridItem area="header">
        <TurnOrderDisplay />
      </GridItem>
      
      <GridItem area="heroes">
        <VStack>{heroes.map(h => <CombatantCard />)}</VStack>
      </GridItem>
      
      <GridItem area="battlefield">
        <BattleField />
      </GridItem>
      
      <GridItem area="enemies">
        <VStack>{enemies.map(e => <CombatantCard />)}</VStack>
      </GridItem>
      
      <GridItem area="log" overflowY="auto">
        <CombatLog />
      </GridItem>
      
      <GridItem area="actions">
        <ActionMenu />
      </GridItem>
    </Grid>
  );
}
```

---

## Component Patterns

### Hero Card
```typescript
import { Box, HStack, VStack, Text, Icon, Progress } from '@chakra-ui/react';
import { GiCrossedSwords } from 'react-icons/gi';

interface HeroCardProps {
  hero: Hero;
  isSelected?: boolean;
  onClick?: () => void;
}

export function HeroCard({ hero, isSelected, onClick }: HeroCardProps) {
  return (
    <Box
      p={4}
      bg={isSelected ? 'gray.700' : 'gray.800'}
      borderWidth={2}
      borderColor={isSelected ? 'blue.400' : 'gray.600'}
      borderRadius="md"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      _hover={onClick ? { borderColor: 'blue.300' } : {}}
      transition="all 0.2s"
    >
      <HStack spacing={4}>
        {/* Icon */}
        <Icon as={GiCrossedSwords} boxSize={12} color={`class.${hero.class.name.toLowerCase()}`} />
        
        {/* Info */}
        <VStack align="start" flex={1} spacing={1}>
          <Text fontSize="lg" fontWeight="bold">{hero.name}</Text>
          <Text fontSize="sm" color="gray.400">{hero.class.name} - Level {hero.level}</Text>
          
          {/* Health Bar */}
          <Progress
            value={(hero.stats.currentHealth / hero.stats.maxHealth) * 100}
            colorScheme="red"
            w="full"
            size="sm"
            borderRadius="full"
          />
          <Text fontSize="xs" color="gray.500">
            {hero.stats.currentHealth} / {hero.stats.maxHealth} HP
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}
```

### Event Card
```typescript
import { Box, VStack, Heading, Text, Button, Icon } from '@chakra-ui/react';

interface EventCardProps {
  event: DungeonEvent;
  onChoice: (choiceId: string) => void;
}

export function EventCard({ event, onChoice }: EventCardProps) {
  return (
    <Box
      bg="gray.800"
      borderWidth={2}
      borderColor="gray.600"
      borderRadius="lg"
      p={6}
      maxW="800px"
      mx="auto"
    >
      {/* Icon & Title */}
      <VStack spacing={4} align="start">
        <HStack>
          <Icon as={getEventIcon(event.type)} boxSize={8} color="blue.400" />
          <Heading size="lg">{event.title}</Heading>
        </HStack>
        
        {/* Description */}
        <Text fontSize="md" color="gray.300">
          {event.description}
        </Text>
        
        {/* Choices */}
        <VStack w="full" spacing={3} mt={4}>
          {event.choices.map(choice => (
            <Button
              key={choice.id}
              w="full"
              size="lg"
              colorScheme={getChoiceColor(choice)}
              onClick={() => onChoice(choice.id)}
              isDisabled={!canMakeChoice(choice)}
              leftIcon={choice.icon ? <Icon as={getIcon(choice.icon)} /> : undefined}
            >
              {choice.text}
            </Button>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}
```

### Item Card with Rarity
```typescript
import { Box, HStack, VStack, Text, Icon, Tooltip } from '@chakra-ui/react';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const rarityColor = `rarity.${item.rarity}`;
  
  return (
    <Tooltip label={<ItemTooltip item={item} />} placement="right">
      <Box
        p={3}
        bg="gray.800"
        borderWidth={2}
        borderColor={rarityColor}
        borderRadius="md"
        cursor={onClick ? 'pointer' : 'default'}
        onClick={onClick}
        _hover={onClick ? { transform: 'scale(1.05)', shadow: 'lg' } : {}}
        transition="all 0.2s"
      >
        <VStack spacing={2}>
          <Icon as={getItemIcon(item.type)} boxSize={8} color={rarityColor} />
          <Text fontSize="sm" fontWeight="bold" color={rarityColor} textAlign="center">
            {item.name}
          </Text>
        </VStack>
      </Box>
    </Tooltip>
  );
}
```

### Equipment Slots
```typescript
import { Grid, GridItem, Box, Text, Icon } from '@chakra-ui/react';

export function EquipmentSlots({ hero }: { hero: Hero }) {
  const slots = [
    { key: 'weapon', label: 'Weapon', icon: GiSword },
    { key: 'armor', label: 'Armor', icon: GiChestArmor },
    { key: 'helmet', label: 'Helmet', icon: GiWingedHelm },
    { key: 'boots', label: 'Boots', icon: GiBootKick },
    { key: 'accessory1', label: 'Accessory', icon: GiRing },
    { key: 'accessory2', label: 'Accessory', icon: GiNecklace },
  ];
  
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
      {slots.map(slot => (
        <GridItem key={slot.key}>
          <EquipmentSlot
            slot={slot}
            item={hero.equipment[slot.key]}
            onEquip={(item) => equipItem(hero.id, item, slot.key)}
          />
        </GridItem>
      ))}
    </Grid>
  );
}

function EquipmentSlot({ slot, item, onEquip }) {
  return (
    <Box
      p={4}
      bg="gray.800"
      borderWidth={2}
      borderColor={item ? 'blue.400' : 'gray.600'}
      borderRadius="md"
      textAlign="center"
    >
      <VStack spacing={2}>
        <Icon as={slot.icon} boxSize={6} color={item ? 'blue.400' : 'gray.500'} />
        <Text fontSize="xs" color="gray.400">{slot.label}</Text>
        {item ? <ItemCard item={item} /> : <Text fontSize="xs">Empty</Text>}
      </VStack>
    </Box>
  );
}
```

---

## Custom Components

### Resource Bar (Health, Mana, XP)
```typescript
import { Box, Progress, Text, HStack } from '@chakra-ui/react';

interface ResourceBarProps {
  current: number;
  max: number;
  label: string;
  color: string;
  icon?: React.ReactElement;
}

export function ResourceBar({ current, max, label, color, icon }: ResourceBarProps) {
  const percentage = (current / max) * 100;
  
  return (
    <Box>
      <HStack justify="space-between" mb={1}>
        <HStack spacing={2}>
          {icon}
          <Text fontSize="sm" fontWeight="bold">{label}</Text>
        </HStack>
        <Text fontSize="sm" color="gray.400">
          {current} / {max}
        </Text>
      </HStack>
      <Progress
        value={percentage}
        colorScheme={color}
        borderRadius="full"
        size="md"
        hasStripe
        isAnimated
      />
    </Box>
  );
}
```

### Stat Display
```typescript
import { HStack, Icon, Text, Tooltip } from '@chakra-ui/react';
import { GiSwordsPower, GiShield, GiRunningShoe, GiClover } from 'react-icons/gi';

const STAT_ICONS = {
  attack: GiSwordsPower,
  defense: GiShield,
  speed: GiRunningShoe,
  luck: GiClover,
};

export function StatDisplay({ stats }: { stats: Stats }) {
  return (
    <HStack spacing={4}>
      {Object.entries(stats).map(([key, value]) => (
        <Tooltip key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
          <HStack spacing={1}>
            <Icon as={STAT_ICONS[key]} color="blue.400" />
            <Text fontSize="sm" fontWeight="bold">{value}</Text>
          </HStack>
        </Tooltip>
      ))}
    </HStack>
  );
}
```

---

## Responsive Design

```typescript
import { useBreakpointValue } from '@chakra-ui/react';

export function DungeonScreen() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  return (
    <Grid
      templateAreas={isMobile ? `
        "header"
        "event"
        "party"
        "actions"
      ` : `
        "header header"
        "party event"
        "party actions"
      `}
      gridTemplateColumns={isMobile ? '1fr' : '350px 1fr'}
      // ... rest of layout
    >
      {/* ... */}
    </Grid>
  );
}
```

---

## Animation & Transitions

```typescript
import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';

const MotionBox = motion(Box);

export function EventCard({ event }: { event: DungeonEvent }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Event content */}
    </MotionBox>
  );
}
```

---

## Accessibility

- All interactive elements use proper semantic HTML
- Keyboard navigation support (Tab, Enter, Escape)
- ARIA labels for screen readers
- High contrast text and borders
- Focus indicators on all clickable elements

```typescript
<Button
  aria-label="Attack enemy"
  _focus={{ boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' }}
>
  Attack
</Button>
```

---

See [file-structure.md](./file-structure.md) for component organization and [architecture.md](./architecture.md) for system design.
