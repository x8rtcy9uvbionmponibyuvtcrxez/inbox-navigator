import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const items = [
  { id: 1, label: "you@company.com created Inbox “Support”", time: "2m ago" },
  { id: 2, label: "Invited mia@client.io to workspace", time: "18m ago" },
  { id: 3, label: "Connected domain example.com", time: "1h ago" },
  { id: 4, label: "New rule: Auto-tag billing emails", time: "4h ago" },
]

export function ActivityList() {
  return (
    <Card className="glass hover-lift">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-muted-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="grid gap-3">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
              <span className="text-sm">{i.label}</span>
              <span className="text-xs text-muted-foreground">{i.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
