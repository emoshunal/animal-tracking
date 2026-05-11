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
import { PawPrint, ShieldCheck } from "lucide-react"
import loginImg from "@/assets/login.jpg"
import { useNavigate } from "react-router-dom"

const loginSchema = z.object({
  email: z.string().email("Please use a valid institutional email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

type LoginFormValues = z.infer<typeof loginSchema>

const STATIC_USER = {
  email: "admin@sec.gov",
  password: "secretary",
}
export function LoginForm() {
  const navigate = useNavigate()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginFormValues) {
    toast.promise(
      new Promise(async (resolve, reject) => {
        // Simulate network delay
        await new Promise((res) => setTimeout(res, 1500))

        if (
          data.email === STATIC_USER.email &&
          data.password === STATIC_USER.password
        ) {
          // Store a dummy token or user info if needed
          localStorage.setItem("isAuthenticated", "true")
          resolve(data)

          // Redirect to dashboard/home after a short delay
          setTimeout(() => navigate("/dashboard"), 1000)
        } else {
          reject(new Error("Invalid credentials"))
        }
      }),
      {
        loading: "Authenticating session...",
        success: "Identity verified. Redirecting...",
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
              <span className="text-xl">VET-TRACK</span>
            </div>

            <div className="relative z-10">
              <blockquote className="space-y-2">
                <p className="text-lg leading-relaxed font-medium">
                  "Streamlining animal health surveillance and population
                  management for municipal districts."
                </p>
                <footer className="text-sm text-emerald-300">
                  Animal Management Division
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
                      <a
                        href="#"
                        className="text-xs font-medium text-emerald-600 hover:underline"
                      >
                        Forgot?
                      </a>
                    </div>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 border-slate-200 bg-slate-50/50 transition-all focus:bg-white"
                      {...form.register("password")}
                    />
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
