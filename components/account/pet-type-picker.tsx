"use client"

import type { PetType } from "@/lib/auth-mock"

const OPTIONS: { type: PetType; emoji: string; label: string }[] = [
  { type: "dog", emoji: "🐕", label: "Köpek" },
  { type: "cat", emoji: "🐈", label: "Kedi" },
  { type: "other", emoji: "🐾", label: "Diğer" },
]

/** Yeni dost eklerken tür seçtiren 3'lü kart grubu. */
export function PetTypePicker({ onPick }: { onPick: (type: PetType) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.type}
          type="button"
          onClick={() => onPick(opt.type)}
          className="flex flex-col items-center gap-2 rounded-2xl border border-foreground/[0.08] bg-white px-3 py-4 text-center transition-all hover:border-[var(--coral)]/40 hover:shadow-sm active:scale-[0.97]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--navy)]/[0.06] text-3xl">
            {opt.emoji}
          </span>
          <span className="text-sm font-bold text-foreground">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
