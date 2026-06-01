"use client"

import Link from "next/link"
import {
  MapPin,
  Bell,
  ShieldCheck,
  Globe,
  CalendarCheck,
  ChevronRight,
  User as UserIcon,
  Plus,
  Syringe,
  LogOut,
} from "lucide-react"
import {
  useAuth,
  petEmoji,
  petTypeLabel,
  formatPetAge,
  vaccinationStatus,
} from "@/lib/auth-mock"
import { openBooking } from "@/lib/booking-bus"
import { AvatarInitials } from "@/components/avatar-initials"
import { EmptyReservations, ReservationCard } from "@/components/account/reservation-card"
import { cn } from "@/lib/utils"

export default function HesapPage() {
  const { user, isAuthed, hydrated, signOut } = useAuth()

  if (!hydrated) return <div className="min-h-[60vh]" aria-hidden="true" />
  if (!isAuthed || !user) return <SignedOut />

  return (
    <div className="min-h-screen">
      {/* ── Kimlik şeridi ── */}
      <Link
        href="/hesap/profil"
        className="flex items-center gap-3.5 border-b border-foreground/8 bg-white px-4 py-4 transition-colors active:bg-foreground/[0.03]"
      >
        <AvatarInitials name={user.name} size={52} className="flex-shrink-0 rounded-[16px]" />
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-base font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {user.name}
          </p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            Profili görüntüle ve düzenle
          </p>
        </div>
        <ChevronRight size={18} className="flex-shrink-0 text-foreground/30" />
      </Link>

      {/* ── Hızlı aksiyon ── */}
      <div className="px-4 pb-2 pt-5">
        <button
          type="button"
          onClick={() => openBooking()}
          className="flex w-full items-center gap-4 rounded-2xl bg-[var(--coral)] px-5 py-4 text-left transition-opacity active:opacity-90"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
            <CalendarCheck size={20} className="text-white" />
          </span>
          <span>
            <span className="block text-base font-extrabold text-white">Rezervasyon oluştur</span>
            <span className="block text-sm text-white/75">Hizmet, tarih ve pati seç</span>
          </span>
          <ChevronRight size={18} className="ml-auto text-white/60" />
        </button>
      </div>

      {/* ── Rezervasyonlarım ── */}
      <Section title="Rezervasyonlarım">
        {user.reservations.length === 0 ? (
          <EmptyReservations />
        ) : (
          <div className="bg-secondary/40 py-1">
            {user.reservations.slice(0, 3).map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        )}
      </Section>

      {/* ── Patili dostlarım ── */}
      <Section title="Patili Dostlarım" href="/hesap/dostlarim" actionLabel="Tümü">
        {user.pets.length === 0 ? (
          <EmptyPets />
        ) : (
          <div className="divide-y divide-foreground/[0.06]">
            {user.pets.map((pet) => {
              const vac = vaccinationStatus(pet)
              const age = formatPetAge(pet.birthDate)
              return (
                <Link
                  key={pet.id}
                  href="/hesap/dostlarim"
                  className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-foreground/[0.03]"
                >
                  {/* Emoji avatar */}
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)]/[0.07] text-2xl">
                    {petEmoji(pet)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{pet.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {petTypeLabel(pet)}{pet.breed ? ` · ${pet.breed}` : ""}{age ? ` · ${age}` : ""}
                    </p>
                  </div>
                  {/* Aşı durumu rozeti */}
                  {vac.tone !== "none" && (
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                        vac.tone === "ok" && "bg-emerald-50 text-emerald-600",
                        vac.tone === "soon" && "bg-amber-50 text-amber-600",
                        vac.tone === "overdue" && "bg-rose-50 text-rose-600",
                      )}
                    >
                      <Syringe size={10} />
                      {vac.tone === "ok" ? "Güncel" : vac.tone === "soon" ? "Yaklaşıyor" : "Gecikti"}
                    </span>
                  )}
                  <ChevronRight size={15} className="flex-shrink-0 text-foreground/25" />
                </Link>
              )
            })}
            <Link
              href="/hesap/dostlarim"
              className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-foreground/[0.03]"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-foreground/15">
                <Plus size={18} className="text-foreground/30" />
              </span>
              <p className="text-sm font-semibold text-muted-foreground">Yeni dost ekle</p>
            </Link>
          </div>
        )}
      </Section>

      {/* ── Hesap ayarları ── */}
      <Section title="Hesap">
        <SettingsRow
          href="/hesap/adreslerim"
          icon={<MapPin size={17} />}
          label="Adreslerim"
          value={user.addresses.length ? `${user.addresses.length} kayıtlı` : undefined}
          placeholder="Henüz eklenmedi"
        />
        <SettingsRow
          href="/hesap/bildirimler"
          icon={<Bell size={17} />}
          label="Bildirimler"
          value={[
            user.prefs.sms && "SMS",
            user.prefs.email && "E-posta",
          ].filter(Boolean).join(", ") || "Kapalı"}
        />
      </Section>

      {/* ── Uygulama ── */}
      <Section title="Uygulama">
        <SettingsRow href="/hesap/dil" icon={<Globe size={17} />} label="Dil" value="Türkçe" />
        <SettingsRow
          href="/hesap/gizlilik"
          icon={<ShieldCheck size={17} />}
          label="Gizlilik ve veriler"
        />
      </Section>

      {/* ── Çıkış ── */}
      <div className="px-4 pb-10 pt-2">
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-white py-3.5 text-sm font-bold text-[var(--coral)] transition-colors active:bg-rose-50"
        >
          <LogOut size={16} /> Çıkış yap
        </button>
        <p className="mt-4 text-center text-[11px] text-muted-foreground/60">
          Veriler yalnızca bu cihazda saklanır · Ön görünüm
        </p>
      </div>
    </div>
  )
}

