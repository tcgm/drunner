import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'gray.100',
      },
    },
  },
  colors: {
    rarity: {
      junk: '#6B7280',
      common: '#FFFFFF',
      uncommon: '#22C55E',
      rare: '#3B82F6',
      epic: '#A855F7',
      legendary: '#F59E0B',
      mythic: '#EF4444',
      artifact: '#EC4899',
      cursed: '#7C3AED',
      set: '#14B8A6',
    },
  },
})

export default theme
