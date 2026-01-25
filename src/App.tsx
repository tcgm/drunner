import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import MainMenuScreen from '@components/screens/MainMenuScreen'
import PartySetupScreen from '@components/screens/PartySetupScreen'
import DungeonScreen from '@components/screens/DungeonScreen'

type Screen = 'menu' | 'party-setup' | 'dungeon'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')

  return (
    <Box minH="100vh" bg="gray.900">
      {currentScreen === 'menu' && (
        <Box py={8} px={4} maxW="container.xl" mx="auto">
          <MainMenuScreen onNewGame={() => setCurrentScreen('party-setup')} />
        </Box>
      )}
      {currentScreen === 'party-setup' && (
        <Box py={8} px={4} maxW="container.xl" mx="auto">
          <PartySetupScreen 
            onStart={() => setCurrentScreen('dungeon')}
            onBack={() => setCurrentScreen('menu')}
          />
        </Box>
      )}
      {currentScreen === 'dungeon' && (
        <Box p={4}>
          <DungeonScreen onExit={() => setCurrentScreen('menu')} />
        </Box>
      )}
    </Box>
  )
}

export default App
