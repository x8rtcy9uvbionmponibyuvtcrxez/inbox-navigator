"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border glass bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo + Workspace */}
          <div className="flex items-center gap-3">
            <div
              aria-label="Inbox Navigator Logo"
              className="size-6 rounded-md"
              style={{
                background: "linear-gradient(135deg, var(--color-chart-4), var(--color-chart-1))",
              }}
            />
            <div className="text-sm">
              <div className="font-medium">Inbox Navigator</div>
              <div className="text-xs text-muted-foreground">My Workspace</div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="mx-auto hidden md:block w-full max-w-sm">
            <div className="relative">
              <Input placeholder="Search…" className="pl-8 h-9 bg-background/60" aria-label="Search" />
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={cn("gap-2")}>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]">IN</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">you@company.com</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
