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
import { GiSwapBag, GiTwoCoins } from 'react-icons/gi'
import { useState, useMemo, useEffect } from 'react'
import { GAME_CONFIG } from '@/config/gameConfig'

interface BuyBankSlotsModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (slots: number) => void
    bankGold: number
    currentSlots: number
}

export default function BuyBankSlotsModal({
    isOpen,
    onClose,
    onConfirm,
    bankGold,
    currentSlots,
}: BuyBankSlotsModalProps) {
    const [selectedSlots, setSelectedSlots] = useState(5)

    // Reset to 5 when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedSlots(5)
        }
    }, [isOpen])

    // Calculate gold cost
    const goldCost = useMemo(() => {
        return selectedSlots * GAME_CONFIG.bank.costPerSlot
    }, [selectedSlots])

    const canAfford = goldCost <= bankGold

    // Calculate max affordable slots
    const maxAffordableSlots = useMemo(() => {
        return Math.floor(bankGold / GAME_CONFIG.bank.costPerSlot)
    }, [bankGold])

    const handleConfirm = () => {
        if (canAfford && selectedSlots > 0) {
            onConfirm(selectedSlots)
            onClose()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent bg="gray.800" borderWidth="2px" borderColor="purple.400">
                <ModalHeader color="purple.400">
                    <HStack>
                        <Icon as={GiSwapBag} boxSize={6} />
                        <Text>Buy Bank Slots</Text>
                    </HStack>
                </ModalHeader>

                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {/* Current Bank Info */}
                        <Box bg="gray.900" p={3} borderRadius="md">
                            <HStack justify="space-between" mb={2}>
                                <Text fontSize="sm" color="gray.400">
                                    Current Slots:
                                </Text>
                                <Text fontSize="sm" fontWeight="bold" color="orange.300">
                                    {currentSlots}
                                </Text>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.400">
                                    Cost per Slot:
                                </Text>
                                <HStack>
                                    <Icon as={GiTwoCoins} color="yellow.400" boxSize={3} />
                                    <Text fontSize="sm" fontWeight="bold" color="yellow.400">
                                        {GAME_CONFIG.bank.costPerSlot.toLocaleString()}
                                    </Text>
                                </HStack>
                            </HStack>
                        </Box>

                        <Divider borderColor="gray.700" />

                        {/* Slots Selector */}
                        <VStack spacing={2}>
                            <Text fontSize="sm" color="gray.400">
                                Number of Slots to Buy
                            </Text>
                            <HStack spacing={2} w="full" justify="center">
                                <IconButton
                                    aria-label="Decrease slots"
                                    icon={<Text fontSize="xl">−</Text>}
                                    onClick={() => setSelectedSlots(Math.max(1, selectedSlots - 1))}
                                    isDisabled={selectedSlots <= 1}
                                    colorScheme="purple"
                                    variant="outline"
                                />
                                <NumberInput
                                    value={selectedSlots}
                                    onChange={(_, num) => {
                                        if (!isNaN(num)) {
                                            setSelectedSlots(Math.max(1, Math.min(1000, num)))
                                        }
                                    }}
                                    min={1}
                                    max={1000}
                                    w="clamp(100px, 12vw, 140px)"
                                    onWheel={(e) => {
                                        e.preventDefault()
                                        const delta = e.deltaY > 0 ? -1 : 1
                                        setSelectedSlots((prev) =>
                                            Math.max(1, Math.min(1000, prev + delta))
                                        )
                                    }}
                                >
                                    <NumberInputField
                                        textAlign="center"
                                        fontWeight="bold"
                                        fontSize="xl"
                                        color="purple.300"
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper borderColor="gray.600" />
                                        <NumberDecrementStepper borderColor="gray.600" />
                                    </NumberInputStepper>
                                </NumberInput>
                                <IconButton
                                    aria-label="Increase slots"
                                    icon={<Text fontSize="xl">+</Text>}
                                    onClick={() =>
                                        setSelectedSlots(Math.min(1000, selectedSlots + 1))
                                    }
                                    isDisabled={selectedSlots >= 1000}
                                    colorScheme="purple"
                                    variant="outline"
                                />
                            </HStack>
                            {selectedSlots > maxAffordableSlots && maxAffordableSlots > 0 && (
                                <Text fontSize="xs" color="yellow.400">
                                    Max affordable: {maxAffordableSlots} slots
                                </Text>
                            )}
                        </VStack>

                        <Divider borderColor="gray.700" />

                        {/* Cost Display */}
                        <Box bg="gray.900" p={3} borderRadius="md">
                            <HStack justify="space-between" mb={2}>
                                <HStack>
                                    <Icon as={GiTwoCoins} color="yellow.400" />
                                    <Text fontSize="sm" color="gray.400">
                                        Total Cost:
                                    </Text>
                                </HStack>
                                <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color={canAfford ? 'green.400' : 'red.400'}
                                >
                                    {goldCost.toLocaleString()}
                                </Text>
                            </HStack>
                            <HStack justify="space-between" mb={2}>
                                <Text fontSize="sm" color="gray.400">
                                    Available Gold:
                                </Text>
                                <Text fontSize="sm" color="gray.300">
                                    {bankGold.toLocaleString()}
                                </Text>
                            </HStack>
                            <Divider borderColor="gray.700" my={2} />
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.400">
                                    New Total Slots:
                                </Text>
                                <Text fontSize="sm" fontWeight="bold" color="purple.300">
                                    {currentSlots + selectedSlots}
                                </Text>
                            </HStack>
                        </Box>

                        {!canAfford && (
                            <Text fontSize="sm" color="red.400" textAlign="center">
                                Not enough gold!
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
                            colorScheme="purple"
                            onClick={handleConfirm}
                            isDisabled={!canAfford || selectedSlots <= 0}
                            leftIcon={<Icon as={GiSwapBag} />}
                        >
                            Buy {selectedSlots} Slot{selectedSlots !== 1 ? 's' : ''}
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
