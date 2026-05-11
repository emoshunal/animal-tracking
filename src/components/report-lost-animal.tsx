import { useState } from "react"
import {
  Megaphone,
  MapPin,
  Clock,
  AlertCircle,
  Save,
  PawPrint,
  FileText,
  Loader2,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AnimalSearch } from "./animal-search"
import { useIncidentStore } from "@/store/useIncidentStore"
import { useReportIncident } from "@/hooks/use-report"

export function ReportLostModal() {
  const {
    isOpen,
    onOpen,
    onClose,
    step,
    setStep,
    selectedAnimal,
    setSelectedAnimal,
    isSubmitting,
  } = useIncidentStore()
  const { reportLost } = useReportIncident()

  const [details, setDetails] = useState({
    last_seen_location: "",
    last_seen_time: "",
    incident_description: "",
    reported_by: "",
  })

  const handlePublish = () => {
    reportLost(details)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(v) => (v ? onOpen() : onClose())}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="border-red-100 bg-white text-red-600 shadow-sm hover:bg-red-50"
        >
          <Megaphone className="mr-2 size-4" /> Report Lost Animal
        </Button>
      </SheetTrigger>

      <SheetContent className="flex !w-full flex-col gap-0 border-l border-red-100/30 bg-white p-0 sm:!w-[550px] sm:!max-w-none">
        {/* Header Section - Red themed for Urgency */}
        <div className="bg-red-600 p-6 text-white">
          <SheetHeader className="text-left">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                <AlertCircle className="size-5 text-white" />
              </div>
              <Badge
                variant="outline"
                className="border-white/30 text-[10px] tracking-widest text-white uppercase"
              >
                Incident Filing
              </Badge>
            </div>
            <SheetTitle className="text-2xl font-bold tracking-tight text-white">
              Report Lost Animal
            </SheetTitle>
            <SheetDescription className="font-medium text-red-50/80">
              Official tagging of a registered animal as "Missing" in the
              community.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <PawPrint className="size-4" />
                  <h3 className="text-xs font-bold tracking-wider uppercase">
                    Find Registered Record
                  </h3>
                </div>
                {/* REUSABLE COMPONENT INJECTED HERE */}
                <AnimalSearch
                  onSelect={(animal) => setSelectedAnimal(animal)}
                />
              </div>

              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
                <strong>Note:</strong> Tagging an animal as lost will notify the
                community.
              </div>
            </div>
          ) : (
            <div className="animate-in space-y-8 duration-300 fade-in slide-in-from-right-4">
              {/* Selected Animal Summary */}
              {selectedAnimal && (
                <div className="flex items-center gap-3 rounded-lg bg-slate-900 p-4 text-white">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white/10 text-xl">
                    <PawPrint className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-[10px] font-bold text-slate-400 uppercase">
                      Tagging as Lost:
                    </p>
                    <p className="text-lg leading-none font-bold">
                      {selectedAnimal.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                    onClick={() => setStep(1)}
                  >
                    Change
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <MapPin className="size-4" />
                  <h3 className="text-xs font-bold tracking-wider uppercase">
                    Last Seen Details
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Sitio / Area
                    </Label>
                    <Input
                      placeholder="e.g. Sitio Riverside"
                      className="h-11 border-none bg-slate-50"
                      value={details.last_seen_location}
                      onChange={(e) =>
                        setDetails({
                          ...details,
                          last_seen_location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Time Lost
                    </Label>
                    <div className="relative">
                      <Clock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="e.g. Around 2:00 PM"
                        className="h-11 border-none bg-slate-50 pl-10"
                        value={details.last_seen_time}
                        onChange={(e) =>
                          setDetails({
                            ...details,
                            last_seen_time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">
                    Description of Incident
                  </Label>
                  <Textarea
                    placeholder="Describe markings, color of collar, behavior..."
                    className="min-h-[100px] resize-none border-none bg-slate-50 p-4"
                    value={details.incident_description}
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        incident_description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Separator className="opacity-50" />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <FileText className="size-4" />
                  <h3 className="text-xs font-bold tracking-wider uppercase">
                    Verification
                  </h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">
                    Reporter Name
                  </Label>
                  <Input
                    placeholder="Leave blank if owner reported"
                    className="h-11 border-none bg-slate-50"
                    value={details.reported_by}
                    onChange={(e) =>
                      setDetails({ ...details, reported_by: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* </div>
             <div className="animate-in space-y-8 duration-300 fade-in slide-in-from-right-4">
              
              <div className="flex items-center gap-3 rounded-lg bg-slate-900 p-4 text-white">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
                  <PawPrint className="size-5" />
                </div>
               <div className="flex-1">
               <p className="mb-1 text-xs leading-none font-bold tracking-tighter text-slate-400 uppercase">
                    Tagging as Lost:
                   </p>
                 <p className="text-lg leading-none font-bold">Bruno</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => setStep(1)}
                >
                  Change
                </Button>
              </div>

     
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <MapPin className="size-4" />
                  <h3 className="text-xs font-bold tracking-wider uppercase">
                    Last Seen Details
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Sitio / Area
                    </Label>
                    <Input
                      placeholder="e.g. Sitio Riverside"
                      className="h-11 border-none bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase">
                      Time Lost
                    </Label>
                    <div className="relative">
                      <Clock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="e.g. Around 2:00 PM"
                        className="h-11 border-none bg-slate-50 pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">
                    Description of Incident
                  </Label>
                  <Textarea
                    placeholder="Describe markings, what they were wearing, or behavior (e.g. wearing blue collar, very shy)"
                    className="min-h-[100px] resize-none border-none bg-slate-50 p-4"
                  />
                </div>
              </div>

              <Separator className="opacity-50" />

        
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <FileText className="size-4" />
                  <h3 className="text-xs font-bold tracking-wider uppercase">
                    Secretary Verification
                  </h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">
                    Reporter Name (if not owner)
                  </Label>
                  <Input
                    placeholder="Leave blank if owner reported"
                    className="h-11 border-none bg-slate-50"
                  />
                </div>
              </div>
            </div>
          )}
        </div> */}

        {/* Footer Actions */}
        <SheetFooter className="border-t bg-slate-50/50 p-6">
          <div className="flex w-full gap-3">
            <Button
              variant="ghost"
              className="h-12 flex-1 text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </Button>

            {step === 2 && (
              <Button
                className="h-12 flex-1 bg-red-600 font-bold text-white shadow-md transition-all hover:bg-red-700 active:scale-95"
                onClick={handlePublish}
                disabled={isSubmitting || !details.last_seen_location}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                Publish Lost Report
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
