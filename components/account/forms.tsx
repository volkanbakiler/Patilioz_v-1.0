"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { PetGender, PetType } from "@/lib/auth-mock"
import { Field, FormButtons, inputCls } from "./ui"
import { BreedAutocomplete } from "./breed-autocomplete"
import { PetPhotoPicker } from "./pet-photo-picker"

export type PetDraft = {
  id?: string
  name: string
  type: PetType
  species: string
  breed: string
  gender: PetGender
  /** Yaş, yıl olarak (form girişi). Kaydederken yaklaşık doğum tarihine çevrilir. */
  ageYears: string
  weightKg: string
  microchip: string
  photo?: string
}

export type AddrDraft = {
  id?: string
  label: string
  line: string
  building: string
  apartment: string
}

export const EMPTY_PET: PetDraft = {
  name: "",
  type: "dog",
  species: "",
  breed: "",
  gender: "unknown",
  ageYears: "",
  weightKg: "",
  microchip: "",
  photo: undefined,
}

const TYPES: { value: PetType; label: string; emoji: string }[] = [
  { value: "dog", label: "Köpek", emoji: "🐕" },
  { value: "cat", label: "Kedi", emoji: "🐈" },
  { value: "other", label: "Diğer", emoji: "🐾" },
]
export const EMPTY_ADDR: AddrDraft = { label: "", line: "", building: "", apartment: "" }

const GENDERS: { value: PetGender; label: string; emoji: string }[] = [
  { value: "female", label: "Dişi", emoji: "♀" },
  { value: "male", label: "Erkek", emoji: "♂" },
  { value: "unknown", label: "Bilmiyorum", emoji: "?" },
]

export function PetForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: PetDraft
  onSave: (d: PetDraft) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<PetDraft>(initial)
  const valid = draft.name.trim().length > 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onSave(draft)
      }}
      className="space-y-4 rounded-xl border border-[var(--coral)]/30 bg-[var(--coral)]/[0.04] p-3.5"
    >
      <PetPhotoPicker
        value={draft.photo}
        onChange={(photo) => setDraft({ ...draft, photo })}
        type={draft.type}
      />

      <Field label="İsim">
        <input
          autoComplete="off"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          placeholder="Örn. Minnoş"
          className={inputCls}
        />
      </Field>

      <Field label="Tür">
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setDraft({ ...draft, type: t.value, breed: "" })}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-2.5 text-sm font-bold transition-colors",
                draft.type === t.value
                  ? "border-[var(--coral)] bg-white text-foreground"
                  : "border-border bg-white/60 text-foreground/60 hover:border-[var(--coral)]/40",
              )}
            >
              <span className="text-xl">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </Field>

      {draft.type === "other" ? (
        <Field label="Tür açıklaması">
          <input
            autoComplete="off"
            value={draft.species}
            onChange={(e) => setDraft({ ...draft, species: e.target.value })}
            placeholder="Örn. Tavşan, Muhabbet kuşu, Hamster"
            className={inputCls}
          />
        </Field>
      ) : (
        <Field label="Cins">
          <BreedAutocomplete
            type={draft.type}
            value={draft.breed}
            onChange={(breed) => setDraft({ ...draft, breed })}
          />
        </Field>
      )}

      <Field label="Cinsiyet">
        <div className="grid grid-cols-3 gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setDraft({ ...draft, gender: g.value })}
              className={cn(
                "rounded-xl border-2 py-2 text-sm font-bold transition-colors",
                draft.gender === g.value
                  ? "border-[var(--coral)] bg-white text-foreground"
                  : "border-border bg-white/60 text-foreground/60 hover:border-[var(--coral)]/40",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Yaş (opsiyonel)">
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="40"
              value={draft.ageYears}
              onChange={(e) =>
                setDraft({ ...draft, ageYears: e.target.value.replace(/\D/g, "").slice(0, 2) })
              }
              placeholder="Örn. 2"
              className={cn(inputCls, "pr-12")}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              yaş
            </span>
          </div>
        </Field>
        <Field label="Kilo (opsiyonel)">
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={draft.weightKg}
              onChange={(e) => setDraft({ ...draft, weightKg: e.target.value })}
              placeholder="Örn. 4.5"
              className={cn(inputCls, "pr-10")}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              kg
            </span>
          </div>
        </Field>
      </div>

      <Field label="Mikroçip numarası (opsiyonel)">
        <input
          inputMode="numeric"
          autoComplete="off"
          value={draft.microchip}
          onChange={(e) => setDraft({ ...draft, microchip: e.target.value.replace(/\D/g, "").slice(0, 15) })}
          placeholder="Varsa 15 haneli numara"
          className={inputCls}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Zorunlu değil — bilmiyorsan boş bırakabilirsin.
        </p>
      </Field>

      <FormButtons onCancel={onCancel} valid={valid} />
    </form>
  )
}

export function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: AddrDraft
  onSave: (d: AddrDraft) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<AddrDraft>(initial)
  const valid = draft.label.trim().length > 0 && draft.line.trim().length > 0
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onSave(draft)
      }}
      className="space-y-3 rounded-xl border border-[var(--coral)]/30 bg-[var(--coral)]/[0.04] p-3"
    >
      <Field label="Etiket">
        <input
          autoFocus
          autoComplete="off"
          value={draft.label}
          onChange={(e) => setDraft({ ...draft, label: e.target.value })}
          placeholder="Örn. Ev, İş, Veteriner"
          className={inputCls}
        />
      </Field>
      <Field label="Adres">
        <input
          name="street-address"
          autoComplete="street-address"
          value={draft.line}
          onChange={(e) => setDraft({ ...draft, line: e.target.value })}
          placeholder="Mahalle, cadde, no"
          className={inputCls}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Bina (ops.)">
          <input
            autoComplete="off"
            value={draft.building}
            onChange={(e) => setDraft({ ...draft, building: e.target.value })}
            placeholder="12"
            className={inputCls}
          />
        </Field>
        <Field label="Daire (ops.)">
          <input
            autoComplete="off"
            value={draft.apartment}
            onChange={(e) => setDraft({ ...draft, apartment: e.target.value })}
            placeholder="5"
            className={inputCls}
          />
        </Field>
      </div>
      <FormButtons onCancel={onCancel} valid={valid} />
    </form>
  )
}
