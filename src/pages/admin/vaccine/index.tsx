import { useState } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  Syringe,
  Edit2,
  History,
  Plus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { LogVaccinationModal } from "@/components/log-new-vaccination"
import { useMedicalStore } from "@/store/useMedicalStore"
import { useVaccinations } from "@/hooks/use-vaccination"
import { useDebounce } from "@/hooks/use-debounce"
import { VaccineHistorySheet } from "@/components/vaccine-history"

export default function VaccinationPage() {
  const vaccine = useMedicalStore()
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 300)

  const { data: vaccinations, loading } = useVaccinations(
    debouncedSearch,
    1,
    10
  )

  return (
    <div className="min-h-screen flex-1 space-y-6 bg-slate-50/50 p-8 pt-6 font-sans">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Vaccination Logs
          </h1>
          <p className="font-medium text-muted-foreground">
            Monitor immunization schedules and rabies compliance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" size="sm" className="bg-white">
            <Download className="mr-2 size-4" /> Export Schedule
          </Button> */}

          <Button
            className="bg-emerald-600 font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95"
            onClick={vaccine.onOpen}
          >
            <Plus className="mr-2 size-4" /> Log New Vaccination
          </Button>

          <LogVaccinationModal />
          <VaccineHistorySheet />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                Compliant
              </p>
              <h2 className="text-2xl font-bold">88%</h2>
            </div>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <Progress value={88} className="mt-4 h-1.5 bg-slate-100" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                Due this Month
              </p>
              <h2 className="text-2xl font-bold">14</h2>
            </div>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
              <Calendar className="size-4" />
            </div>
          </div>
          <p className="mt-4 text-[10px] font-medium text-slate-400 italic">
            *Require community outreach
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                Overdue
              </p>
              <h2 className="text-2xl font-bold text-red-600">03</h2>
            </div>
            <div className="rounded-lg bg-red-100 p-2 text-red-600">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <p className="mt-4 text-[10px] font-bold text-red-400">
            Critical Action Required
          </p>
        </div>
      </div> */}

      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-md">
        <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/30 p-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Filter by animal or vaccine type..."
              className="h-10 border-slate-200 bg-white pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 size-4" /> Status
          </Button>
        </div>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Animal & Type
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Vaccine Info
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Administration
              </th>
              {/* <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                Next Due
              </th> */}
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Loading records...
                </td>
              </tr>
            ) : (
              vaccinations.map((record) => {
                return (
                  <tr
                    key={record.id}
                    className="group transition-colors hover:bg-slate-50/80"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                          <Syringe className="size-4" />
                        </div>
                        <div>
                          <p className="leading-none font-bold text-slate-900">
                            {record.animals?.name}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {record.animals?.species}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                          {record.vaccine_name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 uppercase">
                          LOT: {record.lot_number}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-600">
                          {record.administered_date}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          By: {record.administered_by}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-slate-400 hover:text-slate-900"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 bg-white"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() => vaccine.setEditRecord(record)}
                            className="cursor-pointer"
                          >
                            <Edit2 className="mr-2 size-4" />
                            Edit Record
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              vaccine.onOpenHistory(record.animal_id)
                            }
                            className="cursor-pointer text-emerald-600 focus:text-emerald-700"
                          >
                            <History className="mr-2 size-4" />
                            View History
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700">
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
