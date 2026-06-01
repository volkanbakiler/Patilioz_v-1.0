import Link from "next/link"
import {
  CalendarCheck,
  ChevronRight,
  Clock3,
  CreditCard,
  PackageCheck,
  PawPrint,
  ShieldCheck,
} from "lucide-react"
import type { SavedReservation } from "@/lib/auth-mock"
import { cn } from "@/lib/utils"

const WAITING_BLOCK_MIN = 15

export function ReservationCard({ reservation }: { reservation: SavedReservation }) {
  return (
    <Link
      href={`/hesap/rezervasyonlar/${reservation.id}`}
      className="block px-3 py-3 transition-colors active:bg-foreground/[0.03]"
    >
      <article className="overflow-hidden rounded-[22px] border border-foreground/[0.08] bg-white shadow-[0_8px_24px_rgba(20,31,53,0.08)]">
        <div className="flex items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
                Rezervasyon alındı
              </span>
              <span className="font-mono text-[10px] font-bold text-muted-foreground">{reservation.code}</span>
            </div>
            <h3 className="mt-1 text-[15px] font-extrabold leading-tight text-foreground">
              {serviceTitle(reservation)}
            </h3>
            <p className="mt-0.5 text-[12px] font-semibold text-muted-foreground">
              {formatReservationDate(reservation.outboundDate)} · {reservation.outboundSlot ?? "Saat seçilmedi"}
            </p>
          </div>
          <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <ChevronRight size={16} />
          </span>
        </div>

        <ReservationMap pickup={reservation.pickupPoint} dropoff={reservation.dropoffPoint} compact />

        <div className="space-y-3 p-3">
          <div className="grid grid-cols-2 gap-2">
            <CompactMetric icon={<CalendarCheck size={14} />} label="Hizmet" value={serviceTitle(reservation)} />
            <CompactMetric icon={<Clock3 size={14} />} label="Süre" value={durationLabel(reservation)} />
          </div>

          <AddressPair pickup={reservation.pickupPoint} dropoff={reservation.dropoffPoint} />

          <div className="grid grid-cols-2 gap-2">
            <CompactMetric icon={<PawPrint size={14} />} label="Patili dost" value={petLabel(reservation)} />
            <CompactMetric icon={<PackageCheck size={14} />} label="Taşıma" value={carrierLabel(reservation)} />
          </div>

          <PaymentPanel reservation={reservation} />

          <NextStepNotice />
        </div>
      </article>
    </Link>
  )
}

export function ReservationMap({
  pickup,
  dropoff,
  compact = false,
}: {
  pickup: string
  dropoff: string
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-foreground/[0.06] bg-[linear-gradient(135deg,#e3edf6_0%,#f7fafc_100%)]",
        compact ? "h-[142px]" : "h-[220px] rounded-[24px] border",
      )}
    >
      <div className="absolute inset-x-0 top-8 h-px rotate-2 bg-slate-300/90" />
      <div className="absolute left-4 top-24 h-px w-56 -rotate-6 bg-slate-300/90" />
      <div className="absolute right-0 top-16 h-px w-44 rotate-12 bg-slate-300/90" />
      <div className="absolute left-[44%] top-0 h-full w-11 -rotate-12 rounded-full bg-sky-200/70" />
      <div className="absolute left-[49%] top-0 h-full w-3 -rotate-12 rounded-full bg-sky-300/50" />
      <svg className="absolute left-[30%] top-[33%] h-20 w-[48%] overflow-visible" viewBox="0 0 180 82" aria-hidden="true">
        <path
          d="M6 62 C46 18, 104 16, 174 30"
          fill="none"
          stroke="var(--coral)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="10 9"
        />
      </svg>
      <MapPinBadge label="A" className="left-[34%] top-[58%] bg-[var(--coral)]" />
      <MapPinBadge label="B" className="left-[78%] top-[43%] bg-[var(--navy)]" />
    </div>
  )
}

export function AddressPair({ pickup, dropoff }: { pickup: string; dropoff: string }) {
  return (
    <div className="rounded-2xl border border-foreground/[0.07] bg-secondary/70 p-3">
      <AddressLine tone="coral" label="Alış" value={pickup || "Alış noktası seçilmedi"} />
      <div className="my-2 h-px bg-foreground/[0.06]" />
      <AddressLine tone="navy" label="Varış" value={dropoff || "Varış noktası seçilmedi"} />
    </div>
  )
}

