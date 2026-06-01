"use client"

import { useCallback, useEffect, useState } from "react"
import type { BookingPet, BookingService, DogSize, PaymentMethod } from "./booking-bus"

/**
 * ÖN GÖRÜNÜM (MOCK) auth katmanı.
 *
 * Gerçek kimlik doğrulama YOKTUR — bu yalnızca arayüzün "giriş yapmış / yapmamış"
 * durumlarını ve hesap verisini tasarlayabilmek için localStorage'da tutulan bir
 * taklittir. İleride Firebase (telefon/SMS) ile değiştirilecek.
 */

export type SavedAddress = {
  id: string
  label: string // "Ev", "İş", "Veteriner" vb.
  line: string
  building?: string
  apartment?: string
}

export type PetGender = "male" | "female" | "unknown"

export type PetType = "dog" | "cat" | "other"

export type Vaccination = {
  id: string
  /** "Kuduz", "Karma (FVRCP)", "Parazit" vb. */
  name: string
  /** Yapıldığı tarih (ISO yyyy-mm-dd). */
  date: string
  /** Bir sonraki doz / tekrar tarihi (opsiyonel, ISO). */
  nextDate?: string
}

export type SavedPet = {
  id: string
  name: string
  type: PetType
  /** type === "other" için serbest tür açıklaması (örn. "Tavşan", "Muhabbet kuşu"). */
  species?: string
  breed?: string
  gender?: PetGender
  /** Doğum tarihi (ISO yyyy-mm-dd) — yaş bundan hesaplanır. */
  birthDate?: string
  weightKg?: number
  /** Mikroçip numarası (15 haneli, opsiyonel). */
  microchip?: string
  /** Profil fotoğrafı (ön görünüm: base64 data URL). */
  photo?: string
  /** Alerji, kronik durum, özel ihtiyaç notları. */
  notes?: string
  vaccinations?: Vaccination[]
}

export type AuthProvider = "phone" | "google" | "apple" | "facebook" | "instagram"

export type NotificationPrefs = {
  sms: boolean
  email: boolean
  campaigns: boolean
}

export type SavedReservation = {
  id: string
  code: string
  status: "received" | "planned" | "completed" | "cancelled"
  createdAt: string
  customerName: string
  phone: string
  pet: BookingPet | null
  dogSize: DogSize | null
  weightKg: number | null
  hasCarrier: boolean | null
  service: BookingService | null
  pickupPoint: string
  dropoffPoint: string
  outboundDate: string
  returnDate: string
  outboundSlot: string | null
  returnSlot: string | null
  extraWaitingBlocks: number
  accompaniedWaitingBlocks: number
  paymentMethod: PaymentMethod | null
  amount: number
  couponCode?: string
  discount: number
}

export type AuthUser = {
  /** Hangi yöntemle giriş yapıldı (Firebase'e geçişte sağlayıcı eşlemesi için). */
  provider: AuthProvider
  phone: string
  name: string
  email?: string
  addresses: SavedAddress[]
  pets: SavedPet[]
  reservations: SavedReservation[]
  prefs: NotificationPrefs
}

const DEFAULT_PREFS: NotificationPrefs = {
  sms: true,
  email: false,
  campaigns: true,
}

