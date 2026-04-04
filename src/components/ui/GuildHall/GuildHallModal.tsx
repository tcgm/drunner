import { useEffect, useState, useMemo } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Flex,
  useToast,
} from '@chakra-ui/react'
import { useGameStore } from '@/core/gameStore'
import { QUEST_CONFIG } from '@/config/questConfig'
import { GuildHallHeader } from './GuildHallHeader'
import { QuestBoard } from './QuestBoard'
import { HeroBoard } from './HeroBoard'
import { RoomScene } from './RoomScene'
import type { Quest } from '@/types/quests'

type GuildPanel = 'quests' | 'heroes'

interface GuildHallModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GuildHallModal({ isOpen, onClose }: GuildHallModalProps) {
  const toast = useToast()

  const heroRoster              = useGameStore(state => state.heroRoster)
  const party                   = useGameStore(state => state.party)
  const bankGold                = useGameStore(state => state.bankGold)
  const metaXp                  = useGameStore(state => state.metaXp)
  const quests                  = useGameStore(state => state.quests)
  const questsLastRefreshed     = useGameStore(state => state.questsLastRefreshed)
  const availableHeroesForHire  = useGameStore(state => state.availableHeroesForHire)
  const heroBoardLastRefreshed  = useGameStore(state => state.heroBoardLastRefreshed)

  const acceptQuest       = useGameStore(state => state.acceptQuest)
  const cancelQuest       = useGameStore(state => state.cancelQuest)
  const claimQuestReward  = useGameStore(state => state.claimQuestReward)
  const refreshQuestBoard = useGameStore(state => state.refreshQuestBoard)
  const refreshHeroBoard  = useGameStore(state => state.refreshHeroBoard)
  const hireHero          = useGameStore(state => state.hireHero)

  const [activePanel, setActivePanel] = useState<GuildPanel>('quests')

  useEffect(() => {
    if (isOpen) {
      refreshQuestBoard()
      refreshHeroBoard()
    }
  }, [isOpen, refreshQuestBoard, refreshHeroBoard])

  const activeQuests = quests.filter(q => q.status === 'active')

  const [openedAt] = useState<number>(() => Date.now())

  const questRefreshLabel = useMemo(() => {
    const ms = Math.max(0, (questsLastRefreshed ?? 0) + QUEST_CONFIG.refreshIntervalHours * QUEST_CONFIG.msPerHour - openedAt)
    if (ms <= 0) return 'Ready'
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    return `${h}h ${m}m`
  }, [questsLastRefreshed, openedAt])

  const heroRefreshLabel = useMemo(() => {
    const FOUR_HOURS = 4 * 60 * 60 * 1000
    const ms = Math.max(0, (heroBoardLastRefreshed ?? 0) + FOUR_HOURS - openedAt)
    if (ms <= 0) return 'Ready'
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    return `${h}h ${m}m`
  }, [heroBoardLastRefreshed, openedAt])

  const handleAccept = (questId: string) => {
    if (activeQuests.length >= QUEST_CONFIG.maxActiveQuests) {
      toast({
        title: 'Quest slots full',
        description: 'You may only hold 3 active quests at a time.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right',
      })
      return
    }
    acceptQuest(questId)
    toast({ title: 'Quest accepted!', status: 'success', duration: 2000, isClosable: true, position: 'bottom-right' })
  }

  const handleCancel = (questId: string) => {
    cancelQuest(questId)
    toast({ title: 'Quest abandoned.', status: 'info', duration: 2000, isClosable: true, position: 'bottom-right' })
  }

  const handleClaim = (quest: Quest) => {
    claimQuestReward(quest.id)
    toast({
      title: 'Reward claimed!',
      description: `+${quest.reward.gold.toLocaleString()}g  ·  +${quest.reward.metaXp.toLocaleString()} Meta XP`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom-right',
    })
  }

  const handleHire = (heroId: string) => {
    const hero = availableHeroesForHire.find(h => h.id === heroId)
    if (!hero) return
    hireHero(heroId)
    toast({
      title: `${hero.name} hired!`,
      description: `${hero.heroClass.name} joined your roster. Find them in the party screen.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'bottom-right',
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside" isCentered>
      <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(8px)" />
      <ModalContent
        bg="gray.950"
        border="1px solid"
        borderColor="orange.900"
        boxShadow="0 0 80px rgba(249,115,22,0.18),inset 0 0 120px rgba(0,0,0,0.6)"
        maxW={{ base: '100vw', md: '98vw' }}
        maxH={{ base: '100vh', md: '96vh' }}
        my={{ base: 0, md: '2vh' }}
        borderRadius={{ base: 0, md: 'xl' }}
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box h="3px" bgGradient="linear(to-r,transparent,orange.700,yellow.500,orange.700,transparent)" flexShrink={0} />
        <GuildHallHeader bankGold={bankGold} metaXp={metaXp} />
        <ModalBody p={0} flex={1} minH={0} overflow="hidden" display="flex">
          <Flex direction={{ base: 'column', md: 'row' }} w="full" flex={1} minH={0} overflow="hidden">
            <Box
              flex={{ base: 'none', md: '1 1 60%' }}
              h={{ base: '35vh', md: '100%' }}
              borderRight={{ base: 'none', md: '1px solid' }}
              borderBottom={{ base: '1px solid', md: 'none' }}
              borderColor="gray.800"
              overflow="hidden"
            >
              <RoomScene
                key={isOpen ? 1 : 0}
                heroRoster={heroRoster}
                party={party}
                isOpen={isOpen}
                activeBoard={activePanel}
                onBoardSelect={setActivePanel}
              />
            </Box>
            {activePanel === 'quests' ? (
              <QuestBoard
                quests={quests}
                onAccept={handleAccept}
                onCancel={handleCancel}
                onClaim={handleClaim}
                refreshLabel={questRefreshLabel}
              />
            ) : (
              <HeroBoard
                availableHeroes={availableHeroesForHire}
                bankGold={bankGold}
                onHire={handleHire}
                refreshLabel={heroRefreshLabel}
                onForceRefresh={() => refreshHeroBoard(true)}
              />
            )}
          </Flex>
        </ModalBody>
        <Box h="2px" bgGradient="linear(to-r,transparent,orange.900,orange.700,orange.900,transparent)" flexShrink={0} />
      </ModalContent>
    </Modal>
  )
}

