import { Sparkles, PawPrint } from "lucide-react"

export default function AdoptionComingSoon() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-xl p-8 text-center md:p-12">
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-center gap-2 text-emerald-600">
          <PawPrint className="h-10 w-10 -rotate-12 transform animate-bounce" />
          <span className="text-3xl font-black tracking-tight text-slate-900">
            BRGY-<span className="text-emerald-600">PET</span>
          </span>
        </div>
        {/* Heading */}
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Meet Your Future Best Friend <br />
          <span className="text-emerald-600">Adoption Portal Coming Soon</span>
        </h1>
        {/* Description */}
        <p className="mx-auto mb-8 max-w-md leading-relaxed text-slate-600">
          We are building a brand-new community adoption platform. Soon, you’ll
          be able to browse local rescues, track real-time pet updates, and
          seamlessly apply to bring a new family member home.
        </p>
        {/* Progress Bar */}
        <div className="mx-auto mb-10 max-w-md rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-emerald-600" /> Preparing the
              playpen...
            </span>
            <span className="text-emerald-700">85% Ready</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
              style={{ width: "85%" }}
            ></div>
          </div>
        </div>
        ß
      </div>
    </div>
  )
}
