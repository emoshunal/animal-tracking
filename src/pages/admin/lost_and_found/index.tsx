import { useState } from "react"
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Megaphone,
  Loader2,
  Inbox,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ReportLostModal } from "@/components/report-lost-animal"
import { useReportFetch } from "@/hooks/use-report-fetch"
import { useResolveIncident } from "@/hooks/use-resolve"
import { useDebounce } from "@/hooks/use-debounce"
import { formatDistanceToNow } from "date-fns"

export default function LostAndFoundPage() {
  const [filter, setFilter] = useState<"ALL" | "LOST" | "FOUND">("ALL")
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)

  const { data: reports, loading } = useReportFetch(filter, debouncedSearch)

  const { markAsFound, isResolving } = useResolveIncident()

  return (
    <div className="min-h-screen flex-1 space-y-6 bg-slate-50/50 p-8 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Megaphone className="size-5 text-red-500" />
            <h1 className="text-3xl font-bold tracking-tight">Lost & Found</h1>
          </div>
          <p className="font-medium text-muted-foreground">
            Community-driven tracking to help reunite pets with their owners.
          </p>
        </div>
        <ReportLostModal />
      </div>

      <div className="flex flex-col items-center gap-4 md:flex-row">
        <div className="relative w-full flex-1 md:max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search location or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-none bg-white pl-9 shadow-sm focus-visible:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          {[
            { label: "All", value: "ALL" },
            { label: "Lost", value: "LOST" },
            { label: "Found", value: "FOUND" },
          ].map((opt) => (
            <Badge
              key={opt.value}
              onClick={() => setFilter(opt.value as any)}
              className={`cursor-pointer px-4 py-1.5 transition-all ${
                filter === opt.value
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {opt.label}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-emerald-500" />
          <p className="text-sm font-medium text-slate-500">
            Scanning reports...
          </p>
        </div>
      ) : reports.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mb-4 rounded-full bg-slate-50 p-6">
            <Inbox className="size-12 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No reports found</h3>
          <p className="text-sm text-slate-500">
            There are currently no{" "}
            {filter !== "ALL" ? filter.toLowerCase() : ""} animal reports
            matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="group overflow-hidden border-none bg-white shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <CardContent className="flex flex-col p-0 sm:flex-row">
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100 sm:h-auto sm:w-52">
                  <img
                    src={
                      report.animals?.photo_url ||
                      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&h=400&fit=crop"
                    }
                    alt={report.animals?.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <Badge
                      className={`px-3 py-1 text-[10px] font-black tracking-wider uppercase ${
                        report.status === "LOST"
                          ? "animate-pulse bg-red-600 shadow-lg shadow-red-500/50"
                          : "bg-emerald-600"
                      }`}
                    >
                      {report.status}
                    </Badge>
                    {report.status === "LOST" && (
                      <Badge
                        variant="outline"
                        className="border-none bg-white/90 text-[9px] font-bold text-red-600 backdrop-blur-sm"
                      >
                        URGENT
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Container */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">
                        {report.animals?.name || "Unnamed Pet"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-tighter text-emerald-600 uppercase">
                          {report.animals?.breed || report.animals?.species}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="border-none bg-slate-100 font-mono text-[9px] text-slate-400"
                    >
                      #{report.id.toString().slice(0, 5)}
                    </Badge>
                  </div>

                  <div className="mb-6 space-y-3">
                    <div className="rounded-xl border border-slate-100/50 bg-slate-50 p-3">
                      <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                        <span className="font-bold text-slate-400">“</span>
                        {report.incident_description}
                        <span className="font-bold text-slate-400">”</span>
                      </p>
                    </div>

                    <div className="space-y-1.5 px-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <MapPin className="size-4 text-red-500" />
                        {report.last_seen_location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="size-3" />
                        {/* If using date-fns: formatDistanceToNow(new Date(report.reported_at)) */}
                        Reported:{" "}
                        {formatDistanceToNow(new Date(report.created_at))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-slate-50 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* --- Contact Info Section --- */}
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
                          <Phone className="size-3.5 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] leading-none font-bold text-slate-400 uppercase">
                            Contact
                          </p>
                          <p className="truncate text-xs font-bold text-slate-800">
                            {report.animals?.owners?.full_name ||
                              report.reported_by ||
                              "Unknown"}
                          </p>
                        </div>
                      </div>

                      {/* --- Action Section --- */}
                      <div className="shrink-0">
                        {report.status === "LOST" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isResolving === report.id}
                            onClick={() =>
                              markAsFound(report.id, report.animal_id)
                            }
                            className="h-8 rounded-lg border-emerald-200 bg-emerald-50/50 px-3 text-[11px] font-bold text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white"
                          >
                            {isResolving === report.id ? (
                              <Loader2 className="mr-1.5 size-3 animate-spin" />
                            ) : (
                              <CheckCircle className="mr-1.5 size-3" />
                            )}
                            Found
                          </Button>
                        ) : (
                          <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-slate-500">
                            <CheckCircle className="size-3 text-emerald-500" />
                            <span className="text-[10px] font-bold tracking-tight uppercase">
                              Resolved
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Alert Banner */}
      <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <div className="rounded-full bg-amber-100 p-2 text-amber-600">
          <AlertCircle className="size-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900 underline decoration-amber-200 underline-offset-4">
            Safety Advisory
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-amber-800/80">
            When meeting anyone to recover a pet, please choose a public,
            well-lit location. Report any suspicious contact to the Barangay
            Secretary immediately.
          </p>
        </div>
      </div>
    </div>
  )
}
