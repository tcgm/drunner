import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
  VStack,
  Box,
  Icon,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { FiAlertTriangle, FiDownload } from 'react-icons/fi'
import { useGameStore } from '@/core/gameStore'
import LZString from 'lz-string'

interface MigrationWarningDialogProps {
  isOpen: boolean
}

export function MigrationWarningDialog({ isOpen }: MigrationWarningDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const { approveMigration, cancelMigration, pendingMigrationData } = useGameStore()

  const handleDownloadAndContinue = () => {
    // Export the pending migration data (pre-migration state)
    if (pendingMigrationData) {
      try {
        // Decompress the data
        let str: string
        try {
          str = LZString.decompressFromUTF16(pendingMigrationData) || pendingMigrationData
        } catch {
          str = pendingMigrationData
        }

        // Parse and format for export
        const saveData = JSON.parse(str)
        
        // Remove icon functions and other non-serializable data
        const replacer = (key: string, val: unknown) => {
          if (key === 'icon' && typeof val === 'function') {
            return undefined
          }
          return val
        }
        
        const json = JSON.stringify(saveData, replacer, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `dungeon-runner-pre-migration-${Date.now()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        console.log('[Export] Pre-migration save exported successfully')
      } catch (error) {
        console.error('[Export] Failed to export pre-migration save:', error)
      }
    }
    
    // Give a moment for the download to trigger, then apply migration
    setTimeout(() => {
      approveMigration()
    }, 100)
  }

  const handleCancel = () => {
    cancelMigration()
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={handleCancel}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <AlertDialogOverlay bg="blackAlpha.900" backdropFilter="blur(8px)">
        <AlertDialogContent bg="gray.900" borderWidth="2px" borderColor="orange.500" maxW="600px">
          <AlertDialogHeader fontSize="2xl" fontWeight="bold" color="orange.400">
            <Icon as={FiAlertTriangle} mr={2} />
            Save Migration Required
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack align="stretch" spacing={4}>
              <Text color="gray.300">
                Your save file was created with an older version of Dungeon Runner and needs to be 
                migrated to the current format. This process will update:
              </Text>
              
              <Box 
                bg="gray.800" 
                p={3} 
                borderRadius="md" 
                borderLeft="4px solid"
                borderColor="orange.400"
              >
                <VStack align="stretch" spacing={2} fontSize="sm" color="gray.400">
                  <Text>• Floor and event tracking system</Text>
                  <Text>• Equipment slot structure</Text>
                  <Text>• Item stats and calculations</Text>
                  <Text>• Set item configurations</Text>
                </VStack>
              </Box>

              <Text color="yellow.300" fontWeight="semibold">
                ⚠️ Before continuing, we'll automatically download a backup of your current save file.
              </Text>

              <Text color="gray.400" fontSize="sm">
                The migration process is generally safe, but having a backup ensures you can restore 
                your progress if anything unexpected happens.
              </Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button 
              ref={cancelRef} 
              onClick={handleCancel}
              variant="ghost"
              colorScheme="gray"
            >
              Cancel
            </Button>
            <Button 
              leftIcon={<Icon as={FiDownload} />}
              colorScheme="orange" 
              onClick={handleDownloadAndContinue} 
              ml={3}
            >
              Download Backup & Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
