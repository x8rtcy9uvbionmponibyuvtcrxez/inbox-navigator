import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ReactNode } from "react"
import { Area, AreaChart } from "recharts"

export function MetricCard({
  title,
  value,
  icon,
  demo = false,
  trend,
}: {
  title: string
  value: ReactNode
  icon: ReactNode
  demo?: boolean
  trend?: number[]
}) {
  const data = trend?.map((v, i) => ({ i, v })) ?? [12, 14, 13, 16, 18, 22, 21, 24].map((v, i) => ({ i, v }))

  return (
    <Card className="bg-card glass hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground/80">{icon}</div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div className="text-2xl font-semibold">{value}</div>
        {demo ? (
          <span
            className="inline-flex items-center rounded px-2 py-1 text-xs font-medium"
            style={{
              backgroundColor: "var(--color-warning)",
              color: "var(--color-warning-foreground)",
            }}
          >
            DEMO DATA
          </span>
        ) : null}
      </CardContent>
      <div className="px-4 pb-3">
        <ChartContainer config={{ v: { label: "Trend", color: "var(--color-chart-1)" } }} className="h-12">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="metricFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="var(--color-chart-1)"
              fill="url(#metricFill)"
              strokeWidth={2}
              isAnimationActive
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  )
}
