"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Pencil, Plus, Trash2, X, Check } from "lucide-react"
import { useAuth, type SavedAddress } from "@/lib/auth-mock"
import { RequireAuth } from "@/components/account/ui"
import { cn } from "@/lib/utils"

export default function AdreslerimPage() {
  return (
    <RequireAuth>
      <AdreslerimScreen />
    </RequireAuth>
  )
}

type Draft = { id?: string; label: string; line: string; building: string; apartment: string }
const EMPTY: Draft = { label: "", line: "", building: "", apartment: "" }
const LABEL_CHIPS = ["Ev", "İş", "Veteriner", "Ebeveyn"]

function AdreslerimScreen() {
  const { user, update } = useAuth()
  const [editing, setEditing] = useState<Draft | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (!user) return null

  const save = (draft: Draft) => {
    const clean: SavedAddress = {
      id: draft.id ?? `a${Date.now()}`,
      label: draft.label.trim() || "Adres",
      line: draft.line.trim(),
      building: draft.building.trim() || undefined,
      apartment: draft.apartment.trim() || undefined,
    }
    update({
      addresses: draft.id
        ? user.addresses.map((a) => (a.id === draft.id ? clean : a))
        : [...user.addresses, clean],
    })
    setEditing(null)
  }

  const remove = (id: string) => {
    update({ addresses: user.addresses.filter((a) => a.id !== id) })
    setConfirmDelete(null)
  }

  /* Düzenleme ekranı */
  if (editing !== null) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-between border-b border-foreground/8 bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/50"
          >
            <X size={20} />
          </button>
          <h2
            className="text-sm font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {editing.id ? "Adresi Düzenle" : "Yeni Adres"}
          </h2>
          <div className="w-9" />
        </div>
        <AddressEditor
          initial={editing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Adreslerim"
        action={
          <button
            type="button"
            onClick={() => setEditing(EMPTY)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--coral)] px-3.5 text-xs font-bold text-white"
          >
            <Plus size={13} /> Ekle
          </button>
        }
      />

      {user.addresses.length === 0 ? (
        <EmptyState onAdd={() => setEditing(EMPTY)} />
      ) : (
        <div className="mt-6 px-4">
          <p className="mb-1 px-0.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Kayıtlı Adresler
          </p>
          <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
            {user.addresses.map((addr, i) => (
              <div key={addr.id}>
                {confirmDelete === addr.id ? (
                  <div className="px-4 py-4">
                    <p className="mb-1 text-sm font-bold text-foreground">
                      "{addr.label}" adresini sil?
                    </p>
                    <p className="mb-3 text-xs text-muted-foreground">Bu işlem geri alınamaz.</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 rounded-xl border border-foreground/10 py-2.5 text-sm font-bold text-foreground"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(addr.id)}
                        className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-3.5",
                      i < user.addresses.length - 1 && "border-b border-foreground/[0.06]",
                    )}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07] text-[var(--navy)]/70">
                      <MapPin size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">{addr.label}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {addr.line}
                        {addr.building ? ` · Bina ${addr.building}` : ""}
                        {addr.apartment ? ` · Daire ${addr.apartment}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditing({ id: addr.id, label: addr.label, line: addr.line, building: addr.building ?? "", apartment: addr.apartment ?? "" })}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(addr.id)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-rose-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pb-10" />
    </div>
  )
}

/* ── Adres formu ── */
function AddressEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial: Draft
  onSave: (d: Draft) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<Draft>(initial)
  const valid = draft.label.trim() !== "" && draft.line.trim() !== ""

  return (
    <div className="space-y-5 px-4 pt-6">
      {/* Etiket chips */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Etiket
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {LABEL_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setDraft({ ...draft, label: chip })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all",
                draft.label === chip
                  ? "border-[var(--coral)] bg-[var(--coral)] text-white"
                  : "border-foreground/10 bg-white text-foreground",
              )}
            >
              {chip}
            </button>
          ))}
        </div>
        <InputField
          placeholder="veya özel etiket yaz…"
          value={draft.label}
          onChange={(v) => setDraft({ ...draft, label: v })}
        />
      </div>

      {/* Adres */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Adres
        </p>
        <InputField
          placeholder="Mahalle, cadde, no"
          value={draft.line}
          onChange={(v) => setDraft({ ...draft, line: v })}
          autoComplete="street-address"
        />
      </div>

      {/* Bina / Daire */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Bina (opsiyonel)
          </p>
          <InputField
            placeholder="12"
            value={draft.building}
            onChange={(v) => setDraft({ ...draft, building: v })}
          />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Daire (opsiyonel)
          </p>
          <InputField
            placeholder="5"
            value={draft.apartment}
            onChange={(v) => setDraft({ ...draft, apartment: v })}
          />
        </div>
      </div>

      {/* Kaydet */}
      <button
        type="button"
        onClick={() => valid && onSave(draft)}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold transition-all",
          valid
            ? "bg-[var(--coral)] text-white"
            : "cursor-not-allowed bg-foreground/10 text-muted-foreground",
        )}
      >
        <Check size={15} /> Kaydet
      </button>
    </div>
  )
}

/* ── Primitifler ── */

function InputField({
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="w-full rounded-xl border border-foreground/[0.12] bg-white px-3.5 py-3 text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/50 focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/20 transition-all"
    />
  )
}

function PageHeader({
  title,
  action,
}: {
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 border-b border-foreground/8 bg-white px-4 py-3.5">
      <Link
        href="/hesap"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={20} />
      </Link>
      <h1
        className="flex-1 text-base font-extrabold text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>
      {action}
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--navy)]/[0.06] text-3xl">
        📍
      </span>
      <div>
        <p className="text-base font-bold text-foreground">Kayıtlı adres yok</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sık kullandığın adresleri kaydet, rezervasyonda tek dokunuşla seç.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-2xl bg-[var(--coral)] px-5 py-3 text-sm font-bold text-white"
      >
        <Plus size={15} /> Adres ekle
      </button>
    </div>
  )
}
