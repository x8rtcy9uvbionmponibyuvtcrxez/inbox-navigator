"use client"

type PageHeaderProps = {
  onAddDomain?: () => void
}

export function DomainsPageHeader({ onAddDomain }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="text-balance text-2xl md:text-3xl font-semibold text-foreground">Domains</h1>
        <p className="text-sm text-[color:var(--muted-foreground)]">
          Manage your email domains and DNS settings
          <span className="ml-2 tag">DEMO DATA</span>
        </p>
      </div>

      <div className="shrink-0">
        <button
          type="button"
          onClick={onAddDomain}
          className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-4 py-2 text-sm font-medium shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
          aria-label="Add Domain"
        >
          <span aria-hidden="true">+</span>
          Add Domain
        </button>
      </div>
    </header>
  )
}
