import { create } from "zustand"
import type { Animal } from "@/hooks/use-animal"

interface IncidentState {
  isOpen: boolean
  step: number
  selectedAnimal: Animal | null
  isSubmitting: boolean
  refreshKey: number
  triggerRefresh: () => void
  onOpen: () => void
  onClose: () => void
  setStep: (step: number) => void
  setSelectedAnimal: (animal: Animal | null) => void
  setSubmitting: (value: boolean) => void
  reset: () => void
}

export const useIncidentStore = create<IncidentState>((set) => ({
  isOpen: false,
  step: 1,
  selectedAnimal: null,
  isSubmitting: false,
  refreshKey: 0,
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, step: 1, selectedAnimal: null }),
  setStep: (step) => set({ step }),
  setSelectedAnimal: (animal) =>
    set({ selectedAnimal: animal, step: animal ? 2 : 1 }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  reset: () => set({ step: 1, selectedAnimal: null, isSubmitting: false }),
}))
