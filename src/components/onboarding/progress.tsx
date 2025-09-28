"use client"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export function OnboardingProgress({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="w-48">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span>
          {step} / {total}
        </span>
      </div>
      <div aria-hidden className="h-2 rounded-full border bg-muted/40">
        <div className={cn("h-full rounded-full bg-primary transition-[width]")} style={{ width: `${pct}%` }} />
      </div>
      <Separator className="mt-3 opacity-40" />
    </div>
  )
}
