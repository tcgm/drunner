import { VStack, Heading, Button, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Divider, HStack, Badge, useToast } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { useGameStore } from '@store/gameStore'
import { useMusicContext } from '@/utils/useMusicContext'
import { MusicContext } from '@/types/audio'

interface MainMenuScreenProps {
  onNewRun: () => void
  onContinue: () => void
  onRunHistory: () => void
}

export default function MainMenuScreen({ onNewRun, onContinue, onRunHistory }: MainMenuScreenProps) {
  console.log('[MainMenuScreen] Component rendering');
  const { activeRun, listBackups, restoreFromBackup, exportSave, importSave } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [backups, setBackups] = useState<string[]>([])
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Enable main menu music
  console.log('[MainMenuScreen] About to call useMusicContext');
  useMusicContext(MusicContext.MAIN_MENU)
  console.log('[MainMenuScreen] useMusicContext called');
  
  // Check if there's an active dungeon run in progress
  const hasActiveRun = activeRun !== null && activeRun.result === 'active'
  
  const handleOpenSaveManager = () => {
    const availableBackups = listBackups()
    setBackups(availableBackups)
    onOpen()
  }

  const handleRestoreBackup = (backupKey: string) => {
    const timestamp = parseInt(backupKey.split('-').pop() || '0')
    const date = new Date(timestamp).toLocaleString()
    if (confirm(`Restore save from ${date}?\n\nThis will reload the page and restore your game state. Current unsaved progress will be lost.`)) {
      restoreFromBackup(backupKey)
    }
  }

  const formatBackupDate = (key: string) => {
    const timestamp = parseInt(key.split('-').pop() || '0')
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(timestamp)
    }
  }

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
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
  
  return (
    <Box className="main-menu-screen" h="100vh" w="100vw" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
      <VStack className="main-menu-content" spacing={8}>
        <Heading className="main-menu-title" size="2xl" color="orange.400">
          Dungeon Runner
        </Heading>
        <VStack className="main-menu-buttons" spacing={4}>
          <Button className="btn-new-run" colorScheme="orange" size="lg" onClick={onNewRun}>
            New Run
          </Button>
          <Button 
            className="btn-continue-run"
            colorScheme="orange" 
            variant="outline"
            size="lg" 
            onClick={onContinue}
            isDisabled={!hasActiveRun}
          >
            Continue Run
          </Button>
          <Button 
            className="btn-run-history"
            colorScheme="gray" 
            size="lg" 
            onClick={onRunHistory}
          >
            Run History
          </Button>
          <Button 
            className="btn-manage-saves"
            colorScheme="blue" 
            size="lg" 
            onClick={handleOpenSaveManager}
          >
            Manage Saves
          </Button>
          <Button className="btn-settings" colorScheme="gray" size="lg" isDisabled>
            Settings (Coming Soon)
          </Button>
        </VStack>
      </VStack>

      {/* Save Management Modal */}
      <Modal className="save-management-modal" isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent className="save-management-content" bg="gray.800">
          <ModalHeader className="save-management-header" color="blue.400">Save Management</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="save-management-body" pb={6}>
            <VStack className="save-management-sections" spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.400" mb={2}>
                  Automatic backups are created when the game loads. Restoring a backup will reload the page.
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
                <HStack className="backups-header" justify="space-between" mb={3}>
                  <Text className="backups-title" fontSize="md" fontWeight="bold" color="gray.300">
                    Available Backups
                  </Text>
                  <Badge className="backups-count" colorScheme="blue">{backups.length} saves</Badge>
                </HStack>

                {backups.length === 0 ? (
                  <Box className="no-backups" bg="gray.900" p={4} borderRadius="md" textAlign="center">
                    <Text color="gray.500" fontSize="sm">
                      No backups found. Backups are created automatically when the game loads.
                    </Text>
                  </Box>
                ) : (
                  <VStack className="backups-list" spacing={2} align="stretch" maxH="400px" overflowY="auto">
                    {backups.map((backup, index) => {
                      const { date, time, relative } = formatBackupDate(backup)
                      return (
                        <Box
                          key={backup}
                          className="backup-item"
                          bg="gray.900"
                          p={3}
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor="gray.700"
                          _hover={{ borderColor: 'blue.500', bg: 'gray.850' }}
                          transition="all 0.2s"
                        >
                          <HStack className="backup-item-content" justify="space-between" align="start">
                            <VStack className="backup-item-info" align="start" spacing={0} flex={1}>
                              <HStack className="backup-item-header">
                                <Text className="backup-item-number" fontSize="sm" fontWeight="bold" color="gray.200">
                                  Backup #{backups.length - index}
                                </Text>
                                <Badge className="backup-item-relative-time" colorScheme="green" fontSize="xs">
                                  {relative}
                                </Badge>
                              </HStack>
                              <Text className="backup-item-timestamp" fontSize="xs" color="gray.500">
                                {date} at {time}
                              </Text>
                            </VStack>
                            <Button
                              className="btn-restore-backup"
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleRestoreBackup(backup)}
                            >
                              Restore
                            </Button>
                          </HStack>
                        </Box>
                      )
                    })}
                  </VStack>
                )}
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
