import { Text, Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import type { Item } from '@/types';

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

const RARITY_COLORS: Record<Item['rarity'], RarityColors> = {
  junk: {
    border: '#6B7280',
    bg: 'rgba(107, 114, 128, 0.1)',
    text: '#9CA3AF',
    glow: 'rgba(107, 114, 128, 0.2)',
    gem: '#6B7280',
  },
  common: {
    border: '#9CA3AF',
    bg: 'rgba(156, 163, 175, 0.1)',
    text: '#D1D5DB',
    glow: 'rgba(156, 163, 175, 0.3)',
    gem: '#9CA3AF',
  },
  uncommon: {
    border: '#10B981',
    bg: 'rgba(16, 185, 129, 0.1)',
    text: '#34D399',
    glow: 'rgba(16, 185, 129, 0.4)',
    gem: '#10B981',
  },
  rare: {
    border: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.1)',
    text: '#60A5FA',
    glow: 'rgba(59, 130, 246, 0.5)',
    gem: '#3B82F6',
  },
  epic: {
    border: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.1)',
    text: '#C084FC',
    glow: 'rgba(168, 85, 247, 0.5)',
    gem: '#A855F7',
  },
  legendary: {
    border: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.1)',
    text: '#FBBF24',
    glow: 'rgba(245, 158, 11, 0.6)',
    gem: '#F59E0B',
  },
  mythic: {
    border: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.1)',
    text: '#F9A8D4',
    glow: 'rgba(236, 72, 153, 0.6)',
    gem: '#EC4899',
  },
  artifact: {
    border: '#14B8A6',
    bg: 'rgba(20, 184, 166, 0.1)',
    text: '#5EEAD4',
    glow: 'rgba(20, 184, 166, 0.6)',
    gem: '#14B8A6',
  },
  cursed: {
    border: '#DC2626',
    bg: 'rgba(220, 38, 38, 0.1)',
    text: '#EF4444',
    glow: 'rgba(220, 38, 38, 0.6)',
    gem: '#DC2626',
  },
  set: {
    border: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.1)',
    text: '#A78BFA',
    glow: 'rgba(139, 92, 246, 0.6)',
    gem: '#8B5CF6',
  },
};

interface RarityLabelProps {
  rarity: Item['rarity'];
  text: string;
  isUnique?: boolean;
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
  size = 'md',
  withGlow = true,
  withShimmer = false,
  withPulse = false,
  className = '',
}: RarityLabelProps) {
  const rarityTheme = RARITY_COLORS[rarity];
  const color = isUnique ? '#FFD700' : rarityTheme.text;
  const glowColor = isUnique ? 'rgba(255, 215, 0, 0.5)' : rarityTheme.glow;

  const animations = [];
  if (withPulse || isUnique) animations.push(`${pulse} 2s ease-in-out infinite`);
  if (withGlow) animations.push(`${glow} 2s ease-in-out infinite`);

  return (
    <Box
      className={`rarity-label rarity-label--${rarity}${isUnique ? ' rarity-label--unique' : ''} ${className}`}
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
        {text}
      </Text>
    </Box>
  );
}
