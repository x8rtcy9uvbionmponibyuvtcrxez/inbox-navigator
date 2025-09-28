"use client"

import type React from "react"

import { useState } from "react"

type TabKey = "account" | "team" | "notifications" | "api"

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>("account")

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure your account, team, notifications, and API.</p>
        </header>

        {/* Tabs */}
        <div role="tablist" aria-label="Settings" className="mb-6 flex flex-wrap gap-2">
          <TabButton active={tab === "account"} onClick={() => setTab("account")}>
            Account
          </TabButton>
          <TabButton active={tab === "team"} onClick={() => setTab("team")}>
            Team
          </TabButton>
          <TabButton active={tab === "notifications"} onClick={() => setTab("notifications")}>
            Notifications
          </TabButton>
          <TabButton active={tab === "api"} onClick={() => setTab("api")}>
            API
          </TabButton>
        </div>

        {/* Panels */}
        <div className="space-y-6">
          {tab === "account" && <AccountPanel />}
          {tab === "team" && <TeamPanel />}
          {tab === "notifications" && <NotificationsPanel />}
          {tab === "api" && <ApiPanel />}
        </div>
      </div>
    </main>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "rounded-lg border px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        active ? "border-border bg-card" : "border-transparent bg-background hover:border-border",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none ring-0 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-primary/20"
    />
  )
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "inline-flex h-6 w-11 items-center rounded-full border border-border transition-colors",
        checked ? "bg-primary/80" : "bg-background",
      ].join(" ")}
    >
      <span
        className={[
          "ml-0.5 inline-block h-5 w-5 transform rounded-full bg-card shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
      <span className="sr-only">{label}</span>
    </button>
  )
}

/* Panels */

function AccountPanel() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold">Account</h2>
      <p className="mt-1 text-sm text-muted-foreground">Profile information</p>

      <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Name">
          <Input name="name" placeholder="Jane Doe" />
        </Field>
        <Field label="Email">
          <Input name="email" placeholder="jane@company.com" type="email" />
        </Field>
        <Field label="Company">
          <Input name="company" placeholder="Acme Inc." />
        </Field>
        <div className="md:col-span-2">
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Save changes
          </button>
        </div>
      </form>
    </section>
  )
}

function TeamPanel() {
  const members = [
    { name: "Jane Doe", email: "jane@company.com" },
    { name: "John Smith", email: "john@company.com" },
  ]
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Team</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your workspace members</p>
        </div>
        <button
          type="button"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-background/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Invite
        </button>
      </div>

      <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
        {members.map((m) => (
          <li key={m.email} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.email}</p>
            </div>
            <button
              type="button"
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs transition-colors hover:bg-background/80"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function NotificationsPanel() {
  const options = [
    { key: "billing", label: "Billing emails" },
    { key: "alerts", label: "System alerts" },
    { key: "product", label: "Product updates" },
  ]
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold">Notifications</h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose which alerts you want to receive</p>

      <div className="mt-4 space-y-4">
        {options.map((o) => (
          <div
            key={o.key}
            className="flex items-center justify-between rounded-md border border-border bg-background/40 p-3"
          >
            <div>
              <p className="text-sm font-medium">{o.label}</p>
              <p className="text-xs text-muted-foreground">Enable or disable {o.label.toLowerCase()}.</p>
            </div>
            <Switch checked={true} onChange={() => {}} label={o.label} />
          </div>
        ))}
      </div>
    </section>
  )
}

function ApiPanel() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold">API</h2>
      <p className="mt-1 text-sm text-muted-foreground">Manage your API access</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Public Key">
          <Input value="pk_live_example_123" readOnly />
        </Field>
        <Field label="Secret Key">
          <Input value="sk_live_example_456" readOnly type="password" />
        </Field>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-background/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Rotate keys
        </button>
      </div>
    </section>
  )
}
