import { Link, useLocation } from "react-router-dom" // Use React Router for Vite
import {
  LayoutDashboard,
  PawPrint,
  Users,
  ClipboardList,
  Map,
  ShieldCheck,
  LogOut,
  ChevronUp,
  UserCircle,
  Bell,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Animal Registry", url: "/animals", icon: PawPrint },
  { title: "Owners", url: "/owners", icon: Users },
  { title: "Vaccinations", url: "/vaccinations", icon: ShieldCheck },
  { title: "Lost & Found", url: "/lost-and-found", icon: Map },
  {
    title: "Scan Reports",
    url: "/reports",
    icon: ClipboardList,
    badge: "3",
  },
]

export function AppSidebar() {
  const location = useLocation()
  const handleLogout = () => {
    console.log("test")
    localStorage.removeItem("isAuthenticated")

    window.location.href = "/"
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="bg-card border-r border-border/40"
    >
      {/* --- REFINED BRANDING --- */}
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200/50">
            <PawPrint className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold tracking-tight text-foreground">
              BRGY-PET
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-emerald-600 uppercase">
              Animal Tracking System
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* --- MANAGEMENT SECTION --- */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] font-bold tracking-wider text-muted-foreground/80 uppercase">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                    className="h-10 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700 data-[active=true]:bg-emerald-50 data-[active=true]:font-semibold data-[active=true]:text-emerald-700"
                  >
                    <Link to={item.url}>
                      <item.icon className="size-[18px]" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-auto h-5 border-none bg-emerald-100 px-1.5 text-emerald-700 group-data-[collapsible=icon]:hidden hover:bg-emerald-100">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-4 my-4 opacity-50" />

        <div className="mt-auto px-4 py-6 group-data-[collapsible=icon]:hidden">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-100/50 bg-emerald-50/50 p-4">
            <div className="relative z-10">
              <p className="text-[10px] font-bold tracking-tight text-emerald-800 uppercase">
                Active Coverage
              </p>
              <h4 className="text-xs font-semibold text-emerald-700/80">
                Anonas District
              </h4>
            </div>
            {/* Background Decorative Icon */}
            <PawPrint className="absolute -right-2 -bottom-2 size-16 rotate-12 text-emerald-600 opacity-10" />
          </div>
        </div>
      </SidebarContent>

      {/* --- USER PROFILE FOOTER --- */}
      <SidebarFooter className="border-t border-border/40 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full transition-colors data-[state=open]:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full border border-border bg-slate-200 text-slate-600">
                      <UserCircle className="size-7" />
                    </div>
                    <div className="flex flex-col items-start overflow-hidden text-sm group-data-[collapsible=icon]:hidden">
                      <span className="w-28 truncate text-left font-semibold text-foreground">
                        Secretary
                      </span>
                      <span className="w-28 truncate text-left text-[11px] text-muted-foreground">
                        Barangay Anonas
                      </span>
                    </div>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                className="mb-2 ml-2 w-56"
              >
                {/* <DropdownMenuItem className="cursor-pointer gap-2 py-2">
                  <UserCircle className="size-4" /> Profile Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 py-2">
                  <Bell className="size-4" /> Notifications
                </DropdownMenuItem>
                <SidebarSeparator /> */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 bg-white py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
