import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  QrCode,
  Phone,
  MapPin,
  ShieldCheck,
  History,
  ExternalLink,
  Printer,
  Heart,
} from "lucide-react"
import { Button } from "./ui/button"
import { printQRCode } from "@/utils/qrcode"

export function AnimalProfileModal({
  animal,
  isOpen,
  onClose,
}: {
  animal: any
  isOpen: boolean
  onClose: () => void
}) {
  if (!animal) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto bg-white p-0 sm:!w-[500px] sm:!max-w-none">
        <div className="relative h-48 bg-slate-100">
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => printQRCode(animal.qr_code_id, animal.name)}
              className="h-9 border-none bg-white/90 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white"
            >
              <Printer className="mr-2 size-4" />
              Print Tag
            </Button>
          </div>
          {animal.photo_url ? (
            <img
              src={animal.photo_url}
              className="h-full w-full object-cover"
              alt={animal.name}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-emerald-600">
              <span className="text-6xl font-bold text-white/20 uppercase">
                {animal.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute -bottom-6 left-6 flex size-24 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-xl">
            {/* This would be the actual generated QR Code */}
            <QrCode className="size-16 text-slate-800" />
          </div>
        </div>

        <div className="px-6 pt-10 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {animal.name}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {animal.breed || animal.species}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Badge
                className={
                  animal.status === "Safe"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {animal.status}
              </Badge>
              {!animal.owner_id && (
                <div className="sticky bottom-0 border-t border-slate-100 bg-white/90 p-4 backdrop-blur-sm">
                  <Button
                    className="w-full bg-emerald-600 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98]"
                    onClick={() => {
                      /* Handle your adoption flow / modal / form open here */
                    }}
                  >
                    <Heart className="mr-2 size-4 fill-white" />
                    Adopt {animal.name}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* --- QUICK STATS GRID --- */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Gender
              </p>
              <p className="text-sm font-bold text-slate-700">
                {animal.gender || "Unknown"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Vaccinated
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck
                  className={`size-3 ${animal.is_vaccinated ? "text-blue-600" : "text-slate-300"}`}
                />
                <p className="text-sm font-bold text-slate-700">
                  {animal.is_vaccinated ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Birth Date
              </p>
              <p className="text-sm font-bold text-slate-700">
                {animal.birth_date || "N/A"}
              </p>
            </div>
          </div>

          <Separator className="my-8 bg-slate-100" />

          {/* --- OWNER INFORMATION --- */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              Ownership Information
            </h3>
            {animal.owners ? (
              <div className="rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
                    <span className="font-bold text-slate-600">
                      {animal.owners.full_name?.charAt(0) || "Community Stray"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      {animal.owners.full_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone className="size-3" /> {animal.owners.phone_number}
                    </div>
                  </div>
                  <button className="rounded-full bg-slate-50 p-2 text-slate-400 hover:bg-slate-100">
                    <ExternalLink className="size-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                  <MapPin className="mt-0.5 size-3 shrink-0" />
                  {animal.owners.address || "No address provided"}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                <p className="text-sm font-medium text-slate-400 italic">
                  This animal is registered as a Community Stray.
                </p>
              </div>
            )}
          </section>

          <section className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Recent Activity
              </h3>
              <History className="size-4 text-slate-300" />
            </div>

            <div className="relative space-y-6 pl-6 before:absolute before:top-2 before:left-2 before:h-[80%] before:w-0.5 before:bg-slate-100">
              <div className="relative">
                <div className="absolute top-1 -left-[22px] size-3 rounded-full border-2 border-white bg-emerald-500" />
                <p className="text-xs font-bold text-slate-800">
                  QR Code Tag Printed
                </p>
                <p className="text-[10px] text-slate-400">
                  Today at 10:45 AM • Admin User
                </p>
              </div>
              <div className="relative">
                <div className="absolute top-1 -left-[22px] size-3 rounded-full border-2 border-white bg-slate-300" />
                <p className="text-xs font-bold text-slate-800">
                  Profile Created
                </p>
                <p className="text-[10px] text-slate-400">
                  May 8, 2026 • Municipal Registry
                </p>
              </div>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
