"use client"

import { useCallback, useEffect, useState } from "react"
import { BookingWidget } from "./booking-widget"
import {
  onOpenBooking,
  type BookingService,
  type BookingPet,
  type OpenBookingOptions,
} from "@/lib/booking-bus"

const HASH_TO_TRIP: Record<string, BookingService> = {
  "book-standard": "one-way",
  "book-roundtrip": "round-trip",
  "book-accompanied": "accompanied",
}

const HASH_TO_PET: Record<string, BookingPet> = {
  "book-dog": "dog",
  "book-cat": "cat",
  "book-bird": "bird",
  "book-other": "other",
}

export function BookingSheet() {
  const [open, setOpen] = useState(false)
  const [initial, setInitial] = useState<OpenBookingOptions>({})

  const close = useCallback(() => {
    setOpen(false)
    if (typeof window !== "undefined" && window.location.hash.startsWith("#book")) {
      history.replaceState(null, "", window.location.pathname + window.location.search)
    }
  }, [])

  // Bus listener — primary trigger for other components
  useEffect(() => {
    return onOpenBooking((opts) => {
      setInitial(opts ?? {})
      setOpen(true)
    })
  }, [])

  // Hash deep-link support (e.g. /#book-dog, /#book-standard)
  useEffect(() => {
    const applyHash = () => {
      if (typeof window === "undefined") return
      const raw = window.location.hash.replace("#", "")
      if (!raw) return
      if (raw === "book") {
        setInitial({})
        setOpen(true)
        return
      }
      const service = HASH_TO_TRIP[raw]
      const pet = HASH_TO_PET[raw]
      if (service || pet) {
        setInitial({ service, pet })
        setOpen(true)
      }
    }
    applyHash()
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, close])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Rezervasyon oluştur"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Rezervasyonu kapat"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      />
      <div className="relative w-full sm:max-w-md sm:mx-4 max-h-[92dvh] sm:max-h-[88dvh] flex flex-col bg-card sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 duration-300 border border-border/50">
        <BookingWidget initial={initial} onClose={close} />
      </div>
    </div>
  )
}
