import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  Icon,
  Divider,
} from '@chakra-ui/react'
import { Gi3dStairs, GiCrystalShine } from 'react-icons/gi'
import { useState, useMemo, useEffect } from 'react'
import { GAME_CONFIG } from '@/config/gameConfig'
import type { Hero } from '@/types'

interface FloorSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (floor: number) => void
  party: (Hero | null)[]
  alkahest: number
}

export default function FloorSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  party,
  alkahest,
}: FloorSelectionModalProps) {
  const [selectedFloor, setSelectedFloor] = useState(0)

  // Calculate party average level
  const partyAvgLevel = useMemo(() => {
    const activeHeroes = party.filter((h): h is Hero => h !== null)
    if (activeHeroes.length === 0) return 1
    const totalLevel = activeHeroes.reduce((sum, h) => sum + h.level, 0)
    return Math.floor(totalLevel / activeHeroes.length)
  }, [party])

  // Calculate free floor threshold
  const freeFloorThreshold = Math.floor(
    partyAvgLevel * GAME_CONFIG.dungeon.floorUnlockFraction
  )

  // Set selected floor to last free floor when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFloor(freeFloorThreshold)
    }
  }, [isOpen, freeFloorThreshold])

  // Calculate alkahest cost
  const alkahestCost = useMemo(() => {
    if (selectedFloor <= freeFloorThreshold) return 0
    const floorsSkipped = selectedFloor - freeFloorThreshold
    return Math.floor(
      GAME_CONFIG.dungeon.floorSkipBaseCost *
        Math.pow(GAME_CONFIG.dungeon.floorSkipCostMultiplier, floorsSkipped - 1)
    )
  }, [selectedFloor, freeFloorThreshold])

  const canAfford = alkahestCost === 0 || alkahestCost <= alkahest
  const maxAffordableFloor = useMemo(() => {
    let floor = freeFloorThreshold + 1
    let cost = 0
    while (floor <= GAME_CONFIG.dungeon.maxFloors) {
      const floorsSkipped = floor - freeFloorThreshold
      cost = Math.floor(
        GAME_CONFIG.dungeon.floorSkipBaseCost *
          Math.pow(GAME_CONFIG.dungeon.floorSkipCostMultiplier, floorsSkipped - 1)
      )
      if (cost > alkahest) break
      floor++
    }
    return floor - 1
  }, [freeFloorThreshold, alkahest])

  const handleConfirm = () => {
    if (canAfford) {
      onConfirm(selectedFloor)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent bg="gray.800" borderWidth="2px" borderColor="orange.400">
        <ModalHeader color="orange.400">
          <HStack>
            <Icon as={Gi3dStairs} boxSize={6} />
            <Text>Select Starting Floor</Text>
          </HStack>
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Party Info */}
            <Box bg="gray.900" p={3} borderRadius="md">
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.400">
                  Party Average Level:
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="orange.300">
                  Level {partyAvgLevel}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">
                  Free up to Floor:
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="green.400">
                  {freeFloorThreshold}
                </Text>
              </HStack>
            </Box>

            <Divider borderColor="gray.700" />

            {/* Floor Selector */}
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.400">
                Starting Floor
              </Text>
              <HStack spacing={2} w="full" justify="center">
                <IconButton
                  aria-label="Decrease floor"
                  icon={<Text fontSize="xl">−</Text>}
                  onClick={() => setSelectedFloor(Math.max(0, selectedFloor - 1))}
                  isDisabled={selectedFloor <= 0}
                  colorScheme="orange"
                  variant="outline"
                />
                <NumberInput
                  value={selectedFloor}
                  onChange={(_, num) => {
                    if (!isNaN(num)) {
                      setSelectedFloor(Math.max(0, Math.min(GAME_CONFIG.dungeon.maxFloors, num)))
                    }
                  }}
                  min={0}
                  max={GAME_CONFIG.dungeon.maxFloors}
                  w="120px"
                  onWheel={(e) => {
                    e.preventDefault()
                    const delta = e.deltaY > 0 ? -1 : 1
                    setSelectedFloor((prev) =>
                      Math.max(0, Math.min(GAME_CONFIG.dungeon.maxFloors, prev + delta))
                    )
                  }}
                >
                  <NumberInputField
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="xl"
                    color="orange.300"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper borderColor="gray.600" />
                    <NumberDecrementStepper borderColor="gray.600" />
                  </NumberInputStepper>
                </NumberInput>
                <IconButton
                  aria-label="Increase floor"
                  icon={<Text fontSize="xl">+</Text>}
                  onClick={() =>
                    setSelectedFloor(Math.min(GAME_CONFIG.dungeon.maxFloors, selectedFloor + 1))
                  }
                  isDisabled={selectedFloor >= GAME_CONFIG.dungeon.maxFloors}
                  colorScheme="orange"
                  variant="outline"
                />
              </HStack>
              {selectedFloor > maxAffordableFloor && maxAffordableFloor >= freeFloorThreshold && (
                <Text fontSize="xs" color="yellow.400">
                  Max affordable: Floor {maxAffordableFloor}
                </Text>
              )}
            </VStack>

            <Divider borderColor="gray.700" />

            {/* Cost Display */}
            <Box bg="gray.900" p={3} borderRadius="md">
              <HStack justify="space-between" mb={2}>
                <HStack>
                  <Icon as={GiCrystalShine} color="cyan.400" />
                  <Text fontSize="sm" color="gray.400">
                    Alkahest Cost:
                  </Text>
                </HStack>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={alkahestCost === 0 ? 'green.400' : canAfford ? 'cyan.400' : 'red.400'}
                >
                  {alkahestCost === 0 ? 'FREE' : alkahestCost.toLocaleString()}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.400">
                  Available:
                </Text>
                <Text fontSize="sm" color="gray.300">
                  {alkahest.toLocaleString()}
                </Text>
              </HStack>
            </Box>

            {!canAfford && alkahestCost > 0 && (
              <Text fontSize="sm" color="red.400" textAlign="center">
                Not enough alkahest!
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={2}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              onClick={handleConfirm}
              isDisabled={!canAfford}
              leftIcon={<Icon as={Gi3dStairs} />}
            >
              Enter Dungeon
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
