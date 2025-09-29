"use client"

import { Button } from "@/components/ui/button"

export function PageHeader() {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">Inboxes</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your email inboxes and personas</p>
      </div>
      <div>
        <Button className="rounded-full bg-primary text-primary-foreground hover:opacity-90">Order New Inboxes</Button>
      </div>
    </header>
  )
}
