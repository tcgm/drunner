import { VStack, Card, CardBody, Text } from '@chakra-ui/react'
import { CORE_CLASSES } from '../../data/classes'
import type { HeroClass } from '../../types'

interface ClassSelectionTabProps {
  selectedClass: HeroClass | null
  onClassSelect: (classId: string) => void
}

export function ClassSelectionTab({ selectedClass, onClassSelect }: ClassSelectionTabProps) {
  return (
    <VStack align="stretch" spacing={1}>
      {CORE_CLASSES.map((cls) => (
        <Card
          key={cls.name}
          size="xs"
          variant="outline"
          cursor="pointer"
          onClick={() => onClassSelect(cls.id)}
          bg={selectedClass?.id === cls.id ? 'orange.900' : 'gray.800'}
          borderColor={selectedClass?.id === cls.id ? 'orange.600' : 'gray.700'}
          _hover={{ borderColor: 'orange.500', transform: 'translateX(2px)' }}
          transition="all 0.2s"
        >
          <CardBody py={2} px={3}>
            <VStack align="start" spacing={0.5}>
              <Text fontSize="xs" fontWeight="bold" color="orange.300">
                {cls.name}
              </Text>
              <Text fontSize="2xs" color="gray.500">
                {cls.description}
              </Text>
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  )
}