/* ─── Yardımcılar ─── */

function Section({
  title,
  href,
  actionLabel,
  children,
}: {
  title: string
  href?: string
  actionLabel?: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-5">
      <div className="mb-1 flex items-center justify-between px-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
          {title}
        </p>
        {href && actionLabel && (
          <Link href={href} className="text-xs font-bold text-[var(--coral)]">
            {actionLabel}
          </Link>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white mx-4 shadow-[0_1px_4px_rgba(20,31,53,0.06)]">
        {children}
      </div>
    </div>
  )
}

function SettingsRow({
  href,
  icon,
  label,
  value,
  placeholder,
}: {
  href: string
  icon: React.ReactNode
  label: string
  value?: string
  placeholder?: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-foreground/[0.03] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-foreground/[0.06]"
    >
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07] text-[var(--navy)]">
        {icon}
      </span>
      <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
      {(value || placeholder) && (
        <span className={cn("text-xs", value ? "text-muted-foreground" : "text-muted-foreground/40")}>
          {value ?? placeholder}
        </span>
      )}
      <ChevronRight size={15} className="flex-shrink-0 text-foreground/25" />
    </Link>
  )
}

function EmptyPets() {
  return (
    <Link
      href="/hesap/dostlarim"
      className="flex flex-col items-center gap-3 px-4 py-8 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--navy)]/[0.06] text-3xl">
        🐾
      </span>
      <div>
        <p className="text-sm font-bold text-foreground">Henüz dost eklemedin</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Patili dostunu ekle, aşı takibini ve rezervasyonları kolaylaştır.
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--coral)] px-4 py-2 text-xs font-bold text-white">
        <Plus size={13} /> Dost ekle
      </span>
    </Link>
  )
}

function SignedOut() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--navy)]">
        <UserIcon size={28} className="text-white" />
      </div>
      <h1
        className="text-2xl font-extrabold text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Hesabın seni bekliyor
      </h1>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Üye ol; rezervasyonların, adreslerin ve kayıtlı dostların her cihazda hazır olsun.
      </p>
      <Link
        href="/katil"
        className="mt-6 inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-[var(--coral)] text-sm font-bold text-white transition-opacity active:opacity-90"
      >
        Hemen katıl
      </Link>
    </div>
  )
}
