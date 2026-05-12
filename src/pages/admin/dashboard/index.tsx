import { PawPrint, Syringe, Megaphone, AlertTriangle } from "lucide-react"

import { type LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RegisterAnimalModal } from "@/components/register-animal"
import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase"
import { formatDistanceToNow } from "date-fns"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWithOwnders: 0,
    vaccinated: 0,
    unvaccinated: 0,
    vaccinationRate: 0,
    totalStray: 0,
    activeLost: 0,
  })

  const [recentSightings, setRecentSightings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)

      // 1. Get Total Registered Animals
      const { count: withOwnerCount } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true })
        .not("owner_id", "is", null)

      // 2. Get Vaccination Rate (Animals where vaccinated = true)
      const { count: vacCount } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true })
        .eq("is_vaccinated", true)

      const { count: totalAnimalCount } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true })

      const unvaccinatedCount = (totalAnimalCount || 0) - (vacCount || 0)

      const { count: strayCount } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true })
        .is("owner_id", null)

      const { count: lostCount } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true })
        .eq("status", "LOST")

      // 5. Get Recent Sightings with Animal details
      const { data: sightings } = await supabase
        .from("sighting_reports")
        .select(
          `
          id, created_at, location_name,
          animals ( name, qr_code_id )
        `
        )
        .order("created_at", { ascending: false })
        .limit(3)

      setStats({
        totalWithOwnders: withOwnerCount || 0,
        vaccinated: vacCount || 0,
        unvaccinated: unvaccinatedCount || 0,
        vaccinationRate: totalAnimalCount
          ? Math.round((vacCount! / totalAnimalCount) * 100)
          : 0,
        totalStray: strayCount || 0,
        activeLost: lostCount || 0,
      })
      setRecentSightings(sightings || [])
      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  if (loading) return <div className="p-8">Updating Analytics...</div>
  return (
    <div className="min-h-screen flex-1 space-y-8 bg-slate-50/50 p-8 pt-6 font-sans">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Analytics Overview
          </h1>
          <p className="font-medium text-muted-foreground">
            Monitoring community animal registration and QR sighting activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            className="border-slate-200 bg-white shadow-sm"
          >
            <Download className="mr-2 size-4" /> Export Data
          </Button> */}
          <RegisterAnimalModal />
        </div>
      </div>

      {/* --- KPIS (Hardware-free metrics) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Registered Animals with Owners"
          value={stats.totalWithOwnders.toLocaleString()}
          subtitle={""}
          trend="+12%" // You can calculate this by comparing to a previous date range if desired
          up={true}
          icon={PawPrint}
          color="text-emerald-600"
        />
        <StatsCard
          title="Vaccination Rate"
          value={`${stats.vaccinationRate}%`}
          subtitle={`${stats.vaccinated} Vaccinated • ${stats.unvaccinated} Unvaccinated`}
          trend="vac"
          up={true}
          icon={Syringe}
          color="text-blue-600"
        />
        <StatsCard
          title="Total of Stray Animals"
          value={stats.totalStray.toString().padStart(2, "0")}
          subtitle={""}
          trend="astray"
          up={false}
          icon={AlertTriangle}
          color="text-red-600"
          urgent={stats.totalStray > 0}
        />
        <StatsCard
          title="Total of Reported Lost"
          value={stats.activeLost.toLocaleString()}
          subtitle={""}
          trend="lost"
          up={true}
          icon={Megaphone}
          color="text-indigo-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* --- MAIN CHART: Community Engagement --- */}
        <Card className="border-none bg-white shadow-md shadow-slate-200/50 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base font-bold">
              Community Activity Trend
            </CardTitle>
            <CardDescription>
              Comparing new registrations vs. QR scans over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-6">
              {recentSightings.map((sighting) => (
                <ActivityItem
                  key={sighting.id}
                  initials={
                    sighting.animals?.name?.substring(0, 2).toUpperCase() ||
                    "??"
                  }
                  name={sighting.animals?.name || "Unknown"}
                  desc={`Scanned at ${sighting.location_name}`}
                  time={formatDistanceToNow(new Date(sighting.created_at), {
                    addSuffix: true,
                  })}
                  status={sighting.status === "PENDING" ? "urgent" : "info"}
                />
              ))}
              {recentSightings.length === 0 && (
                <p className="text-center text-xs text-slate-400">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string | null
  trend: string
  up: boolean
  icon: LucideIcon | React.ElementType // Handles the icon component
  color: string
  urgent?: boolean // The '?' makes it optional since you have a default value
}
function StatsCard({
  title,
  value,
  subtitle,
  trend,

  icon: Icon,
  color,
  urgent = false,
}: StatsCardProps) {
  const getLabel = () => {
    if (trend === "astray")
      return { text: "ACTION REQUIRED", color: "text-red-600 bg-red-50" }
    if (trend === "vac")
      return { text: "HEALTH TARGET", color: "text-blue-600 bg-blue-50" }
    if (trend === "lost")
      return { text: "URGENT", color: "text-indigo-600 bg-indigo-50" }
    return { text: "SYSTEM UPDATED", color: "text-emerald-600 bg-emerald-50" }
  }

  const label = getLabel()
  return (
    <Card
      className={`border-none bg-white shadow-md shadow-slate-200/50 ${urgent && value !== "0" ? "ring-2 ring-red-500/20" : ""}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
          {title}
        </CardTitle>
        <div className={`rounded-xl bg-slate-50 p-2.5 ${color}`}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-slate-900">{value}</div>
        {subtitle && (
          <p className="mt-0.5 text-[10px] font-bold text-slate-400">
            {subtitle}
          </p>
        )}
        <div className="mt-3">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${label.color}`}
          >
            {label.text}
          </span>
        </div>
        {/* <div className="mt-1 flex items-center">
          {up ? (
            <ArrowUpRight className="mr-1 size-3 text-emerald-500" />
          ) : (
            <ArrowDownRight className="mr-1 size-3 text-red-500" />
          )}
          <span
            className={`text-xs font-bold ${up ? "text-emerald-600" : "text-red-600"}`}
          >
            {trend}
          </span>
          <span className="ml-1.5 text-[10px] font-medium text-slate-400">
            vs last month
          </span>
        </div> */}
      </CardContent>
    </Card>
  )
}

type ActivityStatus = "urgent" | "success" | "info"
interface ActivityItemProps {
  initials: string
  name: string
  desc: string
  time: string
  status: ActivityStatus
}
function ActivityItem({
  initials,
  name,
  desc,
  time,
  status,
}: ActivityItemProps) {
  const statusColors: Record<ActivityStatus, string> = {
    urgent: "bg-red-500 animate-pulse",
    success: "bg-emerald-500",
    info: "bg-blue-500",
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="size-10 border-2 border-white shadow-sm">
          <AvatarFallback className="bg-slate-100 text-[10px] font-black text-slate-600">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span
          className={`absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white ${statusColors[status]}`}
        />
      </div>
      <div className="flex-1 space-y-0.5">
        <p className="text-sm leading-tight font-bold text-slate-800">{name}</p>
        <p className="line-clamp-1 text-xs font-medium text-slate-500">
          {desc}
        </p>
      </div>
      <div className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
        {time}
      </div>
    </div>
  )
}

export default Dashboard
