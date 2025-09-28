"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Mail, Globe, CreditCard, Settings } from "lucide-react"

type Item = {
  href: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const items: Item[] = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/inboxes", label: "Inboxes", icon: Mail },
  { href: "/domains", label: "Domains", icon: Globe },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 border-r border-border bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)] glass sticky top-14 h-[calc(100dvh-56px)]">
      <nav className="w-full p-4">
        <div className="px-2 py-3 mb-2 text-sm/6 text-muted-foreground">Navigation</div>
        <ul className="grid gap-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--sidebar-ring)]",
                    active
                      ? "bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)]"
                      : "text-muted-foreground hover:bg-[color:var(--sidebar-accent)] hover:text-[color:var(--sidebar-accent-foreground)]",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className={cn("h-4 w-4", active ? "" : "opacity-80 group-hover:opacity-100")} />
                  <span className="text-pretty">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
