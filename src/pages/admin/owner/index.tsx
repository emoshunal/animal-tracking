import { useState } from "react"
import {
  Phone,
  Search,
  Plus,
  ChevronRight,
  Home,
  ShieldCheck,
  Loader2,
  Edit2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AddOwnerModal } from "@/components/register-owner"
import { useOwnerStore } from "@/store/useOwnerStore"
import { useOwners } from "@/hooks/use-owner"
import { OwnerDetailsModal } from "@/components/owner-details-modal"
import { RegisterAnimalModal } from "@/components/register-animal"

export default function OwnersPage() {
  const modal = useOwnerStore()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 9

  const { data, loading, totalPages } = useOwners(search, page, PAGE_SIZE)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="min-h-screen flex-1 space-y-6 bg-slate-50/50 p-8 pt-6 font-sans">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owner Registry</h1>
          <p className="font-medium text-muted-foreground">
            Database of registered animal owners and community guardians.
          </p>
        </div>
        {/* <Button className="bg-emerald-600 shadow-lg shadow-emerald-100 hover:bg-emerald-700">
            <Plus className="mr-2 size-4" /> Add New Owner
          </Button> */}
        <Button
          onClick={() => {
            modal.setEditOwner(null) // Ensure it's a fresh registration
            modal.onOpen()
          }}
          size="sm"
          className="bg-emerald-600 font-semibold shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 active:scale-95"
        >
          <Plus className="mr-2 size-4" /> Add New Owner
        </Button>
        <AddOwnerModal />
      </div>

      {/* --- SEARCH & QUICK FILTERS --- */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, sitio, or ID..."
            className="h-11 border-slate-200 bg-white pl-9 shadow-sm focus-visible:ring-emerald-500"
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="cursor-pointer bg-white px-3 py-1 hover:bg-slate-50"
          >
            All Sitios
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer border-emerald-200 bg-white px-3 py-1 text-emerald-600 hover:bg-slate-50"
          >
            Active Guardians
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
          <p className="font-medium">Loading guardian records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {data.map((owner) => (
            <Card
              key={owner.id}
              className="group overflow-hidden border-none shadow-md shadow-slate-200/60 transition-all hover:ring-1 hover:ring-emerald-500"
            >
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Avatar className="size-12 rounded-xl border-2 border-slate-50 shadow-sm">
                        <AvatarFallback className="bg-emerald-50 font-bold text-emerald-700">
                          {getInitials(owner.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="leading-tight font-bold text-slate-900">
                          {owner.full_name}
                        </h3>
                        <span className="font-mono text-xs tracking-tighter text-slate-400 uppercase">
                          ID: {owner.id.split("-")[0]}
                        </span>
                      </div>
                    </div>
                    <Badge className="border-none bg-emerald-50 text-emerald-700 shadow-none">
                      <ShieldCheck className="mr-1 size-3" />
                      Verified
                    </Badge>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                        <Home className="size-4" />
                      </div>
                      <div>
                        <p className="text-[10px] leading-none font-bold text-slate-400 uppercase">
                          Location
                        </p>
                        <p className="font-medium">{owner.sitio || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                        <Phone className="size-4" />
                      </div>
                      <div>
                        <p className="text-[10px] leading-none font-bold text-slate-400 uppercase">
                          Contact Number
                        </p>
                        <p className="font-medium">{owner.phone_number}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t bg-slate-50/80 px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 font-bold text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                    onClick={() => {
                      modal.setEditOwner(owner)
                      modal.onOpen()
                    }}
                  >
                    <Edit2 className="mr-1 size-3" /> Edit Profile
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 font-bold text-emerald-600 hover:bg-emerald-100"
                    onClick={() => modal.onViewOpen(owner)}
                  >
                    View Details <ChevronRight className="ml-1 size-4" />
                  </Button>
                </div>
                <OwnerDetailsModal />
                <RegisterAnimalModal />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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
    </div>
  )
}
