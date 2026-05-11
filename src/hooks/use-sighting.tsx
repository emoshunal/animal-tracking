import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/utils/supabase"

export function useSightingFetch() {
  const [sightings, setSightings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSightings = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("sighting_reports")
        .select(
          `
          *,
          animals (
            name,
            qr_code_id,
            photo_url
          )
        `
        )
        .order("created_at", { ascending: false })

      if (error) throw error
      setSightings(data || [])
    } catch (err) {
      console.error("Error fetching sightings:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSightings()
  }, [fetchSightings])

  return { sightings, loading, refetch: fetchSightings }
}
