import { useState } from "react"
import { supabase } from "@/utils/supabase"
import { useIncidentStore } from "@/store/useIncidentStore"
import { toast } from "sonner"

export function useResolveIncident() {
  const [isResolving, setIsResolving] = useState<string | null>(null)
  const triggerRefresh = useIncidentStore((state) => state.triggerRefresh)

  const markAsFound = async (reportId: string, animalId: string) => {
    setIsResolving(reportId)
    try {
      // 1. Update the Lost Report status
      const { error: reportError } = await supabase
        .from("lost_reports")
        .update({ status: "FOUND" })
        .eq("id", reportId)

      if (reportError) throw reportError

      // 2. Update the Animal status to Safe
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

  return { markAsFound, isResolving }
}
