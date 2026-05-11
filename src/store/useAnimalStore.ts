import { create } from "zustand"
import type { Animal } from "@/hooks/use-animal"
interface AnimalState {
  isOpen: boolean
  isStray: boolean
  isSubmitting: boolean
  onOpen: () => void
  onClose: () => void
  toggleStray: (value: boolean) => void
  setSubmitting: (value: boolean) => void
  preselectedOwnerId: string | null
  selectedAnimal: Animal | null
  setEditAnimal: (animal: Animal | null) => void
  refreshTrigger: number
  triggerRefresh: () => void
  setPreselectedOwner: (id: string | null) => void
}

export const useAnimalStore = create<AnimalState>((set) => ({
  isOpen: false,
  isStray: false,
  isSubmitting: false,
  preselectedOwnerId: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () =>
    set({
      isOpen: false,
      isStray: false,
      selectedAnimal: null,
      preselectedOwnerId: null,
    }), // Reset stray on close
  toggleStray: (value) => set({ isStray: value }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  selectedAnimal: null,
  setEditAnimal: (animal) =>
    set({
      selectedAnimal: animal,
      isStray: animal ? !animal.owner_id : false,
    }),
  refreshTrigger: 0,
  triggerRefresh: () =>
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
  setPreselectedOwner: (id) => set({ preselectedOwnerId: id }),
}))