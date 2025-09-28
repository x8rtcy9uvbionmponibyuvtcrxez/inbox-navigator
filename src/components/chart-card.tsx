"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

const sample = Array.from({ length: 14 }).map((_, i) => ({
  t: `${i + 1}h`,
  requests: Math.round(1200 + Math.sin(i / 2) * 250 + Math.random() * 90),
}))

export function ChartCard() {
  return (
    <Card className="glass hover-lift">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-muted-foreground">Edge Requests</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer
          config={{
            requests: { label: "Requests", color: "var(--color-chart-1)" },
          }}
          className="h-60"
        >
          <AreaChart data={sample}>
            <defs>
              <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.4} />
            <XAxis dataKey="t" tickLine={false} axisLine={false} />
            <Area
              type="monotone"
              dataKey="requests"
              stroke="var(--color-chart-1)"
              fill="url(#areaFill)"
              strokeWidth={2}
              isAnimationActive
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
