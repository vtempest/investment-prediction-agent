import Link from "next/link"
import { FileText, Shield, Mail, ExternalLink, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2 group cursor-default">
                        {/* <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                            <div className="w-4 h-4 rounded-full bg-primary/50 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="text-lg font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                            {APP_NAME}Run Your Own AI Hedge Fund Team

                        </span> */}
                    </div>

                    <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                        {/* <Link
                            href="/legal/terms"
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/50 hover:text-primary transition-all duration-300 hover:scale-105"
                        >
                            <FileText className="w-4 h-4" />
                            Terms of Service
                        </Link> */}
                        <Link
                            href="/legal/privacy"
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/50 hover:text-primary transition-all duration-300 hover:scale-105"
                        >
                            <Shield className="w-4 h-4" />
                            Terms & Privacy
                        </Link>

                        <Link
                            href="https://rights.institute/ethics/"
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/50 hover:text-primary transition-all duration-300 hover:scale-105"
                        >
                            <Bot className="w-4 h-4" />
                            AI Ethics
                        </Link>

                        <Link
                            href="mailto:contact@autoinvestment.broker"
                            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/50 hover:text-primary transition-all duration-300 hover:scale-105"
                        >
                            <Mail className="w-4 h-4" />
                            Contact
                        </Link>
                    </nav>

                    <div className="flex flex-col items-center md:items-end gap-2 text-sm text-muted-foreground/60">
                        <div className="flex items-center gap-1 hover:text-muted-foreground transition-colors duration-300">
                            &copy; {new Date().getFullYear()} {APP_NAME}
                        </div>
                        <span className="text-xs">San Francisco, CA. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
