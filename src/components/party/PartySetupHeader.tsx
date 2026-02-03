import { GAME_CONFIG } from '@/config/gameConfig'
import { Box, HStack, Heading, Text, Button, Icon } from '@chakra-ui/react'
import { GiShop, GiShoppingCart } from 'react-icons/gi'

interface PartySetupHeaderProps {
  bankGold: number
  metaXp: number
  onBack: () => void
  onStart: () => void
  onOpenShop: () => void
  canStart: boolean
}

export function PartySetupHeader({ bankGold, metaXp, onBack, onStart, onOpenShop, canStart }: PartySetupHeaderProps) {
  return (
    <Box className="party-setup-header" bg="gray.950" borderBottom="2px solid" borderColor="orange.800" px={4} py={2} flexShrink={0}>
      <HStack className="party-setup-header-content" justify="space-between">
        <HStack className="party-setup-header-info" spacing={4}>
          <Heading size="sm" color="orange.400">Assemble Your Party</Heading>
          <HStack className="party-setup-header-gold" spacing={2} bg="gray.800" px={3} py={1} borderRadius="md">
            <Text fontSize="xs" color="gray.400">Bank Gold:</Text>
            <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.gold.light}>{bankGold}</Text>
          </HStack>
          <HStack className="party-setup-header-metaxp" spacing={2} bg="gray.800" px={3} py={1} borderRadius="md">
            <Text fontSize="xs" color="gray.400">Meta XP:</Text>
            <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.xp.light}>{metaXp}</Text>
          </HStack>
        </HStack>
        <HStack className="party-setup-header-actions" spacing={2}>
          <Button 
            variant="outline" 
            colorScheme="purple" 
            onClick={onOpenShop} 
            size="sm"
            leftIcon={<Icon as={GiShop} />}
          >
            Shop
          </Button>
          <Button variant="outline" colorScheme="gray" onClick={onBack} size="xs">
            Back
          </Button>
          <Button 
            colorScheme="orange" 
            onClick={onStart}
            isDisabled={!canStart}
            size="sm"
            px={6}
          >
            Enter Dungeon
          </Button>
        </HStack>
      </HStack>
    </Box>
  )
}
