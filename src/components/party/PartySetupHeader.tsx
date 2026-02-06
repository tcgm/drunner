import { GAME_CONFIG } from '@/config/gameConfig'
import { Box, HStack, Heading, Text, Button, Icon, Tooltip } from '@chakra-ui/react'
import { GiShop, GiShoppingCart, GiChest, GiVikingLonghouse, GiTwoCoins, GiStarsStack, GiPowder } from 'react-icons/gi'

interface PartySetupHeaderProps {
  bankGold: number
  metaXp: number
  alkahest: number
  bankInventory: number
  bankStorageSlots: number
  onBack: () => void
  onStart: () => void
  onOpenShop: () => void
  onOpenMarket: () => void
  onOpenBank: () => void
  canStart: boolean
}

export function PartySetupHeader({ bankGold, metaXp, alkahest, bankInventory, bankStorageSlots, onBack, onStart, onOpenShop, onOpenMarket, onOpenBank, canStart }: PartySetupHeaderProps) {
  return (
    <Box className="party-setup-header" bg="gray.950" borderBottom="2px solid" borderColor="orange.800" px={4} py={2} flexShrink={0}>
      <HStack className="party-setup-header-content" justify="space-between">
        <HStack className="party-setup-header-info" spacing={4}>
          <Heading size="sm" color="orange.400">Assemble Your Party</Heading>
          <Tooltip label="Bank Gold" placement="bottom" hasArrow>
            <HStack className="party-setup-header-gold" spacing={2} bg="gray.800" px={3} py={1} borderRadius="md" cursor="help">
              <Icon as={GiTwoCoins} color={GAME_CONFIG.colors.gold.light} boxSize={4} />
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.gold.light}>{bankGold}</Text>
            </HStack>
          </Tooltip>
          <Tooltip label="Meta XP" placement="bottom" hasArrow>
            <HStack className="party-setup-header-metaxp" spacing={2} bg="gray.800" px={3} py={1} borderRadius="md" cursor="help">
              <Icon as={GiStarsStack} color={GAME_CONFIG.colors.xp.light} boxSize={4} />
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.xp.light}>{metaXp}</Text>
            </HStack>
          </Tooltip>
          <Tooltip label="Alkahest" placement="bottom" hasArrow>
            <HStack className="party-setup-header-alkahest" spacing={2} bg="gray.800" px={3} py={1} borderRadius="md" cursor="help">
              <Icon as={GiPowder} color="purple.400" boxSize={4} />
              <Text fontSize="sm" fontWeight="bold" color="purple.400">{alkahest}</Text>
            </HStack>
          </Tooltip>
        </HStack>
        <HStack className="party-setup-header-actions" spacing={2}>
          <Button 
            variant="outline" 
            colorScheme="blue" 
            onClick={onOpenBank} 
            size="sm"
            leftIcon={<Icon as={GiChest} />}
          >
            Bank ({bankInventory}/{bankStorageSlots})
          </Button>
          <Button 
            variant="outline" 
            colorScheme="purple" 
            onClick={onOpenShop} 
            size="sm"
            leftIcon={<Icon as={GiShop} />}
          >
            Shop
          </Button>
          <Button 
            variant="outline" 
            colorScheme="green" 
            onClick={onOpenMarket} 
            size="sm"
            leftIcon={<Icon as={GiVikingLonghouse} />}
          >
            Market Hall
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
