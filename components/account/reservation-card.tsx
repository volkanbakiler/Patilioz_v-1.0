"use client"

import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CalendarPlus,
  ChevronRight,
  Info,
  MapPin,
  Navigation,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { openBooking } from "@/lib/booking-bus"
import type { SavedReservation } from "@/lib/auth-mock"

/* ─────────── Etiket yardımcıları ─────────── */

export function serviceTitle(r: SavedReservation): string {
  switch (r.service) {
    case "one-way":
      return "Standart Pet Taksi"
    case "round-trip":
      return "Gidiş–Dönüş Pet Taksi"
    case "accompanied":
      return "Refakatçili Pet Taksi"
    default:
      return "Pet Taksi"
  }
}

export function petLabel(r: SavedReservation): string {
  const base =
    r.pet === "dog"
      ? "Köpek"
      : r.pet === "cat"
        ? "Kedi"
        : r.pet === "bird"
          ? "Kuş"
          : r.pet === "other"
            ? "Diğer"
            : "Patili dost"
  if (r.pet === "dog" && r.dogSize) {
    const size = r.dogSize === "small" ? "Küçük" : r.dogSize === "medium" ? "Orta" : "Büyük"
    return `${base} · ${size}`
  }
  return base
}

export function carrierLabel(r: SavedReservation): string {
  if (r.hasCarrier === true) return "Kendi taşıma kutusu"
  if (r.hasCarrier === false) return "Patilioz taşıma kutusu"
  return "Belirtilmedi"
}

export function durationLabel(r: SavedReservation): string {
  if (r.service === "round-trip") return "Gidiş–dönüş · 15 dk bekleme dahil"
  if (r.service === "accompanied") return "Refakat dahil"
  return "Tek yön transfer"
}

export function formatReservationDate(iso: string): string {
  if (!iso) return "Tarih seçilmedi"
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
}

const STATUS_META: Record<
  SavedReservation["status"],
  { label: string; cls: string }
> = {
  received: { label: "Alındı", cls: "bg-emerald-50 text-emerald-700" },
  planned: { label: "Planlandı", cls: "bg-sky-50 text-sky-700" },
  completed: { label: "Tamamlandı", cls: "bg-secondary text-muted-foreground" },
  cancelled: { label: "İptal edildi", cls: "bg-rose-50 text-rose-600" },
}

/* ─────────── Hesap listesindeki rezervasyon kartı ─────────── */

export function ReservationCard({ reservation }: { reservation: SavedReservation }) {
  const status = STATUS_META[reservation.status]
  return (
    <Link
      href={`/hesap/rezervasyonlar/${reservation.id}`}
      className="mx-2 mb-2 flex items-center gap-3.5 rounded-2xl border border-foreground/[0.07] bg-white px-4 py-3.5 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors active:bg-foreground/[0.02]"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)]/[0.07] text-[var(--navy)]">
        <CalendarCheck size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-foreground">{serviceTitle(reservation)}</p>
          <span
            className={cn(
              "flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold",
              status.cls,
            )}
          >
            {status.label}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {formatReservationDate(reservation.outboundDate)}
          {reservation.outboundSlot ? ` · ${reservation.outboundSlot}` : ""}
        </p>
        <p className="mt-0.5 truncate font-mono text-[10px] font-bold text-muted-foreground/70">
          {reservation.code}
        </p>
      </div>
      <ChevronRight size={16} className="flex-shrink-0 text-foreground/25" />
    </Link>
  )
}

export function EmptyReservations() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--navy)]/[0.06] text-[var(--navy)]">
        <CalendarPlus size={24} />
      </span>
      <div>
        <p className="text-sm font-bold text-foreground">Henüz rezervasyon yok</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          İlk rezervasyonunu oluştur, yolculuk burada görünsün.
        </p>
      </div>
      <button
        type="button"
        onClick={() => openBooking()}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--coral)] px-4 py-2 text-xs font-bold text-white"
      >
        Rezervasyon oluştur
        <ArrowRight size={13} />
      </button>
    </div>
  )
}

/* ─────────── Detay sayfası blokları ─────────── */

export function CompactMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-[20px] bg-white p-3.5 shadow-[0_4px_16px_rgba(20,31,53,0.06)]">
      <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--coral)]/10 text-[var(--coral)]">
        {icon}
      </span>
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold leading-snug text-foreground">{value}</p>
    </div>
  )
}

