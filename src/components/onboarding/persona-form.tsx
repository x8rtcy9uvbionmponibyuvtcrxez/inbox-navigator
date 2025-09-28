"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TagInput } from "@/components/onboarding/tag-input"

export type Persona = {
  firstName: string
  lastName: string
  role: string
  tags: string[]
}

export function PersonaForm({
  index,
  value,
  onChange,
}: {
  index: number
  value: Persona
  onChange: (patch: Partial<Persona>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="mb-1 text-sm text-muted-foreground">Persona #{index + 1}</div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor={`first-${index}`}>First name</Label>
          <Input
            id={`first-${index}`}
            value={value.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`last-${index}`}>Last name</Label>
          <Input id={`last-${index}`} value={value.lastName} onChange={(e) => onChange({ lastName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`role-${index}`}>Role</Label>
          <Input
            id={`role-${index}`}
            placeholder="e.g. Sales, Growth, SDR"
            value={value.role}
            onChange={(e) => onChange({ role: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={value.tags} onChange={(tags) => onChange({ tags })} placeholder="Add persona tags" />
      </div>
    </div>
  )
}
