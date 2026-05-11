import { useEffect, useState } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  QrCode,
  Printer,
  Download,
  ExternalLink,
  Plus,
  HeartPulse,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RegisterAnimalModal } from "@/components/register-animal"
import { useAnimalStore } from "@/store/useAnimalStore"
import { useAnimals } from "@/hooks/use-animal"
import type { Animal } from "@/hooks/use-animal"
import { cn } from "@/lib/utils"

import { AnimalProfileModal } from "@/components/animal-profile"
import { QRCodeCanvas } from "qrcode.react"
import { downloadQRCode, printQRCode } from "@/utils/qrcode"

import { useNavigate } from "react-router-dom"

export default function AnimalRecords() {
  const navigate = useNavigate()
  const onOpen = useAnimalStore((state) => state.onOpen)
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

  const [debouncedSearch, setDebouncedSearch] = useState("")

  const modal = useAnimalStore()
  const refreshTrigger = modal.refreshTrigger

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to page 1 on new search
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const { data, totalPages, loading } = useAnimals(
    debouncedSearch,
    page,
    PAGE_SIZE,
    refreshTrigger
  )

  const handleQrClick = (qrId: string) => {
    navigate("/info", { state: { qrId } })
  }

  return (
    <div className="min-h-screen flex-1 space-y-6 bg-slate-50/50 p-8 pt-6 font-sans">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Animal Records</h1>
          <p className="pt-2 text-sm font-normal text-muted-foreground">
            Manage QR-based identification tags and scan history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            className="border-slate-200 bg-white shadow-sm"
          >
            <Printer className="mr-2 size-4" /> Bulk Print QR
          </Button> */}
          <Button
            onClick={onOpen}
            className="bg-emerald-600 font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700"
          >
            <Plus className="mr-2 size-4" /> Register Animal
          </Button>
          <RegisterAnimalModal />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600">
            <QrCode className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-tight text-slate-500 uppercase">
              Active Tags
            </p>
            <p className="text-xl font-bold">1,024</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <History className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-tight text-slate-500 uppercase">
              Total Scans (24h)
            </p>
            <p className="text-xl font-bold">482</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
            <Printer className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-tight text-slate-500 uppercase">
              Pending Print
            </p>
            <p className="text-xl font-bold">12</p>
          </div>
        </div>
      </div> */}

      {/* --- TABLE SECTION --- */}
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-md">
        <div className="flex items-center gap-4 border-b border-slate-100 p-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Filter records..."
              className="h-10 border-none bg-slate-50 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {loading && (
            <span className="animate-pulse text-xs text-slate-400">
              Loading...
            </span>
          )}
          <Button variant="ghost" size="sm" className="text-slate-500">
            <Filter className="mr-2 size-4" /> Filters
          </Button>
        </div>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Animal & Breed
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                QR Identity
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Ownership
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Health & Safety
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!loading &&
              data.map((animal) => (
                <tr
                  key={animal.id}
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {animal.photo_url ? (
                        <img
                          src={animal.photo_url}
                          className="size-10 rounded-xl border border-slate-200 object-cover shadow-sm"
                          alt={animal.name}
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white shadow-inner">
                          {animal.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="mb-1 leading-none font-bold text-slate-900">
                          {animal.name}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {animal.species} • {animal.breed || "Mixed"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div
                      onClick={() => handleQrClick(animal.qr_code_id)}
                      className="group flex w-fit cursor-pointer flex-col gap-1 transition-all active:scale-95"
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-700 group-hover:text-emerald-600">
                        <QrCode className="size-3 text-slate-400 group-hover:text-emerald-500" />
                        {animal.qr_code_id}
                        <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>

                      <span className="flex items-center gap-1 text-[9px] font-bold tracking-tight text-emerald-600 uppercase">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        Active Tag
                      </span>
                    </div>
                    {/* <div className="flex flex-col gap-1">
                      <div className="text-truncate flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-700">
                        <QrCode className="size-3 text-slate-400" />
                        {animal.qr_code_id}
                      </div>

                      <span className="text-[9px] font-bold text-emerald-600 uppercase">
                        Active Tag
                      </span>
                    </div> */}
                  </td>
                  <td className="p-4">
                    {animal.owner_id ? (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">
                          {animal.owners?.full_name || "Private Owner"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {animal.owners?.phone_number}
                        </span>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-[9px] font-bold text-amber-700"
                      >
                        COMMUNITY STRAY
                      </Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "px-2 py-0 text-[10px] font-bold",
                            animal.status === "Safe"
                              ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                              : "border-red-200 bg-red-100 text-red-700"
                          )}
                        >
                          {animal.status}
                        </Badge>
                        {animal.is_vaccinated && (
                          <div
                            className="rounded-full bg-blue-100 p-1 text-blue-600"
                            title="Vaccinated"
                          >
                            <HeartPulse className="size-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden h-8 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[11px] font-bold text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800 md:flex"
                        onClick={() => setSelectedAnimal(animal)}
                      >
                        <ExternalLink className="size-3.5" />
                        View Profile
                      </Button>

                      <div className="flex items-center gap-1">
                        <div className="hidden" aria-hidden="true">
                          <QRCodeCanvas
                            id={`qr-gen-${animal.qr_code_id}`}
                            value={animal.qr_code_id}
                            size={512}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-slate-400 hover:bg-slate-100 hover:text-emerald-600"
                          title="Download QR"
                          onClick={(e) => {
                            e.stopPropagation() // Prevent row click
                            downloadQRCode(animal.qr_code_id, animal.name)
                          }}
                        >
                          <Download className="size-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-slate-400 hover:bg-slate-100"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-52 border-slate-200 bg-white p-2 shadow-xl"
                          >
                            <DropdownMenuLabel className="text-[10px] tracking-widest text-slate-400 uppercase">
                              Management
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer rounded-md focus:bg-emerald-50 focus:text-emerald-700"
                              onClick={() =>
                                printQRCode(animal.qr_code_id, animal.name)
                              }
                            >
                              <Printer className="mr-2 size-4" /> Print QR Tag
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="cursor-pointer rounded-md focus:bg-emerald-50 focus:text-emerald-700 md:hidden">
                              <ExternalLink className="mr-2 size-4" /> View
                              Public Profile
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator className="bg-slate-100" />
                            <DropdownMenuItem
                              className="cursor-pointer rounded-md focus:bg-slate-100"
                              onClick={() => {
                                modal.setEditAnimal(animal)
                                modal.onOpen()
                              }}
                            >
                              Edit Animal Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer rounded-md text-red-600 focus:bg-red-50 focus:text-red-700">
                              Archive Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3">
          <div className="text-xs font-medium text-slate-500">
            Page <span className="text-slate-900">{page}</span> of{" "}
            <span className="text-slate-900">{totalPages || 1}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-200 bg-white px-3 text-xs font-bold shadow-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-200 bg-white px-3 text-xs font-bold shadow-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
        <AnimalProfileModal
          animal={selectedAnimal}
          isOpen={!!selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
        />
      </div>
    </div>
  )
}
