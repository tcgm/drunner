import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { ClassSelectionTab } from './ClassSelectionTab'
import { RosterTab } from './RosterTab'
import type { HeroClass, Hero } from '../../types'

interface HeroSelectionSidebarProps {
  tabIndex: number
  onTabChange: (index: number) => void
  selectedClass: HeroClass | null
  selectedHeroFromRoster: number | null
  storedHeroes: Hero[]
  onClassSelect: (classId: string) => void
  onRosterHeroClick: (index: number) => void
}

export function HeroSelectionSidebar({
  tabIndex,
  onTabChange,
  selectedClass,
  selectedHeroFromRoster,
  storedHeroes,
  onClassSelect,
  onRosterHeroClick
}: HeroSelectionSidebarProps) {
  return (
    <Box w="200px" bg="gray.900" borderRight="1px solid" borderColor="gray.700" overflow="auto">
      <Tabs variant="soft-rounded" colorScheme="orange" index={tabIndex} onChange={onTabChange}>
        <TabList px={2} py={2} flexDirection="column" gap={1}>
          <Tab justifyContent="flex-start" fontSize="xs">Classes</Tab>
          <Tab justifyContent="flex-start" fontSize="xs">Roster</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={2} py={2}>
            <ClassSelectionTab
              selectedClass={selectedClass}
              onClassSelect={onClassSelect}
            />
          </TabPanel>

          <TabPanel px={2} py={2}>
            <RosterTab
              storedHeroes={storedHeroes}
              selectedHeroFromRoster={selectedHeroFromRoster}
              onRosterHeroClick={onRosterHeroClick}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
