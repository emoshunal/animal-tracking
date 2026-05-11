import { useState, useEffect } from "react"
import { Search, Loader2, Dog, Cat, PawPrint } from "lucide-react"
import { Input } from "@/components/ui/input"
import { supabase } from "@/utils/supabase"
import type { Animal } from "@/hooks/use-animal"

interface AnimalSearchProps {
  onSelect: (animal: Animal) => void
}

export function AnimalSearch({ onSelect }: AnimalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Animal[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const searchAnimals = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsSearching(true)
      const { data, error } = await supabase
        .from("animals")
        .select("*, owners(full_name)")
        .or(`name.ilike.%${query}%,qr_code_id.ilike.%${query}%`)
        .limit(5)

      if (!error && data) {
        setResults(data as unknown as Animal[])
      }
      setIsSearching(false)
    }

    const debounce = setTimeout(searchAnimals, 300)
    return () => clearTimeout(debounce)
  }, [query])

  return (
    <div className="relative w-full">
      <div className="relative">
        {isSearching ? (
          <Loader2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-spin text-emerald-600" />
        ) : (
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
        )}
        <Input
          placeholder="Search by Animal Name or QR ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 border-none bg-slate-50 pl-10 shadow-inner focus-visible:ring-emerald-500"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
          {results.map((animal) => (
            <button
              key={animal.id}
              onClick={() => {
                onSelect(animal)
                setQuery("")
                setResults([])
              }}
              className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-emerald-50"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                {animal.species === "Dog" ? (
                  <Dog size={18} />
                ) : animal.species === "Cat" ? (
                  <Cat size={18} />
                ) : (
                  <PawPrint size={18} />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-900">
                  {animal.name}
                  <span className="ml-2 font-mono text-[10px] text-emerald-600 uppercase">
                    {animal.qr_code_id}
                  </span>
                </p>
                <p className="truncate text-[11px] text-amber-400">
                  {animal.owners?.full_name || "Community Stray"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
