import { useEffect, useState } from "react"
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Camera,
  Search,
  Bell,
  UserCheck,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSightingFetch } from "@/hooks/use-sighting"
import { formatDistanceToNow } from "date-fns"
import { supabase } from "@/utils/supabase"
import { toast } from "sonner"
import emailjs from "@emailjs/browser"
export default function SightingReportsPage() {
  const { sightings, loading, refetch } = useSightingFetch()
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSightings = sightings.filter((report: any) => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      report.animals?.name?.toLowerCase().includes(searchTerm) ||
      report.location_name?.toLowerCase().includes(searchTerm) ||
      report.reporter_phone?.includes(searchTerm)
    )
  })

  useEffect(() => {
    if (sightings.length > 0 && !selectedReport) {
      setSelectedReport(sightings[0])
    }
  }, [sightings, selectedReport])

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsProcessing(true)
    try {
      const { error } = await supabase
        .from("sighting_reports")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error
      toast.success(`Report marked as ${newStatus}`)
      if (newStatus === "VERIFIED") {
        await handleVerifyAndNotify(selectedReport)
      }
      refetch()
    } catch (err) {
      toast.error("Failed to update report")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVerifyAndNotify = async (report: any) => {
    setIsProcessing(true)
    try {
      // 1. Update status in Supabase
      const { error: updateError } = await supabase
        .from("sighting_reports")
        .update({ status: "VERIFIED" })
        .eq("id", report.id)

      if (updateError) throw updateError

      const { data, error: ownerError } = await supabase
        .from("animals")
        .select(
          `
        name,
        owners (
          full_name,
          email
        )
      `
        )
        .eq("id", report.animal_id)
        .single()

      const ownerData = data as any
      console.log("Owner Data ", ownerData, "Owner Error", ownerError)
      if (ownerError || !ownerData?.owners?.email) {
        console.error("Could not find owner email:", ownerError)
        toast.warning("Report verified, but owner email not found.")
      } else {
        // 3. Send Email via EmailJS
        const templateParams = {
          to_email: ownerData.owners?.email,
          owner_name: ownerData.owners?.full_name,
          animal_name: ownerData.name,
          location: report.location_name,
          reporter_phone: report.reporter_phone,
          message: report.message,
        }

        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )

        toast.success("Owner notified via email!")
      }

      refetch()
    } catch (err) {
      console.error(err)
      toast.error("Process failed. Check console for details.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  return (
    <div className="flex h-screen flex-col bg-slate-50 font-sans">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Bell className="size-5 text-indigo-600" />
            Submitted QR Reports
          </h1>
          <p className="text-xs font-medium tracking-tighter text-slate-500 uppercase">
            Review and Verify Community Sightings
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="border-none bg-amber-100 px-3 text-amber-700 hover:bg-amber-100">
            {sightings.length} Active Reports
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-full flex-col border-r border-slate-200 bg-white md:w-1/3">
          <div className="border-b border-slate-50 p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search reports..."
                className="border-none bg-slate-50 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredSightings.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`cursor-pointer border-b border-slate-50 p-4 transition-all ${selectedReport?.id === report.id ? "border-r-4 border-r-indigo-600 bg-indigo-50/50" : "hover:bg-slate-50"}`}
              >
                <div className="mb-1 flex items-start justify-between">
                  <h3 className="font-bold text-slate-900">
                    {report.animals?.name || "Unknown Animal"}
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400">
                    {formatDistanceToNow(new Date(report.created_at))} ago
                  </span>
                </div>
                <p className="mb-2 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="size-3" /> {report.location_name}
                </p>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={
                      report.status === "PENDING"
                        ? "border-amber-200 bg-amber-50 text-amber-600"
                        : report.status === "VERIFIED"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : "border-red-200 bg-red-50 text-red-600" // This handles REJECTED
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="hidden flex-1 items-center justify-center overflow-y-auto bg-slate-50/50 p-8 md:flex">
          {selectedReport ? (
            <Card className="w-full max-w-2xl overflow-hidden rounded-3xl border-none bg-white shadow-2xl">
              {/* Report Image */}
              <div className="relative h-64 bg-slate-200">
                {selectedReport.animals?.photo_url ? (
                  <img
                    src={selectedReport.animals.photo_url}
                    className="h-full w-full object-cover"
                    alt="Sighting Proof"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                    <Camera className="size-10 opacity-20" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="border-none bg-black/50 font-mono text-white backdrop-blur-md">
                    #{selectedReport.id.toString().slice(0, 8)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Target Animal
                      </label>
                      <h2 className="mt-1 text-2xl leading-none font-bold text-slate-900">
                        {selectedReport.animals?.name}
                      </h2>
                      <p className="mt-1 font-mono text-xs font-bold text-indigo-600 uppercase">
                        {selectedReport.animals?.species}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <UserCheck className="size-5 text-slate-400" />
                        <div>
                          <p className="text-[10px] leading-none font-bold text-slate-400 uppercase">
                            Reporter
                          </p>
                          <p className="text-sm font-bold">
                            {selectedReport.reporter_phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        Sighting Message
                      </label>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 italic">
                        "{selectedReport.message}"
                      </p>
                    </div>
                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                      <div className="mb-1 flex items-center gap-2 text-indigo-700">
                        <MapPin className="size-4" />
                        <span className="text-xs font-bold uppercase">
                          Reported Location
                        </span>
                      </div>
                      <p className="text-sm font-medium text-indigo-900">
                        {selectedReport.location_name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 space-y-4 border-t border-slate-100 pt-6">
                  {(selectedReport.status === "VERIFIED" ||
                    selectedReport.status === "REJECTED") && (
                    <div
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[11px] font-bold tracking-wider uppercase ${
                        selectedReport.status === "VERIFIED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {selectedReport.status === "VERIFIED" ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <XCircle className="size-3" />
                      )}
                      This report has been marked as {selectedReport.status}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      className="h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
                      disabled={isProcessing}
                      onClick={() => {
                        if (selectedReport.status === "VERIFIED") {
                          toast.info("This report is already verified.")
                        } else {
                          handleUpdateStatus(selectedReport.id, "VERIFIED")
                        }
                      }}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 size-4" />
                      )}
                      {selectedReport.status === "VERIFIED"
                        ? "Already Verified"
                        : "Verify & Notify Owner"}
                    </Button>

                    <Button
                      variant="ghost"
                      disabled={isProcessing}
                      className="h-12 flex-1 rounded-xl font-bold text-red-500 hover:bg-red-50"
                      onClick={() => {
                        if (selectedReport.status === "REJECTED") {
                          toast.info("This report has already been rejected.")
                        } else {
                          handleUpdateStatus(selectedReport.id, "REJECTED")
                        }
                      }}
                    >
                      <XCircle className="mr-2 size-4" />
                      {selectedReport.status === "REJECTED"
                        ? "Already Rejected"
                        : "Reject (Spam)"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <Bell className="mb-4 size-12 opacity-20" />
              <p>Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
