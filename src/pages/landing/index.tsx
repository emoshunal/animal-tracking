import { useEffect, useState } from "react"
import {
  ShieldCheck,
  MapPin,
  AlertCircle,
  Phone,
  Send,
  Heart,
  Info,
  CheckCircle2,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useParams } from "react-router-dom"
import { supabase } from "@/utils/supabase"
import { toast } from "sonner"

export default function PublicAnimalProfile() {
  const { qrId } = useParams()
  const [animal, setAnimal] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showReportForm, setShowReportForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [contactNumber, setContactNumber] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    async function fetchAnimal() {
      if (!qrId) return
      setLoading(true)

      const fullUrl = `${window.location.origin}/${qrId}`
      try {
        const { data, error } = await supabase
          .from("animals")
          .select(
            `
            *,
            owners (
              full_name,
              phone_number
            )
          `
          )
          .eq("qr_code_id", fullUrl)
          .single()

        console.log(data)
        if (error) throw error
        setAnimal(data)
      } catch (err) {
        console.error("Error fetching animal:", err)
      } finally {
        setLoading(false)
      }
    }

    if (qrId) fetchAnimal()
    window.scrollTo(0, 0)
  }, [qrId])

  const handleSubmitSighting = async () => {
    if (!contactNumber || !location) {
      return toast.error("Please provide your contact and location")
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from("sighting_reports").insert([
        {
          animal_id: animal.id,
          reporter_phone: contactNumber,
          location_name: location,
          message: notes,
          status: "PENDING",
        },
      ])

      if (error) throw error

      toast.success(
        "Report submitted! The owner and Barangay have been notified."
      )
      setShowReportForm(false)
    } catch (err) {
      toast.error("Failed to submit report")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    )

  if (!animal)
    return (
      <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="mb-4 size-12 text-slate-300" />
        <h2 className="text-xl font-bold">Tag Not Found</h2>
        <p className="text-slate-500">
          This QR code is not registered in our system.
        </p>
      </div>
    )

  const isLost = animal.status === "Missing"

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans">
      <div
        className={`flex items-center justify-center gap-2 p-3 text-center text-[11px] font-black tracking-widest text-white uppercase transition-colors duration-500 ${
          isLost ? "animate-pulse bg-red-600" : "bg-emerald-600"
        }`}
      >
        {isLost ? (
          <>
            <AlertCircle className="size-4" />
            <span>This Animal is Reported Missing</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="size-4" />
            <span>Safe & Registered</span>
          </>
        )}
      </div>

      <div className="mx-auto max-w-md space-y-6 p-4">
        <Card className="overflow-hidden rounded-3xl border-none shadow-xl">
          <div className="relative h-72 bg-slate-200">
            <img
              src={
                animal.photo_url ||
                "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600"
              }
              className="h-full w-full object-cover"
              alt={animal.name}
            />
            {isLost && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-600/10 backdrop-blur-[1px]">
                <Badge className="border-none bg-red-600 px-6 py-2 text-lg font-black text-white shadow-2xl">
                  LOST
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-6 text-center">
            <h1 className="text-3xl leading-none font-black text-slate-900">
              {animal.name}
            </h1>
            <p className="mt-2 text-sm font-bold tracking-tighter text-emerald-600 uppercase">
              {animal.breed} • {animal.species} • {animal.age} Years Old
            </p>

            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <ShieldCheck className="size-5" />
                </div>
                <span className="mt-1 text-[9px] font-extrabold tracking-widest text-slate-400 uppercase">
                  Vaccinated
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Heart className="size-5" />
                </div>
                <span className="mt-1 text-[9px] font-extrabold tracking-widest text-slate-400 uppercase">
                  Friendly
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <div className="relative h-64 bg-slate-200">
            <img
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600"
              className="h-full w-full object-cover"
              alt="Animal"
            />
            {isLost && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-600/20 backdrop-blur-[2px]">
                <Badge className="scale-110 border-none bg-red-600 px-6 py-2 text-lg font-black text-white shadow-2xl">
                  LOST
                </Badge>
              </div>
            )}
          </div> */}
        {/* 
          <CardContent className="p-6 text-center">
            <h1 className="text-3xl leading-none font-black text-slate-900">
              Bruno
            </h1>
            <p className="mt-2 text-sm font-bold tracking-tighter text-emerald-600 uppercase">
              Aspin • Male • 3 Years Old
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <ShieldCheck className="size-5" />
                </div>
                <span className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
                  Vaccinated
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <Heart className="size-5" />
                </div>
                <span className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
                  Friendly
                </span>
              </div>
            </div>
          </CardContent> */}

        {!showReportForm ? (
          <div className="space-y-3">
            {isLost && animal.owners && (
              <Card className="animate-in border-none bg-white p-5 shadow-lg ring-1 ring-red-100 duration-500 fade-in zoom-in">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <Phone className="size-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Owner Contact
                    </p>
                    <h3 className="text-lg font-bold text-slate-900">
                      {animal.owners.full_name}
                    </h3>
                  </div>
                  <a href={`tel:${animal.owners.phone_number}`}>
                    <Button
                      size="sm"
                      className="rounded-xl bg-red-600 font-bold hover:bg-red-700"
                    >
                      Call Now
                    </Button>
                  </a>
                </div>
              </Card>
            )}
            {isLost ? (
              <Button
                onClick={() => setShowReportForm(true)}
                className="h-16 w-full rounded-2xl bg-red-600 text-lg font-black text-white shadow-lg shadow-red-200 hover:bg-red-700"
              >
                <MapPin className="mr-2 size-6" /> I FOUND{" "}
                {animal.name.toUpperCase()}
              </Button>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                <Info className="mx-auto mb-2 size-8 text-slate-300" />
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <Info className="mx-auto mb-3 size-10 text-emerald-100" />
                  <h4 className="font-bold text-slate-900">All Good!</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {animal.name} is not reported missing. If you found this
                    animal alone, please contact the Barangay Hall.
                  </p>
                </div>
              </div>
            )}
            <a
              href={`CP:${animal.owners?.phone_number || "09123456789"}`}
              className="block"
            >
              <Button
                variant="outline"
                className="h-14 w-full rounded-2xl border-slate-200 bg-white font-bold text-slate-600"
              >
                <Phone className="mr-2 size-4" /> Call{" "}
                {isLost ? "Owner" : "Barangay Office"}
              </Button>
            </a>
          </div>
        ) : (
          <Card className="animate-in rounded-3xl border-none shadow-2xl duration-500 slide-in-from-bottom-10">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  Found Sighting
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReportForm(false)}
                >
                  Cancel
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Your Phone Number
                  </label>
                  <Input
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="To let the owner reach you"
                    className="h-12 rounded-xl border-none bg-slate-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Sighting Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-red-500" />
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Near Brgy Chapel"
                      className="h-12 rounded-xl border-none bg-slate-50 pl-11"
                    />
                  </div>
                </div>
                {/* 
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Upload Photo (Proof of Life)
                  </label>
                  <div className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200">
                    <Camera className="mb-1 size-8" />
                    <span className="text-[10px] font-bold">Snap a Photo</span>
                  </div>
                </div> */}

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Message for the Owner
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Is the pet safe? Any injuries?"
                    className="min-h-[100px] rounded-xl border-none bg-slate-50 p-4"
                  />
                </div>

                <Button
                  className="h-14 w-full rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
                  onClick={handleSubmitSighting}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Send className="mr-2 size-5" /> Send Sighting Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLost && (
          <a
            href={`tel:${animal.owners?.phone_number || "09123456789"}`}
            className="block"
          >
            <Button
              variant="outline"
              className="h-14 w-full rounded-2xl border-slate-200 bg-white font-bold text-slate-600"
            >
              <Phone className="mr-2 size-4" /> Call Barangay Office
            </Button>
          </a>
        )}
        {/* Security Footer */}
        <div className="flex flex-col items-center justify-center gap-1 text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase">
              Verified Barangay Pet Registry
            </span>
          </div>
          <p className="text-[8px] font-medium">Tag ID: QR-{qrId}</p>
        </div>
      </div>
    </div>
  )
}