export function PaymentPanel({ reservation }: { reservation: SavedReservation }) {
  return (
    <div className="rounded-2xl bg-[var(--navy)] p-3 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/50">Toplam tutar</p>
          <p className="mt-0.5 text-[24px] font-extrabold leading-none">₺{reservation.amount.toLocaleString("tr-TR")}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
          <CreditCard size={16} />
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/85">
          {paymentMethodLabel(reservation)}
        </span>
        {reservation.discount > 0 && (
          <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-bold text-emerald-100">
            {reservation.couponCode ? `${reservation.couponCode} · ` : ""}-₺{reservation.discount.toLocaleString("tr-TR")}
          </span>
        )}
      </div>
    </div>
  )
}

export function NextStepNotice() {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <ShieldCheck size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-extrabold text-emerald-950">Sıradaki adım</p>
        <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-emerald-900/75">
          Ekip planlaması yapılacak. Sürücü atandığında SMS ile bilgilendirileceksiniz.
        </p>
      </div>
    </div>
  )
}

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
    <div className="min-w-0 rounded-2xl border border-foreground/[0.07] bg-white p-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <p className="truncate text-[9px] font-extrabold uppercase tracking-wide">{label}</p>
      </div>
      <p className="line-clamp-2 text-[12px] font-extrabold leading-snug text-foreground">{value}</p>
    </div>
  )
}

function AddressLine({ tone, label, value }: { tone: "coral" | "navy"; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[11px] font-extrabold text-white",
          tone === "coral" ? "bg-[var(--coral)]" : "bg-[var(--navy)]",
        )}
      >
        {tone === "coral" ? "A" : "B"}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 line-clamp-2 text-[12px] font-bold leading-snug text-foreground">{value}</p>
      </div>
    </div>
  )
}

function MapPinBadge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={cn(
        "absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white text-xs font-extrabold text-white shadow-lg",
        className,
      )}
    >
      {label}
    </span>
  )
}

export function serviceTitle(reservation: SavedReservation) {
  if (reservation.service === "one-way") return "Tek Yön Pet Taksi"
  if (reservation.service === "round-trip") return "Gidiş-Dönüş Pet Taksi"
  if (reservation.service === "accompanied") return "Refakatçili Pet Taksi"
  return "Pet Taksi"
}

export function durationLabel(reservation: SavedReservation) {
  if (reservation.service === "round-trip") {
    return reservation.extraWaitingBlocks > 0
      ? `5 dk dahil · +${reservation.extraWaitingBlocks * WAITING_BLOCK_MIN} dk ek bekleme`
      : "5 dk bekleme dahil"
  }
  if (reservation.service === "accompanied") {
    return `5 dk dahil · +${reservation.accompaniedWaitingBlocks * WAITING_BLOCK_MIN} dk refakat`
  }
  return "Tek yolculuk"
}

export function petLabel(reservation: SavedReservation) {
  if (reservation.pet === "cat") return "Kedi"
  if (reservation.pet === "dog") {
    const dogSize =
      reservation.dogSize === "small" ? "Küçük"
      : reservation.dogSize === "medium" ? "Orta"
      : reservation.dogSize === "large" ? "Büyük"
      : "Boy seçilmedi"
    return [dogSize, "köpek", reservation.weightKg ? `${reservation.weightKg} kg` : ""].filter(Boolean).join(" · ")
  }
  if (reservation.pet === "bird") return "Kuş"
  if (reservation.pet === "other") return "Diğer tür"
  return "Patili dost"
}

export function carrierLabel(reservation: SavedReservation) {
  if (reservation.pet !== "cat") return "Standart araç içi sabitleme"
  return reservation.hasCarrier ? "Kendi taşıma kutusu ile" : "Patilioz taşıma kutusu satın alındı"
}

export function paymentMethodLabel(reservation: SavedReservation) {
  if (reservation.paymentMethod === "card-online") return "Online ödeme"
  if (reservation.paymentMethod === "card-on-delivery") return "Araçta kart"
  if (reservation.paymentMethod === "cash") return "Nakit"
  return "Ödeme yöntemi seçilmedi"
}

export function formatReservationDate(iso: string) {
  if (!iso) return "Tarih seçilmedi"
  return new Date(`${iso}T00:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function EmptyReservations() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--navy)]/[0.06] text-[var(--navy)]">
        <CalendarCheck size={24} />
      </span>
      <div>
        <p className="text-sm font-bold text-foreground">Henüz rezervasyon yok</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Oluşturduğunuz rezervasyonlar burada haritalı kart olarak görünür.
        </p>
      </div>
    </div>
  )
}
