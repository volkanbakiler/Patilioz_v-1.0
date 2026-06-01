"use client"

import { useRef, useState } from "react"
import { Camera, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PetGender, PetType } from "@/lib/auth-mock"
import { petEmoji } from "@/lib/auth-mock"
import { filterBreeds } from "@/lib/breeds"
import { inputCls } from "@/components/account/ui"

export type PetDraft = {
  id?: string
  name: string
  type: PetType
  species: string
  breed: string
  gender: PetGender
  ageYears: string
  weightKg: string
  microchip: string
  photo?: string
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

const GENDERS: { value: PetGender; label: string }[] = [
  { value: "female", label: "Dişi" },
  { value: "male", label: "Erkek" },
  { value: "unknown", label: "Belirsiz" },
]

/** Pet ekleme / düzenleme formu. */
export function PetForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: PetDraft
  onSave: (draft: PetDraft) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<PetDraft>(initial)
  const fileRef = useRef<HTMLInputElement>(null)
  const valid = draft.name.trim() !== ""
  const set = <K extends keyof PetDraft>(key: K, value: PetDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set("photo", reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onSave(draft)
      }}
      className="space-y-5"
    >
      {/* Foto + isim */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--navy)]/[0.07] text-4xl"
          aria-label="Fotoğraf ekle"
        >
          {draft.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            petEmoji({ type: draft.type, species: draft.species })
          )}
          <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-tl-xl bg-[var(--coral)] text-white">
            <Camera size={13} />
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPhoto}
          className="hidden"
        />
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            İsim
          </p>
          <input
            autoFocus
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Örn. Pamuk"
            className={inputCls}
          />
        </div>
      </div>

      {/* Tür */}
      <Field label="Tür">
        <div className="grid grid-cols-3 gap-2">
          {(["dog", "cat", "other"] as PetType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("type", t)}
              className={cn(
                "rounded-xl border py-2.5 text-sm font-bold transition-all",
                draft.type === t
                  ? "border-[var(--coral)] bg-[var(--coral)] text-white"
                  : "border-foreground/10 bg-white text-foreground",
              )}
            >
              {t === "dog" ? "Köpek" : t === "cat" ? "Kedi" : "Diğer"}
            </button>
          ))}
        </div>
      </Field>

      {/* Cins / tür açıklaması */}
      {draft.type === "other" ? (
        <Field label="Tür açıklaması">
          <input
            value={draft.species}
            onChange={(e) => set("species", e.target.value)}
            placeholder="Örn. Tavşan, Muhabbet kuşu"
            className={inputCls}
          />
        </Field>
      ) : (
        <BreedField
          type={draft.type}
          value={draft.breed}
          onChange={(v) => set("breed", v)}
        />
      )}

      {/* Cinsiyet */}
      <Field label="Cinsiyet">
        <div className="grid grid-cols-3 gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => set("gender", g.value)}
              className={cn(
                "rounded-xl border py-2.5 text-sm font-bold transition-all",
                draft.gender === g.value
                  ? "border-[var(--coral)] bg-[var(--coral)] text-white"
                  : "border-foreground/10 bg-white text-foreground",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </Field>

      {/* Yaş / kilo */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Yaş (yıl)">
          <input
            inputMode="numeric"
            value={draft.ageYears}
            onChange={(e) => set("ageYears", e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Örn. 3"
            className={inputCls}
          />
        </Field>
        <Field label="Kilo (kg)">
          <input
            inputMode="decimal"
            value={draft.weightKg}
            onChange={(e) => set("weightKg", e.target.value.replace(/[^\d.,]/g, ""))}
            placeholder="Örn. 5.5"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Mikroçip */}
      <Field label="Mikroçip (opsiyonel)">
        <input
          inputMode="numeric"
          value={draft.microchip}
          onChange={(e) => set("microchip", e.target.value.replace(/[^\d]/g, ""))}
          placeholder="15 haneli numara"
          className={cn(inputCls, "font-mono")}
        />
      </Field>

      {/* Aksiyonlar */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-foreground/10 py-3 text-sm font-bold text-foreground"
        >
          <X size={15} /> Vazgeç
        </button>
        <button
          type="submit"
          disabled={!valid}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition-all",
            valid
              ? "bg-[var(--coral)] text-white"
              : "cursor-not-allowed bg-foreground/10 text-muted-foreground",
          )}
        >
          <Check size={15} /> Kaydet
        </button>
      </div>
    </form>
  )
}

function BreedField({
  type,
  value,
  onChange,
}: {
  type: PetType
  value: string
  onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const suggestions = filterBreeds(type === "cat" ? "cat" : "dog", value)
  const showList = focused && suggestions.length > 0

  return (
    <Field label="Cins">
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          placeholder="Yazmaya başlayın…"
          autoComplete="off"
          className={inputCls}
        />
        {showList && (
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-foreground/10 bg-white shadow-lg">
            {suggestions.map((b) => (
              <button
                key={b.label}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  onChange(b.label)
                  setFocused(false)
                }}
                className="block w-full px-3.5 py-2.5 text-left text-sm font-semibold text-foreground transition-colors hover:bg-[var(--coral)]/[0.06]"
              >
                {b.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      {children}
    </div>
  )
}
