"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, Settings, User, Shield } from "lucide-react"
import Link from "next/link"

export function TopNav() {
  const { user, loading, signOut, isAdmin } = useAuth()

  if (loading) {
    return (
      <header className="sticky top-0 z-20 border-b border-border glass bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="flex h-14 items-center justify-between">
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border glass bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Left: Logo + Workspace */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div
                aria-label="Inbox Navigator Logo"
                className="size-6 rounded-md"
                style={{
                  background: "linear-gradient(135deg, var(--color-chart-4), var(--color-chart-1))",
                }}
              />
              <div className="text-sm">
                <div className="font-medium">Inbox Navigator</div>
                <div className="text-xs text-muted-foreground">
                  {user ? 'My Workspace' : 'Sign in to continue'}
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Search */}
          {user && (
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
          )}

          {/* Right: User Menu or Sign In */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className={cn("gap-2")}>
                    <Avatar className="size-6">
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name || user.email}</span>
                    {isAdmin && <Shield className="w-3 h-3 text-blue-500" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {isAdmin && (
                      <p className="text-xs text-blue-600 font-medium">Admin</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
