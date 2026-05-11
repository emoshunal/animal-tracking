import { useEffect } from "react"
import {
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Save,
  ShieldCheck,
  Building2,
  Loader2,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/utils/supabase"
import { useOwnerStore } from "@/store/useOwnerStore"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const ownerSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  phone_number: z.string().min(11, "Valid phone number is required"),
  email: z.string().email("Invalid email address").optional(),
  address: z.string().optional(),
  sitio: z.string().optional(),
  street: z.string().optional(),
})

type OwnerFormValues = z.infer<typeof ownerSchema>

export function AddOwnerModal() {
  const modal = useOwnerStore()
  const isEdit = !!modal.selectedOwner
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      address: "",
      sitio: "",
      street: "",
    },
  })

  useEffect(() => {
    if (isEdit && modal.selectedOwner) {
      reset({
        full_name: modal.selectedOwner.full_name,
        phone_number: modal.selectedOwner.phone_number,
        email: modal.selectedOwner.email || "",
        sitio: modal.selectedOwner.sitio || "",
        address: modal.selectedOwner.address || "",
        street: modal.selectedOwner.street || "",
      })
    } else {
      reset({
        full_name: "",
        phone_number: "",
        email: "",
        sitio: "",
        address: "",
        street: "",
      })
    }
  }, [isEdit, modal.selectedOwner, reset])

  const onSubmit = async (data: OwnerFormValues) => {
    modal.setSubmitting(true)
    try {
      const payload = {
        full_name: data.full_name,
        phone_number: data.phone_number,
        email: data.email,
        sitio: data.sitio,
        address: data.address,
        street: data.street,
      }
      // const { error } = await supabase.from("owners").insert([{
      //   full_name: data.full_name,
      //   phone_number: data.phone_number,
      //   email: data.email,
      //   sitio: data.sitio,
      //   street: data.street,
      //   address: data.address,
      // }
      // ])

      // if (error) throw error;

      if (isEdit) {
        const { error } = await supabase
          .from("owners")
          .update(payload)
          .eq("id", modal.selectedOwner?.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("owners").insert([payload])
        if (error) throw error
      }
      toast.promise(
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        },
        {
          loading: "Submitting record...",
          success: isEdit
            ? "Updated Successfully!"
            : "Registered Successfully!",
          error: "Submission failed.",
        }
      )

      modal.triggerRefresh()
      modal.onClose()
      reset()
    } catch (error: any) {
      console.error("Error submitting owner:", error)
      toast.error(error.message || "An error occurred during submission.")
    } finally {
      modal.setSubmitting(false)
    }
  }

  return (
    <Sheet open={modal.isOpen} onOpenChange={modal.onClose}>
      <SheetContent className="flex !w-full flex-col gap-0 border-l border-emerald-100/30 bg-white p-0 sm:!w-[550px] sm:!max-w-none">
        {/* Header Section */}
        <div
          className={cn(
            "p-6 text-white transition-colors duration-300",
            isEdit ? "bg-blue-600" : "bg-emerald-700"
          )}
        >
          <SheetHeader className="text-left">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                <UserPlus className="size-5 text-white" />
              </div>
              <Badge
                variant="outline"
                className="border-white/30 text-[10px] tracking-widest text-white uppercase"
              >
                {isEdit ? "Update Guardian" : "Guardian Registration"}
              </Badge>
            </div>
            <SheetTitle className="text-2xl font-bold tracking-tight text-white">
              {isEdit ? "Update Owner Record" : "Register Owner"}
            </SheetTitle>
            <SheetDescription className="font-medium text-emerald-50/80">
              {isEdit
                ? `Updating profile for ${modal.selectedOwner?.full_name}`
                : "Add a new animal owner to the community database."}
            </SheetDescription>
          </SheetHeader>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="flex-1 space-y-8 overflow-y-auto p-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck className="size-4" />
                <h3 className="text-xs font-bold tracking-wider uppercase">
                  Personal Details
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullname"
                    className="text-[11px] font-bold text-slate-500 uppercase"
                  >
                    Full Name
                  </Label>
                  <Input
                    {...register("full_name")}
                    id="fullname"
                    placeholder="e.g. Roberto Garcia"
                    className="h-11 border-none bg-slate-50 focus-visible:ring-emerald-500"
                  />
                  {errors.full_name && (
                    <p className="text-[10px] text-red-500">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-[11px] font-bold text-slate-500 uppercase"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...register("phone_number")}
                      id="phone"
                      placeholder="+63 9xx"
                      className="h-11 border-none bg-slate-50 pl-10 focus-visible:ring-emerald-500"
                    />
                    {errors.phone_number && (
                      <p className="text-[10px] text-red-500">
                        {errors.phone_number.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[11px] font-bold text-slate-500 uppercase"
                  >
                    Email (Optional)
                  </Label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="h-11 border-none bg-slate-50 pl-10 focus-visible:ring-emerald-500"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <MapPin className="size-4" />
                <h3 className="text-xs font-bold tracking-wider uppercase">
                  Sitio & Residency
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="barangay"
                    className="text-[11px] font-bold text-slate-500 uppercase"
                  >
                    Sitio
                  </Label>
                  <Select onValueChange={(val) => setValue("sitio", val)}>
                    <SelectTrigger
                      id="barangay"
                      className="h-11 w-full border-none bg-slate-50"
                    >
                      <SelectValue placeholder="Select Sitio" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="san-isidro">San Isidro</SelectItem>
                      <SelectItem value="san-pedro">San Pedro</SelectItem>
                      <SelectItem value="maligaya">Maligaya</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sitio && (
                    <p className="text-[10px] text-red-500">
                      {errors.sitio.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="sitio"
                    className="text-[11px] font-bold text-slate-500 uppercase"
                  >
                    Residency Street
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      {...register("street")}
                      id="sitio"
                      placeholder="e.g. Sitio Riverside"
                      className="h-11 border-none bg-slate-50 pl-10 focus-visible:ring-emerald-500"
                    />
                    {errors.street && (
                      <p className="text-[10px] text-red-500">
                        {errors.street.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="text-[11px] font-bold text-slate-500 uppercase"
                >
                  Address Landmarks
                </Label>
                <Input
                  {...register("address")}
                  id="notes"
                  placeholder="e.g. Near the community chapel"
                  className="h-11 border-none bg-slate-50 focus-visible:ring-emerald-500"
                />
                {errors.address && (
                  <p className="text-[10px] text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <SheetFooter className="border-t bg-slate-50/50 p-6">
            <div className="flex w-full gap-3">
              <Button
                variant="ghost"
                className="h-12 flex-1 text-slate-500 hover:bg-slate-100"
                onClick={modal.onClose}
              >
                Cancel
              </Button>
              <Button
                className={cn(
                  "h-12 flex-1 font-bold text-white shadow-md transition-all",
                  isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
                disabled={modal.isSubmitting}
              >
                {modal.isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {isEdit ? "Update Record" : "Save Owner Record"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
