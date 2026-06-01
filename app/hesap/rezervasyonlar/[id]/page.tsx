"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  CalendarCheck,
  Clock3,
  MapPin,
  PackageCheck,
  PawPrint,
  Phone,
  User,
} from "lucide-react"
import { RequireAuth } from "@/components/account/ui"
import {
  AddressPair,
  CompactMetric,
  NextStepNotice,
  PaymentPanel,
  ReservationMap,
  carrierLabel,
  durationLabel,
  formatReservationDate,
  petLabel,
  serviceTitle,
} from "@/components/account/reservation-card"
import { useAuth, type SavedReservation } from "@/lib/auth-mock"

export default function ReservationDetailPage() {
  return (
    <RequireAuth>
      <ReservationDetailScreen />
    </RequireAuth>
  )
}

function ReservationDetailScreen() {
  const { user } = useAuth()
  const params = useParams()
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id
  const reservation = user?.reservations.find((item) => item.id === rawId || item.code === rawId)

  if (!user) return null
  if (!reservation) return <MissingReservation />

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-foreground/8 bg-white/95 px-4 py-3.5 backdrop-blur">
        <Link
          href="/hesap"
          aria-label="Hesaba dön"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/55 transition-colors active:bg-secondary"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Rezervasyon detayı
          </h1>
          <p className="font-mono text-[11px] font-bold text-muted-foreground">{reservation.code}</p>
        </div>
      </div>

      <main className="space-y-4 px-4 py-4 pb-10">
        <StatusHeader reservation={reservation} />
        <ReservationMap pickup={reservation.pickupPoint} dropoff={reservation.dropoffPoint} />

        <div className="grid grid-cols-2 gap-2">
          <CompactMetric icon={<CalendarCheck size={14} />} label="Hizmet" value={serviceTitle(reservation)} />
          <CompactMetric icon={<Clock3 size={14} />} label="Süre" value={durationLabel(reservation)} />
        </div>

        <AddressPair pickup={reservation.pickupPoint} dropoff={reservation.dropoffPoint} />

        <InfoCard title="Yolculuk bilgileri">
          <DetailLine icon={<PawPrint size={15} />} label="Patili dost" value={petLabel(reservation)} />
          <DetailLine icon={<PackageCheck size={15} />} label="Taşıma" value={carrierLabel(reservation)} />
          <DetailLine
            icon={<CalendarCheck size={15} />}
            label="Gidiş"
            value={`${formatReservationDate(reservation.outboundDate)} · ${reservation.outboundSlot ?? "Saat seçilmedi"}`}
          />
          {reservation.service === "round-trip" && (
            <DetailLine
              icon={<CalendarCheck size={15} />}
              label="Dönüş"
              value={`${formatReservationDate(reservation.returnDate)} · ${reservation.returnSlot ?? "Saat seçilmedi"}`}
            />
          )}
        </InfoCard>

        <InfoCard title="Teslim eden kişi">
          <DetailLine icon={<User size={15} />} label="Ad Soyad" value={reservation.customerName || user.name} />
          <DetailLine icon={<Phone size={15} />} label="Telefon" value={formatPhone(reservation.phone || user.phone)} />
        </InfoCard>

        <PaymentPanel reservation={reservation} />
        <NextStepNotice />
      </main>
    </div>
  )
}

function StatusHeader({ reservation }: { reservation: SavedReservation }) {
  return (
    <section className="rounded-[24px] bg-white p-4 shadow-[0_8px_24px_rgba(20,31,53,0.08)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
          Rezervasyon alındı
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[10px] font-bold text-muted-foreground">
          {reservation.code}
        </span>
      </div>
      <h2 className="text-[22px] font-extrabold leading-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
        {serviceTitle(reservation)}
      </h2>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">
        {formatReservationDate(reservation.outboundDate)} · {reservation.outboundSlot ?? "Saat seçilmedi"}
      </p>
    </section>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] bg-white p-4 shadow-[0_8px_24px_rgba(20,31,53,0.08)]">
      <h2 className="mb-3 text-[12px] font-extrabold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function DetailLine({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.06] text-[var(--navy)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words text-[13px] font-bold leading-snug text-foreground">{value}</p>
      </div>
    </div>
  )
}

function MissingReservation() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--navy)]/[0.06] text-[var(--navy)]">
        <MapPin size={24} />
      </span>
      <h1 className="text-xl font-extrabold text-foreground">Rezervasyon bulunamadı</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">Bu rezervasyon bu cihazdaki hesap verilerinde görünmüyor.</p>
      <Link href="/hesap" className="mt-6 rounded-2xl bg-[var(--coral)] px-5 py-3 text-sm font-extrabold text-white">
        Hesaba dön
      </Link>
    </div>
  )
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10) return `+90 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
  return phone || "Telefon yok"
}
