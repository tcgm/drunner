import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import MainMenuScreen from '@components/screens/MainMenuScreen'
import PartySetupScreen from '@components/screens/PartySetupScreen'
import DungeonScreen from '@components/screens/DungeonScreen'

type Screen = 'menu' | 'party-setup' | 'dungeon'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')

  return (
    <Box h="100vh" w="100vw" bg="gray.900" overflow="hidden">
      {currentScreen === 'menu' && (
        <MainMenuScreen onNewGame={() => setCurrentScreen('party-setup')} />
      )}
      {currentScreen === 'party-setup' && (
        <PartySetupScreen 
          onStart={() => setCurrentScreen('dungeon')}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
      {currentScreen === 'dungeon' && (
        <DungeonScreen onExit={() => setCurrentScreen('menu')} />
      )}
    </Box>
  )
}

export default App
