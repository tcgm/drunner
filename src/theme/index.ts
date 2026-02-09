import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { RARITY_COLORS } from '@/systems/rarity/rarityColors'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// Convert rarity colors to Chakra theme format
const rarityThemeColors = Object.fromEntries(
  Object.entries(RARITY_COLORS).map(([key, value]) => [key, value.color])
)

// Add special colors for cursed and set items
rarityThemeColors.cursed = '#4B5563'
rarityThemeColors.set = '#14B8A6'

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
    rarity: rarityThemeColors,
  },
})

export default theme
