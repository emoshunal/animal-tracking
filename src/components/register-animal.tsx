import { useState, useRef, useEffect } from "react"
import {
  PawPrint,
  HeartPulse,
  Info,
  Save,
  User,
  Mars,
  Venus,
  Camera,
  X,
  UserMinus,
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
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/utils/supabase"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAnimalStore } from "@/store/useAnimalStore"
import { OwnerSearch } from "./owner-search"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  species: z.string().min(1, "Select a species"),
  breed: z.string().min(1, "Select a breed"),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  remarks: z.string().optional(),
  ownerId: z.string().optional(),
})

const BASE_URL = window.location.origin
export function RegisterAnimalModal() {
  console.log("Base url is ", BASE_URL)
  const modal = useAnimalStore()
  const editData = modal.selectedAnimal
  const isEdit = !!editData
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,

    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      remarks: "",
      ownerId: "",
    },
  })

  const isStray = modal.isStray

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file) // Store the file for upload
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (isEdit && editData) {
      reset({
        name: editData.name,
        species: editData.species || "",
        breed: editData.breed || "",
        gender: editData.gender || "",
        birthDate: editData.birthDate || "",
        remarks: editData.remarks || "",
        ownerId: editData.owner_id || "",
      })
      setImagePreview(editData.photo_url)
      if (!editData.owner_id) modal.toggleStray(true)
    } else {
      reset({ name: "", remarks: "", ownerId: "" })
      setImagePreview(null)
      modal.toggleStray(false)
    }
  }, [isEdit, editData, reset])

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    modal.setSubmitting(true)
    try {
      let photoUrl = ""

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: storageError } = await supabase.storage
          .from("animals")
          .upload(fileName, imageFile)

        if (storageError) throw storageError

        const { data: publicUrlData } = supabase.storage
          .from("animals")
          .getPublicUrl(fileName)

        photoUrl = publicUrlData.publicUrl
      }

      const payload = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        remarks: formData.remarks,
        gender: formData.gender,
        birthDate: formData.birthDate,
        photo_url: photoUrl,
        owner_id: isStray ? null : formData.ownerId || null,
      }

      if (isEdit) {
        const { error } = await supabase
          .from("animals")
          .update(payload)
          .eq("id", editData.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("animals").insert([
          {
            ...payload,
            qr_code_id: `${BASE_URL}/QR-${Math.floor(1000 + Math.random() * 9000)}`,
            status: "Safe",
          },
        ])
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
      setImagePreview(null)
      setImageFile(null)
    } catch (err: any) {
      console.error("Submission error:", err)
      toast.error(err.message || "An error occurred during submission.")
    } finally {
      modal.setSubmitting(false)
    }
  }

  return (
    <Sheet open={modal.isOpen} onOpenChange={modal.onClose}>
      <SheetContent className="flex !w-full flex-col gap-0 border-l border-emerald-100/30 bg-white p-0 sm:!w-[550px] sm:!max-w-none">
        <div
          className={` ${isEdit ? "bg-blue-600" : "bg-emerald-600"} p-6 text-white`}
        >
          <SheetHeader className="text-left">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                <PawPrint className="size-5 text-white" />
              </div>
              <Badge
                variant="outline"
                className="border-white/30 text-[10px] text-white uppercase"
              >
                {isEdit ? "Update Animal Info" : "New Registration"}
              </Badge>
            </div>
            <SheetTitle className="text-2xl font-bold text-white">
              {isEdit ? "Edit Animal Record" : "Register Animal"}
            </SheetTitle>
            <SheetDescription className="text-emerald-50/80">
              {isEdit
                ? "Modify the details of this animal."
                : "Create a unique profile and QR tracking identity."}
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="space-y-8 p-6">
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex size-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-emerald-500"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setImagePreview(null)
                        setImageFile(null)
                      }}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white"
                    >
                      <X className="size-3" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <Camera className="mb-2 size-8 group-hover:text-emerald-600" />
                    <span className="text-[10px] font-bold uppercase">
                      Upload Photo
                    </span>
                  </div>
                )}
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* Identity Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <Info className="size-4" />
                <h3 className="text-xs font-bold uppercase">Basic Identity</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">
                  Name / ID
                </Label>
                <Input
                  {...register("name")}
                  placeholder="e.g. Bruno"
                  className="h-11 border-none bg-slate-50 focus-visible:ring-emerald-500"
                />
                {errors.name && (
                  <p className="text-[10px] text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">
                    Species
                  </Label>
                  <Select onValueChange={(value) => setValue("species", value)}>
                    <SelectTrigger className="h-11 w-full border-none bg-slate-50 focus:ring-emerald-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="dog">Canine (Dog)</SelectItem>
                      <SelectItem value="cat">Feline (Cat)</SelectItem>
                      <SelectItem value="livestock">Livestock</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.species && (
                    <p className="text-[10px] text-red-500">
                      {errors.species.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase">
                    Breed
                  </Label>
                  <Select onValueChange={(value) => setValue("breed", value)}>
                    <SelectTrigger className="h-11 w-full border-none bg-slate-50 focus:ring-emerald-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="askal">Aspin / Mixed</SelectItem>
                      <SelectItem value="golden">Golden Retriever</SelectItem>
                      <SelectItem value="shih">Shih Tzu</SelectItem>
                      <SelectItem value="persian">Persian Cat</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.breed && (
                    <p className="text-[10px] text-red-500">
                      {errors.breed.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    Gender
                  </Label>
                  <Tabs
                    onValueChange={(value) => setValue("gender", value)}
                    className="w-full"
                  >
                    <TabsList className="grid h-11 w-full grid-cols-2 bg-slate-100 p-1">
                      <TabsTrigger
                        value="male"
                        className="flex items-center gap-2 text-xs data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                      >
                        <Mars className="size-3.5" /> Male
                      </TabsTrigger>
                      <TabsTrigger
                        value="female"
                        className="flex items-center gap-2 text-xs data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-sm"
                      >
                        <Venus className="size-3.5" /> Female
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  {errors.gender && (
                    <p className="text-[10px] text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    Birth Date
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      {...register("birthDate")}
                      max={new Date().toISOString().split("T")[0]} // Prevents picking future dates
                      className={cn(
                        "h-11 w-full appearance-none border-none bg-slate-50 px-3 text-sm focus-visible:ring-emerald-500",
                        "flex-row-reverse gap-2" // Moves the browser's calendar icon to the left
                      )}
                    />
                  </div>
                  {errors.birthDate && (
                    <p className="text-[10px] font-medium text-red-500">
                      {errors.birthDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Owner Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-700">
                  <User className="size-4" />
                  <h3 className="text-xs font-bold uppercase">Ownership</h3>
                </div>
                <div className="flex items-center space-x-2 rounded-lg bg-slate-100 px-3 py-1.5">
                  <Checkbox
                    id="stray"
                    checked={isStray}
                    onCheckedChange={(checked) =>
                      modal.toggleStray(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="stray"
                    className="cursor-pointer text-[11px] font-bold text-slate-600 uppercase"
                  >
                    Stray / No Owner
                  </label>
                </div>
              </div>

              <div
                className={`space-y-2 transition-opacity ${isStray ? "pointer-events-none opacity-40" : ""}`}
              >
                <Label className="text-[11px] font-bold text-slate-500 uppercase">
                  Owner Imformation
                </Label>
                <OwnerSearch
                  disabled={isStray}
                  onSelect={(ownerId) => setValue("ownerId", ownerId)}
                />
                {isStray && (
                  <p className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
                    <UserMinus className="size-3" /> Registered as a
                    community-owned stray.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <HeartPulse className="size-4" />
                <h3 className="text-xs font-bold uppercase">Remarks</h3>
              </div>
              <Textarea
                {...register("remarks")}
                placeholder="Medical notes, markings..."
                className="min-h-[80px] resize-none border-none bg-slate-50 p-4 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <SheetFooter className="border-t bg-slate-50/50 p-6">
            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="ghost"
                className="h-12 flex-1"
                onClick={modal.onClose}
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={modal.isSubmitting}
                className="h-12 flex-1 bg-emerald-600 font-bold shadow-md hover:bg-emerald-700"
              >
                {modal.isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {isEdit ? "Save Changes" : "Register Record"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
