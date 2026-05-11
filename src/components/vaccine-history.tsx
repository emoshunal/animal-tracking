// components/vaccine-history-sheet.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useMedicalStore } from "@/store/useMedicalStore"
import { useVaccinations } from "@/hooks/use-vaccination"
import {
  History,
  Syringe,
  Calendar,
  User,
  FileText,
  Inbox,
  Loader2,
} from "lucide-react"

export function VaccineHistorySheet() {
  const { isHistoryOpen, onCloseHistory, selectedAnimalId } = useMedicalStore()

  const { data: history, loading } = useVaccinations(
    "",
    1,
    50,
    selectedAnimalId || ""
  )
  console.log("Check animal id: ", selectedAnimalId)
  const animalName = history[0]?.animals?.name || "Animal"
  const animalSpecies = history[0]?.animals?.species || "Unknown Species"

  return (
    <Sheet open={isHistoryOpen} onOpenChange={onCloseHistory}>
      <SheetContent className="flex w-full flex-col border-l border-slate-200 bg-white p-0 shadow-2xl sm:max-w-md">
        {/* Header Section */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-6">
          <SheetHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <History className="size-5" />
              </div>
              <div className="space-y-0.5">
                <SheetTitle className="text-xl font-bold">
                  Vaccination History
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    {animalName}
                  </span>
                  <span className="text-slate-300">•</span>
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px] tracking-wider uppercase"
                  >
                    {animalSpecies}
                  </Badge>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="py-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-20">
                <Loader2 className="size-6 animate-spin text-emerald-500" />
                <p className="text-sm font-medium text-slate-500">
                  Retrieving records...
                </p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-slate-50 p-4">
                  <Inbox className="size-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-900">No records found</h3>
                <p className="mt-1 max-w-[200px] text-sm text-slate-500">
                  This animal hasn't received any documented vaccinations yet.
                </p>
              </div>
            ) : (
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-emerald-200 before:via-slate-100 before:to-transparent">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-start gap-6"
                  >
                    {/* Timeline Node */}
                    <div className="sticky top-0 mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-sm transition-transform group-hover:scale-110">
                      <Syringe className="size-4" />
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 space-y-3 pb-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900">
                            {item.vaccine_name}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-400">
                            #{item.lot_number || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {item.administered_date}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="size-3" />
                            {item.administered_by}
                          </div>
                        </div>
                      </div>

                      {item.remarks && (
                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-tight text-slate-400 uppercase">
                            <FileText className="size-3" />
                            Remarks
                          </div>
                          <p className="text-xs leading-relaxed text-slate-600">
                            {item.remarks}
                          </p>
                        </div>
                      )}

                      <Separator className="mt-4 opacity-50" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer info (Optional) */}
        <div className="border-t border-slate-100 bg-slate-50 p-4">
          <p className="text-center text-[10px] text-slate-400 italic">
            End of immunization history for {animalName}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
