import type React from "react"
import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const openSans = Open_Sans({ 
  subsets: ["latin"],
  variable: "--font-open-sans"
})

export const metadata: Metadata = {
  title: "TimeTravel.investments - Multi-Agent AI Stock Analysis",
  description:
    "AI-powered multi-agent stock analysis system with next-day price predictions and comprehensive trading insights",
  icons: {
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
