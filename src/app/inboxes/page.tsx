import { PageHeader } from "@/components/inboxes/page-header"
import { FilterBar } from "@/components/inboxes/filter-bar"
import { InboxesTable } from "@/components/inboxes/inboxes-table"

export default function InboxesPage() {
  console.log("[v0] InboxesPage rendering content-only")
  return (
    <>
      <PageHeader />
      <div className="h-6" />
      <FilterBar />
      <div className="h-6" />
      <InboxesTable />
    </>
  )
}
