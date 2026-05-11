import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    //<Router>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h2 className="text-sm font-medium">Secretary Portal</h2>
          </header>

          <main className="flex-1 bg-slate-50/50 p-6"><Outlet /></main>
        </SidebarInset>
      </SidebarProvider>
    //</Router>
  )
}
