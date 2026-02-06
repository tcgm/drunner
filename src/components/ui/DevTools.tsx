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
  Select,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiWrench } from 'react-icons/gi'
import { useGameStore } from '@/core/gameStore'
import { GAME_CONFIG } from '@/config/gameConfig'
import { useRef, useState, useMemo } from 'react'
import { HiWrench } from 'react-icons/hi2'
import type { Hero, ItemRarity, ItemSlot, Item } from '@/types'
import { generateItem } from '@/systems/loot/lootGenerator'
import { allBases } from '@/data/items/bases'
import { allMaterials } from '@/data/items/materials'
import { ALL_UNIQUE_ITEMS } from '@/data/items/uniques'
import { ALL_SET_ITEMS } from '@/data/items/sets'
import { levelUpHero } from '@/utils/heroUtils'
import { BOSS_EVENTS } from '@/data/events/boss/normal'

type ConfirmAction = 'reset-heroes' | 'apply-penalty' | 'reset-game' | null

export default function DevTools() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { party, dungeon, resetGame, applyPenalty, listBackups, restoreFromBackup, downloadBackup, activeRun } = useGameStore()
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [backups, setBackups] = useState<string[]>([])
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Item generation state
  const [itemGenType, setItemGenType] = useState<'procedural' | 'material' | 'base' | 'unique' | 'set'>('procedural')
  const [itemType, setItemType] = useState<ItemSlot>('weapon')
  const [itemRarity, setItemRarity] = useState<ItemRarity>('common')
  const [itemDepth, setItemDepth] = useState(1)
  const [selectedMaterial, setSelectedMaterial] = useState(allMaterials[0]?.id ?? '')
  const [selectedBase, setSelectedBase] = useState('')
  const [selectedUnique, setSelectedUnique] = useState(ALL_UNIQUE_ITEMS[0]?.name || '')
  const [selectedSet, setSelectedSet] = useState(ALL_SET_ITEMS[0]?.name || '')

  // Search/filter state
  const [materialSearch, setMaterialSearch] = useState('')
  const [baseSearch, setBaseSearch] = useState('')
  const [uniqueSearch, setUniqueSearch] = useState('')
  const [setSearch, setSetSearch] = useState('')

  // Filtered lists
  const filteredMaterials = useMemo(() =>
    allMaterials.filter(m => m.prefix?.toLowerCase().includes(materialSearch.toLowerCase())),
    [materialSearch]
  )

  const filteredBases = useMemo(() => {
    let bases = allBases
    // When in material mode, filter bases by compatibility
    if (itemGenType === 'material') {
      const material = allMaterials.find(m => m.id === selectedMaterial)
      if (material) {
        bases = bases.filter(b => b.type === itemType)
      }
    }
    return bases.filter(b => b.description?.toLowerCase().includes(baseSearch.toLowerCase()))
  }, [baseSearch, itemGenType, selectedMaterial, itemType])

  const filteredUniques = useMemo(() =>
    ALL_UNIQUE_ITEMS.filter(u => u.name.toLowerCase().includes(uniqueSearch.toLowerCase())),
    [uniqueSearch]
  )

  const filteredSets = useMemo(() =>
    ALL_SET_ITEMS.filter(s => s.name.toLowerCase().includes(setSearch.toLowerCase())),
    [setSearch]
  )

  // Determine context (dungeon or party/bank)
  const isInDungeon = activeRun?.result === 'active'

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
        wisdom: hero.class.baseStats.wisdom,
        charisma: hero.class.baseStats.charisma,
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
    const leveledParty = party
      .filter((hero): hero is Hero => hero !== null)
      .map(hero => levelUpHero(hero, GAME_CONFIG.levelUp.maxLevel))
    
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

  const handleGoToFloor = (floor: number) => {
    // Reset floor state completely to avoid inconsistencies
    const newEventsRequired = Math.floor(
      Math.random() * (GAME_CONFIG.dungeon.maxEventsPerFloor - GAME_CONFIG.dungeon.minEventsPerFloor + 1)
    ) + GAME_CONFIG.dungeon.minEventsPerFloor

    useGameStore.setState({
      dungeon: {
        ...dungeon,
        floor: floor,
        eventsThisFloor: 0, // Reset to start of floor
        eventsRequiredThisFloor: newEventsRequired,
        isNextEventBoss: false,
        bossType: null,
      }
    })
  }

  const handleWinEvent = () => {
    const state = useGameStore.getState()
    const currentEvent = state.dungeon.currentEvent
    
    if (!currentEvent) {
      alert('No active event!')
      return
    }

    // Find the first choice with a success outcome
    const winChoice = currentEvent.choices.find(c => c.successOutcome)
    
    if (winChoice?.successOutcome) {
      // Force select the success outcome
      state.selectChoice(winChoice)
    } else {
      alert('No winning choice found in this event!')
    }
  }

  const handleKillEnemy = () => {
    const state = useGameStore.getState()
    const currentEvent = state.dungeon.currentEvent
    
    if (!currentEvent) {
      alert('No active event!')
      return
    }

    if (currentEvent.type !== 'combat' && currentEvent.type !== 'boss') {
      alert('Not a combat event!')
      return
    }

    // Find the attack/fight choice
    const fightChoice = currentEvent.choices.find(c => 
      c.text.toLowerCase().includes('fight') || 
      c.text.toLowerCase().includes('attack') ||
      c.successOutcome
    )
    
    if (fightChoice) {
      state.selectChoice(fightChoice)
    } else {
      alert('No fight option found!')
    }
  }

  const handleSkipEvent = () => {
    const state = useGameStore.getState()
    if (!state.dungeon.currentEvent) {
      alert('No active event!')
      return
    }

    // Clear the event and advance
    useGameStore.setState({
      dungeon: {
        ...state.dungeon,
        currentEvent: null,
      }
    })
    
    // Advance to next floor
    state.advanceDungeon()
  }

  const handleHealAllFull = () => {
    const state = useGameStore.getState()
    const healedParty = state.party.filter((hero): hero is Hero => hero !== null).map(hero => ({
      ...hero,
      isAlive: true,
      stats: {
        ...hero.stats,
        hp: hero.stats.maxHp,
      },
    }))
    
    const healedRoster = state.heroRoster.map(rosterHero => {
      const healedVersion = healedParty.find(h => h.id === rosterHero.id)
      return healedVersion ?? rosterHero
    })
    
    useGameStore.setState({ 
      party: healedParty as (Hero | null)[], 
      heroRoster: healedRoster 
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

  const handleDownloadBackup = (backupKey: string) => {
    downloadBackup(backupKey)
  }

  const formatBackupName = (key: string) => {
    const timestamp = parseInt(key.split('-').pop() || '0')
    return new Date(timestamp).toLocaleString()
  }

  const handleGenerateItem = () => {
    let item: Item | undefined

    switch (itemGenType) {
      case 'procedural': {
        // Standard procedural generation
        item = generateItem(itemDepth, itemType, itemRarity, itemRarity, 0)
        break
      }

      case 'material': {
        // Generate using specific material
        const material = allMaterials.find(m => m.id === selectedMaterial)
        if (material) {
          item = generateItem(itemDepth, itemType, itemRarity, itemRarity, 0)
          // Override with material properties
          item.name = `${material.prefix} ${item.name.split(' ').slice(1).join(' ')}`
        }
        break
      }

      case 'base': {
        // Generate using specific base
        const selectedMat = allMaterials.find(m => m.id === selectedMaterial)
        if (selectedBase && selectedMat) {
          item = generateItem(itemDepth, itemType, itemRarity, itemRarity, 0)
          // Override name with material + base description
          item.name = `${selectedMat.prefix} ${item.name.split(' ').slice(1).join(' ')}`
        }
        break
      }

      case 'unique': {
        // Generate specific unique item
        const unique = ALL_UNIQUE_ITEMS.find(u => u.name === selectedUnique)
        if (unique) {
          item = {
            ...unique,
            id: `unique-${unique.name}-${Date.now()}`,
            isUnique: true,
          } as Item
        }
        break
      }

      case 'set': {
        // Generate specific set item
        const setItem = ALL_SET_ITEMS.find(s => s.name === selectedSet)
        if (setItem) {
          item = {
            ...setItem,
            id: `set-${setItem.name}-${Date.now()}`,
          } as Item
        }
        break
      }
    }

    if (item) {
      // Context-aware insertion
      if (isInDungeon) {
        // Add to dungeon inventory
        useGameStore.setState(state => ({
          dungeon: {
            ...state.dungeon,
            inventory: [...state.dungeon.inventory, item!]
          }
        }))
      } else {
        // Add to bank
        useGameStore.setState(state => ({
          bankInventory: [...state.bankInventory, item!]
        }))
      }
    }
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

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" maxH="90vh" my={4}>
          <ModalHeader color="yellow.400">
            Dev Tools {isInDungeon && <Text as="span" fontSize="sm" color="cyan.400">(In Dungeon)</Text>}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY="auto">
            <Tabs colorScheme="yellow">
              <TabList>
                <Tab>Party</Tab>
                <Tab>Items</Tab>
                <Tab>Dungeon</Tab>
                <Tab>Event</Tab>
                <Tab>System</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
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
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <Text fontSize="sm" fontWeight="bold" color="gray.400">
                        Item Generation
                      </Text>
                      <Text fontSize="xs" color="cyan.400">
                        {isInDungeon ? '→ Dungeon Inventory' : '→ Bank'}
                      </Text>
                    </HStack>

                    <Select
                      size="sm"
                      value={itemGenType}
                      onChange={(e) => setItemGenType(e.target.value as typeof itemGenType)}
                      bg="gray.900"
                    >
                      <option value="procedural">Procedural (Random)</option>
                      <option value="material">By Material</option>
                      <option value="base">By Base</option>
                      <option value="unique">Unique Item</option>
                      <option value="set">Set Item</option>
                    </Select>

                    {itemGenType === 'procedural' && (
                      <VStack spacing={2} align="stretch">
                        <Select size="sm" value={itemType} onChange={(e) => setItemType(e.target.value as ItemSlot)} bg="gray.900">
                          <option value="weapon">Weapon</option>
                          <option value="armor">Armor</option>
                          <option value="helmet">Helmet</option>
                          <option value="boots">Boots</option>
                          <option value="accessory1">Accessory</option>
                        </Select>
                        <Select size="sm" value={itemRarity} onChange={(e) => setItemRarity(e.target.value as ItemRarity)} bg="gray.900">
                          <option value="junk">Junk</option>
                          <option value="common">Common</option>
                          <option value="uncommon">Uncommon</option>
                          <option value="rare">Rare</option>
                          <option value="epic">Epic</option>
                          <option value="legendary">Legendary</option>
                          <option value="mythic">Mythic</option>
                        </Select>
                        <HStack>
                          <Text fontSize="sm" color="gray.400">Depth:</Text>
                          <NumberInput size="sm" value={itemDepth} onChange={(_, val) => setItemDepth(val)} min={1} max={100} w="100px">
                            <NumberInputField bg="gray.900" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </HStack>
                      </VStack>
                    )}

                    {itemGenType === 'material' && (
                      <VStack spacing={2} align="stretch">
                        <Box>
                          <Text fontSize="xs" color="gray.400" mb={1}>Search Material:</Text>
                          <Input
                            size="sm"
                            placeholder="Search materials..."
                            value={materialSearch}
                            onChange={(e) => setMaterialSearch(e.target.value)}
                            bg="gray.900"
                            mb={1}
                          />
                          <Select
                            size="sm"
                            value={selectedMaterial}
                            onChange={(e) => setSelectedMaterial(e.target.value)}
                            bg="gray.900"
                            maxH="200px"
                          >
                            {filteredMaterials.map(mat => (
                              <option key={mat.id} value={mat.id}>{mat.prefix} ({mat.rarity}+)</option>
                            ))}
                          </Select>
                        </Box>
                        <Select size="sm" value={itemType} onChange={(e) => setItemType(e.target.value as ItemSlot)} bg="gray.900">
                          <option value="weapon">Weapon</option>
                          <option value="armor">Armor</option>
                          <option value="helmet">Helmet</option>
                          <option value="boots">Boots</option>
                          <option value="accessory1">Accessory</option>
                        </Select>
                        <Select size="sm" value={itemRarity} onChange={(e) => setItemRarity(e.target.value as ItemRarity)} bg="gray.900">
                          <option value="uncommon">Uncommon</option>
                          <option value="rare">Rare</option>
                          <option value="epic">Epic</option>
                          <option value="legendary">Legendary</option>
                          <option value="mythic">Mythic</option>
                        </Select>
                      </VStack>
                    )}

                    {itemGenType === 'base' && (
                      <VStack spacing={2} align="stretch">
                        <Box>
                          <Text fontSize="xs" color="gray.400" mb={1}>Search Base:</Text>
                          <Input
                            size="sm"
                            placeholder="Search bases..."
                            value={baseSearch}
                            onChange={(e) => setBaseSearch(e.target.value)}
                            bg="gray.900"
                            mb={1}
                          />
                          <Select size="sm" value={selectedBase} onChange={(e) => setSelectedBase(e.target.value)} bg="gray.900">
                            {filteredBases.map((base, idx) => (
                              <option key={idx} value={idx}>{base.type} - {base.description?.substring(0, 30)}</option>
                            ))}
                          </Select>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.400" mb={1}>Material:</Text>
                          <Select size="sm" value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} bg="gray.900">
                            {allMaterials.map(mat => (
                              <option key={mat.id} value={mat.id}>{mat.prefix}</option>
                            ))}
                          </Select>
                        </Box>
                        <Select size="sm" value={itemRarity} onChange={(e) => setItemRarity(e.target.value as ItemRarity)} bg="gray.900">
                          <option value="uncommon">Uncommon</option>
                          <option value="rare">Rare</option>
                          <option value="epic">Epic</option>
                          <option value="legendary">Legendary</option>
                          <option value="mythic">Mythic</option>
                        </Select>
                      </VStack>
                    )}

                    {itemGenType === 'unique' && (
                      <Box>
                        <Text fontSize="xs" color="gray.400" mb={1}>Search Unique:</Text>
                        <Input
                          size="sm"
                          placeholder="Search uniques..."
                          value={uniqueSearch}
                          onChange={(e) => setUniqueSearch(e.target.value)}
                          bg="gray.900"
                          mb={1}
                        />
                        <Select size="sm" value={selectedUnique} onChange={(e) => setSelectedUnique(e.target.value)} bg="gray.900">
                          {filteredUniques.map(unique => (
                            <option key={unique.name} value={unique.name}>{unique.name} - {unique.type}</option>
                          ))}
                        </Select>
                      </Box>
                    )}

                    {itemGenType === 'set' && (
                      <Box>
                        <Text fontSize="xs" color="gray.400" mb={1}>Search Set Item:</Text>
                        <Input
                          size="sm"
                          placeholder="Search set items..."
                          value={setSearch}
                          onChange={(e) => setSetSearch(e.target.value)}
                          bg="gray.900"
                          mb={1}
                        />
                        <Select size="sm" value={selectedSet} onChange={(e) => setSelectedSet(e.target.value)} bg="gray.900">
                          {filteredSets.map(setItem => (
                            <option key={setItem.name} value={setItem.name}>{setItem.name} - {setItem.type}</option>
                          ))}
                        </Select>
                      </Box>
                    )}

                    <Button size="sm" colorScheme="purple" onClick={handleGenerateItem}>
                      {isInDungeon ? 'Insert into Dungeon' : 'Insert into Bank'}
                    </Button>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={3} align="stretch">
                    <Text fontSize="sm" fontWeight="bold" color="gray.400">
                      Dungeon Control
                    </Text>
                    <Button size="sm" colorScheme="cyan" onClick={() => handleAdvanceFloor(5)}>
                      Advance +5 Floors
                    </Button>
                    <Button size="sm" colorScheme="cyan" onClick={() => handleAdvanceFloor(-5)}>
                      Go Back -5 Floors
                    </Button>
                    <Button size="sm" colorScheme="purple" onClick={() => handleGoToFloor(100)}>
                      Go to Floor 100
                    </Button>
                    <Button size="sm" colorScheme="red" onClick={() => setConfirmAction('apply-penalty')}>
                      Apply Death Penalty
                    </Button>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={3} align="stretch">
                    <Text fontSize="sm" fontWeight="bold" color="gray.400">
                      Event Control
                    </Text>
                    {dungeon.currentEvent ? (
                      <>
                        <Text fontSize="xs" color="cyan.400">
                          Current Event: {dungeon.currentEvent.title} ({dungeon.currentEvent.type})
                        </Text>
                        <Button size="sm" colorScheme="green" onClick={handleWinEvent}>
                          Win Event (Auto-Success)
                        </Button>
                        {(dungeon.currentEvent.type === 'combat' || dungeon.currentEvent.type === 'boss') && (
                          <Button size="sm" colorScheme="orange" onClick={handleKillEnemy}>
                            Kill Enemy (Fight Choice)
                          </Button>
                        )}
                        <Button size="sm" colorScheme="yellow" onClick={handleSkipEvent}>
                          Skip Event (Force Continue)
                        </Button>
                        <Button size="sm" colorScheme="blue" onClick={handleHealAllFull}>
                          Heal All to Full HP
                        </Button>
                      </>
                    ) : (
                      <Text fontSize="sm" color="gray.500">
                        No active event. Enter the dungeon to see event controls.
                      </Text>
                    )}
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={3} align="stretch">
                    <Text fontSize="sm" fontWeight="bold" color="gray.400">
                      Game State
                    </Text>
                    <Button 
                      size="sm" 
                      colorScheme="cyan" 
                      onClick={() => {
                        console.log('Total boss events loaded:', BOSS_EVENTS.length)
                        console.log('Zone bosses:', BOSS_EVENTS.filter(e => 'isZoneBoss' in e && e.isZoneBoss).map(e => `${e.title} (floor ${'zoneBossFloor' in e ? e.zoneBossFloor : 'N/A'})`))
                        console.log('Final boss:', BOSS_EVENTS.find(e => 'isFinalBoss' in e && e.isFinalBoss))
                        alert(`Boss events loaded: ${BOSS_EVENTS.length}\nCheck console for details`)
                      }}
                    >
                      Debug: Log Boss Events
                    </Button>
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
                      <VStack align="stretch" spacing={2} maxH="300px" overflowY="auto" bg="gray.900" p={2} borderRadius="md">
                        {backups.map(backup => (
                          <HStack key={backup} spacing={2}>
                            <Button
                              flex={1}
                              size="xs"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => handleRestoreBackup(backup)}
                            >
                              Restore: {formatBackupName(backup)}
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="green"
                              onClick={() => handleDownloadBackup(backup)}
                              title="Download this backup as JSON"
                            >
                              💾
                            </Button>
                          </HStack>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
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
