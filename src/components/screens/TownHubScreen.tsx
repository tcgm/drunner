import React from 'react'
import './TownHubScreen.css'
import { Box, Flex, VStack, Heading, Text, Icon, HStack, Tooltip, useDisclosure, IconButton, Switch, FormControl, FormLabel } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { 
  GiTowerFlag, GiTwoCoins, GiPowder, GiStarsStack
} from 'react-icons/gi'
import { FaArrowLeft } from 'react-icons/fa'
import { GAME_CONFIG } from '@/config/gameConfig'
import { useMusicContext } from '@/utils/useMusicContext'
import { MusicContext } from '@/types/audio'
import { useGameStore } from '@/core/gameStore'
import { PotionShopModal } from '../party/PotionShopModal'
import { MarketHallModal } from '../party/MarketHallModal'
import { BankInventoryModal } from '../party/BankInventoryModal'
import { OverflowInventoryModal } from '../party/OverflowInventoryModal'
import BuyBankSlotsModal from '../party/BuyBankSlotsModal'
import { townLayout, townGridCols, townGridRowSizes, townRowDepthScale, mobileTownGridCols, mobileTownGridRowSizes, type Building } from '@/data/buildings'
import type { Consumable, Item } from '@/types'
import { useBankShopHandlers } from '@/hooks/useBankShopHandlers'

interface TownHubScreenProps {
  onEnterDungeon: () => void
  onBack: () => void
}

const MotionBox = motion.create(Box)
const MotionFlex = motion.create(Flex)

