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
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import type { IconType } from 'react-icons'

interface QuantityInputModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (amount: number) => void
    title: string
    icon?: IconType
    color?: string
    currentAmount?: number
    showCurrentAmount?: boolean
    defaultAmount?: number
    minAmount?: number
    maxAmount?: number
    allowNegative?: boolean
}

export default function QuantityInputModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    icon,
    color = 'purple',
    currentAmount,
    showCurrentAmount = false,
    defaultAmount = 100,
    minAmount,
    maxAmount = 999999,
    allowNegative = false,
}: QuantityInputModalProps) {
    const [selectedAmount, setSelectedAmount] = useState(defaultAmount)

    // Reset to default when modal opens
    useEffect(() => {
        if (isOpen) {
            // Use queueMicrotask to avoid synchronous setState in effect
            queueMicrotask(() => setSelectedAmount(defaultAmount))
        }
    }, [isOpen, defaultAmount])

    const minValue = allowNegative ? (minAmount ?? -maxAmount) : (minAmount ?? 1)

    const handleConfirm = () => {
        if (selectedAmount !== 0) {
            onConfirm(selectedAmount)
            onClose()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent bg="gray.800" borderWidth="2px" borderColor={`${color}.400`}>
                <ModalHeader color={`${color}.400`}>
                    <HStack>
                        {icon && <Icon as={icon} boxSize={6} />}
                        <Text>{title}</Text>
                    </HStack>
                </ModalHeader>

                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        {/* Current Amount */}
                        {showCurrentAmount && currentAmount !== undefined && (
                            <Box bg="gray.900" p={3} borderRadius="md">
                                <HStack justify="space-between">
                                    <Text fontSize="sm" color="gray.400">
                                        Current Amount:
                                    </Text>
                                    <Text fontSize="sm" fontWeight="bold" color={`${color}.300`}>
                                        {currentAmount.toLocaleString()}
                                    </Text>
                                </HStack>
                            </Box>
                        )}

                        {/* Amount Selector */}
                        <VStack spacing={2}>
                            <Text fontSize="sm" color="gray.400">
                                Amount to {allowNegative && selectedAmount < 0 ? 'Remove' : 'Add'}
                            </Text>
                            <HStack spacing={2} w="full" justify="center">
                                <IconButton
                                    aria-label="Decrease amount"
                                    icon={<Text fontSize="xl">−</Text>}
                                    onClick={() => setSelectedAmount(Math.max(minValue, selectedAmount - 100))}
                                    isDisabled={selectedAmount <= minValue}
                                    colorScheme={color}
                                    variant="outline"
                                />
                                <NumberInput
                                    value={selectedAmount}
                                    onChange={(_, num) => {
                                        if (!isNaN(num)) {
                                            setSelectedAmount(Math.max(minValue, Math.min(maxAmount, num)))
                                        }
                                    }}
                                    min={minValue}
                                    max={maxAmount}
                                    w="clamp(120px, 15vw, 160px)"
                                    onWheel={(e) => {
                                        e.preventDefault()
                                        const delta = e.deltaY > 0 ? -100 : 100
                                        setSelectedAmount((prev) =>
                                            Math.max(minValue, Math.min(maxAmount, prev + delta))
                                        )
                                    }}
                                >
                                    <NumberInputField
                                        textAlign="center"
                                        fontWeight="bold"
                                        fontSize="xl"
                                        color={`${color}.300`}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper borderColor="gray.600" />
                                        <NumberDecrementStepper borderColor="gray.600" />
                                    </NumberInputStepper>
                                </NumberInput>
                                <IconButton
                                    aria-label="Increase amount"
                                    icon={<Text fontSize="xl">+</Text>}
                                    onClick={() =>
                                        setSelectedAmount(Math.min(maxAmount, selectedAmount + 100))
                                    }
                                    isDisabled={selectedAmount >= maxAmount}
                                    colorScheme={color}
                                    variant="outline"
                                />
                            </HStack>

                            {/* Quick amount buttons */}
                            <HStack spacing={2} wrap="wrap" justify="center">
                                {[100, 500, 1000, 5000, 10000].map(amount => (
                                    <Button
                                        key={amount}
                                        size="xs"
                                        variant="outline"
                                        colorScheme={color}
                                        onClick={() => setSelectedAmount(amount)}
                                    >
                                        {amount.toLocaleString()}
                                    </Button>
                                ))}
                            </HStack>
                            {allowNegative && (
                                <HStack spacing={2} wrap="wrap" justify="center">
                                    {[-100, -500, -1000, -5000].map(amount => (
                                        <Button
                                            key={amount}
                                            size="xs"
                                            variant="outline"
                                            colorScheme="red"
                                            onClick={() => setSelectedAmount(amount)}
                                        >
                                            {amount.toLocaleString()}
                                        </Button>
                                    ))}
                                </HStack>
                            )}
                        </VStack>

                        {/* Result Display */}
                        {showCurrentAmount && currentAmount !== undefined && (
                            <Box bg="gray.900" p={3} borderRadius="md">
                                <HStack justify="space-between">
                                    <Text fontSize="sm" color="gray.400">
                                        New Total:
                                    </Text>
                                    <Text fontSize="lg" fontWeight="bold" color={`${color}.300`}>
                                        {(currentAmount + selectedAmount).toLocaleString()}
                                    </Text>
                                </HStack>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme={selectedAmount < 0 ? 'red' : color}
                        onClick={handleConfirm}
                        isDisabled={selectedAmount === 0}
                    >
                        {selectedAmount < 0 ? 'Remove' : 'Add'} {Math.abs(selectedAmount).toLocaleString()}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
