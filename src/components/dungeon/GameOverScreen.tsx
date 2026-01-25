import { VStack, Heading, Button, Text, Flex } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiDeathSkull } from 'react-icons/gi'

interface GameOverScreenProps {
  depth: number
  onExit: () => void
}

export default function GameOverScreen({ depth, onExit }: GameOverScreenProps) {
  return (
    <Flex h="calc(100vh - 4rem)" align="center" justify="center">
      <VStack spacing={6}>
        <Icon as={GiDeathSkull} boxSize={32} color="red.400" />
        <Heading size="2xl" color="red.400">
          Party Defeated
        </Heading>
        <Text fontSize="xl" color="gray.400">
          Your party has fallen on Floor {depth}
        </Text>
        <Text fontSize="md" color="gray.500">
          Return to main menu to try again with penalties
        </Text>
        <Button size="lg" colorScheme="orange" onClick={onExit}>
          Return to Main Menu
        </Button>
      </VStack>
    </Flex>
  )
}
