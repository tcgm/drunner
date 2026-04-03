import {
  HStack,
  VStack,
  Text,
  Box,
  Icon,
  ModalCloseButton,
} from '@chakra-ui/react'
import { GiCrossedSwords, GiStarsStack, GiCoins } from 'react-icons/gi'

interface GuildHallHeaderProps {
  bankGold: number
  metaXp: number
}

export function GuildHallHeader({ bankGold, metaXp }: GuildHallHeaderProps) {
  return (
    <Box
      px={{ base: 4, md: 8 }} py={3}
      borderBottom="1px solid" borderColor="gray.800"
      bgGradient="linear(to-b,rgba(30,15,5,0.98),rgba(26,32,44,0.90))"
      flexShrink={0}
    >
      <HStack justify="space-between">
        <HStack spacing={4}>
          <Box
            bg="orange.900" border="2px solid" borderColor="orange.600"
            borderRadius="xl" p={2.5}
            boxShadow="0 0 20px rgba(249,115,22,0.3)"
          >
            <Icon as={GiCrossedSwords} color="orange.300" boxSize={7} />
          </Box>
          <VStack spacing={0} align="flex-start">
            <Text
              color="orange.200" fontWeight="extrabold"
              fontSize={{ base: 'xl', md: '2xl' }}
              letterSpacing="wide" textShadow="0 0 20px rgba(249,115,22,0.5)"
            >
              Guild Hall
            </Text>
            <HStack spacing={3}>
              <Text color="gray.500" fontSize="xs" fontStyle="italic">Adventurers' Sanctum</Text>
              <Text color="gray.700" fontSize="xs">·</Text>
              <HStack spacing={1}>
                <Icon as={GiCoins} color="yellow.500" boxSize={3} />
                <Text color="yellow.400" fontSize="xs" fontWeight="bold">{bankGold.toLocaleString()}g</Text>
              </HStack>
              <Text color="gray.700" fontSize="xs">·</Text>
              <HStack spacing={1}>
                <Icon as={GiStarsStack} color="cyan.500" boxSize={3} />
                <Text color="cyan.400" fontSize="xs" fontWeight="bold">{metaXp.toLocaleString()} XP</Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
        <ModalCloseButton
          color="gray.400" top={3} right={{ base: 4, md: 8 }}
          size="lg" _hover={{ color: 'orange.300' }}
        />
      </HStack>
    </Box>
  )
}
