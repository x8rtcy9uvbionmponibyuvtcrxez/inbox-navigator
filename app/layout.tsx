import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { TopNav } from "@/components/top-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { AuthProvider } from "@/contexts/AuthContext"
import { OnboardingProvider } from "@/contexts/OnboardingContext"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log("[v0] RootLayout rendered: providing TopNav + SidebarNav globally")

  return (
    <html lang="en" className="dark antialiased">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <OnboardingProvider>
            <div className="min-h-dvh bg-background text-foreground">
              <TopNav />
              <div className="mx-auto max-w-[1400px] px-4 md:px-6">
                <div className="flex gap-6 py-6">
                  <SidebarNav />
                  <main className="flex-1 min-w-0">
                    <Suspense fallback={null}>{children}</Suspense>
                  </main>
                </div>
              </div>
            </div>
          </OnboardingProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
