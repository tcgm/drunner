import { 
  IconButton, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  VStack,
  Button,
  Text,
  Divider,
  useDisclosure,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiWrench } from 'react-icons/gi'
import { useGameStore } from '@store/gameStore'
import { GAME_CONFIG } from '@/config/game'
import { useRef, useState } from 'react'

type ConfirmAction = 'reset-heroes' | 'apply-penalty' | 'reset-game' | null

export default function DevTools() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { party, dungeon, resetGame, startDungeon, endGame } = useGameStore()
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Only show in development
  if (import.meta.env.PROD) return null

  const handleResetHeroes = () => {
    const resetParty = party.map(hero => ({
      ...hero,
      level: 1,
      xp: 0,
      stats: {
        hp: hero.class.baseStats.attack * 10 + 50,
        maxHp: hero.class.baseStats.attack * 10 + 50,
        attack: hero.class.baseStats.attack,
        defense: hero.class.baseStats.defense,
        speed: hero.class.baseStats.speed,
        luck: hero.class.baseStats.luck,
        magicPower: hero.class.baseStats.magicPower,
      },
      isAlive: true,
    }))
    useGameStore.setState({ party: resetParty })
    setConfirmAction(null)
  }

  const handleReviveAll = () => {
    const revivedParty = party.map(hero => ({
      ...hero,
      isAlive: true,
      stats: {
        ...hero.stats,
        hp: hero.stats.maxHp,
      },
    }))
    useGameStore.setState({ party: revivedParty })
  }

  const handleHealAll = () => {
    const healedParty = party.map(hero => ({
      ...hero,
      stats: {
        ...hero.stats,
        hp: hero.stats.maxHp,
      },
    }))
    useGameStore.setState({ party: healedParty })
  }

  const handleLevelUp = () => {
    const leveledParty = party.map(hero => ({
      ...hero,
      level: Math.min(GAME_CONFIG.levelUp.maxLevel, hero.level + 1),
      stats: {
        ...hero.stats,
        attack: hero.stats.attack + GAME_CONFIG.statGains.attack,
        defense: hero.stats.defense + GAME_CONFIG.statGains.defense,
        speed: hero.stats.speed + GAME_CONFIG.statGains.speed,
        luck: hero.stats.luck + GAME_CONFIG.statGains.luck,
        maxHp: hero.stats.maxHp + GAME_CONFIG.statGains.maxHp,
      },
    }))
    useGameStore.setState({ party: leveledParty })
  }

  const handleAddGold = (amount: number) => {
    useGameStore.setState({ 
      dungeon: { 
        ...dungeon, 
        gold: dungeon.gold + amount 
      } 
    })
  }

  const handleApplyDeathPenalty = () => {
    endGame()
    startDungeon()
    setConfirmAction(null)
  }

  const handleResetGameConfirm = () => {
    resetGame()
    setConfirmAction(null)
  }

  const getConfirmMessage = () => {
    switch (confirmAction) {
      case 'reset-heroes':
        return 'Reset all heroes to level 1? This will clear all progress and stats.'
      case 'apply-penalty':
        return 'Apply death penalty? This will apply the configured penalty to all heroes.'
      case 'reset-game':
        return 'Reset entire game? This will clear all progress, party, and return to initial state.'
      default:
        return ''
    }
  }

  const handleConfirm = () => {
    switch (confirmAction) {
      case 'reset-heroes':
        handleResetHeroes()
        break
      case 'apply-penalty':
        handleApplyDeathPenalty()
        break
      case 'reset-game':
        handleResetGameConfirm()
        break
    }
  }

  const handleAdvanceFloor = (floors: number) => {
    useGameStore.setState({
      dungeon: {
        ...dungeon,
        depth: dungeon.depth + floors,
      }
    })
  }

  return (
    <>
      <Box position="fixed" bottom={4} right={4} zIndex={9999}>
        <IconButton
          aria-label="Dev Tools"
          icon={<Icon as={GiWrench} boxSize={6} />}
          size="lg"
          colorScheme="yellow"
          onClick={onOpen}
          variant="solid"
        />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader color="yellow.400">Dev Tools</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="bold" color="gray.400">
                Party Management
              </Text>
              <Button size="sm" colorScheme="blue" onClick={() => setConfirmAction('reset-heroes')}>
                Reset All Heroes to Level 1
              </Button>
              <Button size="sm" colorScheme="green" onClick={handleReviveAll}>
                Revive All Dead Heroes
              </Button>
              <Button size="sm" colorScheme="green" onClick={handleHealAll}>
                Heal All to Full HP
              </Button>
              <Button size="sm" colorScheme="purple" onClick={handleLevelUp}>
                Level Up All Heroes (+1)
              </Button>

              <Divider my={2} />

              <Text fontSize="sm" fontWeight="bold" color="gray.400">
                Resources
              </Text>
              <Button size="sm" colorScheme="yellow" onClick={() => handleAddGold(1000)}>
                Add 1000 Gold
              </Button>
              <Button size="sm" colorScheme="yellow" onClick={() => handleAddGold(-500)}>
                Remove 500 Gold
              </Button>

              <Divider my={2} />

              <Text fontSize="sm" fontWeight="bold" color="gray.400">
                Dungeon Control
              </Text>
              <Button size="sm" colorScheme="cyan" onClick={() => handleAdvanceFloor(5)}>
                Advance +5 Floors
              </Button>
              <Button size="sm" colorScheme="cyan" onClick={() => handleAdvanceFloor(-5)}>
                Go Back -5 Floors
              </Button>
              <Button size="sm" colorScheme="red" onClick={() => setConfirmAction('apply-penalty')}>
                Apply Death Penalty
              </Button>

              <Divider my={2} />

              <Text fontSize="sm" fontWeight="bold" color="gray.400">
                Game State
              </Text>
              <Button size="sm" colorScheme="red" variant="outline" onClick={() => setConfirmAction('reset-game')}>
                Reset Entire Game
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={confirmAction !== null}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmAction(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="orange.400">
              Confirm Action
            </AlertDialogHeader>

            <AlertDialogBody color="gray.300">
              {getConfirmMessage()}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirmAction(null)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleConfirm} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
