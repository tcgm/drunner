import { VStack, Heading, Button, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text, Divider, HStack, Badge } from '@chakra-ui/react'
import { useState } from 'react'
import { useGameStore } from '@store/gameStore'

interface MainMenuScreenProps {
  onNewRun: () => void
  onContinue: () => void
  onRunHistory: () => void
}

export default function MainMenuScreen({ onNewRun, onContinue, onRunHistory }: MainMenuScreenProps) {
  const { activeRun, listBackups, restoreFromBackup } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [backups, setBackups] = useState<string[]>([])
  
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
  
  return (
    <Box h="100vh" w="100vw" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
      <VStack spacing={8}>
        <Heading size="2xl" color="orange.400">
          Dungeon Runner
        </Heading>
        <VStack spacing={4}>
          <Button colorScheme="orange" size="lg" onClick={onNewRun}>
            New Run
          </Button>
          <Button 
            colorScheme="orange" 
            variant="outline"
            size="lg" 
            onClick={onContinue}
            isDisabled={!hasActiveRun}
          >
            Continue Run
          </Button>
          <Button 
            colorScheme="gray" 
            size="lg" 
            onClick={onRunHistory}
          >
            Run History
          </Button>
          <Button 
            colorScheme="blue" 
            size="lg" 
            onClick={handleOpenSaveManager}
          >
            Manage Saves
          </Button>
          <Button colorScheme="gray" size="lg" isDisabled>
            Settings (Coming Soon)
          </Button>
        </VStack>
      </VStack>

      {/* Save Management Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader color="blue.400">Save Management</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.400" mb={2}>
                  Automatic backups are created when the game loads. Restoring a backup will reload the page.
                </Text>
              </Box>

              <Divider />

              <Box>
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="md" fontWeight="bold" color="gray.300">
                    Available Backups
                  </Text>
                  <Badge colorScheme="blue">{backups.length} saves</Badge>
                </HStack>

                {backups.length === 0 ? (
                  <Box bg="gray.900" p={4} borderRadius="md" textAlign="center">
                    <Text color="gray.500" fontSize="sm">
                      No backups found. Backups are created automatically when the game loads.
                    </Text>
                  </Box>
                ) : (
                  <VStack spacing={2} align="stretch" maxH="400px" overflowY="auto">
                    {backups.map((backup, index) => {
                      const { date, time, relative } = formatBackupDate(backup)
                      return (
                        <Box
                          key={backup}
                          bg="gray.900"
                          p={3}
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor="gray.700"
                          _hover={{ borderColor: 'blue.500', bg: 'gray.850' }}
                          transition="all 0.2s"
                        >
                          <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={0} flex={1}>
                              <HStack>
                                <Text fontSize="sm" fontWeight="bold" color="gray.200">
                                  Backup #{backups.length - index}
                                </Text>
                                <Badge colorScheme="green" fontSize="xs">
                                  {relative}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color="gray.500">
                                {date} at {time}
                              </Text>
                            </VStack>
                            <Button
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
    </Box>
  )
}
