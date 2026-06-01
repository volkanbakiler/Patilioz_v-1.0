"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { openBooking } from "@/lib/booking-bus"

export function CtaSection() {
  return (
    <section className="bg-background px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-[var(--navy)] px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2
          className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Patili dostunuzun yolculuğu için hazırız
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70 text-pretty">
          Birkaç adımda rezervasyonunuzu oluşturun. İlk yolculuğunuzda %10 hoş
          geldin indirimi sizi bekliyor.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => openBooking()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--coral)] px-7 py-4 text-[15px] font-bold text-white shadow-lg shadow-black/20 transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Rezervasyon oluştur
            <ArrowRight size={18} />
          </button>
          <Link
            href="/hizmetler"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
          >
            Hizmetleri incele
          </Link>
        </div>
      </div>
    </section>
  )
}
