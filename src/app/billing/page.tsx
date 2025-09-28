import { PlanCards } from "@/components/billing/plan-cards"
import { OrderHistoryTable } from "@/components/billing/order-history-table"

export default function BillingPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your subscription and billing information</p>
        </header>

        {/* Current Plan */}
        <section aria-labelledby="plans" className="space-y-4">
          <h2 id="plans" className="sr-only">
            Plans
          </h2>
          <PlanCards />
        </section>

        {/* Order History */}
        <section aria-labelledby="order-history" className="mt-10">
          <div className="mb-3">
            <h2 id="order-history" className="text-lg font-medium">
              Order history
            </h2>
            <p className="text-sm text-muted-foreground">Your past purchases and invoices</p>
          </div>
          <OrderHistoryTable />
        </section>
      </div>
    </main>
  )
}
