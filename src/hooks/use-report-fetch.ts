import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/utils/supabase"
import { useIncidentStore } from "@/store/useIncidentStore"
import { toast } from "sonner"
export function useReportFetch(
  filterType: "ALL" | "LOST" | "FOUND" = "ALL",
  search: string = ""
) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const refreshKey = useIncidentStore((state) => state.refreshKey)
  const fetchIncidents = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("lost_reports")
        .select(
          `
          *,
          animals (
            name,
            breed,
            species,
            photo_url,
            owners(
            full_name,
            phone_number
            )
          )
        `
        )
        .order("created_at", { ascending: false })

      if (filterType !== "ALL") {
        query = query.eq("status", filterType)
      }

      if (search) {
        query = query.or(
          `last_seen_location.ilike.%${search}%,incident_description.ilike.%${search}%`
        )
      }

      const { data: results, error } = await query
      if (error) throw error
      setData(results || [])
    } catch (err) {
      toast.error("Failed to fetch incidents")
      console.error("Error fetching incidents:", err)
    } finally {
      setLoading(false)
    }
  }, [filterType, search])

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents, refreshKey])

  return { data, loading, refetch: fetchIncidents }
}
