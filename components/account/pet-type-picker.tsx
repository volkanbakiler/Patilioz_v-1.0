"use client"

import { Plus } from "lucide-react"
import type { PetType } from "@/lib/auth-mock"

const OPTIONS: { value: PetType; label: string; emoji: string; hint: string }[] = [
  { value: "dog", label: "Köpek", emoji: "🐕", hint: "Standart, gidiş-dönüş, refakat" },
  { value: "cat", label: "Kedi", emoji: "🐈", hint: "Taşıma çantasıyla güvenli" },
  { value: "other", label: "Diğer", emoji: "🐾", hint: "Kuş, tavşan, kemirgen…" },
]

/**
 * Yeni dost eklerken türü görsel olarak seçtirir.
 * Büyük dokunma hedefleri + net "yeni pet ekle" niyeti.
 */
export function PetTypePicker({
  onPick,
}: {
  onPick: (type: PetType) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onPick(o.value)}
          aria-label={`${o.label} ekle`}
          className="group flex flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed border-foreground/15 bg-white px-2 py-5 text-center transition-all hover:border-[var(--coral)]/50 hover:bg-[var(--coral)]/[0.04] active:scale-[0.98]"
        >
          <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--coral)]/10 text-3xl transition-transform group-hover:scale-105">
            {o.emoji}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--coral)] text-white ring-2 ring-white">
              <Plus size={14} strokeWidth={3} />
            </span>
          </span>
          <span className="text-sm font-bold text-foreground">{o.label}</span>
          <span className="hidden text-[11px] leading-tight text-muted-foreground sm:block">
            {o.hint}
          </span>
        </button>
      ))}
    </div>
  )
}
