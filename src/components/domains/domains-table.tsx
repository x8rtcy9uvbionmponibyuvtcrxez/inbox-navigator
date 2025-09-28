type Status = "Active" | "Pending" | "Suspended"

type DomainRow = {
  domain: string
  status: Status
  spf: boolean
  dkim: boolean
  dmarc: boolean
  client: string
  redirect?: string
  addedAt: string
}

function StatusBadge({ status }: { status: Status }) {
  const color = status === "Active" ? "var(--success)" : status === "Pending" ? "var(--warning)" : "var(--danger)"

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-2.5 py-1 text-xs text-foreground">
      <span className="status-dot" style={{ backgroundColor: color }} aria-hidden="true" />
      <span className="sr-only">Status:</span>
      {status}
    </span>
  )
}

function DnsIndicator({ ok }: { ok: boolean }) {
  return (
    <span
      className="inline-flex min-w-10 items-center justify-center rounded-md border border-[color:var(--border)] px-2 py-0.5 text-xs"
      style={{ color: ok ? "var(--success)" : "var(--danger)" }}
      aria-label={ok ? "Configured" : "Not configured"}
      title={ok ? "Configured" : "Not configured"}
    >
      {ok ? "✓" : "✗"}
    </span>
  )
}

const rows: DomainRow[] = [
  {
    domain: "example.com",
    status: "Active",
    spf: true,
    dkim: true,
    dmarc: true,
    client: "Main company",
    redirect: "https://landing.example.com",
    addedAt: "Sep 15, 2024",
  },
  {
    domain: "demo-corp.com",
    status: "Active",
    spf: true,
    dkim: true,
    dmarc: false,
    client: "Demo Corp",
    addedAt: "Sep 12, 2024",
  },
  {
    domain: "test-company.org",
    status: "Pending",
    spf: false,
    dkim: false,
    dmarc: false,
    client: "Test Org",
    redirect: "https://testsite.com",
    addedAt: "Sep 10, 2024",
  },
  {
    domain: "startup-io.com",
    status: "Active",
    spf: true,
    dkim: true,
    dmarc: true,
    client: "Startup Inc",
    addedAt: "Sep 8, 2024",
  },
  {
    domain: "enterprise.net",
    status: "Suspended",
    spf: true,
    dkim: false,
    dmarc: false,
    client: "Enterprise",
    addedAt: "Sep 5, 2024",
  },
]

export function DomainsTable() {
  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[color:var(--background)]/40">
            <tr className="border-b border-[color:var(--border)]">
              <th scope="col" className="px-4 py-3 text-left font-medium text-[color:var(--muted-foreground)]">
                Domain
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-[color:var(--muted-foreground)]">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-[color:var(--muted-foreground)]">
                DNS Records
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-[color:var(--muted-foreground)]">
                Client
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-[color:var(--muted-foreground)]">
                Redirect URL
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-[color:var(--muted-foreground)]">
                Date Added
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium text-[color:var(--muted-foreground)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.domain}
                className="border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--muted)]/40 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">{r.domain}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[color:var(--muted-foreground)]">SPF</span>
                    <DnsIndicator ok={r.spf} />
                    <span className="text-[color:var(--muted-foreground)] ml-3">DKIM</span>
                    <DnsIndicator ok={r.dkim} />
                    <span className="text-[color:var(--muted-foreground)] ml-3">DMARC</span>
                    <DnsIndicator ok={r.dmarc} />
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{r.client}</td>
                <td className="px-4 py-3">
                  {r.redirect ? (
                    <a href={r.redirect} className="text-[color:var(--primary)] underline-offset-4 hover:underline">
                      {r.redirect}
                    </a>
                  ) : (
                    <span className="text-[color:var(--muted-foreground)]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground">{r.addedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <button
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-[color:var(--border)] hover:bg-[color:var(--muted)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                      aria-label={`Open actions for ${r.domain}`}
                      title="Actions"
                    >
                      {"⋯"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
