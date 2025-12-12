import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="border-t border-border px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to Transform Your Trading?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Join traders who trust TimeTravel.investments for daily insights and next-day predictions.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" asChild>
            <Link href="https://takemymoney.timetravel.investments" target="_blank">
              <Calendar className="mr-2 h-5 w-5" />
              Book a Demo
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://drive.google.com/file/d/1haVl0uguVYnLh8D3EUdaIyi3Tl4kSOIP/view?usp=drive_link" target="_blank">
              <FileText className="mr-2 h-5 w-5" />
              Read Whitepaper
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
