"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  CalendarCheck,
  Cat,
  CheckCircle2,
  Clock3,
  Dog,
  MapPin,
  PawPrint,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { openBooking } from "@/lib/booking-bus"
import { useBookingDraft } from "@/lib/booking-draft"

type Slide = {
  eyebrow: string
  title: React.ReactNode
  body: string
  link: { label: string; href?: string; onClick?: () => void }[]
  badge?: string
}

const SLIDES: Slide[] = [
  {
    eyebrow: "Yola çıktık",
    title: (
      <>
        Taşımıoz, <span className="text-[var(--coral)]">eşlik edioz.</span>
      </>
    ),
    body:
      "Patilioz, İstanbul'daki patili dostlarımızın şehir içi ve şehirler arası yolculuklarına eşlik etmek için yola çıktı.",
    link: [{ label: "Hizmetleri inceleyin", href: "#services" }],
  },
  {
    eyebrow: "Tanışma avantajı",
    badge: "Kupon: hosgeldin",
    title: (
      <>
        İlk yolculuğunuzda <span className="text-[var(--coral)]">%10 indirim.</span>
      </>
    ),
    body:
      "Patilioz ailesine hoş geldiniz. Ücretsiz üye olun, ilk rezervasyonunuzda kupon kodunuzu kullanın.",
    link: [
      { label: "Üye olun", href: "/katil" },
      { label: "Hizmetleri incele", href: "/hizmetler" },
    ],
  },
  {
    eyebrow: "Hizmetlerimiz",
    title: (
      <>
        Üç hizmet, <span className="text-[var(--coral)]">üç farklı sorumluluk seviyesi.</span>
      </>
    ),
    body: "Patili dostunuzun yolculuğu için uygun olanı seçin.",
    link: [{ label: "Hizmetleri inceleyin", href: "#services" }],
  },
  {
    eyebrow: "Patilio topluluğu",
    title: (
      <>
        Şehir hayatı ve <span className="text-[var(--coral)]">patili dostlarımız üzerine.</span>
      </>
    ),
    body: "Rehberler, ipuçları ve pratik bilgiler. Hep birlikte daha iyiye.",
    link: [{ label: "Hemen keşfet", href: "#blog" }],
  },
  {
    eyebrow: "Başlamaya hazır mısınız?",
    title: (
      <>
        Dakikalar içinde <span className="text-[var(--coral)]">rezervasyon.</span>
      </>
    ),
    body:
      "Önce patili dostunuzun türünü seçin, uygun hizmeti birlikte belirleyelim.",
    link: [
      { label: "Üye olun", href: "/katil" },
      { label: "Rezervasyon başlat", onClick: () => openBooking() },
    ],
  },
]

