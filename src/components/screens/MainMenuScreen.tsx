import { VStack, Heading, Button, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Divider, HStack, Badge, useToast, Icon, Collapse, IconButton } from '@chakra-ui/react'
import { useState, useRef, useMemo } from 'react'
import { useGameStore } from '@/core/gameStore'
import { GiCrossedSwords, GiCurlyWing, GiRun, GiScrollUnfurled, GiSave, GiGearHammer, GiCryptEntrance } from 'react-icons/gi'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import LZString from 'lz-string'
import { idbGet, idbSet } from '@/utils/idbStorage'

interface MainMenuScreenProps {
  onNewRun: () => void
  onContinue: () => void
  onRunHistory: () => void
}

export default function MainMenuScreen({ onNewRun, onContinue, onRunHistory }: MainMenuScreenProps) {
  const { activeRun, listBackups, createManualBackup, restoreFromBackup, downloadBackup, exportSave, importSave } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [backups, setBackups] = useState<string[]>([])
  const [backupStats, setBackupStats] = useState<Record<string, { itemCount: number; heroCount: number }>>({})
  const [expandedBackups, setExpandedBackups] = useState<Set<string>>(new Set())
  const [showDangerSection, setShowDangerSection] = useState(false)
  const [lsRecoveryData, setLsRecoveryData] = useState<Array<{
    key: string
    raw: string
    gold: number
    heroCount: number
    itemCount: number
    version: number
  }>>([])
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Check if there's an active dungeon run in progress
  const hasActiveRun = activeRun !== null && activeRun.result === 'active'
  
  const handleOpenSaveManager = async () => {
    const availableBackups = await listBackups()
    setBackups(availableBackups)
    // Load stats for each backup concurrently
    const statsEntries = await Promise.all(
      availableBackups.map(async (key) => {
        try {
          const compressed = await idbGet(key)
          if (!compressed) return [key, { itemCount: 0, heroCount: 0 }] as const
          let str: string
          try { str = LZString.decompressFromUTF16(compressed) || compressed } catch { str = compressed }
          const state = JSON.parse(str)
          const gs = state.state || state
          return [key, { itemCount: gs.bankInventory?.length || 0, heroCount: gs.heroRoster?.length || 0 }] as const
        } catch {
          return [key, { itemCount: 0, heroCount: 0 }] as const
        }
      })
    )
    setBackupStats(Object.fromEntries(statsEntries))
    onOpen()
  }

  const toggleBackupExpanded = (backupKey: string) => {
    setExpandedBackups(prev => {
      const next = new Set(prev)
      if (next.has(backupKey)) {
        next.delete(backupKey)
      } else {
        next.add(backupKey)
      }
      return next
    })
  }

  const handleCreateBackup = async () => {
    const success = await createManualBackup()
    if (success) {
      toast({
        title: 'Backup Created',
        description: 'Manual backup created successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      // Refresh backup list
      const availableBackups = await listBackups()
      setBackups(availableBackups)
    } else {
      toast({
        title: 'Backup Failed',
        description: 'Failed to create backup.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleRestoreBackup = async (backupKey: string) => {
    const timestamp = parseInt(backupKey.split('-').pop() || '0')
    const date = new Date(timestamp).toLocaleString()
    if (confirm(`Restore save from ${date}?\n\nThis will reload the page and restore your game state. Current unsaved progress will be lost.`)) {
      await restoreFromBackup(backupKey)
    }
  }

  const handleDownloadBackup = async (backupKey: string) => {
    const success = await downloadBackup(backupKey)
    if (success) {
      toast({
        title: 'Backup Downloaded',
        description: 'Backup has been downloaded as a JSON file.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Download Failed',
        description: 'Failed to download backup.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getRelativeTime = useMemo(() => {
    return (timestamp: number) => {
      const diff = Date.now() - timestamp
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      return `${days}d ago`
    }
  }, [])

  const formatBackupDate = (key: string) => {
    const timestamp = parseInt(key.split('-').pop() || '0')
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(timestamp)
    }
  }

  const handleExportSave = () => {
    try {
      exportSave()
      toast({
        title: 'Save Exported',
        description: 'Your save file has been downloaded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export save file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleImportSave = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const success = importSave(text)
      
      if (success) {
        toast({
          title: 'Save Imported',
          description: 'Your save file has been loaded successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        onClose()
      } else {
        toast({
          title: 'Import Failed',
          description: 'Invalid save file format or corrupted data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Failed to read save file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    
    // Reset the file input
    if (event.target) {
      event.target.value = ''
    }
  }

  const LS_SAVE_PREFIX = 'dungeon-runner-'

  const handleScanLocalStorage = () => {
    const found: typeof lsRecoveryData = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(LS_SAVE_PREFIX)) continue
      const raw = localStorage.getItem(key)
      if (!raw) continue
      try {
        let str: string
        try { str = LZString.decompressFromUTF16(raw) || raw } catch { str = raw }
        const parsed = JSON.parse(str)
        const gs = parsed.state || parsed
        found.push({
          key,
          raw,
          gold: gs.bankGold || 0,
          heroCount: gs.heroRoster?.length || 0,
          itemCount: gs.bankInventory?.length || 0,
          version: gs.saveVersion || 0,
        })
      } catch {
        // skip unparseable keys
      }
    }
    setLsRecoveryData(found)
  }

  const handleRecoverFromLS = async (raw: string, key: string) => {
    if (!confirm(`⚠️ DANGER: Overwrite current save with localStorage data from "${key}" and reload?\n\nThis cannot be undone.`)) return
    await idbSet('dungeon-runner-storage', raw)
    window.location.reload()
  }
  
  return (
    <Box 
      className="main-menu-screen" 
      h="100vh" 
      w="100vw" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      overflow="hidden"
      bgGradient="linear(to-b, gray.900, gray.800, gray.900)"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgImage: 'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.03), transparent 50%)',
        pointerEvents: 'none',
      }}
    >
      {/* Decorative corner elements */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="clamp(100px, 15vw, 200px)"
        height="clamp(100px, 15vw, 200px)"
        borderLeft="3px solid"
        borderTop="3px solid"
        borderColor="orange.500"
        opacity={0.3}
        _after={{
          content: '""',
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          borderLeft: '2px solid',
          borderTop: '2px solid',
          borderColor: 'orange.400',
        }}
      />
      <Box
        position="absolute"
        top="0"
        right="0"
        width="clamp(100px, 15vw, 200px)"
        height="clamp(100px, 15vw, 200px)"
        borderRight="3px solid"
        borderTop="3px solid"
        borderColor="orange.500"
        opacity={0.3}
        _after={{
          content: '""',
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          borderRight: '2px solid',
          borderTop: '2px solid',
          borderColor: 'orange.400',
        }}
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        width="clamp(100px, 15vw, 200px)"
        height="clamp(100px, 15vw, 200px)"
        borderLeft="3px solid"
        borderBottom="3px solid"
        borderColor="orange.500"
        opacity={0.3}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          borderLeft: '2px solid',
          borderBottom: '2px solid',
          borderColor: 'orange.400',
        }}
      />
      <Box
        position="absolute"
        bottom="0"
        right="0"
        width="clamp(100px, 15vw, 200px)"
        height="clamp(100px, 15vw, 200px)"
        borderRight="3px solid"
        borderBottom="3px solid"
        borderColor="orange.500"
        opacity={0.3}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          borderRight: '2px solid',
          borderBottom: '2px solid',
          borderColor: 'orange.400',
        }}
      />

      <VStack className="main-menu-content" spacing={10} position="relative" zIndex={1}>
        {/* Main Title */}
        <VStack spacing={2}>
          <Box position="relative">
            <Icon 
              as={GiCrossedSwords} 
              boxSize={32} 
              color="orange.500"
              opacity={0.15}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex={0}
              filter="blur(1px)"
            />
            <Icon 
              as={GiCurlyWing} 
              boxSize={16} 
              color="orange.400"
              opacity={0.6}
              position="absolute"
              top="50%"
              left="-80px"
              transform="translateY(-50%)"
              filter="drop-shadow(0 0 8px rgba(251, 146, 60, 0.4))"
            />
            <Icon 
              as={GiCurlyWing} 
              boxSize={16} 
              color="orange.400"
              opacity={0.6}
              position="absolute"
              top="50%"
              right="-80px"
              transform="translateY(-50%) scaleX(-1)"
              filter="drop-shadow(0 0 8px rgba(251, 146, 60, 0.4))"
            />
            <Heading 
              className="main-menu-title" 
              size="4xl" 
              fontWeight="bold"
              textAlign="center"
              color="orange.400"
              textShadow="0 0 20px rgba(251, 146, 60, 0.5), 0 0 40px rgba(251, 146, 60, 0.3)"
              letterSpacing="wider"
              textTransform="uppercase"
              position="relative"
              zIndex={1}
            >
              Dungeon Runner
            </Heading>
          </Box>
          <Text 
            fontSize="md" 
            color="orange.300" 
            letterSpacing="widest" 
            textTransform="uppercase"
            opacity={0.8}
          >
            Descend into Dorkness
          </Text>
          <Box 
            width="clamp(200px, 30vw, 300px)" 
            height="clamp(1px, 0.2vh, 3px)" 
            bgGradient="linear(to-r, transparent, orange.500, transparent)" 
            mt={2}
          />
        </VStack>

        {/* Menu Buttons */}
        <VStack className="main-menu-buttons" spacing={4} width="clamp(250px, 30vw, 350px)">
          <Button 
            className="btn-new-run" 
            colorScheme="orange" 
            size="lg" 
            width="100%"
            height="clamp(50px, 6vh, 60px)"
            fontSize="xl"
            fontWeight="bold"
            letterSpacing="wide"
            onClick={onNewRun}
            position="relative"
            boxShadow="0 0 15px rgba(251, 146, 60, 0.4)"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: '0 0 25px rgba(251, 146, 60, 0.6)',
            }}
            transition="all 0.2s"
            leftIcon={<Icon as={GiCryptEntrance} boxSize={6} />}
          >
            Town
          </Button>
          {hasActiveRun && (
            <Button 
              className="btn-continue-run"
              colorScheme="orange" 
              variant="outline"
              size="lg" 
              width="100%"
              height="clamp(50px, 6vh, 60px)"
              fontSize="xl"
              fontWeight="bold"
              letterSpacing="wide"
              onClick={onContinue}
              borderWidth="2px"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: '0 0 20px rgba(251, 146, 60, 0.4)',
              }}
              transition="all 0.2s"
              leftIcon={<Icon as={GiRun} boxSize={6} />}
            >
              Continue Run
            </Button>
          )}
          <Button 
            className="btn-run-history"
            colorScheme="gray" 
            variant="outline"
            size="lg" 
            width="100%"
            height="clamp(50px, 6vh, 60px)"
            fontSize="lg"
            fontWeight="semibold"
            letterSpacing="wide"
            onClick={onRunHistory}
            borderWidth="2px"
            _hover={{
              transform: 'scale(1.05)',
              borderColor: 'orange.400',
              color: 'orange.400',
            }}
            transition="all 0.2s"
            leftIcon={<Icon as={GiScrollUnfurled} boxSize={5} />}
          >
            Run History
          </Button>
          <Button 
            className="btn-manage-saves"
            colorScheme="blue" 
            variant="outline"
            size="lg" 
            width="100%"
            height="clamp(50px, 6vh, 60px)"
            fontSize="lg"
            fontWeight="semibold"
            letterSpacing="wide"
            onClick={handleOpenSaveManager}
            borderWidth="2px"
            _hover={{
              transform: 'scale(1.05)',
              borderColor: 'blue.400',
              color: 'blue.400',
            }}
            transition="all 0.2s"
            leftIcon={<Icon as={GiSave} boxSize={5} />}
          >
            Manage Saves
          </Button>
          <Button 
            className="btn-settings" 
            colorScheme="gray" 
            variant="ghost"
            size="md" 
            width="100%"
            fontSize="sm"
            opacity={0.5}
            isDisabled
            leftIcon={<Icon as={GiGearHammer} boxSize={4} />}
          >
            Settings (Coming Soon)
          </Button>
        </VStack>
      </VStack>

      {/* Save Management Modal */}
      <Modal id="save-management-modal" isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent className="save-management-content" bg="gray.800" maxW="clamp(400px, 70vw, 800px)">
          <ModalHeader className="save-management-header" color="orange.400" fontSize="2xl" pb={3}>
            <HStack>
              <Icon as={GiSave} boxSize={6} />
              <Text>Save Management</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="save-management-body" pb={6}>
            <VStack className="save-management-sections" spacing={5} align="stretch">
              {/* Info Box */}
              <Box bg="blue.900" borderLeft="4px solid" borderColor="blue.400" p={3} borderRadius="md">
                <Text fontSize="sm" color="blue.100">
                  💾 Automatic backups are created every 5 minutes (up to 10 backups)
                </Text>
                <Text fontSize="sm" color="blue.100" mt={1}>
                  ⚠️ Restoring a backup will reload the page
                </Text>
              </Box>

              {/* Export/Import Section */}
              <Box className="save-file-management" bg="gray.900" p={4} borderRadius="md" borderWidth="1px" borderColor="gray.700">
                <Text className="save-file-management-title" fontSize="md" fontWeight="bold" color="gray.300" mb={3}>
                  Save File Management
                </Text>
                <HStack className="save-file-actions" spacing={3}>
                  <Button
                    className="btn-export-save"
                    size="md"
                    colorScheme="green"
                    onClick={handleExportSave}
                    flex={1}
                  >
                    Export Save
                  </Button>
                  <Button
                    className="btn-import-save"
                    size="md"
                    colorScheme="purple"
                    onClick={handleImportSave}
                    flex={1}
                  >
                    Import Save
                  </Button>
                </HStack>
                <Text fontSize="xs" color="gray.500" mt={2}>
                  Export your save to backup or transfer to another device. Import to restore a previously exported save.
                </Text>
              </Box>

              <Divider />

              <Box className="backups-section">
                <HStack className="backups-header" justify="space-between" align="start" mb={3}>
                  <VStack align="start" spacing={1}>
                    <Text className="backups-title" fontSize="lg" fontWeight="bold" color="orange.300">
                      📂 Automatic Backups
                    </Text>
                    {backups.length > 0 && (
                      <Text fontSize="xs" color="gray.500">
                        Last backup: {formatBackupDate(backups[0]).relative}
                      </Text>
                    )}
                  </VStack>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="orange"
                      variant="outline"
                      onClick={handleCreateBackup}
                      leftIcon={<Icon as={GiSave} />}
                    >
                      Create Backup
                    </Button>
                    <Badge className="backups-count" colorScheme="orange" fontSize="md" px={3} py={1}>
                      {backups.length}/10
                    </Badge>
                  </HStack>
                </HStack>

                {backups.length === 0 ? (
                  <Box className="no-backups" bg="gray.900" p={6} borderRadius="md" textAlign="center" borderWidth="2px" borderColor="gray.700" borderStyle="dashed">
                    <Text color="gray.400" fontSize="md" fontWeight="semibold">
                      No backups available yet
                    </Text>
                    <Text color="gray.500" fontSize="sm" mt={2}>
                      Backups are created automatically every 5 minutes during gameplay
                    </Text>
                  </Box>
                ) : (
                  <VStack className="backups-list" spacing={2} align="stretch" maxH="450px" overflowY="auto" pr={2}>
                    {backups.map((backup, index) => {
                      const { date, time, relative } = formatBackupDate(backup)
                      const { itemCount = 0, heroCount = 0 } = backupStats[backup] ?? {}
                      const isExpanded = expandedBackups.has(backup)

                      return (
                        <Box
                          key={backup}
                          className="backup-item"
                          bg={index === 0 ? 'gray.750' : 'gray.900'}
                          p={4}
                          borderRadius="lg"
                          borderWidth="2px"
                          borderColor={index === 0 ? 'orange.500' : 'gray.700'}
                          _hover={{ borderColor: index === 0 ? 'orange.400' : 'blue.500', transform: 'translateX(4px)', shadow: 'lg' }}
                          transition="all 0.2s"
                          position="relative"
                        >
                          {index === 0 && (
                            <Badge 
                              position="absolute" 
                              top="-2" 
                              right="-2" 
                              colorScheme="orange" 
                              fontSize="xs"
                              fontWeight="bold"
                            >
                              LATEST
                            </Badge>
                          )}
                          <VStack spacing={2} align="stretch">
                            <HStack className="backup-item-content" justify="space-between" align="center">
                              <HStack spacing={2} flex={1}>
                                <IconButton
                                  aria-label={isExpanded ? "Collapse details" : "Expand details"}
                                  icon={isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme={index === 0 ? 'orange' : 'blue'}
                                  onClick={() => toggleBackupExpanded(backup)}
                                />
                                <VStack className="backup-item-info" align="start" spacing={1} flex={1}>
                                  <HStack className="backup-item-header" spacing={3}>
                                    <Text className="backup-item-number" fontSize="lg" fontWeight="bold" color={index === 0 ? 'orange.300' : 'gray.200'}>
                                      #{backups.length - index}
                                    </Text>
                                    <Badge className="backup-item-relative-time" colorScheme={index === 0 ? 'orange' : 'blue'} fontSize="sm" px={2}>
                                      {relative}
                                    </Badge>
                                  </HStack>
                                  <HStack className="backup-item-stats" spacing={3}>
                                    <Badge colorScheme="purple" fontSize="xs">
                                      👥 {heroCount} {heroCount === 1 ? 'Hero' : 'Heroes'}
                                    </Badge>
                                    <Badge colorScheme="cyan" fontSize="xs">
                                      🎒 {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                                    </Badge>
                                  </HStack>
                                </VStack>
                              </HStack>
                              <HStack spacing={2}>
                                <Button
                                  className="btn-download-backup"
                                  size="md"
                                  colorScheme="green"
                                  variant="outline"
                                  onClick={() => handleDownloadBackup(backup)}
                                  title="Download this backup"
                                >
                                  💾
                                </Button>
                                <Button
                                  className="btn-restore-backup"
                                  size="md"
                                  colorScheme={index === 0 ? 'orange' : 'blue'}
                                  variant={index === 0 ? 'solid' : 'outline'}
                                  onClick={() => handleRestoreBackup(backup)}
                                  minW="100px"
                                >
                                  Restore
                                </Button>
                              </HStack>
                            </HStack>
                            <Collapse in={isExpanded} animateOpacity>
                              <Box
                                pt={2}
                                pl={10}
                                borderTopWidth="1px"
                                borderColor="gray.700"
                              >
                                <Text className="backup-item-timestamp" fontSize="sm" color="gray.400" fontWeight="medium">
                                  📅 {date} ⏰ {time}
                                </Text>
                              </Box>
                            </Collapse>
                          </VStack>
                        </Box>
                      )
                    })}
                  </VStack>
                )}
              </Box>

              {/* Danger Recovery Section */}
              <Divider borderColor="red.900" />
              <Box>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  opacity={0.6}
                  _hover={{ opacity: 1 }}
                  leftIcon={showDangerSection ? <FaChevronUp /> : <FaChevronDown />}
                  onClick={() => {
                    if (!showDangerSection) handleScanLocalStorage()
                    setShowDangerSection(v => !v)
                  }}
                >
                  ⚠️ Danger Recovery (localStorage)
                </Button>
                <Collapse in={showDangerSection} animateOpacity>
                  <Box
                    mt={2}
                    bg="gray.900"
                    borderWidth="1px"
                    borderColor="red.800"
                    borderRadius="md"
                    p={4}
                  >
                    <Text fontSize="sm" color="red.300" fontWeight="semibold" mb={1}>
                      Emergency save recovery
                    </Text>
                    <Text fontSize="xs" color="gray.400" mb={3}>
                      Reads raw save data still present in localStorage (preserved as a read-only fallback).
                      Use this only if all backups above show 0 heroes / 0 items. Restoring will overwrite IDB and reload the page.
                    </Text>
                    {lsRecoveryData.length === 0 ? (
                      <Text color="gray.500" fontSize="sm">No dungeon-runner-* keys found in localStorage.</Text>
                    ) : (
                      <VStack spacing={2} align="stretch">
                        {lsRecoveryData.map(entry => (
                          <Box
                            key={entry.key}
                            bg="gray.800"
                            p={3}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="red.900"
                          >
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.500" fontFamily="mono">{entry.key}</Text>
                                <HStack spacing={2} flexWrap="wrap">
                                  <Badge colorScheme="yellow" fontSize="xs">💰 {entry.gold.toLocaleString()} g</Badge>
                                  <Badge colorScheme="purple" fontSize="xs">👥 {entry.heroCount} heroes</Badge>
                                  <Badge colorScheme="cyan" fontSize="xs">🎒 {entry.itemCount} items</Badge>
                                  <Badge colorScheme="gray" fontSize="xs">v{entry.version}</Badge>
                                </HStack>
                              </VStack>
                              <Button
                                size="sm"
                                colorScheme="red"
                                flexShrink={0}
                                onClick={() => handleRecoverFromLS(entry.raw, entry.key)}
                              >
                                Recover
                              </Button>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </Box>
                </Collapse>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </Box>
  )
}
