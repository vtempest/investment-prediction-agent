"use client"

import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const GlobeDemo = dynamic(() => import("@/components/globe-demo"), {
  ssr: false,
})

export function CTASection() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Transform Your Trading?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Join traders who trust AI Broker for daily insights and next-day predictions.
          </p>
        </div> */}

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Links and Globe Column */}
          <div className="flex flex-col gap-4">
            {/* Globe */}
            <div className="w-full h-[400px] mb-4">
              <GlobeDemo />
            </div>

            <Button size="lg" asChild className="w-full">
              <Link href="https://takemymoney.autoinvestment.broker" target="_blank">
                <Calendar className="mr-2 h-5 w-5" />
                Book a Demo
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild className="w-full">
              <Link href="https://drive.google.com/file/d/1haVl0uguVYnLh8D3EUdaIyi3Tl4kSOIP/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-5 w-5" />
                Read White Paper
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild className="w-full">
              <Link href="/api/docs" target="_blank" rel="noopener noreferrer">
                API Docs
              </Link>
            </Button>



            <Button variant="outline" size="lg" asChild className="w-full">
              <Link href="/pitchdeck.html" target="_blank" rel="noopener noreferrer">
                Outline Slides
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild className="w-full">
              <Link href="/login" target="_blank" rel="noopener noreferrer">
                Login
              </Link>
            </Button>
          </div>

          {/* Video Column */}
          <div className="flex justify-center lg:justify-end items-start">
            <video
              className="w-3/4 rounded-lg shadow-xl border border-border/50"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="https://i.imgur.com/NMa0RUS.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
