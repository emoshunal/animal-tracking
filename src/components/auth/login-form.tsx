import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Eye, EyeOff, PawPrint, ShieldCheck } from "lucide-react"
import loginImg from "@/assets/login.jpg"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/utils/supabase"
import { useState } from "react"

const loginSchema = z.object({
  email: z.string().email("Please use a valid email address."),
  password: z.string().min(1, "Password is required!."),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginFormValues) {
    toast.promise(
      (async () => {
        // 2. Query the users table
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", data.email)
          .eq("password", data.password) // Plain text comparison as requested
          .single()

        if (error || !user) {
          console.error("Error logging in:", error)
          throw new Error("Invalid email or password.")
        }

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userRole", user.role)
        localStorage.setItem("userName", user.email)
        navigate("/dashboard")
        return user
      })(),
      {
        loading: "Verifying credentials...",
        success: (user: any) => `Welcome back, ${user.role}!`,
        error: (err) => err.message,
      }
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-[1000px] overflow-hidden border-none shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden flex-col justify-between bg-emerald-900 p-10 text-white md:flex">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
              style={{ backgroundImage: `url(${loginImg})` }}
            />

            <div className="relative z-10 flex items-center gap-2 font-bold tracking-tight">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <PawPrint size={24} />
              </div>
              <span className="text-xl">BRGY-PET</span>
            </div>

            <div className="relative z-10">
              <blockquote className="space-y-2">
                <p className="text-lg leading-relaxed font-medium">
                  "Streamlining animal health surveillance and population
                  management for municipal districts."
                </p>
                <footer className="text-sm text-emerald-300">
                  Barangay Anonas Animal Tracking and Registration
                </footer>
              </blockquote>
            </div>
          </div>

          {/* RIGHT COLUMN: Login Form */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="mx-auto w-full max-w-[350px] space-y-8">
              <div className="flex flex-col space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Officer Login
                </h1>
                <p className="text-sm text-slate-500">
                  Enter your credentials to access the portal.
                </p>
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                      Email Address
                    </FieldLabel>
                    <Input
                      type="email"
                      placeholder="name@agency.gov"
                      className="h-12 border-slate-200 bg-slate-50/50 transition-all focus:bg-white"
                      {...form.register("email")}
                    />
                    {form.formState.errors.email && (
                      <FieldError>
                        {form.formState.errors.email.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                        Password
                      </FieldLabel>
                      <Link
                        to="/forgot-password"
                        className="text-xs font-medium text-emerald-600 hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-12 border-slate-200 bg-slate-50/50 pr-10 transition-all focus:bg-white"
                        {...form.register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <FieldError>
                        {form.formState.errors.password.message}
                      </FieldError>
                    )}
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  className="group h-12 w-full bg-emerald-600 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    "Authenticating..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In{" "}
                      <ShieldCheck
                        size={18}
                        className="transition-transform group-hover:scale-110"
                      />
                    </span>
                  )}
                </Button>
              </form>

              <p className="px-8 text-center text-xs text-slate-400">
                Authorized Personnel Only. Access is monitored and logged.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
