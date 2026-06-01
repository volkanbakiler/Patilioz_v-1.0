"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Route,
  Repeat,
  UserCheck,
  Shield,
  Clock,
  RotateCcw,
  Gift,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { openBooking } from "@/lib/booking-bus"
import { services, type ServiceBadge, type ServiceContent } from "@/lib/services"

const SERVICE_ICONS: Record<ServiceContent["icon"], LucideIcon> = {
  route: Route,
  repeat: Repeat,
  userCheck: UserCheck,
}

const BADGE_ICONS: Record<ServiceBadge["icon"], LucideIcon> = {
  shield: Shield,
  clock: Clock,
  userCheck: UserCheck,
  rotateCcw: RotateCcw,
  gift: Gift,
}

export function ServicesSection() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const cards = track.querySelectorAll<HTMLElement>("[data-snap-card]")
        if (!cards.length) return
        const trackRect = track.getBoundingClientRect()
        const center = trackRect.left + trackRect.width / 2
        let best = 0
        let bestDist = Infinity
        cards.forEach((card, i) => {
          const r = card.getBoundingClientRect()
          const cardCenter = r.left + r.width / 2
          const d = Math.abs(cardCenter - center)
          if (d < bestDist) {
            bestDist = d
            best = i
          }
        })
        setActive((prev) => (prev === best ? prev : best))
      })
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      track.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let played = false
    const playHint = () => {
      if (played) return
      played = true
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reduceMotion) return
      const start = track.scrollLeft
      track.scrollTo({ left: start + 28, behavior: "smooth" })
      window.setTimeout(() => {
        track.scrollTo({ left: start, behavior: "smooth" })
      }, 380)
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.setTimeout(playHint, 450)
            io.disconnect()
          }
        })
      },
      { threshold: 0.35 },
    )
    io.observe(track)
    return () => io.disconnect()
  }, [])

  const scrollToCard = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelectorAll<HTMLElement>("[data-snap-card]")[index]
    if (!card) return
    const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
    track.scrollTo({ left, behavior: "smooth" })
  }, [])

  return (
    <section id="services" className="scroll-mt-20 px-3 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="mb-3 rounded-lg border border-foreground/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-1.5">
              <p className="text-[10px] font-bold uppercase text-[var(--coral)]">
                Hizmetlerimiz
              </p>
              <h2
                className="text-2xl font-extrabold leading-tight text-foreground text-balance sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Patili dostlarımızla{" "}
                <span className="text-[var(--coral)]">birlikte yoldayız.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Hizmeti seçin, rezervasyonu birlikte tamamlayalım. Detayları
              görmek için kartın altındaki bağlantıyı kullanın.
            </p>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible"
          style={{
            scrollbarWidth: "none",
            scrollPaddingLeft: "0.75rem",
            scrollPaddingRight: "0.75rem",
          }}
          aria-roledescription="carousel"
          aria-label="Hizmet kartları"
        >
          {services.map((svc, i) => (
            <ActionCard
              key={svc.slug}
              card={svc}
              isActive={active === i}
              position={i + 1}
              total={services.length}
              onSelect={() => openBooking({ service: svc.booking })}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 lg:hidden">
          {services.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={`${i + 1}. hizmete geç: ${s.name}`}
              aria-current={active === i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                active === i
                  ? "w-7 bg-[var(--coral)]"
                  : "w-1.5 bg-foreground/20 hover:bg-foreground/40",
              )}
            />
          ))}
        </div>

        <p className="mx-auto mt-4 max-w-xl px-2 text-center text-xs leading-relaxed text-muted-foreground">
          Tıbbi müdahale yapılmaz. Tedavi ve tıbbi kararlar veteriner ve aile sorumluluğundadır.
        </p>
      </div>
    </section>
  )
}

