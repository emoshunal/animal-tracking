import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  PawPrint,
  Edit3,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useOwnerStore } from "@/store/useOwnerStore"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom"
import { useAnimalStore } from "@/store/useAnimalStore"

export function OwnerDetailsModal() {
  const navigate = useNavigate()
  const animalModal = useAnimalStore()

  const { isViewOpen, viewingOwner, onViewClose, setEditOwner, onOpen } =
    useOwnerStore()

  if (!viewingOwner) return null

  const handleRegisterAnimal = () => {
    // onViewClose()
    animalModal.setPreselectedOwner(viewingOwner.id)
    animalModal.onOpen()
    // setTimeout(() => {
    //   animalModal.onOpen()
    // }, 150)
  }
  const handleEditTransition = () => {
    setEditOwner(viewingOwner)
    onViewClose()
    onOpen()
  }

  return (
    <Sheet open={isViewOpen} onOpenChange={onViewClose}>
      <SheetContent className="flex w-full flex-col border-l border-slate-200 bg-white p-0 sm:!w-[500px] sm:!max-w-[540px]">
        {/* --- PROFILE HERO --- */}
        <div className="relative h-40 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEditTransition}
              className="h-9 border-none bg-white/10 text-gray-800 shadow-sm backdrop-blur-md hover:bg-white/20"
            >
              <Edit3 className="mr-2 size-4" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="px-8 pt-12 pb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {viewingOwner.full_name}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-slate-500">
                <Badge
                  variant="outline"
                  className="border-emerald-100 bg-emerald-50 text-[10px] font-bold text-emerald-700 uppercase"
                >
                  Verified Guardian
                </Badge>
                <span className="font-mono text-xs">
                  ID: {viewingOwner.id.split("-")[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Phone Number
              </p>
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <Phone className="size-3.5 text-emerald-600" />
                {viewingOwner.phone_number}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Email Address
              </p>
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <Mail className="size-3.5 text-emerald-600" />
                {viewingOwner.email || "No email linked"}
              </div>
            </div>
          </div>

          <Separator className="my-8 opacity-50" />

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <MapPin className="size-4 text-emerald-600" />
              Residency Information
            </h3>
            <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Sitio / Area</span>
                <span className="text-sm font-semibold text-slate-700">
                  {viewingOwner.sitio}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Barangay</span>
                <span className="text-sm font-semibold text-slate-700">
                  San Isidro
                </span>
              </div>
              <div className="pt-2">
                <p className="mb-1 text-[10px] font-bold text-slate-400 uppercase">
                  Landmarks
                </p>
                <p className="text-sm leading-relaxed text-slate-600 italic">
                  "{viewingOwner.address}"
                </p>
              </div>
            </div>
          </div>

          {/* --- ANIMAL SUMMARY --- */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <PawPrint className="size-4 text-emerald-600" />
                Linked Animals
              </h3>
              <Badge className="border-none bg-slate-900 text-white">
                {viewingOwner.animalCount} Total
              </Badge>
            </div>

            {viewingOwner.animalCount > 0 ? (
              <div className="grid gap-3">
                {/* If you wanted to fetch actual animal names, you'd update the Supabase query 
          to select(full_name) instead of count. For now, we show a summary card: */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
                      🐾
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {viewingOwner.animalCount} Registered Pets
                      </p>
                      <p className="text-xs text-slate-500">
                        Managed in Animal Registry
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 bg-white text-[11px] font-bold"
                    onClick={() => {
                      navigate(`/animal?ownerId=${viewingOwner.id}`)
                    }}
                  >
                    View All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-100 py-10">
                <div className="rounded-full bg-slate-50 p-3 text-slate-300">
                  <PawPrint className="size-6" />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-400">
                  No animals registered to this guardian.
                </p>
                <Button
                  variant="link"
                  className="mt-1 h-auto p-0 text-xs text-emerald-600"
                  onClick={handleRegisterAnimal}
                >
                  Register an Animal <Plus className="ml-1 size-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-12 flex items-center gap-2 text-[10px] font-medium text-slate-400">
            <Calendar className="size-3" />
            Registered on{" "}
            {format(new Date(viewingOwner.created_at), "MMMM dd, yyyy")}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
