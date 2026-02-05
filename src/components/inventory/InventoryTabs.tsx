import { Tabs, TabList, TabPanels, Tab, TabPanel, Icon } from '@chakra-ui/react'
import { memo } from 'react'
import { GiCrossedSwords, GiCheckedShield, GiHealthPotion } from 'react-icons/gi'
import type { Item } from '@/types'

interface InventoryTabsProps {
  itemsByType: Record<string, Item[]>
  renderContent: (items: Item[]) => React.ReactNode
}

export const InventoryTabs = memo(function InventoryTabs({ 
  itemsByType, 
  renderContent
}: InventoryTabsProps) {
  return (
    <Tabs className="inventory-tabs" variant="enclosed" colorScheme="orange">
      <TabList
        className="inventory-tab-list"
        borderColor="gray.700" 
        mb={0}
      >
        <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
          All ({itemsByType.all?.length || 0})
        </Tab>
        <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
          <Icon as={GiCrossedSwords} mr={2} />
          Weapons ({itemsByType.weapon?.length || 0})
        </Tab>
        <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
          <Icon as={GiCheckedShield} mr={2} />
          Armor ({itemsByType.armor?.length || 0})
        </Tab>
        <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
          Helmets ({itemsByType.helmet?.length || 0})
        </Tab>
        <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
          Boots ({itemsByType.boots?.length || 0})
        </Tab>
        <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
          Accessories ({itemsByType.accessories?.length || 0})
        </Tab>
        <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
          <Icon as={GiHealthPotion} mr={2} />
          Consumables ({itemsByType.consumables?.length || 0})
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel px={0} py={1}>
          {renderContent(itemsByType.all || [])}
        </TabPanel>
        <TabPanel px={0} py={1}>
          {renderContent(itemsByType.weapon || [])}
        </TabPanel>
        <TabPanel px={0} py={1}>
          {renderContent(itemsByType.armor || [])}
        </TabPanel>
        <TabPanel px={0} py={1}>
          {renderContent(itemsByType.helmet || [])}
        </TabPanel>
        <TabPanel px={0} py={1}>
          {renderContent(itemsByType.boots || [])}
        </TabPanel>
        <TabPanel px={0} py={1}>
          {renderContent(itemsByType.accessories || [])}
        </TabPanel>
        <TabPanel px={0} py={1}>
          {renderContent(itemsByType.consumables || [])}
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
})
