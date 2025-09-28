import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ConditionalLayout } from "@/components/conditional-layout"

export const metadata: Metadata = {
  title: "Inbox Navigator",
  description: "Professional email management platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark antialiased">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ConditionalLayout>
          <Suspense fallback={null}>{children}</Suspense>
        </ConditionalLayout>
        <Analytics />
      </body>
    </html>
  )
}
