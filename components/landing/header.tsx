"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Menu,
  X,
  Users,
  GitBranch,
  Target,
  Radio,
  TrendingUp,
  Sparkles,
  Calendar,
} from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden">
            <Image
              src="/apple-touch-icon.png"
              alt="Logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xl font-semibold text-foreground">TimeTravel.Investments</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#agents"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Users className="h-4 w-4" />
            Research Agents
          </Link>
          {/* <Link
            href="#workflow"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <GitBranch className="h-4 w-4" />
            Workflow
          </Link> */}
          <Link
            href="#strategies"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Target className="h-4 w-4" />
            Algo Strategies
          </Link>
          {/* <Link
            href="#signals"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Radio className="h-4 w-4" />
            Signals
          </Link> */}
          <Link
            href="#prediction-markets"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <TrendingUp className="h-4 w-4" />
            Prediction Markets
          </Link>
          <Link
            href="#copy-trading"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Sparkles className="h-4 w-4" />
            Copy Trading
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button size="sm" asChild>
            <Link href="https://takemymoney.timetravel.investments" target="_blank">
              <Calendar className="mr-2 h-4 w-4" />
              Book Demo
            </Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="#agents"
              className="flex items-center gap-2 text-sm text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="h-4 w-4" />
              Agents
            </Link>
            <Link
              href="#workflow"
              className="flex items-center gap-2 text-sm text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <GitBranch className="h-4 w-4" />
              Workflow
            </Link>
            <Link
              href="#strategies"
              className="flex items-center gap-2 text-sm text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Target className="h-4 w-4" />
              Strategies
            </Link>
            <Link
              href="#signals"
              className="flex items-center gap-2 text-sm text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Radio className="h-4 w-4" />
              Signals
            </Link>
            <Link
              href="#prediction-markets"
              className="flex items-center gap-2 text-sm text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <TrendingUp className="h-4 w-4" />
              Prediction Markets
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 text-sm text-muted-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="h-4 w-4" />
              Features
            </Link>
            <div className="pt-2">
              <Button size="sm" className="w-full" asChild>
                <Link href="https://takemymoney.timetravel.investments" target="_blank">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Demo
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
