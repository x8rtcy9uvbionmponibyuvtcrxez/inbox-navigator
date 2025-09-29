"use client"

import { useState } from "react"

export function PlanCards() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Free Plan */}
      <article
        className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-card/90"
        aria-labelledby="free-plan"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id="free-plan" className="text-base font-semibold">
              Free Plan
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Good for evaluation and demos</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">$0</div>
            <div className="text-xs text-muted-foreground">/month</div>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--muted-foreground,theme(colors.neutral.500))]" />
            <span>Demo data only</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--muted-foreground,theme(colors.neutral.500))]" />
            <span>Basic dashboard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--muted-foreground,theme(colors.neutral.500))]" />
            <span>Community support</span>
          </li>
        </ul>

        <div className="mt-5">
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-muted-foreground"
            aria-disabled="true"
            title="Current plan"
          >
            Current plan
          </button>
        </div>
      </article>

      {/* Pro Plan */}
      <article
        className="rounded-xl border border-border bg-card p-5 shadow-sm ring-1 ring-inset ring-primary/10 transition-all hover:shadow-md"
        aria-labelledby="pro-plan"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id="pro-plan" className="text-base font-semibold">
              Pro Plan
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Scale with real inboxes and domains</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">$29</div>
            <div className="text-xs text-muted-foreground">/month</div>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--success,theme(colors.emerald.500))]" />
            <span>Unlimited real inboxes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--success,theme(colors.emerald.500))]" />
            <span>Domain management</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--success,theme(colors.emerald.500))]" />
            <span>Priority support</span>
          </li>
        </ul>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              setLoading(true)
              // placeholder action
              setTimeout(() => setLoading(false), 1200)
            }}
            className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-busy={loading ? "true" : "false"}
          >
            {loading ? "Upgrading..." : "Upgrade to Pro"}
          </button>
        </div>
      </article>
    </div>
  )
}
