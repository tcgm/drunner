/**
 * usePartySync — thin wrapper.
 *
 * All side-effectful listeners/subscriptions have moved to multiplayerService.ts.
 * This hook now just returns the plain action functions so call sites don't need
 * to change their import statements.
 */
import { claimSlot, releaseSlot, distributeRunEnd, pickDraftItem } from './multiplayerService'

export function usePartySync() {
  return { claimSlot, releaseSlot, distributeRunEnd, pickDraftItem }
}