function ActionCard({
  card,
  isActive,
  position,
  total,
  onSelect,
}: {
  card: ServiceContent
  isActive: boolean
  position: number
  total: number
  onSelect: () => void
}) {
  const Icon = SERVICE_ICONS[card.icon]
  return (
    // Kart artık iki "tıklanabilir bölge" içeriyor: üstteki büyük alan rezervasyon
    // başlatır, alt-sol "Detaylar" linki SEO sayfasına gider. Bu yüzden kart
    // kendisi <button> değil <article> — iki link iç içe button olamayacağı için.
    <article
      data-snap-card
      aria-roledescription="slide"
      aria-label={`${position} / ${total}: ${card.name}`}
      className={cn(
        "snap-center shrink-0 flex flex-col text-left",
        "w-[82%] sm:w-[360px] lg:w-auto lg:shrink",
        "relative overflow-hidden rounded-lg border bg-white",
        "transition-all duration-300",
        // Mobil/tablet carousel'de ortadaki aktif kart vurgulanır; masaüstü grid'de
        // tüm kartlar eşit görünür (simetri), vurgu yalnızca hover'da.
        isActive
          ? "border-[var(--coral)]/50 shadow-md lg:border-foreground/10 lg:shadow-sm"
          : "border-foreground/10 shadow-sm",
        "lg:hover:border-[var(--coral)]/30 lg:hover:shadow-md",
      )}
    >
      <div className="h-1.5 bg-[var(--coral)]" aria-hidden="true" />
      {/* Üst — rezervasyon başlatıcı tıklanabilir gövde */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={`${card.name} ile rezervasyon başlat`}
        className="flex-1 cursor-pointer p-5 pb-4 text-left transition-transform active:scale-[0.99] sm:p-6 sm:pb-4"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-xs font-mono text-muted-foreground/60 tracking-wider"
              aria-hidden="true"
            >
              {card.id}
            </span>
            {/* Kampanya pill — işlevsel meta'lardan ayrı kategori (köşe rozeti) */}
            {(() => {
              const promo = card.badges.find((b) => b.icon === "gift")
              if (!promo) return null
              const PromoIcon = BADGE_ICONS[promo.icon]
              return (
                <span className="inline-flex items-center gap-1 rounded-md bg-[var(--coral)]/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[var(--coral)]">
                  <PromoIcon size={10} strokeWidth={2.25} />
                  {promo.label}
                </span>
              )
            })()}
          </div>
          <div
            className={cn(
              "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-300",
              isActive
                ? "bg-[var(--coral)] scale-105"
                : "bg-[var(--navy)] group-hover:bg-[var(--coral)]",
            )}
          >
            <Icon size={22} className="text-white" strokeWidth={1.75} />
          </div>
        </div>

        <h3
          className="mb-2 text-lg font-extrabold leading-snug text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {card.name}
        </h3>

        <p className="mb-1 text-sm font-semibold text-foreground/80">
          {card.tagline}
        </p>
        <p className="mb-3.5 font-mono text-xs text-muted-foreground">
          {card.duration}
        </p>

        {/* Inline meta strip — işlevsel özellikler, ayraç noktayla */}
        <ul
          className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5"
          aria-label="Hizmet özellikleri"
        >
          {card.badges
            .filter((b) => b.icon !== "gift")
            .map((badge, idx, arr) => {
              const BadgeIcon = BADGE_ICONS[badge.icon]
              return (
                <li key={idx} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground/70">
                    <BadgeIcon
                      size={13}
                      strokeWidth={1.75}
                      className="text-[var(--coral)]"
                    />
                    <span className="font-medium">{badge.label}</span>
                  </span>
                  {idx < arr.length - 1 && (
                    <span
                      className="w-0.5 h-0.5 rounded-full bg-foreground/25"
                      aria-hidden="true"
                    />
                  )}
                </li>
              )
            })}
        </ul>

        <div className="mb-4 h-px bg-border" aria-hidden="true" />

        {/* Kimler için uygun — somut senaryolar, kanca işlevi */}
        <p className="mb-2.5 text-[10px] font-bold uppercase text-foreground/58">
          Kimler için uygun
        </p>
        <ul className="space-y-1.5">
          {card.suitableFor.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-2.5 text-sm text-foreground/75 leading-relaxed"
            >
              <span
                className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--coral)]"
                aria-hidden="true"
              />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      </button>

      {/* Alt-sol — SEO detay sayfasına ikincil link */}
      <div className="px-5 pb-4 sm:px-6">
        <Link
          href={`/hizmetler/${card.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-[var(--coral)] transition-colors"
        >
          Detayları gör
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Alt — birincil davet şeridi (kartın kendisi gibi rezervasyon başlatır) */}
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left sm:px-6",
          "transition-colors duration-300 active:scale-[0.99]",
          isActive
            ? "bg-[var(--coral)] text-white"
            : "bg-[var(--navy)] text-white hover:bg-[var(--coral)]",
        )}
      >
        <span className="text-sm font-bold">Bu hizmetle başla</span>
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15"
          aria-hidden="true"
        >
          <ArrowRight size={16} />
        </span>
      </button>
    </article>
  )
}
