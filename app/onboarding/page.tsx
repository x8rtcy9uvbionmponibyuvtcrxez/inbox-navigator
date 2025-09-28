"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { OnboardingProgress } from "@/components/onboarding/progress"
import { TagInput } from "@/components/onboarding/tag-input"
import { PersonaForm, type Persona } from "@/components/onboarding/persona-form"
import { useAuth } from "@/contexts/AuthContext"
import { useOnboarding } from "@/contexts/OnboardingContext"

type DomainChoice = "buy" | "byod" | "managed"

type BusinessProfile = {
  businessType: "SaaS" | "Agency" | "Lead Gen" | "E-commerce" | "Other" | ""
  teamSize: "1-10" | "11-25" | "26-100" | "100+" | ""
  industry: string
  businessName: string
  tags: string[]
}

type DomainSetup = {
  choice: DomainChoice
  // Buy
  purchaseQty: number
  // BYOD
  byodDomains: string // newline separated
  host: "Namecheap" | "GoDaddy" | "Cloudflare" | "Google Domains" | "Other" | ""
  hostUser: string
  hostPassword: string
  // Managed
  notes: string
  // Common
  forwardingUrl: string
}

type ESPIntegration = {
  platform: "Smartlead" | "Instantly" | "Other" | ""
  loginEmail: string
  password: string
  workspace: string
  apiKey: string
  notes: string
}

type ReviewMeta = {
  customRequests: string
  brandFiles?: File | null
}

