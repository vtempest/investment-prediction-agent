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
  LogIn,
  Target,
  Radio,
  TrendingUp,
  Sparkles,
  Calendar,
} from "lucide-react"
import { useState } from "react"
import { APP_NAME } from "@/lib/customize-site"
import { ThemeDropdown } from "@/components/theme-dropdown"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinkClasses = "flex items-center gap-1.5 text-sm uppercase tracking-wide text-muted-foreground transition-all hover:font-medium hover:text-foreground hover:bg-accent hover:text-accent-foreground hover:rounded-md px-2 py-1 -mx-2 -my-1"
  const mobileNavLinkClasses = "flex items-center gap-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:rounded-md px-2 py-1 -mx-2 -my-1"

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
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
          <span className="text-xl font-semibold text-foreground">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#agents"
            className={navLinkClasses}
          >
            <Users className="h-4 w-4" />
            Research Agents
          </Link>
          <Link
            href="#copy-trading"
            className={navLinkClasses}
          >
            <Sparkles className="h-4 w-4" />
            Copy Trading
          </Link>
          <Link
            href="#prediction-markets"
            className={navLinkClasses}
          >
            <TrendingUp className="h-4 w-4" />
            Prediction Markets
          </Link>

          <Link
            href="#strategies"
            className={navLinkClasses}
          >
            <Target className="h-4 w-4" />
            Algo Strategies
          </Link>

          <Link
            href="/api/docs"
            className={navLinkClasses}
          >
            <Sparkles className="h-4 w-4" />
            API
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeDropdown />

          <Link href="/login" rel="noopener noreferrer">
            <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-green-600 dark:bg-green-700 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl space-x-2">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </span>
            </button>
          </Link>

          <Button variant="outline" size="sm" asChild>
            <Link href="https://takemymoney.autoinvestment.broker" target="_blank">
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
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium">Theme</span>
              <ThemeDropdown />
            </div>

            <Link
              href="#agents"
              className={navLinkClasses}
            >
              <Users className="h-4 w-4" />
              Research Agents
            </Link>
            {/* <Link
            href="#workflow"
            className={navLinkClasses}
          >
            <GitBranch className="h-4 w-4" />
            Workflow
          </Link> */}

            {/* <Link
            href="#signals"
            className={navLinkClasses}
          >
            <Radio className="h-4 w-4" />
            Signals
          </Link> */}
            <Link
              href="#prediction-markets"
              className={navLinkClasses}
            >
              <TrendingUp className="h-4 w-4" />
              Prediction Markets
            </Link>
            <Link
              href="#copy-trading"
              className={navLinkClasses}
            >
              <Sparkles className="h-4 w-4" />
              Copy Trading
            </Link>
            <Link
              href="#strategies"
              className={navLinkClasses}
            >
              <Target className="h-4 w-4" />
              Algo Strategies
            </Link>


            <div className="pt-2">
              <Button size="sm" className="w-full" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
