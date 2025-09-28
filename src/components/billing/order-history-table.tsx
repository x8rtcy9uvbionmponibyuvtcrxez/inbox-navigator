"use client"

type Row = {
  order: string
  date: string
  items: string
  amount: string
  status: "Completed" | "Processing" | "Pending"
  invoice: string
}

const rows: Row[] = [
  {
    order: "Premium Inbox Package",
    date: "Jan 15, 2024",
    items: "5 inboxes",
    amount: "$299.99",
    status: "Completed",
    invoice: "Download",
  },
  {
    order: "Standard Package",
    date: "Jan 10, 2024",
    items: "3 inboxes",
    amount: "$149.99",
    status: "Processing",
    invoice: "Download",
  },
  {
    order: "Basic Package",
    date: "Jan 5, 2024",
    items: "2 inboxes",
    amount: "$99.99",
    status: "Pending",
    invoice: "Download",
  },
]

function StatusBadge({ status }: { status: Row["status"] }) {
  const color =
    status === "Completed"
      ? "var(--success, theme(colors.emerald.500))"
      : status === "Processing"
        ? "var(--warning, theme(colors.amber.500))"
        : "var(--muted-foreground, theme(colors.neutral.500))"

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs"
      role="status"
      aria-label={status}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      <span className="leading-none">{status}</span>
    </span>
  )
}

export function OrderHistoryTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="text-left">
          <tr className="border-b border-border/80 text-muted-foreground">
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.order} className="border-b border-border/50 last:border-0">
              <td className="px-4 py-3">{r.order}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
              <td className="px-4 py-3">{r.items}</td>
              <td className="px-4 py-3">{r.amount}</td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-md border border-border bg-background/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    {r.invoice}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
