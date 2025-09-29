"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = useState("")

  function commit(v: string) {
    const cleaned = v.trim().replace(/,$/, "")
    if (!cleaned) return
    if (!value.includes(cleaned)) onChange([...value, cleaned])
    setDraft("")
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      commit(draft)
    }
    if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="rounded-lg border p-2">
      <div className="flex flex-wrap items-center gap-2">
        {value.map((t, i) => (
          <span key={i} className="tag">
            {t}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 h-5 px-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              aria-label={`Remove ${t}`}
            >
              ×
            </Button>
          </span>
        ))}
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => commit(draft)}
          placeholder={placeholder}
          className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  )
}
