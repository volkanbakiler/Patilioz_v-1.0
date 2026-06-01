"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck, MapPin, Star } from "lucide-react"
import { openBooking } from "@/lib/booking-bus"
import { MediaFrame } from "@/components/media-frame"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-20">
        {/* Metin */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--coral)]/20 bg-[var(--coral)]/[0.06] px-3 py-1 text-xs font-bold text-[var(--coral)]">
            <MapPin size={13} /> İstanbul&apos;da hizmet veriyoruz
          </span>
          <h1
            className="mt-4 text-4xl font-extrabold leading-tight text-foreground text-balance sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Patili dostunuz için{" "}
            <span className="text-[var(--coral)]">güvenli yolculuk</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
            Klinik transferi, bakım ziyareti ve günlük taşımalarda; sigortalı,
            takip edilebilir ve sakin bir pet taksi deneyimi. Stresi siz değil,
            biz üstlenelim.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--coral)] px-7 py-4 text-[15px] font-bold text-white shadow-lg shadow-[var(--coral)]/25 transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Rezervasyon oluştur
              <ArrowRight size={18} />
            </button>
            <Link
              href="/hizmetler"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 bg-white px-7 py-4 text-[15px] font-bold text-foreground transition-colors hover:border-foreground/30"
            >
              Hizmetleri keşfet
            </Link>
          </div>

          {/* Güven göstergeleri */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[var(--coral)]" /> Sigortalı taşıma
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star size={16} className="text-[var(--coral)]" /> %10 hoş geldin indirimi
            </span>
          </div>
        </div>

        {/* Görsel */}
        <div className="relative">
          <MediaFrame
            src="/images/hero-pet.jpg"
            alt="Araçta güvenle taşınan patili dost"
            variant="route"
            priority
            className="aspect-[4/3] w-full rounded-[28px] shadow-[0_24px_60px_rgba(20,31,53,0.18)]"
          />
        </div>
      </div>
    </section>
  )
}
