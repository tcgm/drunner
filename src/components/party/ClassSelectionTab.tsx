import { Box, Heading, VStack, Text } from '@chakra-ui/react'
import { CORE_CLASSES } from '../../data/classes'
import type { HeroClass } from '../../types'
import ClassCard from './ClassCard'

interface ClassSelectionTabProps {
  selectedClass: HeroClass | null
  onClassSelect: (classId: string) => void
}

export function ClassSelectionTab({ selectedClass, onClassSelect }: ClassSelectionTabProps) {
  return (
    <VStack className="class-selection-tab" align="stretch" spacing={2}>
      <Box flexShrink={0} mb={2}>
        <Heading size="xs" color="orange.300" mb={1}>
          Hero Classes
        </Heading>
        <Text fontSize="xs" color="gray.500">
          {selectedClass ? `Selected: ${selectedClass.name}` : 'Select a class'}
        </Text>
      </Box>
      
      {CORE_CLASSES.map((cls) => (
        <ClassCard
          key={cls.id}
          heroClass={cls}
          isSelected={selectedClass?.id === cls.id}
          partyHasClass={false}
          onClick={() => onClassSelect(cls.id)}
        />
      ))}
    </VStack>
  )
}
