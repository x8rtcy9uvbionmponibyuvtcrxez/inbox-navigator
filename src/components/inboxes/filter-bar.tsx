"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FilterBar() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
        <label className="sr-only" htmlFor="inbox-search">
          Search inboxes
        </label>
        <Input
          id="inbox-search"
          placeholder="Search inboxes..."
          className="pl-9 bg-background border-border focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select defaultValue="all">
          <SelectTrigger className="w-40 bg-background border-border focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-40 bg-background border-border focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="All Domains" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Domains</SelectItem>
            <SelectItem value="example.com">example.com</SelectItem>
            <SelectItem value="demo-corp.com">demo-corp.com</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-40 bg-background border-border focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="All ESPs" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All ESPs</SelectItem>
            <SelectItem value="gmail">Gmail</SelectItem>
            <SelectItem value="outlook">Outlook</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
