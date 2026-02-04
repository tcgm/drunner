import { VStack, Heading, Button, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Divider, HStack, Badge, useToast, Icon } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { useGameStore } from '@store/gameStore'
import { GiCrossedSwords, GiCurlyWing, GiRun, GiScrollUnfurled, GiSave, GiGearHammer, GiCryptEntrance } from 'react-icons/gi'

interface MainMenuScreenProps {
  onNewRun: () => void
  onContinue: () => void
  onRunHistory: () => void
}

export default function MainMenuScreen({ onNewRun, onContinue, onRunHistory }: MainMenuScreenProps) {
  const { activeRun, listBackups, restoreFromBackup, exportSave, importSave } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [backups, setBackups] = useState<string[]>([])
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
        width="200px"
        height="200px"
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
        width="200px"
        height="200px"
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
        width="200px"
        height="200px"
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
        width="200px"
        height="200px"
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
            width="300px" 
            height="2px" 
            bgGradient="linear(to-r, transparent, orange.500, transparent)" 
            mt={2}
          />
        </VStack>

        {/* Menu Buttons */}
        <VStack className="main-menu-buttons" spacing={4} width="300px">
          <Button 
            className="btn-new-run" 
            colorScheme="orange" 
            size="lg" 
            width="100%"
            height="60px"
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
            New Run
          </Button>
          {hasActiveRun && (
            <Button 
              className="btn-continue-run"
              colorScheme="orange" 
              variant="outline"
              size="lg" 
              width="100%"
              height="60px"
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
            height="60px"
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
            height="60px"
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
