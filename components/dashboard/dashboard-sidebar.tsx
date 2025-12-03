"use client"

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
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  activeTab?: string
  setActiveTab?: (tab: string) => void
}

const navigation = [
  { name: "Overview", value: "overview", icon: LayoutDashboard },
  { name: "Signals", value: "signals", icon: Signal },
  { name: "Agents", value: "agents", icon: Users },
  { name: "Strategies", value: "strategies", icon: TrendingUp },
  { name: "Prediction Markets", value: "prediction-markets", icon: Target },
  { name: "Copy Trading", value: "copy-trading", icon: Copy },
  { name: "Risk & Portfolio", value: "risk", icon: Shield },
]

const secondaryNav = [
  { name: "Settings", value: "settings", icon: Settings },
  { name: "Help", value: "help", icon: HelpCircle },
]

export function DashboardSidebar({ activeTab = "overview", setActiveTab }: DashboardSidebarProps) {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">TimeTravel.AI</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab?.(item.value)}
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
          {secondaryNav.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab?.(item.value)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground text-left"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  )
}
