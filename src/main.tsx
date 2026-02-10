import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'
import theme from '@theme/index'
import { injectRarityColorVars } from '@/utils/injectRarityColors'

// Inject rarity colors as CSS variables at startup
injectRarityColorVars()

// Enable HMR for rarity color changes
if (import.meta.hot) {
  import.meta.hot.accept('@/utils/injectRarityColors', (newModule) => {
    if (newModule) {
      newModule.injectRarityColorVars()
    }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