export function AddressPair({
  pickup,
  dropoff,
}: {
  pickup: string
  dropoff: string
}) {
  return (
    <section className="rounded-[24px] bg-white p-4 shadow-[0_8px_24px_rgba(20,31,53,0.08)]">
      <div className="flex gap-3">
        <div className="flex flex-col items-center pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--navy)]" />
          <span className="my-1 w-px flex-1 border-l border-dashed border-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--coral)]" />
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
              Alış
            </p>
            <p className="mt-0.5 break-words text-[13px] font-bold leading-snug text-foreground">
              {pickup || "Belirtilmedi"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
              Varış
            </p>
            <p className="mt-0.5 break-words text-[13px] font-bold leading-snug text-foreground">
              {dropoff || "Belirtilmedi"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ReservationMap({
  pickup,
  dropoff,
}: {
  pickup: string
  dropoff: string
}) {
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-[var(--navy)] shadow-[0_8px_24px_rgba(20,31,53,0.12)]">
      <svg viewBox="0 0 400 160" className="h-40 w-full" role="img" aria-label="Rota görseli">
        <defs>
          <linearGradient id="rm-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--navy)" />
            <stop offset="100%" stopColor="oklch(0.24 0.07 250)" />
          </linearGradient>
        </defs>
        <rect width="400" height="160" fill="url(#rm-bg)" />
        <g stroke="white" strokeOpacity="0.06">
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 24} x2="400" y2={i * 24} />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="160" />
          ))}
        </g>
        <path
          d="M60 120 C 140 120, 130 50, 210 50 S 300 64, 340 40"
          stroke="var(--coral)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="2 12"
          strokeLinecap="round"
        />
        <circle cx="60" cy="120" r="7" fill="white" />
        <circle cx="60" cy="120" r="13" stroke="white" strokeOpacity="0.3" strokeWidth="2" fill="none" />
        <circle cx="340" cy="40" r="7" fill="var(--coral)" />
        <circle cx="340" cy="40" r="13" stroke="var(--coral)" strokeOpacity="0.4" strokeWidth="2" fill="none" />
      </svg>
      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
          <MapPin size={13} /> {pickup ? truncate(pickup) : "Alış"}
        </span>
        <Navigation size={14} className="text-white/40" />
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
          <MapPin size={13} className="text-[var(--coral)]" /> {dropoff ? truncate(dropoff) : "Varış"}
        </span>
      </div>
    </section>
  )
}

function truncate(value: string, max = 18) {
  return value.length > max ? `${value.slice(0, max)}…` : value
}

export function PaymentPanel({ reservation }: { reservation: SavedReservation }) {
  const methodLabel =
    reservation.paymentMethod === "card-online"
      ? "Online ödeme"
      : reservation.paymentMethod === "card-on-delivery"
        ? "Araçta kart"
        : reservation.paymentMethod === "cash"
          ? "Nakit"
          : "Seçilmedi"

  const subtotal = reservation.amount + reservation.discount

  return (
    <section className="rounded-[24px] bg-white p-4 shadow-[0_8px_24px_rgba(20,31,53,0.08)]">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--navy)]/[0.06] text-[var(--navy)]">
          <Wallet size={15} />
        </span>
        <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-muted-foreground">
          Ödeme
        </h2>
      </div>

      <div className="space-y-2 text-sm">
        <Row label="Ara toplam" value={`₺${subtotal.toLocaleString("tr-TR")}`} muted />
        {reservation.discount > 0 && (
          <Row
            label={reservation.couponCode ? `İndirim (${reservation.couponCode})` : "İndirim"}
            value={`−₺${reservation.discount.toLocaleString("tr-TR")}`}
            tone="discount"
          />
        )}
        <div className="my-2 border-t border-dashed border-foreground/15" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">Toplam</span>
          <span className="text-lg font-extrabold text-foreground">
            ₺{reservation.amount.toLocaleString("tr-TR")}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Ödeme yöntemi</span>
          <span className="text-xs font-bold text-foreground">{methodLabel}</span>
        </div>
      </div>
    </section>
  )
}

function Row({
  label,
  value,
  muted,
  tone,
}: {
  label: string
  value: string
  muted?: boolean
  tone?: "discount"
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-sm", muted ? "text-muted-foreground" : "text-foreground")}>
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-semibold",
          tone === "discount" ? "text-emerald-600" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function NextStepNotice() {
  return (
    <section className="flex items-start gap-3 rounded-[24px] border border-[var(--coral)]/15 bg-[var(--coral)]/[0.05] p-4">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--coral)]/15 text-[var(--coral)]">
        <Info size={15} />
      </span>
      <div>
        <p className="text-sm font-bold text-foreground">Sırada ne var?</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          Rezervasyon talebin alındı. Müsaitlik kontrolü sonrası net fiyat ve sürücü bilgisiyle
          birlikte SMS ile bilgilendirileceksin.
        </p>
      </div>
    </section>
  )
}
