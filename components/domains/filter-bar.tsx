export function DomainsFilterBar() {
  return (
    <section
      aria-label="Filters"
      className="rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-3 md:px-4 md:py-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]"
          >
            {/* Simple search icon */}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search domains..."
            className="w-full rounded-md border border-[color:var(--border)] bg-[color:var(--background)] pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-[color:var(--muted-foreground)] outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            aria-label="Search domains"
          />
        </div>

        {/* Selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <select
            aria-label="Filter by status"
            className="rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            defaultValue="all-status"
          >
            <option value="all-status">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            aria-label="Filter by client"
            className="rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            defaultValue="all-clients"
          >
            <option value="all-clients">All Clients</option>
            <option value="main">Main company</option>
            <option value="demo">Demo Corp</option>
            <option value="test">Test Org</option>
            <option value="startup">Startup Inc</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <select
            aria-label="Filter by DNS status"
            className="rounded-md border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            defaultValue="all-dns"
          >
            <option value="all-dns">DNS Status</option>
            <option value="all-ok">All OK</option>
            <option value="missing">Missing Records</option>
            <option value="partial">Partial</option>
          </select>
        </div>
      </div>
    </section>
  )
}
