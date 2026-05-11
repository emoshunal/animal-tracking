import { create } from "zustand"

export interface VaccinationRecord {
  id?: string
  animal_id: string
  vaccine_name: string
  lot_number: string
  administered_date: string
  expiration_date: string
  administered_by: string
  remarks: string
  animals: {
    name: string
    breed: string | null
    species: string | null
  }
}


interface MedicalState {
  isOpen: boolean
  isSubmitting: boolean
  refreshTrigger: number
  selectedRecord: VaccinationRecord | null
  onOpen: () => void
  onClose: () => void
  setEditRecord: (record: VaccinationRecord) => void
  setSubmitting: (value: boolean) => void
  triggerRefresh: () => void

  isHistoryOpen: boolean
  selectedAnimalId: string | null
  onOpenHistory: (animalId: string) => void
  onCloseHistory: () => void
}

export const useMedicalStore = create<MedicalState>((set) => ({
  isOpen: false,
  isSubmitting: false,
  selectedRecord: null,
  refreshTrigger: 0,
  onOpen: () => set({ isOpen: true, selectedRecord: null }),
  onClose: () => set({ isOpen: false, selectedRecord: null }),
  setEditRecord: (record) => set({ selectedRecord: record, isOpen: true }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  triggerRefresh: () =>
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
  
  isHistoryOpen: false,
  selectedAnimalId: null,
  onOpenHistory: (animalId) =>
    set({ isHistoryOpen: true, selectedAnimalId: animalId }),
  onCloseHistory: () => set({ isHistoryOpen: false, selectedAnimalId: null }),
}))