export default function TownHubScreen({ onEnterDungeon, onBack }: TownHubScreenProps) {
  // Set town music
  useMusicContext(MusicContext.MAIN_MENU)

  // Mobile portrait detection
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth <= 768)
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const gridCols = isMobile ? mobileTownGridCols : townGridCols
  const gridRowSizes = isMobile ? mobileTownGridRowSizes : townGridRowSizes

  // Game store
  const {
    bankGold, alkahest, metaXp, party, purchasePotion, spendBankGold,
    bankInventory, bankStorageSlots,
    overflowInventory, dungeon,
    keepOverflowItem, discardOverflowItem, clearOverflow, expandBankStorage,
    finalizeRunItemTransfer,
  } = useGameStore()

  // On mount: finalize any stranded dungeon item transfer, then surface overflow modal
  const { isOpen: isOverflowOpen, onOpen: onOverflowOpen, onClose: onOverflowClose } = useDisclosure()

  React.useEffect(() => {
    if (dungeon.inventory.length > 0) {
      finalizeRunItemTransfer()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (overflowInventory.length > 0) {
      onOverflowOpen()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overflowInventory.length])

  // development grid debug
  const devMode = import.meta.env.DEV
  const [showGrid, setShowGrid] = React.useState(false)

  // Shop modal
  const { isOpen: isShopOpen, onOpen: onShopOpen, onClose: onShopClose } = useDisclosure()

  // Market Hall modal
  const { isOpen: isMarketOpen, onOpen: onMarketOpen, onClose: onMarketClose } = useDisclosure()

  // Bank modal
  const { isOpen: isBankOpen, onOpen: onBankOpen, onClose: onBankClose } = useDisclosure()

  const handleBuildingClick = (buildingId: string) => {
    switch (buildingId) {
      case 'shop':
        onShopOpen()
        break
      case 'market':
        onMarketOpen()
        break
      case 'bank':
        onBankOpen()
        break
      case 'forge':
        // TODO: Open forge when implemented
        break
      case 'tower':
        // TODO: Open arcane tower when implemented
        break
    }
  }

  const handlePurchasePotion = (potion: Consumable) => {
    purchasePotion(potion)
  }

  const { handlePurchaseItem, handleExpandBank, isBuySlotsOpen, onBuySlotsClose } = useBankShopHandlers()

  return (
    <Box className="town-hub-screen" position="relative" h="100vh" overflow="hidden">
      {/* Sky gradient at top */}
      <Box 
        className="town-hub-sky"
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="60%"
        bgGradient="linear(to-b, #1a365d, #2d3748, #4a5568)"
        pointerEvents="none"
      />

      {/* Ground at bottom - extends to last grid row */}
      <Box 
        className="town-hub-ground"
        position="absolute"
        top="40%"
        left={0}
        right={0}
        bottom={0}
        bgGradient="linear(to-b, #2d3015, #1a1a0d)"
        pointerEvents="none"
        zIndex={1}
      />

      {/* Horizon line */}
      <Box 
        position="absolute"
        top="60%"
        left={0}
        right={0}
        height="2px"
        bgGradient="linear(to-r, transparent, orange.600, transparent)"
        opacity={0.3}
        pointerEvents="none"
      />

      <Flex 
        className="town-hub-container"
        direction="column" 
        h="full" 
        position="relative"
        overflow="hidden"
      >
        {/* Header (overlay) */}
        <Box 
          className="town-hub-header"
          p={4} 
          textAlign="center" 
          zIndex={200}
          // bg="rgba(0, 0, 0, 0.5)"
          bg="transparent"
          backdropFilter="blur(4px)"
          position="absolute"
          top={0}
          left={0}
          right={0}
        >
          {devMode && (
            <FormControl display="inline-flex" alignItems="center" position="absolute" top={4} right={4} w={"4rem"}>
              <FormLabel htmlFor="grid-toggle" mb="0" mr={2} fontSize="xs" color="gray.300">
                Grid&nbsp;
              </FormLabel>
              <Switch
                id="grid-toggle"
                size="sm"
                isChecked={showGrid}
                onChange={() => setShowGrid(prev => !prev)}
              />
            </FormControl>
          )}
          {/* Back button - floating top-right */}
          <IconButton
            aria-label="Back to main menu"
            icon={<FaArrowLeft />}
            onClick={onBack}
            position="absolute"
            top={4}
            left={4}
            size="sm"
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'white', bg: 'rgba(255, 255, 255, 0.1)' }}
            zIndex={101}
          >
            <Text fontSize="xs">Back</Text>
          </IconButton>
          <Heading size="lg" color="gold">Adventurer's Haven</Heading>
          <Text fontSize="sm" color="gray.400" mt={1}>
            Prepare yourself for the dungeon ahead
          </Text>
          {/* Resource trackers */}
          <HStack spacing={3} justify="center" mt={2}>
            <Tooltip label="Bank Gold" placement="bottom" hasArrow>
              <HStack spacing={1} bg="blackAlpha.500" px={3} py={1} borderRadius="md" cursor="default">
                <Icon as={GiTwoCoins} color={GAME_CONFIG.colors.gold.light} boxSize={4} />
                <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.gold.light}>{bankGold.toLocaleString()}</Text>
              </HStack>
            </Tooltip>
            <Tooltip label="Alkahest" placement="bottom" hasArrow>
              <HStack spacing={1} bg="blackAlpha.500" px={3} py={1} borderRadius="md" cursor="default">
                <Icon as={GiPowder} color={GAME_CONFIG.colors.alkahest.light} boxSize={4} />
                <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.alkahest.light}>{alkahest.toLocaleString()}</Text>
              </HStack>
            </Tooltip>
            <Tooltip label="Meta XP" placement="bottom" hasArrow>
              <HStack spacing={1} bg="blackAlpha.500" px={3} py={1} borderRadius="md" cursor="default">
                <Icon as={GiStarsStack} color={GAME_CONFIG.colors.xp.light} boxSize={4} />
                <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.xp.light}>{metaXp.toLocaleString()}</Text>
              </HStack>
            </Tooltip>
          </HStack>
        </Box>

        {/* Town Square - grid-based 2.5D space */}
        <Box 
          className="town-square"
          flex={1}
          position="relative"
        >
          <Box
            className="town-grid"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gridTemplateRows: gridRowSizes.join(' '),
            }}
          >
            {/* optional debug overlay sits separately so it doesn't affect layout */}
            {showGrid && (
              <Box className="grid-overlay">
                {Array.from({ length: gridCols }).map((_, i) => {
                  const col = i + 1
                  const row = gridRowSizes.length // front (ground) row
                  return (
                    <Box
                      key={`cell-${i}`}
                      className="grid-cell"
                      style={{ gridColumn: col, gridRow: row }}
                    />
                  )
                })}
              </Box>
            )}
            {/* Far background castle occupying full width */}
            {/* (castle is now a building in townLayout) */}

            {/* Far background tower on right */}
            <MotionBox
              className="building-tower-back row-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Icon as={GiTowerFlag} boxSize="70px" color="gray.600" filter="blur(1px)" />
            </MotionBox>

            {/* Back row - coming soon buildings */}
            {/* Midground buildings */}
            {/* Front row buildings */}
            {townLayout.map(({ building, col, row, side, colSpan, decorative, opacity: placementOpacity, action, mobile }, i) => {
              const placement = isMobile && mobile ? mobile : { col, row, colSpan }
              if (placement.hidden) return null
              const effectiveRow = placement.row
              return (
                <BuildingCard
                  key={building.id}
                  {...building}
                  className={`building-${building.id}`}
                  side={side}
                  index={i}
                  depthScale={townRowDepthScale[effectiveRow] ?? 1}
                  decorative={decorative}
                  opacity={placementOpacity}
                  style={{
                    gridColumn: placement.colSpan ? `${placement.col} / span ${placement.colSpan}` : placement.col,
                    gridRow: effectiveRow,
                  }}
                  onClick={action === 'enter-dungeon' ? onEnterDungeon : () => handleBuildingClick(building.id)}
                />
              )
            })}
          </Box>
        </Box>
      </Flex>

      {/* Potion Shop Modal */}
      <PotionShopModal
        isOpen={isShopOpen}
        onClose={onShopClose}
        bankGold={bankGold}
        party={party}
        onPurchase={handlePurchasePotion}
        onPurchaseItem={handlePurchaseItem}
        onSpendGold={spendBankGold}
        bankInventory={bankInventory}
        bankStorageSlots={bankStorageSlots}
      />

      {/* Market Hall Modal */}
      <MarketHallModal
        isOpen={isMarketOpen}
        onClose={onMarketClose}
        bankGold={bankGold}
        party={party}
        onPurchase={handlePurchasePotion}
        onSpendGold={spendBankGold}
      />

      {/* Bank Inventory Modal */}
      <BankInventoryModal
        isOpen={isBankOpen}
        onClose={onBankClose}
        bankInventory={bankInventory}
        pendingSlot={null}
        onEquipItem={() => {}} // No equipping from town hub bank
        selectedHeroIndex={null}
        party={party}
      />

      {/* Buy Bank Slots Modal */}
      <BuyBankSlotsModal
        isOpen={isBuySlotsOpen}
        onClose={onBuySlotsClose}
        onConfirm={handleExpandBank}
        bankGold={bankGold}
        currentSlots={bankStorageSlots}
      />

      {/* Overflow Inventory Modal - shown when last run items exceeded bank capacity */}
      <OverflowInventoryModal
        isOpen={isOverflowOpen}
        onClose={onOverflowClose}
        overflowInventory={overflowInventory}
        bankInventory={bankInventory}
        bankStorageSlots={bankStorageSlots}
        bankGold={bankGold}
        onExpandBank={expandBankStorage}
        onKeepItem={keepOverflowItem}
        onDiscardItem={discardOverflowItem}
        onClearAll={clearOverflow}
      />
    </Box>
  )
}

