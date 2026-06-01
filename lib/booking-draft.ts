"use client"

import { useCallback, useEffect, useState } from "react"
import type { BookingPet, BookingService, ContactPref, DogSize, PaymentMethod } from "./booking-bus"

export type BookingStep =
  | "pet"
  | "dog-size"
  | "cat-carrier"
  | "service"
  | "outbound-date"
  | "return-date"
  | "pickup"
  | "dropoff"
  | "roundtrip-waiting"
  | "accompanied-waiting"
  | "outbound-time"
  | "return-time"
  | "accompanied-time"
  | "summary"
  | "contact-auth"
  | "payment-preference"
  | "secure-payment"
  | "offline-payment-confirm"
  | "confirmation"

export type OnlinePaymentDraft = {
  cardholder: string
  cardNumber: string
  expiry: string
  cvc: string
}

export interface BookingDraft {
  pet: BookingPet | null
  petSize: DogSize | null
  weightKg: number | null
  hasCarrier: boolean | null
  service: BookingService | null
  outboundDate: string
  date: string
  returnDate: string
  pickupPoint: string
  pickupAddress: string
  pickupNote: string
  dropoffPoint: string
  dropoffAddress: string
  dropoffNote: string
  handoverNote: string
  returnSameAsPickup: boolean
  returnAddress: string
  returnNote: string
  extraWaitingBlocks: number
  accompaniedWaitingBlocks: number
  waitingBlocks: number
  outboundSlot: string | null
  selectedSlot: string | null
  returnSlot: string | null
  phone: string
  customerName: string
  contactPref: ContactPref | null
  paymentPreference: PaymentMethod | null
  paymentMethod: PaymentMethod | null
  onlinePaymentDraft: OnlinePaymentDraft
  couponCode: string
  lastStep: BookingStep
  updatedAt: number
}

export const EMPTY_DRAFT: BookingDraft = {
  pet: null,
  petSize: null,
  weightKg: null,
  hasCarrier: null,
  service: null,
  outboundDate: "",
  date: "",
  returnDate: "",
  pickupPoint: "",
  pickupAddress: "",
  pickupNote: "",
  dropoffPoint: "",
  dropoffAddress: "",
  dropoffNote: "",
  handoverNote: "",
  returnSameAsPickup: true,
  returnAddress: "",
  returnNote: "",
  extraWaitingBlocks: 0,
  accompaniedWaitingBlocks: 0,
  waitingBlocks: 0,
  outboundSlot: null,
  selectedSlot: null,
  returnSlot: null,
  phone: "",
  customerName: "",
  contactPref: null,
  paymentPreference: null,
  paymentMethod: null,
  onlinePaymentDraft: {
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  },
  couponCode: "",
  lastStep: "pet",
  updatedAt: 0,
}

const STORAGE_KEY = "patilioz:booking-draft"
const CHANGE_EVENT = "patilioz:booking-draft-changed"
const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000

function readDraft(): BookingDraft {
  if (typeof window === "undefined") return EMPTY_DRAFT
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_DRAFT
    const parsed = JSON.parse(raw) as Partial<BookingDraft>
    const merged = { ...EMPTY_DRAFT, ...parsed }
    return {
      ...merged,
      // Geriye uyumluluk: eski taslak alanlarını yeni akış alanlarına taşı.
      outboundDate: merged.outboundDate || merged.date,
      pickupPoint: merged.pickupPoint || merged.pickupAddress,
      dropoffPoint: merged.dropoffPoint || merged.dropoffAddress,
      outboundSlot: merged.outboundSlot ?? merged.selectedSlot,
      paymentPreference: merged.paymentPreference ?? merged.paymentMethod,
      accompaniedWaitingBlocks:
        merged.accompaniedWaitingBlocks || (merged.service === "accompanied" ? merged.waitingBlocks : 0),
      onlinePaymentDraft: {
        ...EMPTY_DRAFT.onlinePaymentDraft,
        ...(merged.onlinePaymentDraft ?? {}),
      },
    }
  } catch {
    return EMPTY_DRAFT
  }
}

function writeDraft(next: BookingDraft) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
  } catch {
    // sessiz: quota dolu veya disabled
  }
}

export function clearBookingDraft() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
  } catch {
    // sessiz
  }
}

export function hasResumableDraft(d: BookingDraft): boolean {
  if (!d.updatedAt) return false
  if (Date.now() - d.updatedAt > STALE_AFTER_MS) return false
  return Boolean(
    d.pet ||
    d.service ||
    d.pickupPoint ||
    d.dropoffPoint ||
    d.pickupAddress ||
    d.dropoffAddress ||
    d.outboundDate ||
    d.date,
  )
}

export function useBookingDraft() {
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setDraft(readDraft())
    setHydrated(true)
    const onChange = () => setDraft(readDraft())
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setDraft(readDraft())
    }
    window.addEventListener(CHANGE_EVENT, onChange)
    window.addEventListener("storage", onStorage)
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const update = useCallback((patch: Partial<BookingDraft>) => {
    const current = readDraft()
    // Patch'teki tüm anahtarlar mevcut değerlere eşitse YAZMA — gereksiz
    // re-render ve döngüyü andıran ping-pong effect tetiklenmelerini engeller.
    let changed = false
    for (const k of Object.keys(patch) as (keyof BookingDraft)[]) {
      if (current[k] !== patch[k]) { changed = true; break }
    }
    if (!changed) return
    const next: BookingDraft = {
      ...current,
      ...patch,
      updatedAt: Date.now(),
    }
    writeDraft(next)
    setDraft(next)
  }, [])

  const reset = useCallback(() => {
    clearBookingDraft()
    setDraft(EMPTY_DRAFT)
  }, [])

  return { draft, hydrated, update, reset, resumable: hasResumableDraft(draft) }
}
