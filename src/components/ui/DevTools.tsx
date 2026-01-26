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
import { GAME_CONFIG } from '@/config/gameConfig'
import { useRef, useState } from 'react'
import { HiWrench } from 'react-icons/hi2'
import type { Hero } from '@/types'

type ConfirmAction = 'reset-heroes' | 'apply-penalty' | 'reset-game' | null

export default function DevTools() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { party, dungeon, resetGame, applyPenalty, listBackups, restoreFromBackup } = useGameStore()
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [backups, setBackups] = useState<string[]>([])
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Only show in development
  if (import.meta.env.PROD) return null

  const handleResetHeroes = () => {
    const state = useGameStore.getState()
    const resetParty = party.filter((hero): hero is Hero => hero !== null).map(hero => ({
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
    // Update roster as well
    const resetRoster = state.heroRoster.map(rosterHero => {
      const resetVersion = resetParty.find(h => h.id === rosterHero.id)
      return resetVersion ?? rosterHero
    })
    useGameStore.setState({ party: resetParty as (Hero | null)[], heroRoster: resetRoster })
    setConfirmAction(null)
  }

  const handleReviveAll = () => {
    const state = useGameStore.getState()
    const revivedParty = party.filter((hero): hero is Hero => hero !== null).map(hero => ({
      ...hero,
      isAlive: true,
      stats: {
        ...hero.stats,
        hp: hero.stats.maxHp,
      },
    }))
    // Update roster as well
    const revivedRoster = state.heroRoster.map(rosterHero => {
      const revivedVersion = revivedParty.find(h => h.id === rosterHero.id)
      return revivedVersion ?? rosterHero
    })
    useGameStore.setState({ party: revivedParty as (Hero | null)[], heroRoster: revivedRoster })
  }

  const handleHealAll = () => {
    const state = useGameStore.getState()
    const healedParty = party.filter((hero): hero is Hero => hero !== null).map(hero => ({
      ...hero,
      stats: {
        ...hero.stats,
        hp: hero.stats.maxHp,
      },
    }))
    // Update roster as well
    const healedRoster = state.heroRoster.map(rosterHero => {
      const healedVersion = healedParty.find(h => h.id === rosterHero.id)
      return healedVersion ?? rosterHero
    })
    useGameStore.setState({ party: healedParty as (Hero | null)[], heroRoster: healedRoster })
  }

  const handleLevelUp = () => {
    const state = useGameStore.getState()
    const leveledParty = party.filter((hero): hero is Hero => hero !== null).map(hero => ({
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
    // Update roster as well
    const leveledRoster = state.heroRoster.map(rosterHero => {
      const leveledVersion = leveledParty.find(h => h.id === rosterHero.id)
      return leveledVersion ?? rosterHero
    })
    useGameStore.setState({ party: leveledParty as (Hero | null)[], heroRoster: leveledRoster })
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
    applyPenalty()
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

  const handleLoadBackups = () => {
    const availableBackups = listBackups()
    setBackups(availableBackups)
  }

  const handleRestoreBackup = (backupKey: string) => {
    if (confirm(`Restore backup from ${new Date(parseInt(backupKey.split('-').pop() || '0')).toLocaleString()}?`)) {
      restoreFromBackup(backupKey)
    }
  }

  const formatBackupName = (key: string) => {
    const timestamp = parseInt(key.split('-').pop() || '0')
    return new Date(timestamp).toLocaleString()
  }

  return (
    <>
      <Box position="fixed" bottom={4} right={4} zIndex={9999}>
        <IconButton
          aria-label="Dev Tools"
          icon={<Icon as={HiWrench} boxSize={6} />}
          size="sm"
          colorScheme="yellow"
          onClick={onOpen}
          variant="solid"
        />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="md" scrollBehavior="inside">
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

              <Divider my={2} />

              <Text fontSize="sm" fontWeight="bold" color="gray.400">
                Backup & Recovery
              </Text>
              <Button size="sm" colorScheme="green" onClick={handleLoadBackups}>
                Load Backup List ({backups.length})
              </Button>
              {backups.length > 0 && (
                <VStack align="stretch" spacing={1} maxH="200px" overflowY="auto" bg="gray.900" p={2} borderRadius="md">
                  {backups.map(backup => (
                    <Button
                      key={backup}
                      size="xs"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleRestoreBackup(backup)}
                    >
                      Restore: {formatBackupName(backup)}
                    </Button>
                  ))}
                </VStack>
              )}
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