/** İsimden evrensel "initials" üretir (avatar için). En fazla 2 harf. */
export function getInitials(name?: string): string {
  if (!name) return "P"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "P"
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Pet türü için emoji. "other" için species'e göre kaba eşleme, yoksa pati. */
export function petEmoji(pet: { type: PetType; species?: string }): string {
  if (pet.type === "dog") return "🐕"
  if (pet.type === "cat") return "🐈"
  const s = (pet.species ?? "").toLocaleLowerCase("tr")
  if (/kuş|muhabbet|papağan|kanarya|bird/.test(s)) return "🐦"
  if (/tavşan|rabbit/.test(s)) return "🐇"
  if (/balık|fish|akvaryum/.test(s)) return "🐟"
  if (/hamster|kemirgen/.test(s)) return "🐹"
  if (/kaplumbağa|turtle/.test(s)) return "🐢"
  if (/at|horse/.test(s)) return "🐴"
  return "🐾"
}

/** Pet türü için okunur etiket. "other"da species varsa onu döndürür. */
export function petTypeLabel(pet: { type: PetType; species?: string }): string {
  if (pet.type === "dog") return "Köpek"
  if (pet.type === "cat") return "Kedi"
  return pet.species?.trim() || "Diğer"
}

export type VaccinationState = {
  tone: "overdue" | "soon" | "ok" | "none"
  label: string
}

/** Pet'in aşı kayıtlarından genel durumu çıkarır (liste rozeti için). */
export function vaccinationStatus(pet: SavedPet): VaccinationState {
  const vacs = pet.vaccinations ?? []
  if (vacs.length === 0) return { tone: "none", label: "Aşı kaydı yok" }
  const now = Date.now()
  const day = 1000 * 60 * 60 * 24
  let overdue = false
  let soon = false
  for (const v of vacs) {
    if (!v.nextDate) continue
    const t = new Date(v.nextDate).getTime()
    if (Number.isNaN(t)) continue
    const days = Math.ceil((t - now) / day)
    if (days < 0) overdue = true
    else if (days <= 30) soon = true
  }
  if (overdue) return { tone: "overdue", label: "Aşı gecikti" }
  if (soon) return { tone: "soon", label: "Aşı yaklaşıyor" }
  return { tone: "ok", label: "Aşı güncel" }
}

/**
 * Yaş (yıl) → yaklaşık doğum tarihi (ISO). Böylece saklanan tarihten
 * zamanla güncel yaş otomatik hesaplanır. Bugünden `years` yıl öncesi alınır.
 */
export function ageYearsToBirthDate(years: number): string | undefined {
  if (!Number.isFinite(years) || years < 0 || years > 40) return undefined
  const d = new Date()
  d.setFullYear(d.getFullYear() - Math.floor(years))
  return d.toISOString().slice(0, 10)
}

/** Doğum tarihinden tam yaş (yıl, aşağı yuvarlanmış) döndürür. Form için. */
export function birthDateToAgeYears(birthDate?: string): number | null {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years -= 1
  return years < 0 ? null : years
}

/** Doğum tarihinden (ISO) okunur yaş metni üretir: "2 yaş 3 ay", "5 aylık". */
export function formatPetAge(birthDate?: string): string | null {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (now.getDate() < birth.getDate()) months -= 1
  if (months < 0) return null
  if (months < 12) return `${months} aylık`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem === 0 ? `${years} yaş` : `${years} yaş ${rem} ay`
}

/**
 * Sosyal sağlayıcı meta verisi.
 *
 * Firebase notu: Google / Apple / Facebook, Firebase Authentication'da yerleşik
 * OAuth sağlayıcılarıdır. Instagram YERLEŞİK DEĞİLDİR — genelde Facebook Login
 * üzerinden ya da custom token (Instagram Basic Display API) ile bağlanır.
 * Buradaki `firebaseId`, ileride `new OAuthProvider(firebaseId)` / ilgili
 * provider sınıfıyla eşlenmek üzere not düşülmüştür.
 */
export const PROVIDERS: {
  id: Exclude<AuthProvider, "phone">
  label: string
  firebaseId: string
  note?: string
}[] = [
  { id: "google", label: "Google", firebaseId: "google.com" },
  { id: "apple", label: "Apple", firebaseId: "apple.com" },
  { id: "facebook", label: "Facebook", firebaseId: "facebook.com" },
  {
    id: "instagram",
    label: "Instagram",
    firebaseId: "facebook.com",
    note: "Firebase'de yerleşik değil; Facebook Login veya custom token ile bağlanır.",
  },
]

const KEY = "patilioz:auth-mock"
const EVENT = "patilioz:auth-changed"

function read(): AuthUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AuthUser>
    // Eski kayıtlarda eksik alanları güvenle tamamla.
    return {
      provider: parsed.provider ?? "phone",
      phone: parsed.phone ?? "",
      name: parsed.name ?? "Patilio Üyesi",
      email: parsed.email,
      addresses: parsed.addresses ?? [],
      pets: parsed.pets ?? [],
      reservations: parsed.reservations ?? [],
      prefs: { ...DEFAULT_PREFS, ...(parsed.prefs ?? {}) },
    }
  } catch {
    return null
  }
}

function write(user: AuthUser | null) {
  try {
    if (user) window.localStorage.setItem(KEY, JSON.stringify(user))
    else window.localStorage.removeItem(KEY)
    window.dispatchEvent(new CustomEvent(EVENT))
  } catch {
    /* sessiz */
  }
}

/** Yeni "giriş yapmış" kullanıcı için örnek başlangıç verisi (ön görünüm). */
function seedUser(opts: {
  provider: AuthProvider
  phone?: string
  name?: string
  email?: string
}): AuthUser {
  return {
    provider: opts.provider,
    phone: opts.phone ?? "",
    name: opts.name ?? "Patilio Üyesi",
    email: opts.email,
    // Yeni üyeler boş başlar — kullanıcı kendi pet/adresini ekler.
    addresses: [],
    pets: [],
    reservations: [],
    prefs: { ...DEFAULT_PREFS },
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setUser(read())
    setHydrated(true)
    const sync = () => setUser(read())
    window.addEventListener(EVENT, sync)
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) sync()
    }
    window.addEventListener("storage", onStorage)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  /** Mock telefon girişi — numarayla "üye olur". */
  const signIn = useCallback((phone: string) => {
    const existing = read()
    const next = existing
      ? { ...existing, provider: "phone" as AuthProvider, phone }
      : seedUser({ provider: "phone", phone })
    write(next)
    return next
  }, [])

  /**
   * Mock sosyal giriş. Firebase'e geçişte burası
   * signInWithPopup(auth, provider) ile değiştirilecek; dönen kullanıcı
   * profili (displayName/email) seedUser yerine kullanılacak.
   */
  const signInWithProvider = useCallback((provider: Exclude<AuthProvider, "phone">) => {
    const existing = read()
    const meta = PROVIDERS.find((p) => p.id === provider)
    const next = existing
      ? { ...existing, provider }
      : seedUser({
          provider,
          name: `${meta?.label ?? "Patilio"} Üyesi`,
        })
    write(next)
    return next
  }, [])

  const signOut = useCallback(() => write(null), [])

  const update = useCallback((patch: Partial<AuthUser>) => {
    const cur = read()
    if (!cur) return
    write({ ...cur, ...patch })
  }, [])

  return {
    user,
    hydrated,
    isAuthed: hydrated && Boolean(user),
    signIn,
    signInWithProvider,
    signOut,
    update,
  }
}
