import { VStack, SimpleGrid, Box, Text, Badge, Flex, Icon as ChakraIcon, Button } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { HeroClass, Hero } from '@/types'

interface HeroSlotProps {
  hero: Hero | null
  index: number
  selectedClass: HeroClass | null
  isHovered: boolean
  onAdd: () => void
  onRemove: (id: string) => void
  onHover: (index: number | null) => void
}

export default function HeroSlot({ 
  hero, 
  index, 
  selectedClass,
  isHovered,
  onAdd,
  onRemove,
  onHover
}: HeroSlotProps) {
  const isEmpty = !hero
  
  return (
    <Box
      position="relative"
      h="auto"
      w="full"
      bg={isEmpty ? 'gray.800' : 'linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(45, 55, 72, 0.9) 100%)'}
      borderRadius="xl"
      borderWidth="3px"
      borderColor={isHovered ? 'orange.500' : isEmpty ? 'gray.700' : 'orange.800'}
      cursor={isEmpty && selectedClass ? 'pointer' : 'default'}
      onClick={() => isEmpty && selectedClass && onAdd()}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      transition="all 0.3s"
      _hover={isEmpty && selectedClass ? { borderColor: 'orange.400', transform: 'scale(1.02)', boxShadow: '0 8px 24px rgba(251, 146, 60, 0.3)' } : {}}
      overflow="hidden"
      boxShadow={isEmpty ? 'none' : '0 4px 16px rgba(0,0,0,0.4)'}
    >
      {isEmpty ? (
        <Flex h="120px" align="center" justify="center" direction="column">
          <ChakraIcon as={GameIcons.GiCircle} boxSize={12} color="gray.600" mb={2} />
          <Text color="gray.500" fontSize="sm" fontWeight="bold" textAlign="center" px={2}>
            {selectedClass ? selectedClass.name : 'Empty Slot'}
          </Text>
          <Text color="gray.600" fontSize="xs" mt={1}>Slot {index + 1}</Text>
        </Flex>
      ) : (
        <>
          {/* Background Icon Effect */}
          <Box
            position="absolute"
            top="-20px"
            right="-20px"
            opacity={0.08}
            transform="rotate(-15deg)"
          >
            <Icon 
              as={(GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman} 
              boxSize={40} 
              color="orange.400"
            />
          </Box>
          
          <VStack spacing={1} p={1} position="relative" zIndex={1}>
            {/* Main Icon */}
            <Box
              bg="linear-gradient(135deg, rgba(194, 65, 12, 0.3) 0%, rgba(234, 88, 12, 0.3) 100%)"
              borderRadius="lg"
              p={1}
              borderWidth="2px"
              borderColor="orange.700"
              boxShadow="0 0 20px rgba(234, 88, 12, 0.2)"
              position="relative"
            >
              <ChakraIcon 
                as={(GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman} 
                boxSize={12} 
                color="orange.300"
              />
              {/* Glow effect */}
              <Box
                position="absolute"
                inset={0}
                borderRadius="lg"
                bg="orange.500"
                opacity={0.1}
                filter="blur(10px)"
              />
            </Box>
            
            {/* Hero Info */}
            <VStack spacing={0.5} w="full">
              <Text fontWeight="bold" fontSize="sm" color="orange.200" w="full" textAlign="center">
                {hero.name}
              </Text>
              <Badge colorScheme="orange" fontSize="xs">
                Lv{hero.level}
              </Badge>
              
              {/* Stats Grid */}
              <SimpleGrid columns={2} spacing={1} w="full" pt={1} fontSize="xs">
                <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                  <Text color="gray.500">HP</Text>
                  <Text fontWeight="bold" color="cyan.400">{hero.stats.maxHp}</Text>
                </VStack>
                <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                  <Text color="gray.500">ATK</Text>
                  <Text fontWeight="bold" color="red.400">{hero.stats.attack}</Text>
                </VStack>
                <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                  <Text color="gray.500">DEF</Text>
                  <Text fontWeight="bold" color="blue.400">{hero.stats.defense}</Text>
                </VStack>
                <VStack spacing={0} bg="gray.900" borderRadius="md" p={1}>
                  <Text color="gray.500">SPD</Text>
                  <Text fontWeight="bold" color="green.400">{hero.stats.speed}</Text>
                </VStack>
              </SimpleGrid>
            </VStack>
            
            {/* Remove Button */}
            <Button
              size="sm"
              colorScheme="red"
              variant="solid"
              w="full"
              leftIcon={<ChakraIcon as={GameIcons.GiCancel} />}
              onClick={(e) => {
                e.stopPropagation()
                onRemove(hero.id)
              }}
              fontSize="xs"
              mt={1}
            >
              Remove
            </Button>
          </VStack>
        </>
      )}
      
      {/* Slot Number Badge */}
      <Box
        position="absolute"
        top={2}
        right={2}
        bg="gray.900"
        borderRadius="full"
        w={7}
        h={7}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="xs"
        fontWeight="bold"
        color="gray.400"
        borderWidth="2px"
        borderColor="gray.700"
      >
        {index + 1}
      </Box>
      
      {/* Selected glow */}
      {!isEmpty && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="3px"
          bg="linear-gradient(90deg, transparent, orange.400, transparent)"
          boxShadow="0 0 10px rgba(251, 146, 60, 0.8)"
        />
      )}
    </Box>
  )
}
