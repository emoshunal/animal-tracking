import { useState } from "react"
import { supabase } from "@/utils/supabase"
import { useIncidentStore } from "@/store/useIncidentStore"
import { toast } from "sonner"

export function useResolveIncident() {
  const [isResolving, setIsResolving] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const triggerRefresh = useIncidentStore((state) => state.triggerRefresh)

  const markAsFound = async (reportId: string, animalId: string) => {
    setIsResolving(reportId)
    try {
      const { error: reportError } = await supabase
        .from("lost_reports")
        .update({ status: "FOUND" })
        .eq("id", reportId)

      if (reportError) throw reportError

      const { error: animalError } = await supabase
        .from("animals")
        .update({ status: "Safe" })
        .eq("id", animalId)

      if (animalError) throw animalError

      toast.success("Great news! The animal has been marked as found.")
      triggerRefresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update status")
    } finally {
      setIsResolving(null)
    }
  }

  const deleteReport = async (reportId: string) => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from("lost_reports")
        .delete()
        .eq("id", reportId)

      if (error) throw error

      toast.success("Report deleted successfully")
      triggerRefresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete report")
      return false
    } finally {
      setIsDeleting(false)
    }
  }
  return { markAsFound, isResolving, deleteReport, isDeleting }
}
