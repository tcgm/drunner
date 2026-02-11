import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'
import theme from '@theme/index'
import { injectRarityColorVars } from '@/utils/injectRarityColors'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

// Inject rarity colors as CSS variables at startup
injectRarityColorVars()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </ErrorBoundary>
  </StrictMode>,
)
