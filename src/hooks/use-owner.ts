import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/utils/supabase"
import { useOwnerStore } from "@/store/useOwnerStore"

export interface Owner {
  id: string
  full_name: string
  phone_number: string
  email?: string
  sitio?: string
  street?: string
  address?: string
  created_at: string
}

export function useOwners(searchTerm: string, page: number, pageSize: number) {
  const [data, setData] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)

  const refreshTrigger = useOwnerStore((state) => state.refreshTrigger)

  const fetchOwners = useCallback(async () => {
    setLoading(true)
    try {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

     let query = supabase
       .from("owners")
       .select(
         `
        *,
        animals:animals(count)
      `,
         { count: "exact" }
       ) 
       .order("created_at", { ascending: false })
       .range(from, to)

      if (searchTerm) {
        query = query.or(
          `full_name.ilike.%${searchTerm}%,sitio.ilike.%${searchTerm}%`
        )
      }

      const { data, error, count } = await query

      if (error) throw error

      const formattedData = data.map((owner) => ({
        ...owner,
        animalCount: owner.animals?.[0]?.count || 0,
      }))

     setData(formattedData)
     setTotalPages(Math.ceil((count || 0) / pageSize))
    } catch (err) {
      console.error("Error fetching owners:", err)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, page, pageSize])


  useEffect(() => {
    fetchOwners()
  }, [fetchOwners, refreshTrigger])

  return { data, loading, totalPages, refetch: fetchOwners }
}
