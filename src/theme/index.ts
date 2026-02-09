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
      junk: '#D1D5DB',
      abundant: '#115E59',
      common: '#BEF264',
      uncommon: '#1E40AF',
      rare: '#E9D5FF',
      veryRare: '#701A75',
      magical: '#A5F3FC',
      elite: '#881337',
      epic: '#FBCFE8',
      legendary: '#7C2D12',
      mythic: '#FEF9C3',
      mythicc: '#7F1D1D',
      artifact: '#FDE68A',
      divine: '#064E3B',
      celestial: '#BAE6FD',
      realityAnchor: '#312E81',
      structural: '#DDD6FE',
      singularity: '#4C1D95',
      void: '#D9F99D',
      elder: '#0F172A',
      layer: '#FDA4AF',
      plane: '#134E4A',
      author: '#FFFFFF',
      cursed: '#4B5563',
      set: '#14B8A6',
    },
  },
})

export default theme