interface BuildingCardProps extends Building {
  side: 'left' | 'right'
  index: number
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  decorative?: boolean
  opacity?: number
  depthScale?: number
}

function BuildingCard({ icon, label, color, disabled = false, sizeMultiplier = 1, labelSize, side, index, onClick, className, style, decorative = false, opacity: opacityProp, depthScale = 1 }: BuildingCardProps) {
  const effectiveOpacity = opacityProp ?? (disabled ? 0.5 : 1)
  const buildingVariants = {
    hidden: { 
      scale: depthScale * 0.8, 
      opacity: 0,
      y: 30
    },
    visible: { 
      scale: depthScale,
      opacity: effectiveOpacity,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
        delay: 0.3 + index * 0.15
      }
    }
  }

  return (
    <MotionFlex
      className={`building-card building-card-${side} ${className || ''}`}
      direction="column"
      align="center"
      cursor={disabled || decorative ? 'default' : 'pointer'}
      onClick={disabled || decorative ? undefined : onClick}
      _hover={disabled || decorative ? {} : {
        filter: `drop-shadow(0 15px 40px ${color}70)`,
      }}
      whileHover={disabled || decorative ? {} : {
        scale: depthScale * 1.15,
        y: -12,
        rotateY: side === 'left' ? 3 : -3,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      variants={buildingVariants}
      initial="hidden"
      animate="visible"
      style={{ transformStyle: 'preserve-3d', ...style }}
    >
      {/* Fixed-size 120px container so the card layout never shifts regardless of sizeMultiplier */}
      <Box position="relative" boxSize="120px" flexShrink={0} mb={2} overflow="visible" display="flex" alignItems="center" justifyContent="center">
        {/* Scale + tilt wrapper  -  owns transform so svg bob animation doesn't fight scale */}
        <Box
          className="icon-scale-wrapper"
          style={{
            transform: `scale(${sizeMultiplier})`,
            transformOrigin: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {typeof icon === 'string' ? (
            <Box
              as="img"
              src={icon}
              boxSize="120px"
              style={{
                filter: decorative
                  ? 'blur(1.5px) grayscale(30%)'
                  : disabled
                  ? 'grayscale(80%) opacity(0.5)'
                  : `drop-shadow(0 4px 12px ${color}50)`,
              }}
            />
          ) : (
            <Icon 
              as={icon}
              boxSize="120px"
              color={decorative ? 'gray.500' : disabled ? 'gray.600' : color}
              filter={decorative ? 'blur(1.5px)' : disabled ? 'grayscale(80%)' : `drop-shadow(0 4px 12px ${color}50)`}
            />
          )}
        </Box>
      </Box>
      {!decorative && (
        <>
          <Text 
            fontSize={labelSize ?? 'sm'} 
            fontWeight="bold" 
            color={disabled ? 'gray.500' : 'white'}
            textAlign="center"
            textShadow={disabled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.8)'}
          >
            {label}
          </Text>
          {disabled && (
            <Text 
              position="absolute"
              top="-10px"
              right="-10px"
              fontSize="2xs"
              color="gray.500"
              bg="rgba(0, 0, 0, 0.9)"
              px={2}
              py={1}
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.700"
            >
              Soon
            </Text>
          )}
        </>
      )}
    </MotionFlex>
  )
}
