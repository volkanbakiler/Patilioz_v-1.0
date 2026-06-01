"use client"

export type BookingPet = "dog" | "cat" | "bird" | "other"
export type DogSize = "small" | "medium" | "large"
export type BookingService = "one-way" | "round-trip" | "accompanied"
export type PaymentMethod = "cash" | "card-on-delivery" | "card-online"
export type ContactPref = "sms" | "whatsapp" | "call"

export interface OpenBookingOptions {
  pet?: BookingPet
  service?: BookingService
  /** true ise mevcut draft'tan devam et (rezervasyon yarım kaldığı yerden). */
  resume?: boolean
}

const EVENT_NAME = "patilioz:open-booking"

export function openBooking(opts: OpenBookingOptions = {}) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: opts }))
}

export function onOpenBooking(handler: (opts: OpenBookingOptions) => void) {
  if (typeof window === "undefined") return () => {}
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<OpenBookingOptions>).detail ?? {}
    handler(detail)
  }
  window.addEventListener(EVENT_NAME, listener)
  return () => window.removeEventListener(EVENT_NAME, listener)
}
