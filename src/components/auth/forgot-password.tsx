import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { supabase } from "@/utils/supabase"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { toast } from "sonner"
import { KeyRound, ChevronLeft, MailCheck, ShieldCheck } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid institutional email."),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export function ForgotPassword() {
  const navigate = useNavigate()
  const [isSent, setIsSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  })

  async function onSubmit(data: ForgotFormValues) {
    setLoading(true)
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("full_name, password, email")
        .eq("email", data.email)
        .single()

      if (error || !user) throw new Error("Email not found in our registry.")

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        "template_hzeygof",
        {
          to_name: user.full_name,
          to_email: user.email,
          message: `Your current password for the BRGY-PET Portal is: ${user.password}`,
          link: window.location.origin + "/",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      setIsSent(true)
      toast.success("Recovery details sent successfully.")
    } catch (err: any) {
      toast.error(err.message || "Failed to process request.")
    } finally {
      setLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <Card className="w-full max-w-md animate-in overflow-hidden border-none p-0 shadow-2xl duration-300 fade-in zoom-in">
          <div className="bg-emerald-600 p-12 text-center text-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-8 ring-white/10 backdrop-blur-sm">
              <MailCheck size={40} />
            </div>
            <h2 className="mt-8 text-2xl font-black tracking-tighter uppercase">
              Check Your Inbox
            </h2>
            <p className="mt-2 text-sm font-medium text-emerald-100">
              We've sent recovery credentials to your registered email.
            </p>
          </div>
          <CardContent className="bg-white p-8">
            <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <ShieldCheck
                className="mt-1 shrink-0 text-emerald-600"
                size={20}
              />
              <p className="text-xs leading-relaxed text-slate-500">
                If you don't see the email within 5 minutes, please check your
                spam folder or contact the System Architect.
              </p>
            </div>
            <Button
              className="mt-8 h-12 w-full bg-slate-900 font-bold tracking-widest text-white uppercase transition-all hover:bg-slate-800"
              onClick={() => navigate("/")}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-2xl">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-emerald-900 p-10 text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <KeyRound size={120} />
          </div>

          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500">
                <KeyRound size={14} className="text-white" />
              </div>
              <h1 className="text-sm font-black tracking-[0.2em] uppercase">
                BRGY-PET
              </h1>
            </div>
            <h2 className="pt-4 text-3xl font-black tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-sm font-medium text-emerald-300/80">
              Enter your email for identity verification.
            </p>
          </div>
        </div>

        <CardContent className="p-10 pt-12">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Field>
              <FieldLabel className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                Institutional Email Address
              </FieldLabel>
              <Input
                placeholder="officer@barangay.gov"
                className="h-14 border-slate-200 bg-slate-50/50 text-base transition-all focus:bg-white focus:ring-emerald-500/20"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <FieldError className="mt-2 text-xs font-bold tracking-wide text-red-500 uppercase">
                  {form.formState.errors.email.message}
                </FieldError>
              )}
            </Field>

            <Button
              disabled={loading}
              type="submit"
              className="h-14 w-full bg-emerald-600 font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              {loading ? "Verifying..." : "Send Recovery Link"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-slate-50 bg-slate-50/50 p-6">
          <Link
            to="/"
            className="group flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-all hover:text-emerald-600"
          >
            <ChevronLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Return to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
