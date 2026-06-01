"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, X, Pencil, Trash2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-mock"

/* ---------------- Sayfa kabuğu: geri + başlık ---------------- */

export function AccountPageShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="px-3 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto w-full max-w-[640px]">
        <div className="mb-4 flex items-center gap-3">
          <Link
            href="/hesap"
            aria-label="Hesaba dön"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-foreground/10 bg-white text-foreground transition-colors hover:bg-foreground/[0.03]"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1
            className="text-xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
        </div>
        {children}
      </div>
    </section>
  )
}

/**
 * Giriş zorunlu sayfalar için guard. Hydrate olmadan boş iskelet,
 * giriş yoksa /katil'e yönlendirir, varsa children'ı render eder.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthed, hydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (hydrated && !isAuthed) router.replace("/katil")
  }, [hydrated, isAuthed, router])

  if (!hydrated) return <div className="min-h-[40vh]" aria-hidden="true" />
  if (!isAuthed) return <div className="min-h-[40vh]" aria-hidden="true" />
  return <>{children}</>
}

/* ---------------- Kart ---------------- */

export function Card({
  title,
  action,
  children,
}: {
  title?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-white p-4 shadow-sm sm:p-5">
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          {title && (
            <h2 className="text-sm font-extrabold text-foreground">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

/* ---------------- Form alanları ---------------- */

export const inputCls =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/30"

export const inputErrCls = "border-[var(--coral)] ring-2 ring-[var(--coral)]/25"

export function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-foreground/60">
        {label}
      </span>
      {children}
    </label>
  )
}

export function ErrText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs font-medium text-[var(--coral)]">{children}</p>
}

export function FormButtons({
  onCancel,
  onSave,
  valid = true,
  saveLabel = "Kaydet",
  loading = false,
}: {
  onCancel: () => void
  onSave?: () => void
  valid?: boolean
  saveLabel?: string
  loading?: boolean
}) {
  return (
    <div className="flex gap-2 pt-1">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-foreground/10 bg-white py-2.5 text-sm font-bold text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X size={15} /> Vazgeç
      </button>
      <button
        type={onSave ? "button" : "submit"}
        onClick={onSave}
        disabled={!valid || loading}
        className={cn(
          "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-[0.98]",
          valid && !loading
            ? "bg-[var(--coral)] text-white hover:opacity-90"
            : "cursor-not-allowed bg-border text-muted-foreground",
        )}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Kaydediliyor…
          </>
        ) : (
          <>
            <Check size={15} /> {saveLabel}
          </>
        )}
      </button>
    </div>
  )
}

/* ---------------- Satır işlemleri (düzenle/sil) ---------------- */

export function RowActions({
  onEdit,
  onDelete,
  deleteLabel,
}: {
  onEdit: () => void
  onDelete: () => void
  deleteLabel: string
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Düzenle"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:text-[var(--navy)]"
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={deleteLabel}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:text-[var(--coral)]"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

/* ---------------- Boş durum + satır + toggle ---------------- */

export function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-foreground/15 px-4 py-6 text-center text-sm text-muted-foreground">
      {text}
    </p>
  )
}

export function InfoRow({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-semibold text-foreground", valueClass)}>{value}</dd>
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  // track w-12=48, knob w-6=24, ml-0.5=2 → açık kayma 20px = translate-x-5
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--coral)]/40 focus-visible:ring-offset-2",
        checked ? "bg-[var(--coral)]" : "bg-foreground/25",
      )}
    >
      <span
        className={cn(
          "pointer-events-none ml-0.5 inline-block h-6 w-6 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  )
}

/* ---------------- Hub menü satırı ---------------- */

export function HubRow({
  href,
  icon,
  title,
  desc,
}: {
  href: string
  icon: React.ReactNode
  title: string
  desc?: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-foreground/[0.025]"
    >
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--coral)]/10 text-[var(--coral)]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-foreground">{title}</span>
        {desc && <span className="block text-xs text-muted-foreground">{desc}</span>}
      </span>
      <ChevronRight size={18} className="flex-shrink-0 text-muted-foreground" />
    </Link>
  )
}
