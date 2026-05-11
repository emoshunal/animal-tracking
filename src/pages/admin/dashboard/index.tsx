import {
  PawPrint,
  Syringe,
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  QrCode,
} from "lucide-react"

import { type LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RegisterAnimalModal } from "@/components/register-animal"
import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase"
import { formatDistanceToNow } from "date-fns"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAnimals: 0,
    vaccinationRate: 0,
    activeLost: 0,
    totalScans: 0,
  })

  const [recentSightings, setRecentSightings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)

      // 1. Get Total Registered Animals
      const { count: animalCount } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true })

      // 2. Get Vaccination Rate (Animals where vaccinated = true)
      const { count: vacCount } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true })
        .eq("is_vaccinated", true)

      // 3. Get Active Lost Reports
      const { count: lostCount } = await supabase
        .from("animals")
        .select("*", { count: "exact", head: true })
        .eq("status", "LOST")

      // 4. Get Total Scans (from your sighting_reports table)
      const { count: scanCount } = await supabase
        .from("sighting_reports")
        .select("*", { count: "exact", head: true })

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
        totalAnimals: animalCount || 0,
        vaccinationRate: animalCount
          ? Math.round((vacCount! / animalCount) * 100)
          : 0,
        activeLost: lostCount || 0,
        totalScans: scanCount || 0,
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
        {/* <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 bg-white shadow-sm"
          >
            <Download className="mr-2 size-4" /> Export Data
          </Button>
          <RegisterAnimalModal />
        </div> */}
      </div>

      {/* --- KPIS (Hardware-free metrics) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Registered"
          value={stats.totalAnimals.toLocaleString()}
          trend="+12%" // You can calculate this by comparing to a previous date range if desired
          up={true}
          icon={PawPrint}
          color="text-emerald-600"
        />
        <StatsCard
          title="Vaccination Rate"
          value={`${stats.vaccinationRate}%`}
          trend="+5.2%"
          up={true}
          icon={Syringe}
          color="text-blue-600"
        />
        <StatsCard
          title="Active Lost Reports"
          value={stats.activeLost.toString().padStart(2, "0")}
          trend="-2"
          up={false}
          icon={Megaphone}
          color="text-red-600"
          urgent={stats.activeLost > 0}
        />
        <StatsCard
          title="Total QR Scans"
          value={stats.totalScans.toLocaleString()}
          trend="+18%"
          up={true}
          icon={QrCode}
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
  trend: string
  up: boolean
  icon: LucideIcon | React.ElementType // Handles the icon component
  color: string
  urgent?: boolean // The '?' makes it optional since you have a default value
}
function StatsCard({
  title,
  value,
  trend,
  up,
  icon: Icon,
  color,
  urgent = false,
}: StatsCardProps) {
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
        <div className="mt-1 flex items-center">
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
        </div>
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
