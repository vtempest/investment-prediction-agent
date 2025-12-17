"use client"

import { Button } from "@/components/ui/button"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import {
  Users,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Clock,
  Bot,
  Newspaper,
  TrendingDown,
  Calendar,
  LogIn,
} from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden sm:px-6 py-10 lg:px-8 min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="https://i.imgur.com/YUYD3zJ.jpeg" alt="AI Trading Command Center" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/30 to-background/90" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-12 max-w-4xl mx-auto">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Chatbot Simplexity for Algorithmic Trading</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
            <span className="block text-primary"> Auto-Invest Like a Boss</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="text-2xl font-bold mb-4">Run Your Own AI Hedge Fund Team</h3>
            <p className="max-w-2xl rounded-lg border border-border bg-background/50 p-4 text-lg leading-relaxed text-foreground backdrop-blur-sm">
              Deploy specialized AI agents with algorithmic trading strategies across stocks and prediction markets. Track
              sharp traders on Polymarket & Kalshi, analyze outcomes with LLM-powered research, and execute momentum,
              breakout, and scalping strategies with institutional-grade risk management.
            </p>

            <div className="mt-10 flex flex-col items-center lg:items-start gap-4 sm:flex-row">
              <Link href="/login" rel="noopener noreferrer">
                <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-green-600 dark:bg-green-700 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl space-x-2">
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </span>
                </button>
              </Link>

              <Button variant="outline" size="lg" asChild>
                <Link href="/survey">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Demo
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link href="/api/docs" target="_blank" rel="noopener noreferrer">
                  API Docs
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full relative rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-background/50 backdrop-blur-sm">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto object-cover"
              poster="/images/hero-poster.png"
            >
              <source src="/public/images/autoinvest-ad.webm" type="video/webm" />
              <source src="/images/autoinvest-ad.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "Multi-Agent Teams", desc: "4 specialized analysts" },
            { icon: BarChart3, label: "Algo Strategies", desc: "Momentum & breakout" },
            { icon: TrendingUp, label: "Prediction Markets", desc: "Polymarket & Kalshi" },
            { icon: MessageSquare, label: "Copy Trading", desc: "Follow top performers" },
            { icon: Clock, label: "Time Travel Backtesting", desc: "Test strategies in the past" },
            { icon: Bot, label: "Chatbot Algo Builder", desc: "Modify rules with AI chat" },
            { icon: Newspaper, label: "News Opinion Scanner", desc: "AI judges sentiment shifts" },
            { icon: TrendingDown, label: "Senate & Investor Tracking", desc: "Follow insider moves" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm hover:bg-card/70 transition-colors"
            >
              <item.icon className="h-8 w-8 text-primary" />
              <span className="font-semibold text-foreground text-center text-sm">{item.label}</span>
              <span className="text-xs text-muted-foreground text-center">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section >
  )
}
