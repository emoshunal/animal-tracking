// hooks/useVaccinations.ts
import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/utils/supabase"
import { useMedicalStore } from "@/store/useMedicalStore"
import type { VaccinationRecord } from "@/store/useMedicalStore"

export function useVaccinations(
  searchTerm: string,
  page: number,
  pageSize: number,
  animalId?: string | null
) {
  const [data, setData] = useState<VaccinationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)

  const refreshTrigger = useMedicalStore((state) => state.refreshTrigger)

  const fetchVaccinations = useCallback(async () => {
    setLoading(true)
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      let query = supabase.from("vaccination_records").select(
        `
          *,
          animals!inner (
            name,
            breed,
            species
          )
        `,
        { count: "exact" }
      )

      if (animalId && animalId.trim() !== "") {
        query = query.eq("animal_id", animalId)
      } else if (searchTerm && searchTerm.trim() !== "") {
        query = query.or(
          `vaccine_name.ilike.%${searchTerm}%,animals.name.ilike.%${searchTerm}%`
        )
      }

      const { data, error, count } = await query
        .order("administered_date", { ascending: false })
        .range(from, to)

      if (error) throw error

      setData(data as unknown as VaccinationRecord[])
      setTotalPages(Math.ceil((count || 0) / pageSize))
    } catch (err) {
      console.error("Error fetching vaccinations:", err)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, page, pageSize, animalId])

  useEffect(() => {
    fetchVaccinations()
  }, [fetchVaccinations, refreshTrigger])

  return { data, loading, totalPages, animalId, refetch: fetchVaccinations }
}
