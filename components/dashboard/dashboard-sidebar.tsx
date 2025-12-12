"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Activity,
  LayoutDashboard,
  Signal,
  Users,
  Settings,
  TrendingUp,
  Target,
  Copy,
  Shield,
  HelpCircle,
  Menu,
  X,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardSidebarProps {
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

const navigation = [
  { name: "Overview", value: "overview", icon: LayoutDashboard },
  { name: "API Data", value: "api-data", icon: Activity },
  { name: "Alpaca Trading", value: "alpaca", icon: TrendingUp },
  { name: "Signals", value: "signals", icon: Signal },
  { name: "Agents", value: "agents", icon: Users },
  { name: "Strategies", value: "strategies", icon: Zap },
  { name: "Prediction Markets", value: "prediction-markets", icon: Target },
  { name: "Copy Trading", value: "copy-trading", icon: Copy },
  { name: "Risk & Portfolio", value: "risk", icon: Shield },
]

const secondaryNav = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", value: "help", icon: HelpCircle },
]




export function DashboardSidebar({ activeTab = "overview", setActiveTab }: DashboardSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleTabClick = (value: string) => {
    // If setActiveTab is provided (we are on dashboard), use it
    if (setActiveTab) {
      setActiveTab(value)
    } else {
      // Otherwise navigate to dashboard with tab param
      router.push(`/dashboard?tab=${value}`)
    }
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">TimeTravel.AI</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.value}
              onClick={() => handleTabClick(item.value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
                activeTab === item.value
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-1">
          {secondaryNav.map((item) => {
            if ('href' in item && item.href) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            }
            return (
              <button
                key={item.value}
                onClick={() => handleTabClick(item.value as string)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground text-left"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </button>
            )
          })}
          
          <div className="pt-2 mt-2 border-t border-border">
            <Link 
              href="/dashboard/profile" 
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {session?.user?.name
                    ? (session.user.name as string).split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-sm font-medium truncate">{session?.user?.name || "Guest User"}</span>
                <span className="text-xs text-muted-foreground truncate">{session?.user?.email || "Sign in"}</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile Sidebar - Sheet/Drawer */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed top-0 left-0 bottom-0 z-30">
        <SidebarContent />
      </aside>
    </>
  )
}
