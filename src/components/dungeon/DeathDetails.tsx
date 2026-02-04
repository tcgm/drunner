import { VStack, Text, Box, HStack, Badge, Divider, Icon, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GiDeathSkull, GiSwordWound } from 'react-icons/gi'
import type { Run } from '@/types'

const MotionBox = motion.create(Box)

interface DeathDetailsProps {
  deathDetails: Run['deathDetails']
}

export default function DeathDetails({ deathDetails }: DeathDetailsProps) {
  if (!deathDetails) return null

  return (
    <MotionBox
      bg="rgba(139, 0, 0, 0.2)"
      p={5}
      borderRadius="lg"
      border="2px solid"
      borderColor="red.600"
      w="full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="center" spacing={2}>
          <Icon as={GiDeathSkull} boxSize={6} color="red.400" />
          <Text color="red.300" fontSize="lg" fontWeight="bold">
            Killing Blow
          </Text>
        </HStack>
        
        <Box textAlign="center">
          <Badge colorScheme="red" fontSize="sm" px={3} py={1} mb={2}>
            {deathDetails.eventType.toUpperCase()}
          </Badge>
          <Text color="red.200" fontSize="xl" fontWeight="semibold">
            {deathDetails.eventTitle}
          </Text>
        </Box>

        {deathDetails.heroDamage.length > 0 && (
          <>
            <Divider borderColor="red.800" />
            <Text color="red.300" fontSize="sm" fontWeight="semibold" textAlign="center">
              Damage Dealt to Heroes
            </Text>
            <SimpleGrid columns={2} spacing={3}>
              {deathDetails.heroDamage.map((damage: { heroName: string; damageReceived: number }, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <Box
                    bg="rgba(0,0,0,0.4)"
                    p={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="red.900"
                  >
                    <HStack justify="space-between">
                      <Text color="gray.300" fontSize="md">
                        {damage.heroName}
                      </Text>
                      <HStack spacing={1}>
                        <Icon as={GiSwordWound} boxSize={4} color="red.400" />
                        <Text color="red.400" fontSize="md" fontWeight="bold">
                          {damage.damageReceived}
                        </Text>
                      </HStack>
                    </HStack>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </>
        )}
      </VStack>
    </MotionBox>
  )
}
