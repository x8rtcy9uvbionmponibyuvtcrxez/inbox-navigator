"use client"

import { MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type InboxRow = {
  email: string
  persona: string
  domain: string
  esp: string
  status: "Active" | "Paused"
  activity: string
}

const data: InboxRow[] = [
  {
    email: "support@example.com",
    persona: "Customer Support",
    domain: "example.com",
    esp: "Gmail",
    status: "Active",
    activity: "1,247 emails",
  },
  {
    email: "sales@demo-corp.com",
    persona: "Sales Team",
    domain: "demo-corp.com",
    esp: "Outlook",
    status: "Active",
    activity: "89",
  },
]

export function InboxesTable() {
  return (
    <section aria-label="Inbox list" className="rounded-xl border border-border bg-card/90">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Persona</TableHead>
              <TableHead className="text-muted-foreground">Domain</TableHead>
              <TableHead className="text-muted-foreground">ESP</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Activity</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.email} className="border-border hover:bg-muted/30">
                <TableCell className="font-medium">{row.email}</TableCell>
                <TableCell>{row.persona}</TableCell>
                <TableCell className="text-muted-foreground">{row.domain}</TableCell>
                <TableCell className="text-muted-foreground">{row.esp}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-primary/70" aria-hidden />
                    <span>{row.status}</span>
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.activity}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open row actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem>Open</DropdownMenuItem>
                      <DropdownMenuItem>Pause</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:text-red-400">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
