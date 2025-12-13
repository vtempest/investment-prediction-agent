"use client"

import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Activity, 
  TrendingUp, 
  Signal, 
  Users, 
  Zap, 
  Target, 
  Copy, 
  Shield,
  Settings, 
  HelpCircle,
  ChevronUp, 
  User2, 
  LogOut, 
  Sparkles,
  CreditCard,
  Search,
  Bell
} from 'lucide-react'
import { useSession, signOut } from "@/lib/auth-client"

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
  SidebarMenuBadge,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Helper component for Search
function SidebarSearch() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<{symbol: string, name: string}[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { state, toggleSidebar } = useSidebar()

   React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  React.useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 1) {
        setResults([])
        return
      }

      try {
        const res = await fetch(`/api/stocks/autocomplete?q=${encodeURIComponent(query)}&limit=5`)
        const data = await res.json()
        if (data.success) {
          setResults(data.data)
          setIsOpen(true)
        }
      } catch (err) {
        console.error("Autocomplete failed", err)
      }
    }

    const timeoutId = setTimeout(fetchResults, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSelect = (symbol: string) => {
    setQuery(symbol)
    setIsOpen(false)
    // Close mobile sidebar if open
    if (state === "expanded") {
      toggleSidebar()
    }
    router.push(`/dashboard?tab=strategies&symbol=${symbol}`)
  }

  if (state === "collapsed") {
    return (
      <Button variant="ghost" size="icon" className="h-7 w-2" onClick={() => toggleSidebar()}>
        <Search className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div ref={wrapperRef} className="relative w-full px-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input 
          placeholder="Search stocks..." 
          className="pl-8 h-8 bg-sidebar-accent/50 border-sidebar-border" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if(results.length > 0) setIsOpen(true) }}
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-2 right-2 mt-1 bg-popover border border-border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <div 
              key={item.symbol}
              className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm flex justify-between items-center"
              onClick={() => handleSelect(item.symbol)}
            >
              <span className="font-bold">{item.symbol}</span>
              <span className="text-muted-foreground truncate max-w-[80px] text-xs">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Navigation Configuration
const navigationGroups = [
  
  {
    title: "Trading",
    items: [
      { name: "Research Agents", tab: "api-data", icon: Activity },
      // { name: "Agents", tab: "agents", icon: Users },
      { name: "Strategies", tab: "strategies", icon: Zap },
      { name: "Copy Trading", tab: "copy-trading", icon: Copy },
      { name: "Prediction Markets", tab: "prediction-markets", icon: Target },
    ],
  },
  {
    title: "Risk & Portfolio",
    items: [
      { name: "Overview", tab: "overview", icon: LayoutDashboard },

      { name: "Risk Management", tab: "risk", icon: Shield },
      { name: "Alpaca Trading", tab: "alpaca", icon: TrendingUp },
    ],
  },
]

function AppSidebarContent({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'overview'
  const { data: session } = useSession()
  const user = session?.user || { name: "Guest User", email: "guest@example.com", image: null }
  
  // Helper to determine active state
  const isActive = (tab?: string, href?: string) => {
    if (href) return pathname === href
    if (tab) return pathname === '/dashboard' && currentTab === tab
    return false
  }

  const userInitials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "GU"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src="/apple-touch-icon.png"
                    alt="Logo"
                    width={48}
                    height={48}
                    className="size-4 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">TimeTravel</span>
                  {/* <span className="truncate text-xs">v1.0.0</span> */}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSearch />
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.tab)}
                      tooltip={item.name}
                    >
                      <Link href={`/dashboard?tab=${item.tab}`}>
                        <item.icon />
                        <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === '/dashboard/settings'}
                  tooltip="Settings"
                >
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === '/help'}
                  tooltip="Help"
                >
                  <Link href="/help">
                    <HelpCircle />
                    <span className="group-data-[collapsible=icon]:hidden">Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                    <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{user.name || "Guest"}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <div className="relative group-data-[collapsible=icon]:hidden">
                    <Bell className="h-4 w-4 ml-auto text-muted-foreground" />
                     <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border border-sidebar-accent" />
                  </div>
                  <ChevronUp className="ml-2 size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                    <AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name || "Guest"}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <User2 className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={async () => {
                  await signOut()
                  router.push("/")
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Suspense fallback={<Sidebar collapsible="icon" {...props} />}>
      <AppSidebarContent {...props} />
    </Suspense>
  )
}
