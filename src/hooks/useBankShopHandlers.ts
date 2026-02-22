import { useDisclosure } from '@chakra-ui/react'
import { useGameStore } from '@/core/gameStore'
import { GAME_CONFIG } from '@/config/gameConfig'
import type { Consumable, Item } from '@/types'

/**
 * Shared hook for shop purchase handlers used across screens that have a potion shop,
 * market hall, and featured item purchase. Centralises the bank-full guard and
 * gold-deduction + item-placement logic so screens don't duplicate it.
 *
 * @param onBankFull  Optional override for what to do when the bank is full.
 *                    Defaults to opening the built-in BuyBankSlotsModal.
 *                    Pass `onBankOpen` from TownHubScreen to redirect to the bank instead.
 */
export function useBankShopHandlers(onBankFull?: () => void) {
  const {
    bankInventory,
    bankStorageSlots,
    bankGold,
    moveItemToBank,
    spendBankGold,
    expandBankStorage,
  } = useGameStore()

  // BuyBankSlotsModal disclosure — used by DungeonPrepScreen and PartySetupScreen.
  // TownHubScreen passes its own onBankFull so this never opens there.
  const { isOpen: isBuySlotsOpen, onOpen: onBuySlotsOpen, onClose: onBuySlotsClose } = useDisclosure()

  const handleBankFull = () => {
    if (onBankFull) {
      onBankFull()
    } else {
      onBuySlotsOpen()
    }
  }

  /** Potion shop purchase — spends gold at shop price and places item in bank. */
  const handlePurchasePotion = (potion: Consumable, price: number) => {
    if (spendBankGold(price)) {
      moveItemToBank(potion)
    }
  }

  /** Market consumable — same as above but guards against a full bank first. */
  const handlePurchaseConsumable = (consumable: Consumable, price: number) => {
    if (bankInventory.length >= bankStorageSlots) {
      handleBankFull()
      return
    }
    if (spendBankGold(price)) {
      moveItemToBank(consumable)
    }
  }

  /** Featured / equipment item purchase — guards against a full bank first. */
  const handlePurchaseItem = (item: Item, price: number) => {
    if (bankInventory.length >= bankStorageSlots) {
      handleBankFull()
      return
    }
    if (spendBankGold(price)) {
      moveItemToBank(item)
    }
  }

  /** Expand bank storage, deducting the configured cost per slot. */
  const handleExpandBank = (slots: number) => {
    const totalCost = slots * GAME_CONFIG.bank.costPerSlot
    if (bankGold >= totalCost) {
      expandBankStorage(slots)
    }
  }

  return {
    handlePurchasePotion,
    handlePurchaseConsumable,
    handlePurchaseItem,
    handleExpandBank,
    isBuySlotsOpen,
    onBuySlotsClose,
  }
}
