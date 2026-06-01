"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Cake,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  HeartPulse,
  Pencil,
  Plus,
  Syringe,
  Trash2,
  Weight,
  X,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useAuth,
  formatPetAge,
  ageYearsToBirthDate,
  birthDateToAgeYears,
  petEmoji,
  petTypeLabel,
  type SavedPet,
  type Vaccination,
} from "@/lib/auth-mock"
import { RequireAuth } from "@/components/account/ui"
import { PetForm, type PetDraft } from "@/components/account/forms"
import { inputCls } from "@/components/account/ui"

export default function PetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return (
    <RequireAuth>
      <PetDetailScreen id={slug} />
    </RequireAuth>
  )
}

function petToDraft(pet: SavedPet): PetDraft {
  const years = birthDateToAgeYears(pet.birthDate)
  return {
    id: pet.id,
    name: pet.name,
    type: pet.type,
    species: pet.species ?? "",
    breed: pet.breed ?? "",
    gender: pet.gender ?? "unknown",
    ageYears: years != null ? String(years) : "",
    weightKg: pet.weightKg != null ? String(pet.weightKg) : "",
    microchip: pet.microchip ?? "",
    photo: pet.photo,
  }
}

function PetDetailScreen({ id }: { id: string }) {
  const { user, update } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!user) return null
  const pet = user.pets.find((p) => p.id === id)

  if (!pet) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <span className="text-5xl">🐾</span>
        <p className="text-base font-bold text-foreground">Bu dost bulunamadı.</p>
        <Link
          href="/hesap/dostlarim"
          className="rounded-2xl bg-[var(--coral)] px-5 py-2.5 text-sm font-bold text-white"
        >
          Listeye dön
        </Link>
      </div>
    )
  }

  const patch = (next: SavedPet) =>
    update({ pets: user.pets.map((p) => (p.id === pet.id ? next : p)) })

  const saveEdit = (draft: PetDraft) => {
    const weight = parseFloat(draft.weightKg.replace(",", "."))
    const years = parseInt(draft.ageYears, 10)
    patch({
      ...pet,
      name: draft.name.trim() || pet.name,
      type: draft.type,
      species: draft.type === "other" ? draft.species.trim() || undefined : undefined,
      breed: draft.type !== "other" ? draft.breed.trim() || undefined : undefined,
      gender: draft.gender,
      birthDate: Number.isFinite(years) ? ageYearsToBirthDate(years) : undefined,
      weightKg: Number.isFinite(weight) && weight > 0 ? weight : undefined,
      microchip: draft.microchip.trim() || undefined,
      photo: draft.photo,
    })
    setEditing(false)
  }

  const removePet = () => {
    update({ pets: user.pets.filter((p) => p.id !== pet.id) })
    router.replace("/hesap/dostlarim")
  }

  /* Düzenleme modu */
  if (editing) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center gap-3 border-b border-foreground/8 bg-white px-4 py-3.5">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/50"
          >
            <ArrowLeft size={20} />
          </button>
          <h2
            className="text-base font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {pet.name}&apos;i Düzenle
          </h2>
        </div>
        <div className="px-4 py-5">
          <PetForm initial={petToDraft(pet)} onSave={saveEdit} onCancel={() => setEditing(false)} />
        </div>
      </div>
    )
  }

  const age = formatPetAge(pet.birthDate)

  return (
    <div className="min-h-screen">
      {/* Başlık */}
      <div className="flex items-center justify-between border-b border-foreground/8 bg-white px-4 py-3.5">
        <Link
          href="/hesap/dostlarim"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/50"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1
          className="text-base font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pet.name}
        </h1>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-foreground/10 px-3 text-xs font-bold text-foreground"
        >
          <Pencil size={13} /> Düzenle
        </button>
      </div>

      {/* Kimlik kartı */}
      <div className="mx-4 mt-5 overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        {/* Avatar + isim */}
        <div className="flex items-center gap-4 px-4 py-5">
          <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--navy)]/[0.07] text-4xl">
            {pet.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pet.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              petEmoji(pet)
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-xl font-extrabold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {pet.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {[petTypeLabel(pet), pet.breed].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        {/* Stat şeridi */}
        <div className="grid grid-cols-3 divide-x divide-foreground/[0.06] border-t border-foreground/[0.06]">
          <StatCell icon={<Cake size={14} />} label="Yaş" value={age ?? "—"} />
          <StatCell
            icon={<Weight size={14} />}
            label="Kilo"
            value={pet.weightKg != null ? `${pet.weightKg} kg` : "—"}
          />
          <StatCell
            icon={<HeartPulse size={14} />}
            label="Cinsiyet"
            value={
              pet.gender === "female" ? "Dişi" : pet.gender === "male" ? "Erkek" : "—"
            }
          />
        </div>
      </div>

      {/* Mikroçip */}
      {pet.microchip && (
        <div className="mx-4 mt-4 flex items-center gap-3.5 rounded-2xl border border-foreground/[0.07] bg-white px-4 py-3.5 shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07] text-[var(--navy)]/70">
            <Fingerprint size={16} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
              Mikroçip
            </p>
            <p className="font-mono text-sm font-semibold text-foreground">{pet.microchip}</p>
          </div>
        </div>
      )}

      {/* Aşı takibi */}
      <VaccinationsSection pet={pet} onPatch={patch} />

      {/* Sağlık notu */}
      <HealthNoteSection pet={pet} onPatch={patch} />

      {/* Silme */}
      <div className="mx-4 mt-5">
        {confirmDelete ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="mb-1 text-sm font-bold text-foreground">
              {pet.name}&apos;i silmek istediğine emin misin?
            </p>
            <p className="mb-4 text-xs text-muted-foreground">Bu işlem geri alınamaz.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border border-foreground/10 bg-white py-2.5 text-sm font-bold"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={removePet}
                className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white"
              >
                Evet, sil
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-foreground/[0.07] bg-white py-3.5 text-sm font-bold text-rose-500 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors active:bg-rose-50"
          >
            <Trash2 size={15} /> {pet.name}&apos;i sil
          </button>
        )}
      </div>

      <div className="pb-10" />
    </div>
  )
}

