import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { supabase } from "@/utils/supabase"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Eye, EyeOff, KeyRound } from "lucide-react"

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ChangePasswordValues = z.infer<typeof changePasswordSchema>

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  userEmail,
}: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  })

  const onSubmit = async (values: ChangePasswordValues) => {
    setLoading(true)
    try {
      // 1. Verify current password
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", userEmail)
        .eq("password", values.currentPassword)
        .single()

      if (fetchError || !user) {
        throw new Error("Current password incorrect.")
      }

      // 2. Update to new password
      const { error: updateError } = await supabase
        .from("users")
        .update({ password: values.newPassword })
        .eq("id", user.id)

      if (updateError) throw updateError

      toast.success("Password updated successfully")
      reset()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  const ToggleButton = () => (
    <button
      type="button"
      onClick={() => setShowPasswords(!showPasswords)}
      className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
    >
      {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  )
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden border-none bg-white p-0 shadow-2xl sm:max-w-[400px]">
        <div className="flex items-center gap-4 bg-slate-900 p-6 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <KeyRound size={24} />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight uppercase">
              Update Credentials
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-400">
              Modify your portal access key
            </DialogDescription>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 bg-white p-6"
        >
          <Field>
            <FieldLabel className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Current Password
            </FieldLabel>
            <div className="relative">
              <Input
                type={showPasswords ? "text" : "password"}
                {...register("currentPassword")}
                className="h-11 border-slate-200 bg-slate-50 pr-10"
              />
              <ToggleButton />
            </div>
            {errors.currentPassword && (
              <FieldError>{errors.currentPassword.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              New Password
            </FieldLabel>
            <div className="relative">
              <Input
                type={showPasswords ? "text" : "password"}
                {...register("newPassword")}
                className="h-11 border-slate-200 bg-slate-50 pr-10"
              />
              <ToggleButton />
            </div>
            {errors.newPassword && (
              <FieldError>{errors.newPassword.message}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Confirm New Password
            </FieldLabel>
            <div className="relative">
              <Input
                type={showPasswords ? "text" : "password"}
                {...register("confirmPassword")}
                className="h-11 border-slate-200 bg-slate-50 pr-10"
              />
              <ToggleButton />
            </div>
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>

          <div className="pt-2">
            <Button
              disabled={loading}
              type="submit"
              className="h-11 w-full bg-emerald-600 font-bold tracking-widest uppercase transition-all hover:bg-emerald-700"
            >
              {loading ? "Updating..." : "Save New Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
