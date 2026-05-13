import { useEffect, useState } from "react"
import {
  Syringe,
  Calendar,
  Search,
  Save,
  Stethoscope,
  Building2,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { VaccinationRecord } from "@/store/useMedicalStore"
import { useMedicalStore } from "@/store/useMedicalStore"
import type { Animal } from "@/hooks/use-animal"
import { AnimalSearch } from "./animal-search"
import { toast } from "sonner"
import { supabase } from "@/utils/supabase"

export function LogVaccinationModal() {
  const {
    isOpen,
    onClose,
    selectedRecord,
    isSubmitting,
    setSubmitting,
    triggerRefresh,
  } = useMedicalStore()
  const [formData, setFormData] = useState<Partial<VaccinationRecord>>({})

  const handleSelectAnimal = (animal: Animal) => {
    setFormData((prev) => ({
      ...prev,
      animal_id: animal.id,
      animals: {
        name: animal.name,
        species: animal.species,
        breed: animal.breed,
      },
    }))
  }

  useEffect(() => {
    if (selectedRecord) {
      setFormData(selectedRecord)
    } else {
      setFormData({
        administered_date: new Date().toISOString().split("T")[0],
      })
    }
  }, [selectedRecord, isOpen])

  const displaySpecies = selectedRecord?.animals?.species || ""

  const handleSave = async () => {
    if (
      !formData.animal_id ||
      !formData.vaccine_name ||
      !formData.administered_date
    ) {
      toast.error(
        "Please fill in all required fields: Animal, Vaccine Type, and Date Administered."
      )
      return
    }
    setSubmitting(true)
    try {
      const { animals, ...payload } = formData
      let error
      if (selectedRecord?.id) {
        const { error: updateError } = await supabase
          .from("vaccination_records")
          .update(payload)
          .eq("id", selectedRecord.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from("vaccination_records")
          .insert(payload)
        error = insertError
      }
      if (error) throw error
      toast.success(
        `Vaccination record ${selectedRecord ? "updated" : "logged"} successfully!`
      )

      const { error: animalUpdateError } = await supabase
        .from("animals")
        .update({ is_vaccinated: true })
        .eq("id", formData.animal_id)

      if (animalUpdateError) {
        console.warn(
          "Record saved, but failed to update animal status:",
          animalUpdateError
        )
      }
      triggerRefresh()
    } catch (err: any) {
      console.error("Error saving vaccination record:", err)
      toast.error(err.message || "Failed to save record")
    } finally {
      setSubmitting(false)
    }

    console.log("Saving Vaccination Record:", formData)
    setTimeout(() => {
      setSubmitting(false)
      onClose()
    }, 1000)
  }
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex !w-full flex-col gap-0 border-l border-emerald-100/30 bg-white p-0 sm:!w-[550px] sm:!max-w-none">
        {/* Header Section */}
        <div className="bg-emerald-600 p-6 text-white">
          <SheetHeader className="text-left">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                <Syringe className="size-5 text-white" />
              </div>
              <Badge
                variant="outline"
                className="border-white/30 text-[10px] tracking-widest text-white uppercase"
              >
                {selectedRecord ? "Update Log" : "New Medical Entry"}
              </Badge>
            </div>
            <SheetTitle className="text-2xl font-bold tracking-tight text-white">
              {selectedRecord ? "Edit Vaccination" : "Log Vaccination"}
            </SheetTitle>
            <SheetDescription className="font-medium text-emerald-50/80">
              Record a treatment and set the next immunization schedule.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Search className="size-4" />
              <h3 className="text-xs font-bold tracking-wider uppercase">
                Select Animal
              </h3>
            </div>
            {!selectedRecord && <AnimalSearch onSelect={handleSelectAnimal} />}

            {formData.animal_id && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/30 p-3">
                <div className="flex size-10 items-center justify-center rounded-lg border border-emerald-100 bg-white font-bold text-emerald-700 shadow-sm">
                  {displaySpecies === "Dog"
                    ? "🐕"
                    : displaySpecies === "Cat"
                      ? "🐈"
                      : "🐾"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    {formData.animals?.name}
                  </p>
                  <p className="font-mono text-[10px] text-emerald-700">
                    {formData.animal_id}
                  </p>
                </div>
                {!selectedRecord && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px]"
                    onClick={() => setFormData({ ...formData, animal_id: "" })}
                  >
                    Change
                  </Button>
                )}
              </div>
            )}
          </div>

          <Separator className="opacity-50" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Stethoscope className="size-4" />
              <h3 className="text-xs font-bold tracking-wider uppercase">
                Vaccination Details
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">
                  Vaccine Type
                </Label>
                <Select
                  value={formData.vaccine_name}
                  onValueChange={(v) =>
                    setFormData({ ...formData, vaccine_name: v })
                  }
                >
                  <SelectTrigger className="h-11 w-full border-none bg-slate-50">
                    <SelectValue placeholder="Select Vaccine" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="anti-rabies">Anti-Rabies</SelectItem>
                    <SelectItem value="5-in-1">5-in-1 (Canine)</SelectItem>
                    <SelectItem value="4-in-1">4-in-1 (Feline)</SelectItem>
                    <SelectItem value="deworming">Deworming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">
                  Manufacturer / Lot #
                </Label>
                <Input
                  placeholder="e.g. Nobivac #1234"
                  className="h-11 border-none bg-slate-50"
                  value={formData.lot_number}
                  onChange={(e) =>
                    setFormData({ ...formData, lot_number: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">
                  Date Administered
                </Label>
                <div className="relative">
                  <Calendar className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="date"
                    className="h-11 border-none bg-slate-50 pl-10"
                    value={formData.administered_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        administered_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">
                  Next Due Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-emerald-500" />
                  <Input
                    type="date"
                    className="h-11 border-none bg-emerald-50/50 pl-10 ring-1 ring-emerald-100"
                    value={formData.expiration_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expiration_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="opacity-50" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Building2 className="size-4" />
              <h3 className="text-xs font-bold tracking-wider uppercase">
                Provider Information
              </h3>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase">
                Administered By
              </Label>
              <Input
                placeholder="e.g. Dr. Ramos - City Veterinary Office"
                className="h-11 border-none bg-slate-50"
                value={formData.administered_by}
                onChange={(e) =>
                  setFormData({ ...formData, administered_by: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase">
                Medical Notes / Side Effects
              </Label>
              <Textarea
                placeholder="Any observations after injection..."
                className="min-h-[80px] resize-none border-none bg-slate-50 p-4 focus-visible:ring-emerald-500"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <SheetFooter className="border-t bg-slate-50/50 p-6">
          <div className="flex w-full gap-3">
            <Button
              variant="ghost"
              className="h-12 flex-1 text-slate-500 hover:bg-slate-100"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="h-12 flex-1 bg-emerald-600 font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95"
              onClick={handleSave}
            >
              <Save className="mr-2 size-4" />{" "}
              {isSubmitting
                ? "Processing..."
                : selectedRecord
                  ? "Update Log"
                  : "Save Record"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
