import { DomainsPageHeader } from "@/components/domains/page-header"
import { DomainsFilterBar } from "@/components/domains/filter-bar"
import { DomainsTable } from "@/components/domains/domains-table"

export default function DomainsPage() {
  return (
    <main className="min-h-[100dvh] bg-[color:var(--background)] text-foreground">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:py-10">
        <div className="space-y-6">
          <DomainsPageHeader />
          <DomainsFilterBar />
          <DomainsTable />
        </div>
      </div>
    </main>
  )
}
