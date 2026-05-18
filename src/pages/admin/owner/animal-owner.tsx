import { useSearchParams } from "react-router-dom"
import { useAnimals } from "@/hooks/use-animal" // You'll create this hook
import { PawPrint, FilterX, Dog, Cat, CircleAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AnimalRegistryPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const ownerId = searchParams.get("ownerId")

  const {
    data: animals,
    loading,
    ownerName,
  } = useAnimals("", 1, 50, 0, ownerId)

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      {ownerId && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <PawPrint size={16} />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
                Filtering by Owner
              </p>
              <h2 className="text-sm font-semibold text-slate-900">
                {ownerName || "Loading Owner..."}
              </h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-700 hover:bg-emerald-100"
            onClick={() => setSearchParams({})} // Clear filters
          >
            <FilterX className="mr-2 size-4" /> Clear Filter
          </Button>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Animal List
          </h1>
          <p className="font-medium text-slate-500">
            {ownerId
              ? `Showing animals registered to this owner.`
              : `Showing all registered community animals.`}
          </p>
        </div>
        {/* <Button
          className="bg-slate-900 shadow-md hover:bg-slate-800"
          onClick={() =>
            navigate(`/animals/new${ownerId ? `?ownerId=${ownerId}` : ""}`)
          }
        >
          <Plus className="mr-2 size-4" /> Register Animal
        </Button> */}
      </div>

      {/* --- ANIMALS GRID --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading...</p>
        ) : animals.length > 0 ? (
          animals.map((animal) => (
            <Card
              key={animal.id}
              className="border-none shadow-sm transition-all hover:ring-1 hover:ring-emerald-500"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl transition-colors ${
                        animal.species === "Dog"
                          ? "bg-blue-50 text-blue-600"
                          : animal.species === "Cat"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {animal.species === "Dog" ? (
                        <Dog size={24} strokeWidth={2.5} />
                      ) : animal.species === "Cat" ? (
                        <Cat size={24} strokeWidth={2.5} />
                      ) : (
                        <PawPrint size={24} strokeWidth={2.5} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {animal.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase"
                      >
                        {animal.breed}
                      </Badge>
                    </div>
                  </div>
                  <Badge className="border-none bg-blue-50 text-[10px] text-blue-700 uppercase">
                    {animal.gender}
                  </Badge>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Status
                    </p>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        animal.is_vaccinated
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          animal.is_vaccinated
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      />{" "}
                      {animal.is_vaccinated ? "Vaccinated" : "Unvaccinated"}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Registry ID
                    </p>
                    <p className="font-mono text-sm text-slate-600">
                      #{animal.id.split("-")[0]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 bg-white py-20">
            <div className="mb-4 text-4xl">
              <CircleAlert className="size-24 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No animals found
            </h3>
            <p className="text-slate-500">
              No animals are currently registered under this search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
