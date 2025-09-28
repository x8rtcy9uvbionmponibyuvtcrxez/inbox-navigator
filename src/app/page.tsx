import { MetricCard } from "@/components/metric-card"
import { ChartCard } from "@/components/chart-card"
import { ActivityList } from "@/components/activity-list"
import { Button } from "@/components/ui/button"
import { Mail, Globe, ShoppingCart, Users, Plus, LinkIcon, UserPlus } from "lucide-react"

export default function DashboardPage() {
  console.log("[v0] DashboardPage rendering content-only")
  return (
    <>
      {/* Header */}
      <section className="mb-6 md:mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Inbox Navigator</h1>
            <p className="text-pretty text-sm text-muted-foreground">Fast, focused, and ready to ship.</p>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button className="h-9 bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> New Inbox
            </Button>
            <Button variant="outline" className="h-9 bg-transparent">
              <LinkIcon className="mr-2 h-4 w-4" /> Connect Domain
            </Button>
            <Button variant="outline" className="h-9 bg-transparent">
              <UserPlus className="mr-2 h-4 w-4" /> Invite Member
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Inboxes"
          value={15}
          icon={<Mail className="h-5 w-5" />}
          demo
          trend={[10, 12, 13, 14, 15, 15, 15, 15]}
        />
        <MetricCard
          title="Active Domains"
          value={3}
          icon={<Globe className="h-5 w-5" />}
          demo
          trend={[1, 1, 2, 2, 3, 3, 3, 3]}
        />
        <MetricCard
          title="Total Orders"
          value={3}
          icon={<ShoppingCart className="h-5 w-5" />}
          demo
          trend={[0, 1, 1, 2, 2, 3, 3, 3]}
        />
        <MetricCard
          title="Active Clients"
          value={2}
          icon={<Users className="h-5 w-5" />}
          demo
          trend={[1, 1, 1, 2, 2, 2, 2, 2]}
        />
      </section>

      {/* Grid: chart + activity */}
      <section className="mt-6 md:mt-8 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard />
        </div>
        <ActivityList />
      </section>
    </>
  )
}
