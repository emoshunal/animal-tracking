import { supabase } from "@/utils/supabase"
import { useIncidentStore } from "@/store/useIncidentStore"
import { toast } from "sonner"

export function useReportIncident() {
  const { setSubmitting, onClose, selectedAnimal, triggerRefresh } =
    useIncidentStore()

  const reportLost = async (formData: {
    last_seen_location: string
    last_seen_time: string
    incident_description: string
    reported_by: string
  }) => {
    if (!selectedAnimal) return

    setSubmitting(true)
    try {
      const { error: incidentError } = await supabase
        .from("lost_reports")
        .insert([
          {
            animal_id: selectedAnimal.id,
            status: "LOST",
            last_seen_location: formData.last_seen_location,
            last_seen_time: formData.last_seen_time,
            incident_description: formData.incident_description,
            reported_by:
              formData.reported_by || selectedAnimal.owners?.full_name,
          },
        ])

      if (incidentError) throw incidentError

      const { error: animalError } = await supabase
        .from("animals")
        .update({ status: "Missing" })
        .eq("id", selectedAnimal.id)

      if (animalError) throw animalError

      toast.success(`${selectedAnimal.name} has been reported as lost.`)
      triggerRefresh()
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to submit report")
    } finally {
      setSubmitting(false)
    }
  }

  return { reportLost }
}
