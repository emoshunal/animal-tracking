import type { Owner } from "@/hooks/use-owner"
import { create } from "zustand"

interface OwnerState {
  isOpen: boolean
  isSubmitting: boolean
  selectedOwner: Owner | null
  onOpen: () => void
  onClose: () => void
  setSubmitting: (value: boolean) => void
  setEditOwner: (owner: Owner | null) => void
  refreshTrigger: number
  triggerRefresh: () => void
  isViewOpen: boolean
  viewingOwner: any | null
  onViewOpen: (owner: any) => void
  onViewClose: () => void
}

export const useOwnerStore = create<OwnerState>((set) => ({
  isOpen: false,
  isSubmitting: false,
  selectedOwner: null,
  refreshTrigger: 0,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  setEditOwner: (owner) => set({ selectedOwner: owner }),
  triggerRefresh: () =>
  set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
  isViewOpen: false,
  viewingOwner: null,
  onViewOpen: (owner) => set({ isViewOpen: true, viewingOwner: owner }),
  onViewClose: () => set({ isViewOpen: false, viewingOwner: null }),
}))
