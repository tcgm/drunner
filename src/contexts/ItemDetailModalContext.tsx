import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Item } from '@/types'
import { ItemDetailModal } from '@/components/ui/ItemDetailModal'

interface ItemDetailModalContextType {
    openItemDetail: (item: Item) => void
    closeItemDetail: () => void
}

const ItemDetailModalContext = createContext<ItemDetailModalContextType | undefined>(undefined)

interface ItemDetailModalProviderProps {
    children: ReactNode
}

export function ItemDetailModalProvider({ children }: ItemDetailModalProviderProps) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)

    const openItemDetail = useCallback((item: Item) => {
        setSelectedItem(item)
    }, [])

    const closeItemDetail = useCallback(() => {
        setSelectedItem(null)
    }, [])

    return (
        <ItemDetailModalContext.Provider value={{ openItemDetail, closeItemDetail }}>
            {children}
            {selectedItem && (
                <ItemDetailModal
                    item={selectedItem}
                    isOpen={true}
                    onClose={closeItemDetail}
                />
            )}
        </ItemDetailModalContext.Provider>
    )
}

export function useItemDetailModal() {
    const context = useContext(ItemDetailModalContext)
    if (!context) {
        throw new Error('useItemDetailModal must be used within ItemDetailModalProvider')
    }
    return context
}
