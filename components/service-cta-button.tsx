"use client"

import { ArrowRight } from "lucide-react"
import { openBooking, type BookingService } from "@/lib/booking-bus"

export function ServiceCtaButton({
  service,
  label,
}: {
  service: BookingService
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => openBooking({ service })}
      className="inline-flex items-center justify-between gap-3 rounded-full bg-[var(--coral)] text-white px-6 py-4 font-bold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[var(--coral)]/25 min-w-[260px]"
    >
      <span>{label}</span>
      <ArrowRight size={18} />
    </button>
  )
}
