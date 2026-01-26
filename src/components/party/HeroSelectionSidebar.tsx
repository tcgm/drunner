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
    <Box className="hero-selection-sidebar" w="280px" minW="280px" overflowY="auto" px={3} py={3} bg="gray.900" borderRight="2px solid" borderColor="gray.800">
      <Tabs size="sm" colorScheme="orange" isLazy index={tabIndex} onChange={onTabChange}>
        <TabList mb={3}>
          <Tab>Classes</Tab>
          <Tab>Roster</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <ClassSelectionTab
              selectedClass={selectedClass}
              onClassSelect={onClassSelect}
            />
          </TabPanel>

          <TabPanel p={0}>
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
