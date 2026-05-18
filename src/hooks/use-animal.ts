import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase"

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

export interface Animal {
  id: string
  owner_id: string | null
  name: string
  breed: string | null
  species: string | null
  gender: string | null
  birthDate: string | null
  qr_code_id: string
  qrStatus: string
  photo_url: string | null
  remarks: string | null
  is_vaccinated: boolean
  status: "Safe" | "Lost" | "Found" | string
  created_at: string

  owners?: Owner
}

const DEFAULT_SORT = {
  column: "created_at",
  ascending: false,
}
export function useAnimals(
  searchTerm = "",
  page = 1,
  pageSize = 10,
  refreshTrigger: number,
  ownerId: string | null = null,
  sortConfig = DEFAULT_SORT
) {
  const [data, setData] = useState<Animal[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [ownerName, setOwnerName] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function fetchAnimals() {
      setLoading(true)

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      let query = supabase
        .from("animals")
        .select("*, owners(*)", { count: "exact" })

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`)
      }

      if (ownerId) {
        query = query.eq("owner_id", ownerId)
      }

      query = query.order(sortConfig.column, {
        ascending: sortConfig.ascending,
      })

      query = query.range(from, to)

      const { data: animals, count: totalCount, error } = await query

      if (isMounted) {
        if (!error && animals) {
          setData(animals as unknown as Animal[])
          setCount(totalCount || 0)

          if (ownerId && animals.length > 0 && animals[0].owners) {
            setOwnerName((animals[0].owners as unknown as Owner).full_name)
          }
        }
        setLoading(false)
      }
    }

    //   if (!error && animals) {
    //     setData(animals as unknown as Animal[])
    //     setCount(totalCount || 0)
    //     if (ownerId && animals.length > 0 && animals[0].owners) {
    //       setOwnerName(animals[0].owners.full_name)
    //     }
    //   }
    //   setLoading(false)
    // }

    fetchAnimals()
    return () => {
      isMounted = false // Clean up execution when hook parameters change quickly
    }
    // We break down the object fields here so React only tracks the primitive strings/booleans, not the object reference
  }, [
    searchTerm,
    page,
    pageSize,
    refreshTrigger,
    ownerId,
    sortConfig.column,
    sortConfig.ascending,
  ])

  return {
    data,
    count,
    loading,
    ownerName,
    totalPages: Math.ceil(count / pageSize),
  }
}