type WizardData = {
  profile: BusinessProfile
  domain: DomainSetup
  personasPerDomain: number
  personaFormat: string
  personas: Persona[]
  esp: ESPIntegration
  review: ReviewMeta
}

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { order, loading: orderLoading, error: orderError, submitOnboarding } = useOnboarding()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [data, setData] = useState<WizardData>({
    profile: {
      businessType: "",
      teamSize: "",
      industry: "",
      businessName: "",
      tags: [],
    },
    domain: {
      choice: "buy",
      purchaseQty: 1,
      byodDomains: "",
      host: "",
      hostUser: "",
      hostPassword: "",
      notes: "",
      forwardingUrl: "",
    },
    personasPerDomain: 1,
    personaFormat: "first.last",
    personas: [{ firstName: "", lastName: "", role: "", tags: [] }],
    esp: {
      platform: "",
      loginEmail: "",
      password: "",
      workspace: "",
      apiKey: "",
      notes: "",
    },
    review: {
      customRequests: "",
      brandFiles: null,
    },
  })

  const canContinue = useMemo(() => {
    if (step === 1) {
      const p = data.profile
      return !!(p.businessType && p.teamSize && p.industry && p.businessName)
    }
    if (step === 2) {
      const d = data.domain
      if (d.choice === "buy") {
        return d.purchaseQty >= 1 && d.forwardingUrl.length > 0
      }
      if (d.choice === "byod") {
        return !!(d.byodDomains.trim() && d.host && d.hostUser && d.hostPassword && d.forwardingUrl)
      }
      if (d.choice === "managed") {
        return d.forwardingUrl.length > 0 // notes optional
      }
    }
    if (step === 3) {
      return (
        data.personasPerDomain >= 1 &&
        data.personas.length >= 1 &&
        data.personas.every((p) => p.firstName && p.lastName)
      )
    }
    if (step === 4) {
      const e = data.esp
      return !!(e.platform && e.loginEmail && e.workspace) // password/apiKey may be optional in some flows
    }
    return true
  }, [step, data])

  function next() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  }
  function back() {
    setStep((s) => Math.max(1, s - 1))
  }

  function updateProfile<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, [key]: value } }))
  }
  function updateDomain<K extends keyof DomainSetup>(key: K, value: DomainSetup[K]) {
    setData((prev) => ({ ...prev, domain: { ...prev.domain, [key]: value } }))
  }
  function updateESP<K extends keyof ESPIntegration>(key: K, value: ESPIntegration[K]) {
    setData((prev) => ({ ...prev, esp: { ...prev.esp, [key]: value } }))
  }
  function updatePersona(idx: number, patch: Partial<Persona>) {
    setData((prev) => {
      const copy = [...prev.personas]
      copy[idx] = { ...copy[idx], ...patch }
      return { ...prev, personas: copy }
    })
  }
  function setPersonasCount(count: number) {
    setData((prev) => {
      const clamped = Math.max(1, Math.min(3, count))
      let personas = [...prev.personas]
      if (clamped > personas.length) {
        while (personas.length < clamped) personas.push({ firstName: "", lastName: "", role: "", tags: [] })
      } else if (clamped < personas.length) {
        personas = personas.slice(0, clamped)
      }
      return { ...prev, personasPerDomain: clamped, personas }
    })
  }

  async function handleComplete() {
    if (!order) {
      setSubmitError("No order found. Please ensure you accessed this page from a valid order.")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Transform data to match the expected format
      const transformedData = {
        businessProfile: data.profile,
        domainSetup: data.domain,
        espIntegration: data.esp,
        personas: data.personas,
        customTags: data.review.customRequests ? [data.review.customRequests] : []
      }

      console.log("[v0] Onboarding complete payload:", transformedData)

      const result = await submitOnboarding(transformedData)
      
      if (result.success) {
        // Redirect to success page
        router.push('/onboarding/success')
      } else {
        setSubmitError(result.error || "Failed to submit onboarding data")
      }
    } catch (error) {
      console.error("Error submitting onboarding:", error)
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking authentication and order
  if (authLoading || orderLoading) {
    return (
      <main className="mx-auto max-w-4xl p-6 md:p-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading onboarding...</p>
          </div>
        </div>
      </main>
    )
  }

  // Show error if no order found
  if (orderError || !order) {
    return (
      <main className="mx-auto max-w-4xl p-6 md:p-10">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Order Not Found</h2>
              <p className="text-red-600 mb-4">
                {orderError || "No order found. Please ensure you accessed this page from a valid order."}
              </p>
              <Button onClick={() => router.push('/')} variant="outline">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl p-6 md:p-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-balance">Post‑Payment Onboarding</h1>
          <p className="text-sm text-muted-foreground">Help us tailor your email workspace.</p>
          {order && (
            <p className="text-xs text-muted-foreground mt-1">
              Order: {order.orderNumber} | Amount: ${order.totalAmount}
            </p>
          )}
        </div>
        <OnboardingProgress step={step} total={TOTAL_STEPS} />
      </div>

      {/* Error Display */}
      {submitError && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-4">
            <p className="text-red-600 text-sm">{submitError}</p>
          </CardContent>
        </Card>
      )}

      <Card className="glass hover-lift">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-muted-foreground">
            Step {step} of {TOTAL_STEPS}
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {step === 1 && (
            <section className="space-y-6">
              <h2 className="text-xl font-medium">Business Profile</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business type</Label>
                  <Select
                    value={data.profile.businessType}
                    onValueChange={(v: any) => updateProfile("businessType", v)}
                  >
                    <SelectTrigger id="businessType" className="w-full">
                      <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                      <SelectItem value="Agency">Agency</SelectItem>
                      <SelectItem value="Lead Gen">Lead Gen</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team size</Label>
                  <Select value={data.profile.teamSize} onValueChange={(v: any) => updateProfile("teamSize", v)}>
                    <SelectTrigger id="teamSize" className="w-full">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10</SelectItem>
                      <SelectItem value="11-25">11-25</SelectItem>
                      <SelectItem value="26-100">26-100</SelectItem>
                      <SelectItem value="100+">100+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g. B2B SaaS, Marketing, Healthcare"
                    value={data.profile.industry}
                    onChange={(e) => updateProfile("industry", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business name</Label>
                  <Input
                    id="businessName"
                    placeholder="Your company name"
                    value={data.profile.businessName}
                    onChange={(e) => updateProfile("businessName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom tags</Label>
                <TagInput
                  value={data.profile.tags}
                  onChange={(tags) => updateProfile("tags", tags)}
                  placeholder="Type and press Enter"
                />
                <p className="text-xs text-muted-foreground">Use tags to help us prioritize features and templates.</p>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <h2 className="text-xl font-medium">Domain Setup</h2>
              <RadioGroup
                value={data.domain.choice}
                onValueChange={(v: DomainChoice) => updateDomain("choice", v)}
                className="grid gap-4 md:grid-cols-3"
              >
                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem id="opt-buy" value="buy" />
                    <div className="space-y-1">
                      <Label htmlFor="opt-buy">Buy Fresh Domains</Label>
                      <p className="text-xs text-muted-foreground">
                        We’ll purchase and configure new domains for warmup and scale.
                      </p>
                    </div>
                  </div>
                  {data.domain.choice === "buy" && (
                    <div className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="qty">Quantity</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => updateDomain("purchaseQty", Math.max(1, data.domain.purchaseQty - 1))}
                            aria-label="Decrease quantity"
                          >
                            −
                          </Button>
                          <Input
                            id="qty"
                            type="number"
                            min={1}
                            value={data.domain.purchaseQty}
                            onChange={(e) => updateDomain("purchaseQty", Math.max(1, Number(e.target.value)))}
                            className="w-24 text-center"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => updateDomain("purchaseQty", Math.max(1, data.domain.purchaseQty + 1))}
                            aria-label="Increase quantity"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button type="button" className="w-full">
                        Purchase
                      </Button>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem id="opt-byod" value="byod" />
                    <div className="space-y-1">
                      <Label htmlFor="opt-byod">Bring Your Own Domains</Label>
                      <p className="text-xs text-muted-foreground">We’ll guide you through DNS and authentication.</p>
                    </div>
                  </div>
                  {data.domain.choice === "byod" && (
                    <div className="mt-4 space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="domains">Domains (one per line)</Label>
                        <Textarea
                          id="domains"
                          rows={4}
                          placeholder={"acme.com\nacme.io"}
                          value={data.domain.byodDomains}
                          onChange={(e) => updateDomain("byodDomains", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="host">Host</Label>
                          <Select value={data.domain.host} onValueChange={(v: any) => updateDomain("host", v)}>
                            <SelectTrigger id="host">
                              <SelectValue placeholder="Choose host" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Namecheap">Namecheap</SelectItem>
                              <SelectItem value="GoDaddy">GoDaddy</SelectItem>
                              <SelectItem value="Cloudflare">Cloudflare</SelectItem>
                              <SelectItem value="Google Domains">Google Domains</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hostUser">Credentials user</Label>
                          <Input
                            id="hostUser"
                            value={data.domain.hostUser}
                            onChange={(e) => updateDomain("hostUser", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hostPassword">Credentials password</Label>
                          <Input
                            id="hostPassword"
                            type="password"
                            value={data.domain.hostPassword}
                            onChange={(e) => updateDomain("hostPassword", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem id="opt-managed" value="managed" />
                    <div className="space-y-1">
                      <Label htmlFor="opt-managed">Let Us Handle It</Label>
                      <p className="text-xs text-muted-foreground">Fully managed domain procurement and setup.</p>
                    </div>
                  </div>
                  {data.domain.choice === "managed" && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="managed-notes">Notes</Label>
                      <Textarea
                        id="managed-notes"
                        rows={3}
                        placeholder="Tell us any preferences or constraints."
                        value={data.domain.notes}
                        onChange={(e) => updateDomain("notes", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor="forwarding">Forwarding URL (common)</Label>
                <Input
                  id="forwarding"
                  placeholder="https://example.com/landing"
                  value={data.domain.forwardingUrl}
                  onChange={(e) => updateDomain("forwardingUrl", e.target.value)}
                />
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6">
              <h2 className="text-xl font-medium">Persona Setup</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="persona-count">Personas per domain</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setPersonasCount(Math.max(1, data.personasPerDomain - 1))}
                      aria-label="Decrease personas"
                    >
                      −
                    </Button>
                    <Input
                      id="persona-count"
                      type="number"
                      min={1}
                      max={3}
                      value={data.personasPerDomain}
                      onChange={(e) => setPersonasCount(Number(e.target.value))}
                      className="w-24 text-center"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setPersonasCount(Math.min(3, data.personasPerDomain + 1))}
                      aria-label="Increase personas"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="persona-format">Persona format</Label>
                  <Input
                    id="persona-format"
                    placeholder="first.last"
                    value={data.personaFormat}
                    onChange={(e) => setData((prev) => ({ ...prev, personaFormat: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use tokens like first, last (e.g. first.last, f.last).
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {data.personas.map((p, idx) => (
                  <div key={idx} className="rounded-lg border p-4">
                    <PersonaForm index={idx} value={p} onChange={(patch) => updatePersona(idx, patch)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-6">
              <h2 className="text-xl font-medium">ESP Integration</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={data.esp.platform} onValueChange={(v: any) => updateESP("platform", v)}>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Choose ESP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Smartlead">Smartlead</SelectItem>
                      <SelectItem value="Instantly">Instantly</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Login email</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    value={data.esp.loginEmail}
                    onChange={(e) => updateESP("loginEmail", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.esp.password}
                    onChange={(e) => updateESP("password", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workspace">Workspace name</Label>
                  <Input
                    id="workspace"
                    value={data.esp.workspace}
                    onChange={(e) => updateESP("workspace", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API key</Label>
                  <Input id="apiKey" value={data.esp.apiKey} onChange={(e) => updateESP("apiKey", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="esp-notes">Notes</Label>
                <Textarea
                  id="esp-notes"
                  rows={3}
                  placeholder="Anything we should know about your ESP setup?"
                  value={data.esp.notes}
                  onChange={(e) => updateESP("notes", e.target.value)}
                />
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="space-y-6">
              <h2 className="text-xl font-medium">Final Review</h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-medium">Business Profile</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Type</dt>
                      <dd>{data.profile.businessType || "—"}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Team size</dt>
                      <dd>{data.profile.teamSize || "—"}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Industry</dt>
                      <dd className="truncate">{data.profile.industry || "—"}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Business</dt>
                      <dd className="truncate">{data.profile.businessName || "—"}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="text-muted-foreground">Tags</dt>
                      <dd className="flex flex-wrap gap-2">
                        {data.profile.tags.length
                          ? data.profile.tags.map((t, i) => (
                              <span key={i} className="tag">
                                {t}
                              </span>
                            ))
                          : "—"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-medium">Domain Setup</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Choice</dt>
                      <dd>{data.domain.choice}</dd>
                    </div>
                    {data.domain.choice === "buy" && (
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">Quantity</dt>
                        <dd>{data.domain.purchaseQty}</dd>
                      </div>
                    )}
                    {data.domain.choice === "byod" && (
                      <>
                        <div>
                          <dt className="text-muted-foreground">Domains</dt>
                          <dd className="mt-1 whitespace-pre-wrap text-xs opacity-80">
                            {data.domain.byodDomains || "—"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-muted-foreground">Host</dt>
                          <dd>{data.domain.host || "—"}</dd>
                        </div>
                      </>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Forwarding</dt>
                      <dd className="truncate">{data.domain.forwardingUrl || "—"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-medium">Personas</h3>
                  <div className="text-sm">
                    <div className="mb-2 text-muted-foreground">
                      {data.personasPerDomain} per domain, format: {data.personaFormat}
                    </div>
                    <ul className="space-y-2">
                      {data.personas.map((p, i) => (
                        <li key={i} className="rounded-md bg-card p-2">
                          <div className="flex items-center justify-between">
                            <span>
                              {p.firstName} {p.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">{p.role || "—"}</span>
                          </div>
                          {p.tags?.length ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {p.tags.map((t, j) => (
                                <span key={j} className="tag">
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-medium">ESP</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Platform</dt>
                      <dd>{data.esp.platform || "—"}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Login</dt>
                      <dd className="truncate">{data.esp.loginEmail || "—"}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Workspace</dt>
                      <dd className="truncate">{data.esp.workspace || "—"}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="custom-requests">Custom requests</Label>
                  <Textarea
                    id="custom-requests"
                    rows={5}
                    placeholder="Any special guidance, assets, or constraints?"
                    value={data.review.customRequests}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, review: { ...prev.review, customRequests: e.target.value } }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-files">Brand assets (optional)</Label>
                  <Input
                    id="brand-files"
                    type="file"
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        review: { ...prev.review, brandFiles: e.target.files?.[0] || null },
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload logos, guidelines, or templates to speed up setup.
                  </p>
                </div>
              </div>
            </section>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={back} disabled={step === 1}>
          Back
        </Button>
        {step < TOTAL_STEPS ? (
          <Button onClick={next} disabled={!canContinue}>
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handleComplete} 
            disabled={isSubmitting || !canContinue}
            className="px-6 py-6 text-base"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        )}
      </div>
    </main>
  )
}
