"use client"

import Link from "next/link"
import {
  ArrowRight,
  Clock,
  Gift,
  Repeat,
  RotateCcw,
  Route,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import { openBooking } from "@/lib/booking-bus"
import { services, type ServiceContent, type ServiceBadge } from "@/lib/services"

const SERVICE_ICONS = {
  route: Route,
  repeat: Repeat,
  userCheck: UserCheck,
} as const

const BADGE_ICONS = {
  shield: ShieldCheck,
  clock: Clock,
  userCheck: UserCheck,
  rotateCcw: RotateCcw,
  gift: Gift,
} as const

export function ServicesSection() {
  return (
    <section className="bg-[var(--card)] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
            Hizmetlerimiz
          </p>
          <h2
            className="mt-2 text-3xl font-extrabold text-foreground text-balance sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            İhtiyacınıza uygun üç seçenek
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Tek yön bir transferden randevu boyunca refakate kadar; her durum için
            doğru hizmeti seçin.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {services.map((svc) => (
            <ServiceCard key={svc.slug} svc={svc} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ svc }: { svc: ServiceContent }) {
  const Icon = SERVICE_ICONS[svc.icon]
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--navy)] text-white">
          <Icon size={22} />
        </span>
        <span className="font-mono text-xs font-bold text-muted-foreground">{svc.id}</span>
      </div>

      <h3
        className="text-xl font-extrabold text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {svc.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-foreground/80">{svc.tagline}</p>
      <p className="mt-1 text-xs text-muted-foreground">{svc.duration}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {svc.badges.map((badge) => (
          <Badge key={badge.label} badge={badge} />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => openBooking({ service: svc.booking })}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--coral)] px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Başla
          <ArrowRight size={15} />
        </button>
        <Link
          href={`/hizmetler/${svc.slug}`}
          className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-foreground/30"
        >
          Detay
        </Link>
      </div>
    </div>
  )
}

function Badge({ badge }: { badge: ServiceBadge }) {
  const Icon = BADGE_ICONS[badge.icon]
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">
      <Icon size={12} />
      {badge.label}
    </span>
  )
}
