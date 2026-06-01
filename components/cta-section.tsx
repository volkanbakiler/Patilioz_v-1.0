"use client"

import { ArrowRight, CalendarCheck, Phone } from "lucide-react"
import { openBooking } from "@/lib/booking-bus"

export function CtaSection() {
  return (
    <section id="campaigns" className="scroll-mt-20 px-3 py-4 sm:px-4 lg:px-6">
      <div className="relative mx-auto grid w-full max-w-[1120px] gap-4 overflow-hidden rounded-lg border border-white/10 bg-[var(--navy)] p-4 text-white shadow-sm sm:p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-bold uppercase text-[var(--coral)]">
            Hemen başlayın
          </p>
          <h2
            className="mt-1 text-2xl font-extrabold leading-tight text-balance sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Patili dostunuzun <span className="text-[var(--coral)]">yolculuğunu planlayın</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/58">
            Rezervasyonu tamamlayın. Belirtilen saatte yanınızda olacağız.
          </p>
        </div>
        <div className="relative z-10 flex flex-col gap-2 sm:flex-row md:justify-end">
          <button
            type="button"
            onClick={() => openBooking()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--coral)] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            <CalendarCheck size={16} />
            Rezervasyon Yap
            <ArrowRight size={15} />
          </button>
          <a
            href="tel:+90XXXXXXXXXX"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/8 px-4 text-sm font-bold text-white/82 transition-all hover:border-white/35 hover:text-white"
          >
            <Phone size={16} />
            Bizi Arayın
          </a>
        </div>
      </div>
    </section>
  )
}
