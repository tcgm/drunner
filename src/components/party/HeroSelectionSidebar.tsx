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
    <Box className="hero-selection-sidebar" w="280px" minW="280px" px={3} py={3} bg="gray.900" borderRight="2px solid" borderColor="gray.800" display="flex" flexDirection="column" overflow="hidden">
      <Tabs size="sm" colorScheme="orange" isLazy index={tabIndex} onChange={onTabChange} display="flex" flexDirection="column" flex={1} overflow="hidden">
        <TabList mb={3} flexShrink={0}>
          <Tab>Classes</Tab>
          <Tab>Roster</Tab>
        </TabList>

        <TabPanels flex={1} overflow="hidden">
          <TabPanel p={0} h="100%">
            <ClassSelectionTab
              selectedClass={selectedClass}
              onClassSelect={onClassSelect}
            />
          </TabPanel>

          <TabPanel p={0} h="100%">
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
