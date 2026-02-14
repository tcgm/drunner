// console.log('[Main] Module file starting to parse...')
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'
import theme from '@theme/index'
import { injectRarityColorVars } from '@/utils/injectRarityColors'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

// console.log('[Main] All imports completed')

// Update diagnostic banner
const updateBanner = (id: string, text: string, color: string) => {
  // const banner = document.getElementById(id)
  // if (banner) {
  //   banner.textContent = text
  //   banner.style.background = color
  //   banner.style.display = 'block'
  // }
}

// console.log('[Main] Starting app initialization...')
// updateBanner('module-loaded-banner', 'MODULE LOADED ✓', 'green')

try {
// console.log('[Main] Injecting rarity colors...')
// updateBanner('module-loaded-banner', 'INJECTING COLORS...', 'orange')
  // Inject rarity colors as CSS variables at startup
  injectRarityColorVars()
  // console.log('[Main] Rarity colors injected successfully')
  // updateBanner('module-loaded-banner', 'COLORS INJECTED ✓', 'green')

  // console.log('[Main] Getting root element...')
  // updateBanner('module-loaded-banner', 'GETTING ROOT...', 'orange')
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found!')
  }
  // console.log('[Main] Root element found:', rootElement)
  // updateBanner('module-loaded-banner', 'ROOT FOUND ✓', 'green')

  // console.log('[Main] Creating React root...')
  // updateBanner('module-loaded-banner', 'CREATING REACT ROOT...', 'orange')
  const root = createRoot(rootElement)
  // console.log('[Main] React root created')
  // updateBanner('module-loaded-banner', 'REACT ROOT CREATED ✓', 'green')

  // console.log('[Main] Rendering app...')
  // updateBanner('module-loaded-banner', 'RENDERING APP...', 'orange')
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </ErrorBoundary>
    </StrictMode>,
  )
  // console.log('[Main] App render initiated')
  // updateBanner('module-loaded-banner', 'APP RENDERING ✓', 'green')

  // Hide loader after a short delay to ensure React has mounted
  setTimeout(() => {
    // console.log('[Main] Hiding loader...')
    const loader = document.getElementById('app-loader')
    if (loader) {
      loader.style.display = 'none'
      // console.log('[Main] Loader hidden')
    }
    // updateBanner('module-loaded-banner', 'APP LOADED ✓', 'green')

    // Hide diagnostic banners after successful load
    setTimeout(() => {
      const banners = ['html-loaded-banner', 'js-loaded-banner', 'module-loaded-banner']
      banners.forEach(id => {
        const el = document.getElementById(id)
        if (el) el.style.display = 'none'
      })
      // console.log('[Main] Diagnostic banners hidden')
    }, 2000)
  }, 100)
} catch (error) {
  console.error('[Main] Fatal error during initialization:', error)
  const loader = document.getElementById('app-loader')
  if (loader) loader.style.display = 'none'
  throw error
}
