import { Box, Icon, IconButton } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Item } from '@/types'
import { ItemSlot as ItemSlotComponent } from '@/components/ui/ItemSlot'
import { hasUpgradeAvailable, hasCompatibleItems } from '@/utils/equipmentUtils'
import { getSlotById } from '@/config/slotConfig'

const SLOT_ICONS: Record<string, IconType> = {
  weapon: GameIcons.GiSwordman,
  armor: GameIcons.GiChestArmor,
  helmet: GameIcons.GiHelmet,
  boots: GameIcons.GiBootStomp,
  accessory1: GameIcons.GiRing,
  accessory2: GameIcons.GiGemNecklace,
  // Add consumable icons
  consumable1: GameIcons.GiApothecary,
  consumable2: GameIcons.GiApothecary,
  consumable3: GameIcons.GiApothecary,
}

interface EquipmentSlotProps {
  slot: string
  item: Item | null
  availableItems: Item[]
  currentEquipment?: Record<string, Item | null>
  isSwapActive?: boolean
  showSwapButton?: boolean
  onSwapClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function EquipmentSlot({
  slot,
  item,
  availableItems,
  currentEquipment,
  isSwapActive = false,
  showSwapButton = false,
  onSwapClick,
  size = 'md'
}: EquipmentSlotProps) {
  const slotDef = getSlotById(slot)
  const SlotIcon = SLOT_ICONS[slot] || GameIcons.GiSquare
  const slotName = slotDef?.name || slot
  const isEmpty = !item
  const hasUpgrade = hasUpgradeAvailable(slot, item, availableItems, currentEquipment)
  const canSwap = hasCompatibleItems(slot, availableItems, currentEquipment)
  const slotSize = size === 'lg' ? 'var(--item-slot-md)' : size === 'sm' ? 'var(--item-slot-sm)' : 'var(--item-slot-md)'

  // Debug logging
  if (showSwapButton) {
    console.log('[EquipmentSlot]', slot, '- canSwap:', canSwap, 'availableItems:', availableItems.length, 'showSwapButton:', showSwapButton, 'onSwapClick:', !!onSwapClick)
  }

  if (isEmpty) {
    return (
      <Box position="relative" w={slotSize} h={slotSize}>
        <Box
          w={slotSize}
          h={slotSize}
          bg="gray.900"
          borderWidth="2px"
          borderColor={isSwapActive ? "orange.400" : "gray.700"}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor={canSwap && onSwapClick ? "pointer" : "default"}
          _hover={{ borderColor: isSwapActive ? "orange.300" : canSwap ? "gray.600" : "gray.700" }}
          title={slotName}
          onClick={canSwap && onSwapClick ? onSwapClick : undefined}
        >
          <Icon as={SlotIcon} boxSize={8} color="gray.600" />
        </Box>
        {canSwap && (
          <Icon
            as={GameIcons.GiUpgrade}
            position="absolute"
            top="2px"
            left="50%"
            transform="translateX(-50%)"
            color="gold"
            boxSize={5}
            filter="drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))"
            zIndex={2}
          />
        )}
        {showSwapButton && canSwap && onSwapClick && (
          <IconButton
            aria-label="Swap equipment"
            icon={<Icon as={GameIcons.GiBattleGear} boxSize={5} />}
            size="sm"
            position="absolute"
            bottom="0"
            left="0"
            colorScheme={isSwapActive ? "orange" : "gray"}
            variant="solid"
            onClick={(e) => {
              console.log('[EquipmentSlot] Swap button clicked for slot:', slot)
              e.stopPropagation()
              onSwapClick()
            }}
            zIndex={3}
            minW="clamp(24px, 2.5vw, 32px)"
            h="clamp(24px, 2.5vw, 32px)"
            p={0}
            borderRadius="md"
          />
        )}
      </Box>
    )
  }

  return (
    <Box position="relative" w={slotSize} h={slotSize} title={slotName}>
      <Box
        borderWidth="2px"
        borderColor={isSwapActive ? "orange.400" : "transparent"}
        borderRadius="md"
        h={slotSize}
        w={slotSize}
      >
        <ItemSlotComponent item={item} isClickable={true} size={size} />
      </Box>
      {hasUpgrade && (
        <Icon
          as={GameIcons.GiUpgrade}
          position="absolute"
          top="2px"
          left="50%"
          transform="translateX(-50%)"
          color="gold"
          boxSize={5}
          filter="drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))"
          zIndex={2}
        />
      )}
      {showSwapButton && canSwap && onSwapClick && (
        <IconButton
          aria-label="Swap equipment"
          icon={<Icon as={GameIcons.GiCardExchange} boxSize={5} />}
          size="sm"
          position="absolute"
          bottom="0"
          left="0"
          colorScheme={isSwapActive ? "orange" : "gray"}
          variant="solid"
          onClick={(e) => {
            console.log('[EquipmentSlot] Swap button clicked for slot:', slot)
            e.stopPropagation()
            onSwapClick()
          }}
          zIndex={3}
          minW="clamp(24px, 2.5vw, 32px)"
          h="clamp(24px, 2.5vw, 32px)"
          p={0}
          borderRadius="md"
        />
      )}
    </Box>
  )
}
