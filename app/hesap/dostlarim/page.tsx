"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarCheck,
  ChevronRight,
  Plus,
  AlertCircle,
  CalendarClock,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useAuth,
  formatPetAge,
  ageYearsToBirthDate,
  petEmoji,
  petTypeLabel,
  vaccinationStatus,
  type SavedPet,
  type PetType,
  type VaccinationState,
} from "@/lib/auth-mock"
import { openBooking } from "@/lib/booking-bus"
import { RequireAuth } from "@/components/account/ui"
import { PetForm, EMPTY_PET, type PetDraft } from "@/components/account/forms"
import { PetTypePicker } from "@/components/account/pet-type-picker"

export default function DostlarimPage() {
  return (
    <RequireAuth>
      <DostlarimScreen />
    </RequireAuth>
  )
}

function draftToPet(draft: PetDraft): SavedPet {
  const weight = parseFloat(draft.weightKg.replace(",", "."))
  const years = parseInt(draft.ageYears, 10)
  return {
    id: draft.id ?? `p${Date.now()}`,
    name: draft.name.trim() || "İsimsiz dost",
    type: draft.type,
    species: draft.type === "other" ? draft.species.trim() || undefined : undefined,
    breed: draft.type !== "other" ? draft.breed.trim() || undefined : undefined,
    gender: draft.gender,
    birthDate: Number.isFinite(years) ? ageYearsToBirthDate(years) : undefined,
    weightKg: Number.isFinite(weight) && weight > 0 ? weight : undefined,
    microchip: draft.microchip.trim() || undefined,
    photo: draft.photo,
  }
}

function DostlarimScreen() {
  const { user, update } = useAuth()
  const [addingType, setAddingType] = useState<PetType | null>(null)

  if (!user) return null

  const pets = user.pets
  const alertCount = pets.filter((p) => {
    const s = vaccinationStatus(p).tone
    return s === "overdue" || s === "soon"
  }).length

  const save = (draft: PetDraft) => {
    update({ pets: [...pets, draftToPet(draft)] })
    setAddingType(null)
  }

  /* Yeni ekleme formu açıksa */
  if (addingType !== null) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center gap-3 border-b border-foreground/8 bg-white px-4 py-3.5">
          <button
            type="button"
            onClick={() => setAddingType(null)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/50"
          >
            <ArrowLeft size={20} />
          </button>
          <h2
            className="text-base font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Yeni Dost Ekle
          </h2>
        </div>
        <div className="px-4 py-5">
          <PetForm
            initial={{ ...EMPTY_PET, type: addingType }}
            onSave={save}
            onCancel={() => setAddingType(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Patili Dostlarım" />

      {/* Boş durum */}
      {pets.length === 0 ? (
        <EmptyState onPickType={setAddingType} />
      ) : (
        <>
          {/* Aşı uyarı özeti */}
          {alertCount > 0 && (
            <div className="mx-4 mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertCircle size={18} className="flex-shrink-0 text-amber-600" />
              <p className="text-sm font-semibold text-amber-700">
                {alertCount} dostun aşı takvimine dikkat gerekiyor.
              </p>
            </div>
          )}

          {/* Pet listesi */}
          <div className="mt-5 px-4">
            <p className="mb-1 px-0.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {pets.length} Kayıtlı Dost
            </p>
            <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
              {pets.map((pet, i) => (
                <PetRow
                  key={pet.id}
                  pet={pet}
                  divider={i < pets.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Yeni ekleme — tür seç */}
          <div className="mt-5 px-4">
            <p className="mb-1 px-0.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Yeni Dost Ekle
            </p>
            <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
              <div className="px-4 py-4">
                <PetTypePicker onPick={setAddingType} />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="pb-10" />
    </div>
  )
}

function PetRow({ pet, divider }: { pet: SavedPet; divider: boolean }) {
  const age = formatPetAge(pet.birthDate)
  const vac = vaccinationStatus(pet)
  const meta = [petTypeLabel(pet), pet.breed, age].filter(Boolean).join(" · ")

  return (
    <div className={cn(divider && "border-b border-foreground/[0.06]")}>
      <Link
        href={`/hesap/dostlarim/${pet.id}`}
        className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-foreground/[0.03]"
      >
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--navy)]/[0.07] text-2xl">
          {pet.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pet.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            petEmoji(pet)
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{pet.name}</p>
          <p className="truncate text-xs text-muted-foreground">{meta}</p>
          {vac.tone !== "none" && <VacBadge state={vac} />}
        </div>
        <ChevronRight size={16} className="flex-shrink-0 text-foreground/25" />
      </Link>
      {/* Hızlı rezervasyon */}
      <button
        type="button"
        onClick={() => openBooking()}
        className="flex w-full items-center justify-center gap-1.5 border-t border-foreground/[0.06] py-2.5 text-xs font-bold text-[var(--coral)] transition-colors active:bg-[var(--coral)]/[0.04]"
      >
        <CalendarCheck size={13} />
        {pet.name} için rezervasyon
      </button>
    </div>
  )
}

function VacBadge({ state }: { state: VaccinationState }) {
  const cfg = {
    overdue: { cls: "bg-rose-50 text-rose-600", icon: <AlertCircle size={10} /> },
    soon: { cls: "bg-amber-50 text-amber-600", icon: <CalendarClock size={10} /> },
    ok: { cls: "bg-emerald-50 text-emerald-600", icon: <CheckCircle2 size={10} /> },
    none: null,
  }[state.tone]
  if (!cfg) return null
  return (
    <span
      className={cn(
        "mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
        cfg.cls,
      )}
    >
      {cfg.icon}
      {state.label}
    </span>
  )
}

function EmptyState({ onPickType }: { onPickType: (t: PetType) => void }) {
  return (
    <div className="mt-5 px-4">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-foreground/[0.07] bg-white px-6 py-10 text-center shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--coral)]/10 text-4xl">
          🐾
        </span>
        <div>
          <p className="text-base font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Patili dostunu tanıt
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Dostunu kaydet; rezervasyonların hızlansın,
            aşı takibini tek yerden yönet.
          </p>
        </div>
        <PetTypePicker onPick={onPickType} />
      </div>
    </div>
  )
}

function PageHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-foreground/8 bg-white px-4 py-3.5">
      <Link
        href="/hesap"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={20} />
      </Link>
      <h1
        className="text-base font-extrabold text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>
    </div>
  )
}
