import { Text, Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import type { Item } from '@/types';
import { getModifierById } from '@/data/items/mods';
import { getRarityColors } from '@/systems/rarity/rarities';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const glow = keyframes`
  0%, 100% { 
    filter: drop-shadow(0 0 8px var(--glow-color));
  }
  50% { 
    filter: drop-shadow(0 0 15px var(--glow-color));
  }
`;

interface RarityColors {
  border: string;
  bg: string;
  text: string;
  glow: string;
  gem: string;
}

interface RarityLabelProps {
  rarity: Item['rarity'];
  text: string;
  isUnique?: boolean;
  modifiers?: string[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  withGlow?: boolean;
  withShimmer?: boolean;
  withPulse?: boolean;
  className?: string;
}

export function RarityLabel({
  rarity,
  text,
  isUnique = false,
  modifiers = [],
  size = 'md',
  withGlow = true,
  withShimmer = false,
  withPulse = false,
  className = '',
}: RarityLabelProps) {
  const rarityTheme = getRarityColors(rarity);
  
  // Import modifiers to get color and icon
  const primaryModifier = modifiers.length > 0 ? getModifierById(modifiers[0]) : null;
  
  const color = primaryModifier ? primaryModifier.color : (isUnique ? '#FFD700' : rarityTheme.text);
  const glowColor = primaryModifier ? `${primaryModifier.color}99` : (isUnique ? 'rgba(255, 215, 0, 0.5)' : rarityTheme.glow);
  const displayText = primaryModifier ? `${primaryModifier.icon} ${text}` : text;

  const animations = [];
  if (withPulse || isUnique || modifiers.length > 0) animations.push(`${pulse} 2s ease-in-out infinite`);
  if (withGlow) animations.push(`${glow} 2s ease-in-out infinite`);

  const modifierClasses = modifiers.map(m => `rarity-label--${m}`).join(' ');

  return (
    <Box
      className={`rarity-label rarity-label--${rarity}${isUnique ? ' rarity-label--unique' : ''} ${modifierClasses} ${className}`}
      position="relative"
      display="inline-block"
    >
      {withShimmer && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={`linear-gradient(90deg, transparent 0%, ${glowColor} 50%, transparent 100%)`}
          backgroundSize="200% 100%"
          sx={{ animation: `${shimmer} 3s linear infinite` }}
          opacity={0.3}
          pointerEvents="none"
          borderRadius="md"
        />
      )}
      <Text
        className="rarity-label-text"
        fontSize={size}
        fontWeight="bold"
        color={color}
        textShadow={withGlow ? `0 0 10px ${glowColor}` : undefined}
        position="relative"
        sx={{
          '--glow-color': glowColor,
          animation: animations.length > 0 ? animations.join(', ') : undefined,
        }}
      >
        {displayText}
      </Text>
    </Box>
  );
}