/* ── Aşı bölümü ── */
const SUGGESTED_DOG = ["Kuduz", "Karma (DHPPi+L)", "İç/Dış Parazit"]
const SUGGESTED_CAT = ["Kuduz", "Karma (FVRCP)", "İç/Dış Parazit"]

function VaccinationsSection({ pet, onPatch }: { pet: SavedPet; onPatch: (p: SavedPet) => void }) {
  const [adding, setAdding] = useState(false)
  const vaccinations = pet.vaccinations ?? []
  const suggestions = pet.type === "dog" ? SUGGESTED_DOG : SUGGESTED_CAT
  const sorted = [...vaccinations].sort((a, b) => (a.date < b.date ? 1 : -1))

  const remove = (id: string) =>
    onPatch({ ...pet, vaccinations: vaccinations.filter((x) => x.id !== id) })

  return (
    <div className="mt-5 px-4">
      <div className="mb-1 flex items-center justify-between px-0.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Aşı ve Parazit Takibi
        </p>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--coral)]"
          >
            <Plus size={13} /> Ekle
          </button>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        {adding && (
          <div className="border-b border-foreground/[0.06] px-4 py-4">
            <VaccinationForm
              suggestions={suggestions}
              onSave={(v) => {
                onPatch({ ...pet, vaccinations: [...vaccinations, v] })
                setAdding(false)
              }}
              onCancel={() => setAdding(false)}
            />
          </div>
        )}

        {sorted.length === 0 && !adding ? (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Henüz aşı kaydı yok.
            </p>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--coral)]/10 px-3.5 py-1.5 text-xs font-bold text-[var(--coral)]"
            >
              <Plus size={12} /> Aşı ekle
            </button>
          </div>
        ) : (
          sorted.map((v, i) => (
            <div
              key={v.id}
              className={cn(i < sorted.length - 1 && "border-b border-foreground/[0.06]")}
            >
              <VaccinationRow vac={v} onRemove={() => remove(v.id)} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function VaccinationRow({ vac, onRemove }: { vac: Vaccination; onRemove: () => void }) {
  const status = nextStatus(vac.nextDate)
  return (
    <div className="flex items-start gap-3.5 px-4 py-3.5">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--coral)]/10 text-[var(--coral)]">
        <Syringe size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">{vac.name}</p>
        <p className="text-xs text-muted-foreground">Yapıldı: {formatDate(vac.date)}</p>
        {vac.nextDate && status && (
          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
              status.tone === "overdue" && "bg-rose-50 text-rose-600",
              status.tone === "soon" && "bg-amber-50 text-amber-600",
              status.tone === "ok" && "bg-emerald-50 text-emerald-600",
            )}
          >
            {status.tone === "overdue" ? (
              <AlertCircle size={10} />
            ) : status.tone === "soon" ? (
              <CalendarClock size={10} />
            ) : (
              <CheckCircle2 size={10} />
            )}
            {status.label}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${vac.name} sil`}
        className="rounded-lg p-1.5 text-muted-foreground/50 transition-colors hover:text-rose-500"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function VaccinationForm({
  suggestions,
  onSave,
  onCancel,
}: {
  suggestions: string[]
  onSave: (v: Vaccination) => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [nextDate, setNextDate] = useState("")
  const today = new Date().toISOString().slice(0, 10)
  const valid = name.trim() !== "" && date !== ""

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!valid) return
        onSave({ id: `v${Date.now()}`, name: name.trim(), date, nextDate: nextDate || undefined })
      }}
      className="space-y-3"
    >
      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Aşı / Uygulama
        </p>
        <input
          autoFocus
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn. Kuduz"
          className={inputCls}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setName(s)}
              className="rounded-full border border-foreground/10 bg-white px-2.5 py-1 text-xs font-semibold text-foreground/70"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Yapıldığı Tarih
          </p>
          <input
            type="date"
            max={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Sonraki Doz (ops.)
          </p>
          <input
            type="date"
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-foreground/10 py-2.5 text-sm font-bold text-foreground"
        >
          <X size={14} /> Vazgeç
        </button>
        <button
          type="submit"
          disabled={!valid}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold",
            valid ? "bg-[var(--coral)] text-white" : "bg-foreground/10 text-muted-foreground",
          )}
        >
          <Check size={14} /> Kaydet
        </button>
      </div>
    </form>
  )
}

/* ── Sağlık notu bölümü ── */
function HealthNoteSection({ pet, onPatch }: { pet: SavedPet; onPatch: (p: SavedPet) => void }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(pet.notes ?? "")

  const save = () => {
    onPatch({ ...pet, notes: text.trim() || undefined })
    setEditing(false)
  }

  return (
    <div className="mt-5 px-4">
      <div className="mb-1 flex items-center justify-between px-0.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Sağlık Notları
        </p>
        {!editing && (
          <button
            type="button"
            onClick={() => { setText(pet.notes ?? ""); setEditing(true) }}
            className="text-xs font-bold text-[var(--coral)]"
          >
            {pet.notes ? "Düzenle" : "Ekle"}
          </button>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        {editing ? (
          <div className="space-y-3 px-4 py-4">
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Alerji, kronik durum, ilaç, özel ihtiyaç…"
              className={cn(inputCls, "resize-none")}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-foreground/10 py-2.5 text-sm font-bold text-foreground"
              >
                <X size={14} /> Vazgeç
              </button>
              <button
                type="button"
                onClick={save}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--coral)] py-2.5 text-sm font-bold text-white"
              >
                <Check size={14} /> Kaydet
              </button>
            </div>
          </div>
        ) : pet.notes ? (
          <p className="px-4 py-4 text-sm leading-relaxed text-foreground/80">{pet.notes}</p>
        ) : (
          <div className="px-4 py-5 text-center">
            <p className="text-sm text-muted-foreground">
              Alerji, kronik durum veya özel ihtiyaç varsa ekle.
            </p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--coral)]/10 px-3.5 py-1.5 text-xs font-bold text-[var(--coral)]"
            >
              <Plus size={12} /> Not ekle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Yardımcılar ── */
function StatCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--coral)]/10 text-[var(--coral)]">
        {icon}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground/50">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
}

function nextStatus(nextDate?: string): { tone: "overdue" | "soon" | "ok"; label: string } | null {
  if (!nextDate) return null
  const next = new Date(nextDate)
  if (Number.isNaN(next.getTime())) return null
  const days = Math.ceil((next.getTime() - Date.now()) / 86400000)
  if (days < 0) return { tone: "overdue", label: `Gecikti · ${formatDate(nextDate)}` }
  if (days <= 30) return { tone: "soon", label: `Yaklaşıyor · ${formatDate(nextDate)}` }
  return { tone: "ok", label: `Sonraki · ${formatDate(nextDate)}` }
}