const AUTO_MS = 10000
const TWEEN_MS = 800
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export function HeroSection() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const [stopped, setStopped] = useState(false)
  const cycleCountRef = useRef(0)
  const tweenRafRef = useRef<number | null>(null)
  const programmaticScrollRef = useRef(false)

  const scrollToSlide = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const target = index * track.clientWidth
    const start = track.scrollLeft
    const delta = target - start

    if (tweenRafRef.current) cancelAnimationFrame(tweenRafRef.current)
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion || Math.abs(delta) < 1) {
      track.scrollLeft = target
      return
    }

    programmaticScrollRef.current = true
    const startedAt = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / TWEEN_MS)
      track.scrollLeft = start + delta * easeInOutCubic(t)
      if (t < 1) {
        tweenRafRef.current = requestAnimationFrame(tick)
      } else {
        tweenRafRef.current = null
        programmaticScrollRef.current = false
      }
    }
    tweenRafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (stopped) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return
      setActive((prev) => {
        const next = (prev + 1) % SLIDES.length
        scrollToSlide(next)
        cycleCountRef.current += 1
        if (cycleCountRef.current >= SLIDES.length - 1) setStopped(true)
        return next
      })
    }, AUTO_MS)

    return () => window.clearInterval(timer)
  }, [stopped, scrollToSlide])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const onScroll = () => {
      if (programmaticScrollRef.current) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const width = track.clientWidth
        if (!width) return
        const idx = Math.round(track.scrollLeft / width)
        setActive((prev) => (prev === idx ? prev : idx))
      })
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      track.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const goTo = (index: number) => {
    setActive(index)
    scrollToSlide(index)
    setStopped(true)
  }

  return (
    <section aria-label="Patilioz ana ekranı" className="px-3 pb-20 pt-3 sm:px-4 sm:pb-0 lg:px-6 lg:pt-5">
      <div className="mx-auto grid w-full max-w-[1120px] gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[var(--navy)] text-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] via-[var(--navy)]/96 to-[var(--navy)]/92" aria-hidden="true" />
          <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-white/45">Canlı akış</p>
              <p className="truncate text-sm font-bold">İstanbul pet mobilite</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/8 px-2.5 py-1.5 text-xs font-semibold text-white/72">
              <Clock3 size={14} />
              08:00-17:00
            </div>
          </div>

          <div
            ref={trackRef}
            onTouchStart={() => setStopped(true)}
            onMouseDown={() => setStopped(true)}
            className="relative z-10 flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: "none" }}
            aria-roledescription="carousel"
          >
            {SLIDES.map((slide, i) => (
              <article
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${SLIDES.length}`}
                className="flex min-h-[282px] w-full shrink-0 snap-center flex-col justify-between gap-8 px-4 py-5 sm:min-h-[316px] sm:px-6 lg:px-7"
              >
                <div className="max-w-2xl space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[var(--coral)]">
                      <PawPrint size={17} />
                    </span>
                    <p className="text-[11px] font-bold uppercase text-white/58">
                      {slide.eyebrow}
                    </p>
                    {slide.badge && (
                      <span className="rounded-md bg-[var(--coral)]/18 px-2 py-1 font-mono text-[11px] text-white/88">
                        {slide.badge}
                      </span>
                    )}
                  </div>

                  <h1
                    className="max-w-[680px] text-[30px] font-extrabold leading-[1.06] text-balance sm:text-4xl lg:text-[44px]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {slide.title}
                  </h1>

                  <p className="max-w-xl text-[15px] leading-relaxed text-white/68 text-pretty">
                    {slide.body}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {slide.link.map((l, j) =>
                    l.onClick ? (
                      <button
                        key={j}
                        type="button"
                        onClick={l.onClick}
                        className={cn(
                          "inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-bold transition-all active:scale-[0.98]",
                          j === 0
                            ? "bg-[var(--coral)] text-white"
                            : "border border-white/12 bg-white/8 text-white",
                        )}
                      >
                        {l.label}
                        <ArrowRight size={15} />
                      </button>
                    ) : (
                      <a
                        key={j}
                        href={l.href}
                        className={cn(
                          "inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-bold transition-all active:scale-[0.98]",
                          j === 0
                            ? "bg-[var(--coral)] text-white"
                            : "border border-white/12 bg-white/8 text-white",
                        )}
                      >
                        {l.label}
                        <ArrowRight size={15} />
                      </a>
                    ),
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Slayt ${i + 1}'e geç`}
                  aria-current={active === i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    active === i
                      ? "w-7 bg-[var(--coral)]"
                      : "w-1.5 bg-white/28 hover:bg-white/50",
                  )}
                />
              ))}
            </div>
            <div className="hidden items-center gap-2 text-xs font-semibold text-white/62 sm:flex">
              <ShieldCheck size={14} className="text-[var(--coral)]" />
              Sigortalı yolculuk
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-foreground/10 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                Hızlı rezervasyon
              </p>
              <h2
                className="mt-1 text-xl font-extrabold leading-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Yolculuğu birkaç adımda başlatın
              </h2>
            </div>
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--coral)]/12 text-[var(--coral)]">
              <CalendarCheck size={20} />
            </span>
          </div>

          <HeroBookingCta />

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => openBooking({ pet: "dog" })}
              className="flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3 py-3 text-left text-sm font-bold text-foreground transition-colors hover:bg-foreground/[0.055]"
            >
              Köpek
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[var(--coral)] shadow-sm">
                <Dog size={16} />
              </span>
            </button>
            <button
              type="button"
              onClick={() => openBooking({ pet: "cat" })}
              className="flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3 py-3 text-left text-sm font-bold text-foreground transition-colors hover:bg-foreground/[0.055]"
            >
              Kedi
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[var(--coral)] shadow-sm">
                <Cat size={16} />
              </span>
            </button>
          </div>

          <div className="mt-4 hidden space-y-2 border-t border-foreground/10 pt-4 sm:block">
            {[
              ["Adres", "Kapı zili ve daire detayı alınır", MapPin],
              ["Plan", "Zaman dilimi onayla netleşir", Clock3],
              ["Takip", "Yolculuk boyunca bilgilendirme", CheckCircle2],
            ].map(([title, desc, Icon]) => (
              <div key={title as string} className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--coral)]/12 text-[var(--coral)]">
                  <Icon size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{title as string}</p>
                  <p className="truncate text-xs text-muted-foreground">{desc as string}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="mx-auto mt-3 hidden w-full max-w-[1120px] gap-3 sm:grid sm:grid-cols-3">
        {[
          ["Sigortalı", "Her yolculuk kayıt ve güvence altında.", ShieldCheck],
          ["Canlı bildirim", "Plan değişirse önce onay alınır.", Sparkles],
          ["Net teslim", "Alış ve varış ayrıntıları baştan tamamlanır.", CheckCircle2],
        ].map(([title, desc, Icon]) => (
          <div
            key={title as string}
            className="flex items-center gap-3 rounded-lg border border-foreground/10 bg-white px-3.5 py-3 shadow-sm"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--coral)] text-white">
              <Icon size={17} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-foreground">{title as string}</p>
              <p className="truncate text-xs text-muted-foreground">{desc as string}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function HeroBookingCta() {
  const { resumable, hydrated, reset } = useBookingDraft()
  const showResume = hydrated && resumable

  if (showResume) {
    return (
      <div className="grid gap-2">
        <button
          type="button"
          onClick={() => openBooking({ resume: true })}
          className="inline-flex h-12 items-center justify-between gap-3 rounded-lg bg-[var(--coral)] px-4 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <span className="flex items-center gap-2.5">
            <RotateCcw size={16} />
            Rezervasyonunu sürdür
          </span>
          <ArrowRight size={18} />
        </button>
        <button
          type="button"
          onClick={() => {
            reset()
            openBooking()
          }}
          className="h-10 rounded-lg border border-foreground/10 bg-white text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Mevcut taslağı sil ve yeniden başla"
        >
          Yeniden başla
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => openBooking()}
      className="inline-flex h-12 w-full items-center justify-between gap-3 rounded-lg bg-[var(--coral)] px-4 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
    >
      <span>Rezervasyona başla</span>
      <ArrowRight size={18} />
    </button>
  )
}
