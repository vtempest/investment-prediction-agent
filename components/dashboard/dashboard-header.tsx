"use client"

import { Bell, Search, Menu, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

function AutocompleteSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{symbol: string, name: string}[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  useEffect(() => {
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
    router.push(`/dashboard/quote/${symbol}`)
  }

  return (
    <div ref={wrapperRef} className="relative w-64">
      <Input 
        placeholder="Search stocks..." 
        className="pl-9 bg-secondary border-border" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if(results.length > 0) setIsOpen(true) }}
      />
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-border rounded-md shadow-md z-50 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <div 
              key={item.symbol}
              className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm flex justify-between items-center"
              onClick={() => handleSelect(item.symbol)}
            >
              <span className="font-bold">{item.symbol}</span>
              <span className="text-muted-foreground truncate max-w-[120px]">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center gap-2 border-b border-border px-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Activity className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">PrimoAgent</span>
              </Link>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/analysis"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground"
              >
                Analysis
              </Link>
              <Link
                href="/dashboard/agents"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground"
              >
                Agents
              </Link>
              <Link
                href="/dashboard/reports"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground"
              >
                Reports
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <AutocompleteSearch />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select defaultValue="paper">
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paper">📝 Paper</SelectItem>
            <SelectItem value="live">🔴 Live</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">TT</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
