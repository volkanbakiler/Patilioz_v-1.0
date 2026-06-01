"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Apple,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  LocateFixed,
  LockKeyhole,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Tag,
  Wallet,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { BookingPet, BookingService, DogSize, OpenBookingOptions, PaymentMethod } from "@/lib/booking-bus"
import { useAuth, type SavedReservation } from "@/lib/auth-mock"
import { useBookingDraft, type BookingStep as DraftStep, type OnlinePaymentDraft } from "@/lib/booking-draft"

type Step =
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
  | "confirmation"

type Phase = "dost" | "hizmet" | "rota" | "zaman" | "onay"
type StepMotion = "forward" | "back" | "replace"

const PHASES: { id: Phase; label: string }[] = [
  { id: "dost", label: "Dost" },
  { id: "hizmet", label: "Hizmet" },
  { id: "rota", label: "Rota" },
  { id: "zaman", label: "Zaman" },
  { id: "onay", label: "Onay" },
]

const STEP_PHASE: Record<Step, Phase> = {
  pet: "dost",
  "dog-size": "dost",
  "cat-carrier": "dost",
  service: "hizmet",
  "outbound-date": "rota",
  "return-date": "rota",
  pickup: "rota",
  dropoff: "rota",
  "roundtrip-waiting": "rota",
  "accompanied-waiting": "rota",
  "outbound-time": "zaman",
  "return-time": "zaman",
  "accompanied-time": "zaman",
  summary: "onay",
  "contact-auth": "onay",
  "payment-preference": "onay",
  "secure-payment": "onay",
  confirmation: "onay",
}

const TR_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
]
const TR_DAYS = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"]

const FREE_WAIT_MIN = 5
const WAITING_BLOCK_MIN = 15
const CARRIER_FEE = 500
const LARGE_DOG_FEE = 50
const WAITING_BLOCK_FEE = 60
const ACCOMPANIED_BLOCK_FEE = 75
const MOCK_SMS_CODE = "000000"

const BASE_PRICES: Record<BookingService, number> = {
  "one-way": 250,
  "round-trip": 420,
  accompanied: 340,
}

const PETS: {
  type: BookingPet
  label: string
  desc: string
  image: string
  gradient: string
}[] = [
  {
    type: "cat",
    label: "Kedi",
    desc: "Kutulu ve sakin rota",
    image: "/images/booking/pet-cat.jpg",
    gradient: "from-orange-100 via-amber-50 to-stone-100",
  },
  {
    type: "dog",
    label: "Köpek",
    desc: "Boyuna göre plan",
    image: "/images/booking/pet-dog.jpg",
    gradient: "from-sky-100 via-blue-50 to-slate-100",
  },
  {
    type: "bird",
    label: "Kuş",
    desc: "Kafesli güvenli taşıma",
    image: "/images/booking/pet-bird.jpg",
    gradient: "from-emerald-100 via-teal-50 to-cyan-100",
  },
  {
    type: "other",
    label: "Diğer",
    desc: "Tavşan, hamster ve fazlası",
    image: "/images/booking/pet-other.jpg",
    gradient: "from-rose-100 via-stone-50 to-slate-100",
  },
]

const DOG_SIZES: {
  value: DogSize
  label: string
  kg: string
  desc: string
  image: string
  gradient: string
}[] = [
  {
    value: "small",
    label: "Küçük",
    kg: "≤ 10 kg",
    desc: "Kucak ve küçük ırklar",
    image: "/images/booking/dog-small.jpg",
    gradient: "from-amber-100 via-orange-50 to-stone-100",
  },
  {
    value: "medium",
    label: "Orta",
    kg: "10-25 kg",
    desc: "Beagle, Cocker ve benzeri",
    image: "/images/booking/dog-medium.jpg",
    gradient: "from-sky-100 via-cyan-50 to-slate-100",
  },
  {
    value: "large",
    label: "Büyük",
    kg: "25+ kg",
    desc: "Golden, Labrador ve benzeri",
    image: "/images/booking/dog-large.jpg",
    gradient: "from-indigo-100 via-slate-50 to-blue-100",
  },
]

const CARRIER_OPTIONS = [
  {
    value: true,
    label: "Kendi kutum var",
    desc: "Araç içinde sabitliyoruz",
    image: "/images/booking/carrier-own.jpg",
    gradient: "from-emerald-100 via-green-50 to-stone-100",
  },
  {
    value: false,
    label: "Patilioz kutusu satın al",
    desc: `+₺${CARRIER_FEE} · Yolculuğa hazır kutu`,
    image: "/images/booking/carrier-rental.jpg",
    gradient: "from-coral/20 via-rose-50 to-stone-100",
  },
]

const SERVICES: {
  value: BookingService
  label: string
  desc: string
  meta: string
}[] = [
  { value: "one-way", label: "Tek Yön", desc: "Bir noktadan diğerine", meta: "Tek teslim, tek varış" },
  { value: "round-trip", label: "Gidiş-Dönüş", desc: "Gidiş ve dönüş ayrı planlanır", meta: "Tarih ve saatler ayrı seçilir" },
  { value: "accompanied", label: "Refakatçili", desc: "Randevu boyunca yanında", meta: "Ek refakat bloklarıyla" },
]

const ADDRESS_SUGGESTIONS = [
  { name: "Zarif Sokağı No:14", addr: "Merkez Mahallesi, Kadıköy", kind: "Sık kullanılan" },
  { name: "Kadıköy Veteriner Polikliniği", addr: "Moda Cad. No:12, Kadıköy", kind: "Veteriner" },
  { name: "Bahariye Pet Kuaförü", addr: "Bahariye Cad. No:5, Kadıköy", kind: "Bakım" },
  { name: "Şişli Evcil Hayvan Kliniği", addr: "Halaskargazi Cad. No:90, Şişli", kind: "Veteriner" },
  { name: "Beşiktaş Pet Otel", addr: "Barbaros Bulvarı No:45, Beşiktaş", kind: "Otel" },
]

const TIME_GROUPS = [
  { label: "Sabah", slots: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"] },
  { label: "Öğleden sonra", slots: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"] },
]

const FULL_SLOTS = new Set(["08:00", "14:30"])

const PAYMENT_OPTIONS: {
  value: PaymentMethod
  label: string
  desc: string
  Icon: typeof CreditCard
}[] = [
  { value: "card-online", label: "Online ödeme", desc: "Güvenli ödeme adımında tamamlanır", Icon: CreditCard },
  { value: "card-on-delivery", label: "Araçta kart", desc: "Teslim sırasında kartla", Icon: Wallet },
  { value: "cash", label: "Nakit", desc: "Teslim sırasında nakit", Icon: Wallet },
]

const COUPON_OPTIONS = [
  { code: "HOSGELDIN10", desc: "%10 indirim", kind: "percent", value: 10 },
  { code: "ROTA75", desc: "₺75 indirim", kind: "fixed", value: 75, minTotal: 400 },
  { code: "KUTU50", desc: "₺50 kutu indirimi", kind: "fixed", value: 50, requiresCarrier: true },
] as const

type CouponOption = (typeof COUPON_OPTIONS)[number]

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function parseISO(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(iso: string, days: number) {
  const d = iso ? parseISO(iso) : startOfDay(new Date())
  d.setDate(d.getDate() + days)
  return toISO(d.getFullYear(), d.getMonth(), d.getDate())
}

function formatDateShort(iso: string) {
  if (!iso) return "Seçilmedi"
  return parseISO(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })
}

function formatDateLong(iso: string) {
  if (!iso) return "Seçilmedi"
  return parseISO(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
}

function isDateFull(iso: string) {
  const day = parseISO(iso).getDate()
  return day === 8 || day === 15 || day === 22
}

function getFlowSteps(input: {
  pet: BookingPet | null
  service: BookingService | null
  contactComplete: boolean
  paymentPreference: PaymentMethod | null
}) {
  const steps: Step[] = ["pet"]

  if (input.pet === "dog") steps.push("dog-size")
  if (input.pet === "cat") steps.push("cat-carrier")

  steps.push("service")

  if (!input.service) return steps

  steps.push("outbound-date")
  if (input.service === "round-trip") steps.push("return-date")

  steps.push("pickup", "dropoff")

  if (input.service === "round-trip") steps.push("roundtrip-waiting")
  if (input.service === "accompanied") steps.push("accompanied-waiting")

  if (input.service === "round-trip") {
    steps.push("outbound-time", "return-time")
  } else if (input.service === "accompanied") {
    steps.push("accompanied-time")
  } else {
    steps.push("outbound-time")
  }

  steps.push("summary")
  if (!input.contactComplete) steps.push("contact-auth")
  if (input.paymentPreference === "card-online") steps.push("secure-payment")
  steps.push("confirmation")

  return steps
}

function dogSizeLabel(size: DogSize | null) {
  if (size === "small") return "Küçük"
  if (size === "medium") return "Orta"
  if (size === "large") return "Büyük"
  return "Seçilmedi"
}

function petLabel(pet: BookingPet | null) {
  if (pet === "dog") return "Köpek"
  if (pet === "cat") return "Kedi"
  if (pet === "bird") return "Kuş"
  if (pet === "other") return "Diğer"
  return "Seçilmedi"
}

function paymentLabel(payment: PaymentMethod | null) {
  return PAYMENT_OPTIONS.find((option) => option.value === payment)?.label ?? "Seçilmedi"
}

function hasUsableCustomerName(name: string) {
  const normalized = name.trim().replace(/\s+/g, " ")
  if (normalized.length < 5) return false
  if (!normalized.includes(" ")) return false
  return !/^(Patilio|Google|Apple|Facebook|Instagram) Üyesi$/i.test(normalized)
}

function maskCard(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "")
  if (digits.length < 4) return "Kart bilgisi"
  return `•••• ${digits.slice(-4)}`
}

function couponIsAvailable(
  coupon: (typeof COUPON_OPTIONS)[number],
  input: { price: number; hasCarrier: boolean | null },
) {
  if ("minTotal" in coupon && input.price < coupon.minTotal) return false
  if ("requiresCarrier" in coupon && coupon.requiresCarrier && input.hasCarrier !== false) return false
  return true
}

function getCouponDiscount(coupon: (typeof COUPON_OPTIONS)[number], price: number) {
  if (coupon.kind === "percent") return Math.round((price * coupon.value) / 100)
  return Math.min(price, coupon.value)
}

function getOneWayHint(step: Step, input: { contactComplete: boolean; paymentPreference: PaymentMethod | null }) {
  if (step === "service") return "Sırada: gidiş tarihi"
  if (step === "outbound-date") return "Sırada: teslim noktası"
  if (step === "pickup") return "Sırada: varış noktası"
  if (step === "dropoff") return "Sırada: gidiş saati"
  if (step === "outbound-time") return "Sırada: rezervasyon özeti"
  if (step === "summary") {
    if (!input.contactComplete) return "Sırada: iletişim doğrulama"
    if (!input.paymentPreference) return "Ödeme yöntemini seçin"
    return input.paymentPreference === "card-online" ? "Sırada: güvenli ödeme" : "Sırada: rezervasyon onayı"
  }
  if (step === "contact-auth") return "Sırada: son kontrol ve ödeme"
  if (step === "payment-preference") {
    if (!input.paymentPreference) return "Sırada: ödeme tercihi"
    if (!input.contactComplete) return "Sırada: iletişim doğrulama"
    return input.paymentPreference === "card-online" ? "Sırada: güvenli ödeme" : "Sırada: rezervasyon onayı"
  }
  if (step === "secure-payment") return "Sırada: rezervasyon onayı"
  return null
}

function AutoPhoto({
  src,
  gradient,
  alt,
  selected,
}: {
  src: string
  gradient: string
  alt: string
  selected?: boolean
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      className={cn(
        "relative h-[74px] overflow-hidden rounded-t-[18px] bg-gradient-to-br",
        gradient,
        selected ? "opacity-100" : "opacity-95",
      )}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {failed && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.85),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.1),rgba(10,28,55,0.08))]" />
      )}
    </div>
  )
}

function WizardFrame({
  step,
  motion,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  phaseTargets,
  onPhaseClick,
  onClose,
  hint,
  action,
  children,
}: {
  step: Step
  motion: StepMotion
  canGoBack: boolean
  canGoForward?: boolean
  onBack: () => void
  onForward?: () => void
  phaseTargets?: Partial<Record<Phase, Step>>
  onPhaseClick?: (phase: Phase) => void
  onClose?: () => void
  hint?: string
  action?: {
    label: string
    onClick: () => void
    disabled?: boolean
    tone?: "coral" | "green" | "navy"
  }
  children: React.ReactNode
}) {
  const activePhase = STEP_PHASE[step]
  const activeIndex = PHASES.findIndex((phase) => phase.id === activePhase)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const lastWheelNavRef = useRef(0)
  const motionName =
    motion === "back" ? "patiliozStepBack" : motion === "replace" ? "patiliozStepRise" : "patiliozStepForward"
  const motionDuration = motion === "replace" ? 300 : 420

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start) return

    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dx) <= 72 || Math.abs(dx) <= Math.abs(dy) * 1.35) return
    if (dx > 0 && canGoBack) onBack()
    if (dx < 0 && canGoForward) onForward?.()
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const dx = event.deltaX
    const dy = event.deltaY
    if (Math.abs(dx) < 36 || Math.abs(dx) <= Math.abs(dy) * 1.15) return

    const now = Date.now()
    if (now - lastWheelNavRef.current < 520) return
    lastWheelNavRef.current = now

    if (dx < 0 && canGoBack) onBack()
    if (dx > 0 && canGoForward) onForward?.()
  }

  return (
    <div className="flex h-[100dvh] max-h-[820px] flex-col overflow-hidden bg-card text-card-foreground sm:h-[min(760px,88dvh)]">
      <div className="flex shrink-0 flex-col gap-2 border-b border-border/70 bg-card px-3.5 pb-2 pt-2">
        <div className="mx-auto h-1 w-10 rounded-full bg-foreground/15 sm:hidden" aria-hidden="true" />
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={!canGoBack}
            aria-label="Geri"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-all",
              canGoBack
                ? "border-[var(--navy)] bg-[var(--navy)] text-white shadow-sm shadow-navy/20 active:scale-95"
                : "pointer-events-none border-transparent bg-transparent text-transparent",
            )}
          >
            <ChevronLeft size={19} strokeWidth={2.7} />
          </button>
          <div className="min-w-0 text-center">
            <p className="text-[14px] font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Hızlı rezervasyon
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--coral)]/25 bg-[var(--coral)]/10 text-[var(--coral)] transition-all active:scale-95 hover:bg-[var(--coral)] hover:text-white"
          >
            <X size={19} strokeWidth={2.7} />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {PHASES.map((phase, index) => {
            const active = phase.id === activePhase
            const done = index < activeIndex
            const clickable = Boolean(phaseTargets?.[phase.id]) && !active
            return (
              <button
                type="button"
                key={phase.id}
                onClick={() => clickable && onPhaseClick?.(phase.id)}
                disabled={!clickable}
                className={cn(
                  "flex h-7 items-center justify-center rounded-full border px-1 text-[10px] font-extrabold transition-[background-color,border-color,color,box-shadow,transform] duration-300",
                  clickable && "cursor-pointer active:scale-95",
                  active && "scale-[1.03] border-[var(--coral)] bg-[var(--coral)] text-white shadow-sm shadow-coral/20",
                  done && "border-[var(--navy)] bg-[var(--navy)] text-white shadow-sm shadow-navy/10",
                  !active && !done && "border-border bg-secondary text-muted-foreground",
                  !clickable && "cursor-default",
                )}
              >
                {phase.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          className="h-full overflow-hidden px-3.5 py-3"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          <div
            key={step}
            className="will-change-transform"
            style={{ animation: `${motionName} ${motionDuration}ms cubic-bezier(0.22, 1, 0.36, 1) both` }}
          >
            {children}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-card to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-card to-transparent" aria-hidden="true" />
      </div>

      <div className="flex min-h-[64px] shrink-0 items-center border-t border-border/70 bg-card px-3.5 py-2.5">
        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "relative flex h-11 w-full items-center justify-center overflow-hidden rounded-2xl px-4 text-[13px] font-extrabold transition-all active:scale-[0.98]",
              action.disabled && "cursor-not-allowed bg-border/70 text-muted-foreground",
              !action.disabled && action.tone === "green" && "bg-emerald-600 text-white shadow-sm shadow-emerald-900/15",
              !action.disabled && action.tone === "navy" && "bg-[var(--navy)] text-white shadow-sm shadow-navy/15",
              !action.disabled && (!action.tone || action.tone === "coral") && "bg-[var(--coral)] text-white shadow-sm shadow-coral/20",
            )}
          >
            {!action.disabled && <span className="patilioz-cta-sheen" aria-hidden="true" />}
            <span className="relative">{action.label}</span>
          </button>
        ) : (
          <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/80 px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-card text-[var(--coral)] shadow-sm">
                <Check size={14} strokeWidth={2.5} />
              </span>
              <p className="text-[11px] font-bold text-foreground">{hint ?? "Seçince ilerler"}</p>
            </div>
            <span className="h-1.5 w-10 rounded-full bg-foreground/15 motion-safe:animate-pulse" aria-hidden="true" />
          </div>
        )}
      </div>
      <style>{`
        @keyframes patiliozStepForward {
          0% { opacity: 0; transform: translate3d(28px, 10px, 0) scale(0.985); filter: blur(8px); }
          58% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
        }
        @keyframes patiliozStepBack {
          0% { opacity: 0; transform: translate3d(-24px, 8px, 0) scale(0.988); filter: blur(7px); }
          60% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
        }
        @keyframes patiliozStepRise {
          0% { opacity: 0; transform: translate3d(0, 14px, 0) scale(0.99); filter: blur(6px); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
        }
        .patilioz-cta-sheen {
          position: absolute;
          inset-block: 0;
          left: -38%;
          width: 34%;
          transform: skewX(-18deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          animation: patiliozButtonSheen 2.6s ease-in-out infinite;
        }
        @keyframes patiliozButtonSheen {
          0%, 42% { transform: translateX(0) skewX(-18deg); opacity: 0; }
          52% { opacity: 1; }
          82%, 100% { transform: translateX(420%) skewX(-18deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="patiliozStep"], .patilioz-cta-sheen { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-[21px] font-extrabold leading-[1.05] text-foreground sm:text-[22px]" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function SelectCheck({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-all",
        active ? "scale-100 bg-[var(--coral)] text-white" : "scale-90 bg-card/80 text-transparent",
      )}
    >
      <Check size={14} strokeWidth={3} />
    </span>
  )
}

function MiniTimeline({
  outboundDate,
  returnDate,
  outboundSlot,
  returnSlot,
}: {
  outboundDate?: string
  returnDate?: string
  outboundSlot?: string | null
  returnSlot?: string | null
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/70 p-3">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--coral)]" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Gidiş</p>
          <p className="truncate text-[12px] font-extrabold text-foreground">
            {outboundDate ? formatDateShort(outboundDate) : "Tarih bekleniyor"}
            {outboundSlot ? ` · ${outboundSlot}` : ""}
          </p>
        </div>
      </div>
      <div className="ml-[4.5px] h-5 w-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--navy)]" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dönüş</p>
          <p className="truncate text-[12px] font-extrabold text-foreground">
            {returnDate ? formatDateShort(returnDate) : "Sırada"}
            {returnSlot ? ` · ${returnSlot}` : ""}
          </p>
        </div>
      </div>
    </div>
  )
}

function CompactCalendar({
  value,
  minIso,
  onChange,
}: {
  value: string
  minIso?: string
  onChange: (iso: string) => void
}) {
  const today = startOfDay(new Date())
  const minDate = minIso ? parseISO(minIso) : today
  const initial = value ? parseISO(value) : minDate
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  useEffect(() => {
    if (!value) return
    const selected = parseISO(value)
    setViewYear(selected.getFullYear())
    setViewMonth(selected.getMonth())
  }, [value])

  const firstDow = new Date(viewYear, viewMonth, 1).getDay()
  const offset = firstDow === 0 ? 6 : firstDow - 1
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = [...Array<null>(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const selected = value ? parseISO(value) : null
  const canPrev = new Date(viewYear, viewMonth, 1) > new Date(minDate.getFullYear(), minDate.getMonth(), 1)

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-secondary px-3 py-2.5">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => shiftMonth(-1)}
          aria-label="Önceki ay"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground disabled:opacity-25"
        >
          <ChevronLeft size={15} />
        </button>
        <p className="text-[14px] font-extrabold text-foreground">{TR_MONTHS[viewMonth]} {viewYear}</p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Sonraki ay"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground"
        >
          <ChevronLeft size={15} className="rotate-180" />
        </button>
      </div>
      <div className="grid grid-cols-7 border-b border-border bg-secondary/70">
        {TR_DAYS.map((day) => (
          <div key={day} className="py-2 text-center text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1 p-2">
        {cells.map((day, index) => {
          if (!day) return <div key={index} className="aspect-square" />
          const date = new Date(viewYear, viewMonth, day)
          date.setHours(0, 0, 0, 0)
          const iso = toISO(viewYear, viewMonth, day)
          const past = date < minDate
          const full = !past && isDateFull(iso)
          const active = selected?.getTime() === date.getTime()
          return (
            <button
              key={iso}
              type="button"
              disabled={past || full}
              onClick={() => onChange(iso)}
              className={cn(
                "relative mx-auto flex aspect-square w-9 items-center justify-center rounded-xl text-[12px] font-bold transition-all active:scale-95",
                past && "cursor-not-allowed text-muted-foreground/25",
                full && "cursor-not-allowed bg-amber-50 text-amber-500",
                !past && !full && !active && "text-foreground hover:bg-[var(--coral)]/10",
                active && "bg-[var(--coral)] text-white shadow-sm shadow-coral/20",
              )}
            >
              {day}
              {full && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-amber-500" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function QuickDateChips({
  mode,
  outboundDate,
  onSelect,
}: {
  mode: "outbound" | "return"
  outboundDate?: string
  onSelect: (iso: string) => void
}) {
  const todayIso = toISO(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  const options =
    mode === "return"
      ? [
          { label: "Aynı gün", iso: outboundDate || todayIso },
          { label: "Ertesi gün", iso: addDays(outboundDate || todayIso, 1) },
          { label: "Tarih seç", iso: "" },
        ]
      : [
          { label: "Bugün", iso: todayIso },
          { label: "Yarın", iso: addDays(todayIso, 1) },
          { label: "Bu hafta", iso: addDays(todayIso, 3) },
        ]
  return (
    <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => option.iso && onSelect(option.iso)}
          className="shrink-0 rounded-full border border-border bg-secondary px-3.5 py-2 text-[12px] font-extrabold text-foreground transition-all active:scale-95"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function MapPreview({
  mode,
  pickup,
  dropoff,
}: {
  mode: "pickup" | "dropoff"
  pickup?: string
  dropoff?: string
}) {
  return (
    <div className="space-y-2.5">
      <div className="relative h-[158px] overflow-hidden rounded-[22px] border border-border bg-[linear-gradient(135deg,#e5eef6,#f6f8fa)] shadow-sm">
        <div className="absolute inset-x-0 top-10 h-px rotate-2 bg-slate-300" />
        <div className="absolute left-10 top-32 h-px w-52 -rotate-6 bg-slate-300" />
        <div className="absolute right-8 top-20 h-px w-40 rotate-12 bg-slate-300" />
        <div className="absolute left-[48%] top-0 h-full w-10 -rotate-12 rounded-full bg-sky-200/70" />
        <div className="absolute left-[52%] top-0 h-full w-3 -rotate-12 rounded-full bg-sky-300/60" />
        {mode === "dropoff" && (
          <svg className="absolute left-[45%] top-[39%] h-16 w-32 overflow-visible" viewBox="0 0 128 64" aria-hidden="true">
            <path d="M4 48 C36 14, 72 14, 124 24" fill="none" stroke="var(--coral)" strokeWidth="5" strokeLinecap="round" strokeDasharray="9 8" />
          </svg>
        )}
        <div className="absolute left-[48%] top-[42%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[var(--coral)] text-sm font-extrabold text-white shadow-lg">
          A
        </div>
        {mode === "dropoff" && (
          <div className="absolute right-[20%] top-[45%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[var(--navy)] text-sm font-extrabold text-white shadow-lg">
            B
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              {mode === "pickup" ? "Teslim noktası" : "Rota önizlemesi"}
            </p>
            <p className="mt-0.5 truncate text-[12px] font-extrabold text-foreground">
              {mode === "pickup" ? pickup || "Pini sürükleyerek netleştirin" : `${pickup || "Teslim"} → ${dropoff || "Varış"}`}
            </p>
          </div>
          {mode === "dropoff" && dropoff && (
            <div className="shrink-0 text-right">
              <p className="text-[12px] font-extrabold text-foreground">6.4 km</p>
              <p className="text-[10px] font-bold text-muted-foreground">22 dk</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PointSelector({
  kind,
  value,
  pickup,
  onSelect,
  onUseLocation,
  locating,
}: {
  kind: "pickup" | "dropoff"
  value: string
  pickup?: string
  onSelect: (value: string) => void
  onUseLocation?: () => void
  locating?: boolean
}) {
  const selectedName = value.split(",")[0] ?? value
  const [query, setQuery] = useState("")
  const [editing, setEditing] = useState(!value)
  const inputValue = value && !editing ? selectedName : query

  const suggestions = useMemo(() => {
    if (inputValue.trim().length < 2) return ADDRESS_SUGGESTIONS.slice(0, 2)
    const lower = inputValue.toLocaleLowerCase("tr")
    return ADDRESS_SUGGESTIONS.filter((item) =>
      `${item.name} ${item.addr} ${item.kind}`.toLocaleLowerCase("tr").includes(lower),
    ).slice(0, 2)
  }, [inputValue])

  const showResults = editing || !value
  const typedPoint = inputValue.trim()
  const hasExactSuggestion = suggestions.some((item) => `${item.name}, ${item.addr}`.toLocaleLowerCase("tr") === typedPoint.toLocaleLowerCase("tr"))
  const visibleSuggestions = typedPoint.length >= 3 && !hasExactSuggestion ? suggestions.slice(0, 1) : suggestions

  const useTypedPoint = () => {
    if (typedPoint.length < 3) return
    setQuery(typedPoint)
    setEditing(false)
    onSelect(typedPoint)
  }

  return (
    <div className="space-y-2.5">
      {showResults && (
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={inputValue}
            onFocus={() => {
              setQuery(value ? selectedName : query)
              setEditing(true)
            }}
            onChange={(event) => {
              setQuery(event.target.value)
              setEditing(true)
            }}
            placeholder={kind === "pickup" ? "Teslim noktası ara" : "Varış noktası ara"}
            className="h-12 w-full rounded-2xl border border-border bg-secondary pl-10 pr-3 text-[14px] font-semibold text-foreground outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-[var(--coral)]"
          />
        </div>
      )}

      {value && !editing && (
        <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 p-3.5 shadow-sm">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
              <MapPin size={16} strokeWidth={2.7} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">{kind === "pickup" ? "Teslim noktası" : "Varış noktası"}</p>
              <p className="mt-0.5 line-clamp-3 text-[13px] font-extrabold leading-snug text-emerald-950">{value}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setQuery(selectedName)
                setEditing(true)
              }}
              className="rounded-full bg-white/85 px-2.5 py-1.5 text-[10px] font-extrabold text-emerald-800 active:scale-95"
            >
              Değiştir
            </button>
          </div>
        </div>
      )}

      {showResults && (
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {kind === "pickup" && (
          <button
            type="button"
            onClick={() => {
              setEditing(false)
              onUseLocation?.()
            }}
            disabled={locating}
            className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--coral)]/25 bg-[var(--coral)]/8 px-3 py-2 text-[12px] font-extrabold text-[var(--coral)] disabled:opacity-60"
          >
            <LocateFixed size={13} />
            {locating ? "Konum alınıyor" : "Mevcut konum"}
          </button>
        )}
        {["Veteriner", "Pet kuaförü", "Pet oteli"].map((chip) => (
          <span key={chip} className="shrink-0 rounded-full border border-border bg-card px-3 py-2 text-[12px] font-bold text-muted-foreground">
            {chip}
          </span>
        ))}
        </div>
      )}

      {showResults && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {typedPoint.length >= 3 && !hasExactSuggestion && (
          <button
            type="button"
            onClick={useTypedPoint}
            className="flex w-full items-center gap-3 border-b border-border/70 px-3.5 py-3 text-left transition-colors active:bg-secondary"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--coral)]/10 text-[var(--coral)]">
              <Check size={15} strokeWidth={3} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-extrabold text-foreground">Bu noktayı kullan</span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{typedPoint}</span>
            </span>
          </button>
        )}
        {visibleSuggestions.map((item, index) => (
          <button
            key={`${item.name}-${index}`}
            type="button"
            onClick={() => {
              setQuery(item.name)
              setEditing(false)
              onSelect(`${item.name}, ${item.addr}`)
            }}
            className={cn(
              "flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition-colors active:bg-secondary",
              (typedPoint.length >= 3 && !hasExactSuggestion) || index !== visibleSuggestions.length - 1 ? "border-b border-border/70" : "",
            )}
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--coral)]/10 text-[var(--coral)]">
              <MapPin size={15} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-extrabold text-foreground">{item.name}</span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{item.addr}</span>
            </span>
            <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">{item.kind}</span>
          </button>
        ))}
        </div>
      )}

      <MapPreview mode={kind} pickup={pickup || value} dropoff={value} />
    </div>
  )
}

function WaitingBlocks({
  service,
  value,
  showPrice,
  onChange,
}: {
  service: "round-trip" | "accompanied"
  value: number
  showPrice: boolean
  onChange: (blocks: number) => void
}) {
  const isRoundTrip = service === "round-trip"
  const min = isRoundTrip ? 0 : 1
  const max = isRoundTrip ? 4 : 6
  const fee = (isRoundTrip ? WAITING_BLOCK_FEE : ACCOMPANIED_BLOCK_FEE) * value
  const extraMinutes = value * WAITING_BLOCK_MIN
  const setBlocks = (next: number) => onChange(Math.min(max, Math.max(min, next)))

  return (
    <div className="space-y-3">
      <div className="rounded-[22px] border border-border bg-secondary/80 p-3.5">
        <p className="text-[12px] font-extrabold text-foreground">
          {FREE_WAIT_MIN} dk bekleme dahil. {isRoundTrip ? "Ek süre satın alabilirsiniz." : "Ek refakat 15 dk bloklarla planlanır."}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          {isRoundTrip
            ? "Randevu uzarsa aynı ekibin beklemesini isterseniz şimdi ekleyin."
            : "Randevu süresi uzarsa sizi bilgilendiririz; süre planı burada başlar."}
        </p>
      </div>

      <div className="rounded-[24px] border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setBlocks(value - 1)}
            disabled={value <= min}
            aria-label="Ek süreyi azalt"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-all active:scale-95 disabled:opacity-35"
          >
            <Minus size={18} />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              {isRoundTrip ? "Ek bekleme" : "Ek refakat"}
            </p>
            <p className="mt-1 text-[28px] font-extrabold leading-none text-foreground">
              {value > 0 ? `+${extraMinutes}` : "Yok"}
              {value > 0 && <span className="ml-1 text-[13px] text-muted-foreground">dk</span>}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
              {value > 0 ? `${value} blok x ${WAITING_BLOCK_MIN} dk` : "Yalnızca dahil olan 5 dk"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBlocks(value + 1)}
            disabled={value >= max}
            aria-label="Ek süre ekle"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--coral)] text-white shadow-sm shadow-coral/20 transition-all active:scale-95 disabled:opacity-35"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary px-3 py-2.5">
          <span className="text-[11px] font-bold text-muted-foreground">Ek ücret</span>
          {showPrice ? (
            <span className="text-[18px] font-extrabold text-[var(--coral)]">₺{fee.toLocaleString("tr-TR")}</span>
          ) : (
            <span className="max-w-[170px] text-right text-[10px] font-extrabold leading-tight text-muted-foreground">
              Doğrulamadan sonra hesaplanır
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(isRoundTrip ? [0, 1, 2, 4] : [1, 2, 4, 6]).map((blocks) => (
          <button
            key={blocks}
            type="button"
            onClick={() => setBlocks(blocks)}
            className={cn(
              "h-10 rounded-2xl border text-[11px] font-extrabold transition-all active:scale-95",
              value === blocks ? "border-[var(--coral)] bg-[var(--coral)] text-white" : "border-border bg-card text-muted-foreground",
            )}
          >
            {blocks === 0 ? "Ek yok" : `+${blocks * WAITING_BLOCK_MIN} dk`}
          </button>
        ))}
      </div>
    </div>
  )
}

function TimeSlotPicker({
  value,
  onSelect,
  accent = "coral",
}: {
  value: string | null
  onSelect: (slot: string) => void
  accent?: "coral" | "navy"
}) {
  return (
    <div className="space-y-4">
      {TIME_GROUPS.map((group) => (
        <div key={group.label}>
          <div className="mb-2 flex items-center gap-2">
            <Clock3 size={14} className="text-muted-foreground" />
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">{group.label}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {group.slots.map((slot) => {
              const full = FULL_SLOTS.has(slot)
              const active = value === slot
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={full}
                  onClick={() => onSelect(slot)}
                  className={cn(
                    "h-12 rounded-2xl border text-[13px] font-extrabold transition-all active:scale-[0.98]",
                    full && "cursor-not-allowed border-border bg-secondary/70 text-muted-foreground/45",
                    !full && !active && "border-border bg-card text-foreground hover:border-[var(--coral)]/45",
                    active && accent === "coral" && "border-[var(--coral)] bg-[var(--coral)] text-white shadow-sm shadow-coral/20",
                    active && accent === "navy" && "border-[var(--navy)] bg-[var(--navy)] text-white shadow-sm shadow-navy/20",
                  )}
                >
                  {full ? "Dolu" : slot}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function SummaryRow({
  label,
  value,
  onEdit,
}: {
  label: string
  value: string
  onEdit: () => void
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-center gap-2.5 border-b border-border/70 px-3 py-2.5 text-left last:border-b-0 active:bg-secondary"
    >
      <span className="w-20 shrink-0 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 line-clamp-2 break-words text-[12px] font-extrabold leading-snug text-foreground">{value || "Seçilmedi"}</span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Edit3 size={13} />
      </span>
    </button>
  )
}

function SummaryMiniButton({
  label,
  value,
  onEdit,
}: {
  label: string
  value: string
  onEdit: () => void
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="min-w-0 rounded-2xl border border-border bg-secondary/70 p-2.5 text-left active:scale-[0.99]"
    >
      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="mt-0.5 block truncate text-[12px] font-extrabold text-foreground">{value || "Seçilmedi"}</span>
    </button>
  )
}

function RouteMiniSummary({
  pickup,
  dropoff,
  onPickupEdit,
  onDropoffEdit,
}: {
  pickup: string
  dropoff: string
  onPickupEdit: () => void
  onDropoffEdit: () => void
}) {
  return (
    <div className="rounded-2xl bg-secondary/70 p-2.5">
      <button type="button" onClick={onPickupEdit} className="flex w-full items-start gap-2 text-left active:scale-[0.99]">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--coral)] text-[10px] font-extrabold text-white">A</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Alış</span>
          <span className="mt-0.5 block truncate text-[12px] font-bold text-foreground">{pickup || "Seçilmedi"}</span>
        </span>
      </button>
      <div className="my-1.5 h-px bg-border" />
      <button type="button" onClick={onDropoffEdit} className="flex w-full items-start gap-2 text-left active:scale-[0.99]">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--navy)] text-[10px] font-extrabold text-white">B</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Varış</span>
          <span className="mt-0.5 block truncate text-[12px] font-bold text-foreground">{dropoff || "Seçilmedi"}</span>
        </span>
      </button>
    </div>
  )
}

function DiscountChooser({
  availableCoupons,
  couponCode,
  couponApplied,
  couponDiscount,
  couponMatch,
  couponAvailable,
  price,
  onSelectCoupon,
  onCouponInput,
}: {
  availableCoupons: CouponOption[]
  couponCode: string
  couponApplied: boolean
  couponDiscount: number
  couponMatch?: CouponOption
  couponAvailable: boolean
  price: number
  onSelectCoupon: (code: string) => void
  onCouponInput: (code: string) => void
}) {
  const normalizedCode = couponCode.trim().toUpperCase()
  const bestCoupon = availableCoupons.reduce<CouponOption | null>((best, coupon) => {
    if (!best) return coupon
    return getCouponDiscount(coupon, price) > getCouponDiscount(best, price) ? coupon : best
  }, null)
  const bestCouponSelected = Boolean(bestCoupon && couponApplied && normalizedCode === bestCoupon.code)

  return (
    <div className="rounded-[18px] border border-border bg-card p-2 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--coral)]/10 text-[var(--coral)]">
            <Tag size={13} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold text-foreground">İndirim</p>
            <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-snug text-muted-foreground">
              {couponDiscount > 0
                ? `${normalizedCode} uygulandı. Tutar ₺${couponDiscount.toLocaleString("tr-TR")} düştü.`
                : availableCoupons.length > 0
                  ? "Uygun kuponlardan birini seçin."
                  : "Bu rezervasyona uygun kupon görünmüyor."}
            </p>
          </div>
        </div>
        {couponDiscount > 0 ? (
          <button
            type="button"
            onClick={() => onCouponInput("")}
            className="shrink-0 rounded-full border border-border bg-secondary px-3 py-1.5 text-[10px] font-extrabold text-foreground active:scale-95"
          >
            Kaldır
          </button>
        ) : bestCoupon ? (
          <button
            type="button"
            onClick={() => onSelectCoupon(bestCoupon.code)}
            disabled={bestCouponSelected}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold active:scale-95",
              bestCouponSelected ? "bg-emerald-50 text-emerald-700" : "bg-[var(--navy)] text-white",
            )}
          >
            En iyi kuponu seç
          </button>
        ) : (
          <span className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-[10px] font-extrabold text-muted-foreground">
            Kupon yok
          </span>
        )}
      </div>

      {availableCoupons.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {availableCoupons.map((coupon) => {
            const active = couponApplied && normalizedCode === coupon.code
            return (
              <button
                key={coupon.code}
                type="button"
                onClick={() => onSelectCoupon(coupon.code)}
                className={cn(
                  "min-h-[50px] rounded-xl border px-3 py-2 text-left transition-all active:scale-95",
                  active ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-border bg-secondary text-foreground",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-[12px] font-extrabold uppercase tracking-tight">{coupon.code}</span>
                  {active && <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />}
                </span>
                <span className="mt-0.5 block truncate text-[10px] font-semibold text-muted-foreground">{coupon.desc}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <p className="rounded-xl bg-secondary p-2.5 text-[10px] font-semibold leading-snug text-muted-foreground">
          Şu an bu seçimlere uygun indirim yok. Uygun kampanya olduğunda burada görünür.
        </p>
      )}

      <div className="relative mt-2">
        <Tag size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={couponCode}
          onChange={(event) => onCouponInput(event.target.value)}
          placeholder="Kod varsa yazın; eşleşirse otomatik uygulanır"
          className="h-9 w-full rounded-xl border border-border bg-secondary pl-8 pr-3 text-[11px] font-extrabold outline-none focus:border-[var(--coral)]"
        />
      </div>
      {couponCode && !couponMatch && (
        <p className="mt-1 text-[9px] font-semibold text-amber-600">Bu kod sistemde tanınmıyor.</p>
      )}
      {couponCode && couponMatch && !couponAvailable && (
        <p className="mt-1 text-[9px] font-semibold text-amber-600">Bu kod mevcut seçimlere uygulanamıyor.</p>
      )}
    </div>
  )
}

interface BookingWidgetProps {
  initial?: OpenBookingOptions
  onClose?: () => void
}

export function BookingWidget({ initial, onClose }: BookingWidgetProps) {
  const { draft, hydrated, update, reset } = useBookingDraft()
  const { user, hydrated: authHydrated, signIn, signInWithProvider, update: updateUser } = useAuth()
  const hydratedRef = useRef(false)
  const stepRef = useRef<Step>("pet")
  const reservationSavedRef = useRef(false)

  const [step, setStep] = useState<Step>("pet")
  const [stepMotion, setStepMotion] = useState<StepMotion>("replace")
  const [petType, setPetType] = useState<BookingPet | null>(initial?.pet ?? null)
  const [dogSize, setDogSize] = useState<DogSize | null>(null)
  const [weightKg, setWeightKg] = useState<number | null>(null)
  const [hasCarrier, setHasCarrier] = useState<boolean | null>(null)
  const [tripType, setTripType] = useState<BookingService | null>(initial?.service ?? null)
  const [outboundDate, setOutboundDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [pickupPoint, setPickupPoint] = useState("")
  const [dropoffPoint, setDropoffPoint] = useState("")
  const [handoverNote, setHandoverNote] = useState("")
  const [extraWaitingBlocks, setExtraWaitingBlocks] = useState(0)
  const [accompaniedWaitingBlocks, setAccompaniedWaitingBlocks] = useState(1)
  const [outboundSlot, setOutboundSlot] = useState<string | null>(null)
  const [returnSlot, setReturnSlot] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [smsSent, setSmsSent] = useState(false)
  const [smsConfirmed, setSmsConfirmed] = useState(false)
  const [smsCode, setSmsCode] = useState("")
  const [smsError, setSmsError] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [paymentPreference, setPaymentPreference] = useState<PaymentMethod | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [onlinePayment, setOnlinePayment] = useState<OnlinePaymentDraft>({
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })
  const [locating, setLocating] = useState(false)
  const [socialNotice, setSocialNotice] = useState("")
  const [showCard, setShowCard] = useState(false)
  const [confirmationCode] = useState(() => `PAT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)

  const verifiedPhone = (user?.phone ?? "").replace(/\D/g, "")
  const phoneVerified = authHydrated && verifiedPhone.length >= 10
  const customerNameComplete = hasUsableCustomerName(customerName || user?.name || "")
  const contactComplete = phoneVerified && customerNameComplete

  const flowSteps = useMemo(
    () => getFlowSteps({ pet: petType, service: tripType, contactComplete, paymentPreference }),
    [contactComplete, petType, paymentPreference, tripType],
  )

  useEffect(() => {
    stepRef.current = step
  }, [step])

  const priceBase = tripType ? BASE_PRICES[tripType] : 0
  const dogFee = dogSize === "large" ? LARGE_DOG_FEE : 0
  const carrierFee = hasCarrier === false ? CARRIER_FEE : 0
  const waitingFee = extraWaitingBlocks * WAITING_BLOCK_FEE
  const accompaniedFee = tripType === "accompanied" ? accompaniedWaitingBlocks * ACCOMPANIED_BLOCK_FEE : 0
  const price = priceBase + dogFee + carrierFee + waitingFee + accompaniedFee
  const couponMatch = COUPON_OPTIONS.find((coupon) => coupon.code === couponCode.trim().toUpperCase())
  const couponAvailable = couponMatch ? couponIsAvailable(couponMatch, { price, hasCarrier }) : false
  const couponDiscount = couponApplied && couponMatch && couponAvailable ? getCouponDiscount(couponMatch, price) : 0
  const discounted = Math.max(0, price - couponDiscount)
  const canShowPrice = contactComplete
  const phoneDigits = phone.replace(/\D/g, "")
  const availableCoupons = COUPON_OPTIONS.filter((coupon) => couponIsAvailable(coupon, { price, hasCarrier }))

  const currentIndex = flowSteps.indexOf(step)
  const canGoBack = currentIndex > 0 && step !== "confirmation"

  const replaceStep = useCallback((next: Step) => {
    stepRef.current = next
    setStepMotion("replace")
    setStep(next)
  }, [])

  const moveTo = useCallback((next: Step, preferredMotion?: StepMotion) => {
    const from = stepRef.current
    if (from === next) return

    const fromIndex = flowSteps.indexOf(from)
    const toIndex = flowSteps.indexOf(next)
    const resolvedMotion =
      preferredMotion ?? (fromIndex >= 0 && toIndex >= 0 ? (toIndex < fromIndex ? "back" : "forward") : "replace")

    stepRef.current = next
    setStepMotion(resolvedMotion)
    setStep(next)
  }, [flowSteps])

  const goTo = useCallback((next: Step) => moveTo(next), [moveTo])

  const goNext = useCallback(() => {
    const index = flowSteps.indexOf(step)
    if (index >= 0 && index < flowSteps.length - 1) moveTo(flowSteps[index + 1], "forward")
  }, [flowSteps, moveTo, step])

  const goBack = useCallback(() => {
    const index = flowSteps.indexOf(step)
    if (index > 0) moveTo(flowSteps[index - 1], "back")
  }, [flowSteps, moveTo, step])

  const phaseTargets = useMemo(() => {
    const targets: Partial<Record<Phase, Step>> = {}

    for (const phase of PHASES) {
      const target = flowSteps.find((candidate, index) => index < currentIndex && STEP_PHASE[candidate] === phase.id)
      if (target) targets[phase.id] = target
    }

    return targets
  }, [currentIndex, flowSteps])

  const goToPhase = useCallback(
    (phase: Phase) => {
      const target = phaseTargets[phase]
      if (target) moveTo(target, "back")
    },
    [moveTo, phaseTargets],
  )

  const autoAdvance = useCallback((next?: Step) => {
    window.setTimeout(() => {
      if (next) moveTo(next, "forward")
      else {
        const index = flowSteps.indexOf(stepRef.current)
        if (index >= 0 && index < flowSteps.length - 1) moveTo(flowSteps[index + 1], "forward")
      }
    }, 210)
  }, [flowSteps, moveTo])

  useEffect(() => {
    if (initial?.resume) return
    if (initial?.pet && initial?.service) {
      replaceStep("outbound-date")
      return
    }
    if (initial?.pet) {
      setPetType(initial.pet)
      replaceStep(initial.pet === "dog" ? "dog-size" : initial.pet === "cat" ? "cat-carrier" : "service")
      return
    }
    if (initial?.service) {
      setTripType(initial.service)
      replaceStep("outbound-date")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hydrated || hydratedRef.current) return
    hydratedRef.current = true

    if (initial?.resume && draft.updatedAt) {
      const knownSteps = getFlowSteps({
        pet: draft.pet,
        service: draft.service,
        contactComplete:
          (user?.phone ?? "").replace(/\D/g, "").length >= 10 &&
          hasUsableCustomerName(draft.customerName || user?.name || ""),
        paymentPreference: draft.paymentPreference,
      })
      replaceStep(knownSteps.includes(draft.lastStep as Step) ? (draft.lastStep as Step) : "pet")
    }

    setPetType((current) => current ?? draft.pet)
    setDogSize((current) => current ?? draft.petSize)
    setWeightKg((current) => current ?? draft.weightKg)
    setHasCarrier((current) => current ?? draft.hasCarrier)
    setTripType((current) => current ?? draft.service)
    setOutboundDate((current) => current || draft.outboundDate || draft.date)
    setReturnDate((current) => current || draft.returnDate)
    setPickupPoint((current) => current || draft.pickupPoint || draft.pickupAddress)
    setDropoffPoint((current) => current || draft.dropoffPoint || draft.dropoffAddress)
    setHandoverNote((current) => current || draft.handoverNote)
    setExtraWaitingBlocks(draft.extraWaitingBlocks)
    setAccompaniedWaitingBlocks(draft.accompaniedWaitingBlocks || 1)
    setOutboundSlot((current) => current ?? draft.outboundSlot ?? draft.selectedSlot)
    setReturnSlot((current) => current ?? draft.returnSlot)
    setPhone((current) => current || draft.phone)
    setCustomerName((current) => current || draft.customerName || (hasUsableCustomerName(user?.name ?? "") ? user?.name ?? "" : ""))
    setPaymentPreference((current) => current ?? draft.paymentPreference ?? draft.paymentMethod)
    setCouponCode((current) => current || draft.couponCode)
    setOnlinePayment({ ...onlinePayment, ...draft.onlinePaymentDraft })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, draft, initial, user?.phone])

  useEffect(() => {
    if (!hydrated) return
    update({
      pet: petType,
      petSize: dogSize,
      weightKg,
      hasCarrier,
      service: tripType,
      outboundDate,
      date: outboundDate,
      returnDate,
      pickupPoint,
      pickupAddress: pickupPoint,
      dropoffPoint,
      dropoffAddress: dropoffPoint,
      handoverNote,
      extraWaitingBlocks,
      accompaniedWaitingBlocks,
      waitingBlocks: tripType === "accompanied" ? accompaniedWaitingBlocks : extraWaitingBlocks,
      outboundSlot,
      selectedSlot: outboundSlot,
      returnSlot,
      phone,
      customerName,
      paymentPreference,
      paymentMethod: paymentPreference,
      couponCode,
      onlinePaymentDraft: onlinePayment,
      lastStep: step as DraftStep,
    })
  }, [
    hydrated,
    update,
    petType,
    dogSize,
    weightKg,
    hasCarrier,
    tripType,
    outboundDate,
    returnDate,
    pickupPoint,
    dropoffPoint,
    handoverNote,
    extraWaitingBlocks,
    accompaniedWaitingBlocks,
    outboundSlot,
    returnSlot,
    phone,
    customerName,
    paymentPreference,
    couponCode,
    onlinePayment,
    step,
  ])

  useEffect(() => {
    if (flowSteps.includes(step)) return
    replaceStep(flowSteps[Math.max(0, flowSteps.length - 2)] ?? "pet")
  }, [flowSteps, replaceStep, step])

  useEffect(() => {
    if (customerName || !hasUsableCustomerName(user?.name ?? "")) return
    setCustomerName(user?.name ?? "")
  }, [customerName, user?.name])

  useEffect(() => {
    if (step !== "confirmation" || reservationSavedRef.current || !user || !contactComplete) return
    if (user.reservations.some((reservation) => reservation.code === confirmationCode)) {
      reservationSavedRef.current = true
      return
    }

    const reservation: SavedReservation = {
      id: globalThis.crypto?.randomUUID?.() ?? `res-${Date.now()}`,
      code: confirmationCode,
      status: "received",
      createdAt: new Date().toISOString(),
      customerName: customerName.trim().replace(/\s+/g, " "),
      phone: verifiedPhone || phoneDigits,
      pet: petType,
      dogSize,
      weightKg,
      hasCarrier,
      service: tripType,
      pickupPoint,
      dropoffPoint,
      outboundDate,
      returnDate,
      outboundSlot,
      returnSlot,
      extraWaitingBlocks,
      accompaniedWaitingBlocks,
      paymentMethod: paymentPreference,
      amount: discounted,
      couponCode: couponDiscount > 0 ? couponMatch?.code : undefined,
      discount: couponDiscount,
    }

    reservationSavedRef.current = true
    updateUser({ reservations: [reservation, ...user.reservations] })
  }, [
    step,
    user,
    contactComplete,
    confirmationCode,
    customerName,
    verifiedPhone,
    phoneDigits,
    petType,
    dogSize,
    weightKg,
    hasCarrier,
    tripType,
    pickupPoint,
    dropoffPoint,
    outboundDate,
    returnDate,
    outboundSlot,
    returnSlot,
    extraWaitingBlocks,
    accompaniedWaitingBlocks,
    paymentPreference,
    discounted,
    couponDiscount,
    couponMatch?.code,
    updateUser,
  ])

  const close = () => {
    if (step === "confirmation") reset()
    onClose?.()
  }

  const resetCheckoutState = useCallback(() => {
    setPaymentPreference(null)
    setCouponCode("")
    setCouponApplied(false)
    setOnlinePayment({
      cardholder: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
    })
  }, [])

  const useCurrentLocation = () => {
    setLocating(true)
    window.setTimeout(() => {
      setPickupPoint("Mevcut konum, Kadıköy merkez")
      setLocating(false)
    }, 650)
  }

  const selectPet = (pet: BookingPet) => {
    setPetType(pet)
    setDogSize(null)
    setHasCarrier(null)
    autoAdvance(pet === "dog" ? "dog-size" : pet === "cat" ? "cat-carrier" : "service")
  }

  const selectService = (service: BookingService) => {
    setTripType(service)
    setReturnDate("")
    setExtraWaitingBlocks(0)
    setAccompaniedWaitingBlocks(service === "accompanied" ? 1 : 0)
    setOutboundSlot(null)
    setReturnSlot(null)
    resetCheckoutState()
    autoAdvance("outbound-date")
  }

  const selectOutboundDate = (iso: string) => {
    setOutboundDate(iso)
    if (returnDate && returnDate < iso) setReturnDate("")
    setOutboundSlot(null)
    setReturnSlot(null)
    resetCheckoutState()
    autoAdvance(tripType === "round-trip" ? "return-date" : "pickup")
  }

  const selectReturnDate = (iso: string) => {
    setReturnDate(iso)
    setReturnSlot(null)
    resetCheckoutState()
    autoAdvance("pickup")
  }

  const selectPickup = (point: string) => {
    setPickupPoint(point)
    setOutboundSlot(null)
    setReturnSlot(null)
    resetCheckoutState()
  }

  const selectDropoff = (point: string) => {
    setDropoffPoint(point)
    setOutboundSlot(null)
    setReturnSlot(null)
    resetCheckoutState()
  }

  const confirmPickup = () => {
    if (!pickupPoint) return
    moveTo("dropoff", "forward")
  }

  const confirmDropoff = () => {
    if (!dropoffPoint) return
    if (tripType === "round-trip") moveTo("roundtrip-waiting", "forward")
    else if (tripType === "accompanied") moveTo("accompanied-waiting", "forward")
    else moveTo("outbound-time", "forward")
  }

  const selectRoundTripWaiting = (blocks: number) => {
    setExtraWaitingBlocks(blocks)
    setOutboundSlot(null)
    setReturnSlot(null)
    resetCheckoutState()
  }

  const selectAccompaniedWaiting = (blocks: number) => {
    setAccompaniedWaitingBlocks(blocks)
    setOutboundSlot(null)
    setReturnSlot(null)
    resetCheckoutState()
  }

  const selectOutboundSlot = (slot: string) => {
    setOutboundSlot(slot)
    resetCheckoutState()
    autoAdvance(tripType === "round-trip" ? "return-time" : "summary")
  }

  const selectReturnSlot = (slot: string) => {
    setReturnSlot(slot)
    resetCheckoutState()
    autoAdvance("summary")
  }

  const selectAccompaniedSlot = (slot: string) => {
    setOutboundSlot(slot)
    resetCheckoutState()
    autoAdvance("summary")
  }

  const selectPayment = (payment: PaymentMethod) => {
    setPaymentPreference(payment)
  }

  const verifyPhone = () => {
    if (!phoneVerified && phoneDigits.length < 10) return
    if (!phoneVerified && !smsSent) {
      setSmsSent(true)
      setSmsCode("")
      setSmsError("")
      return
    }
    if (!phoneVerified && !smsConfirmed && smsCode !== MOCK_SMS_CODE) {
      setSmsError("Kod hatalı. Ön görünüm için 000000 kullanın.")
      return
    }
    if (!phoneVerified && !smsConfirmed) {
      setSmsConfirmed(true)
      setSmsError("")
      return
    }
    if (!customerNameComplete) return
    setSmsError("")
    if (!phoneVerified) signIn(phoneDigits)
    updateUser({ name: customerName.trim().replace(/\s+/g, " ") })
    moveTo("summary", "forward")
  }

  const continueAfterPaymentPreference = () => {
    if (!paymentPreference) return
    if (!contactComplete) {
      moveTo("contact-auth", "forward")
      return
    }
    moveTo(paymentPreference === "card-online" ? "secure-payment" : "confirmation", "forward")
  }

  const continueAfterSummary = () => {
    if (!contactComplete) {
      moveTo("contact-auth", "forward")
      return
    }
    continueAfterPaymentPreference()
  }

  const applyCouponCode = (nextCode?: string) => {
    const normalized = (nextCode ?? couponCode).trim().toUpperCase()
    setCouponCode(normalized)
    const match = COUPON_OPTIONS.find((coupon) => coupon.code === normalized)
    setCouponApplied(Boolean(match && couponIsAvailable(match, { price, hasCarrier })))
  }

  const updateCouponCode = (value: string) => {
    const nextCode = value.toUpperCase()
    const normalized = nextCode.trim()
    setCouponCode(nextCode)
    const match = COUPON_OPTIONS.find((coupon) => coupon.code === normalized)
    setCouponApplied(Boolean(match && couponIsAvailable(match, { price, hasCarrier })))
  }

  const handleProvider = (provider: "google" | "apple") => {
    signInWithProvider(provider)
    setSocialNotice(`${provider === "google" ? "Google" : "Apple"} ile devam edildi. Rezervasyon için telefon numaranızı da doğrulayın.`)
  }

  const securePaymentReady =
    onlinePayment.cardholder.trim().length > 3 &&
    onlinePayment.cardNumber.replace(/\D/g, "").length >= 12 &&
    onlinePayment.expiry.replace(/\D/g, "").length >= 4 &&
    onlinePayment.cvc.replace(/\D/g, "").length >= 3

  let hint = "Seçince ilerler"
  let action: Parameters<typeof WizardFrame>[0]["action"] | undefined

  if (step === "dog-size") hint = "Boy seçilince hizmete geçer"
  if (step === "cat-carrier") hint = "Seçince hizmete geçer"
  if (step === "service") hint = "Hizmet seçilince tarih planlanır"
  if (step === "outbound-date") hint = "Gidiş tarihi seçilince sonraki ihtiyaç gösterilir"
  if (step === "return-date") hint = "Dönüş tarihi seçilince teslim noktası sırada"
  if (step === "pickup") hint = "Konum netleşince varış noktası sırada"
  if (step === "dropoff") hint = "Varış seçilince bekleme veya saat sırada"
  if (step === "roundtrip-waiting") hint = "Ek süreyi ayarlayın; sonra gidiş saati"
  if (step === "accompanied-waiting") hint = "Refakat süresini ayarlayın; sonra başlangıç saati"
  if (step === "outbound-time") hint = tripType === "round-trip" ? "Gidiş saati seçilince dönüş saati sırada" : "Saat seçilince özet sırada"
  if (step === "return-time") hint = "Dönüş saati seçilince özet sırada"
  if (step === "accompanied-time") hint = "Saat seçilince özet sırada"
  if (tripType === "one-way") {
    hint = getOneWayHint(step, { contactComplete, paymentPreference }) ?? hint
  }
  if (step === "summary") {
    hint = !contactComplete
      ? "Sırada: iletişim doğrulama"
      : paymentPreference
        ? paymentPreference === "card-online"
          ? "Sırada: güvenli ödeme"
          : "Sırada: rezervasyon onayı"
        : "Ödeme yöntemini seçin"
  }
  if (step === "contact-auth") hint = phoneVerified || smsConfirmed ? "Ad soyad tamamlanınca son kontrole dönersiniz" : "Telefon doğrulanınca ad soyad istenir"
  if (step === "pickup" && pickupPoint) action = { label: "Bu teslim noktası doğru", onClick: confirmPickup, tone: "coral" }
  if (step === "dropoff" && dropoffPoint) action = { label: "Bu varış noktası doğru", onClick: confirmDropoff, tone: "coral" }
  if (step === "roundtrip-waiting") action = { label: "Gidiş saatine geç", onClick: () => moveTo("outbound-time", "forward"), tone: "coral" }
  if (step === "accompanied-waiting") action = { label: "Başlangıç saatini seç", onClick: () => moveTo("accompanied-time", "forward"), tone: "coral" }
  if (step === "summary") action = {
    label: !contactComplete
      ? "İletişimi tamamla"
      : !paymentPreference
        ? "Ödeme yöntemini seçin"
        : paymentPreference === "card-online"
          ? "Güvenli ödemeye geç"
          : "Rezervasyonu oluştur",
    onClick: continueAfterSummary,
    disabled: contactComplete && !paymentPreference,
    tone: paymentPreference === "card-online" ? "green" : "coral",
  }
  if (step === "contact-auth") action = {
    label: phoneVerified || smsConfirmed ? "Bilgileri tamamla, ödeme adımına geç" : smsSent ? "Kodu doğrula" : "SMS kodu gönder",
    onClick: verifyPhone,
    disabled: phoneVerified || smsConfirmed ? !customerNameComplete : smsSent ? smsCode.length !== 6 : phoneDigits.length < 10,
    tone: "coral",
  }
  if (step === "payment-preference") action = {
    label: !paymentPreference
      ? "Ödeme yöntemini seçin"
      : !contactComplete
        ? "İletişimi tamamla"
        : paymentPreference === "card-online"
          ? "Güvenli ödemeye geç"
          : "Rezervasyonu oluştur",
    onClick: continueAfterPaymentPreference,
    disabled: !paymentPreference,
    tone: paymentPreference === "card-online" ? "green" : "coral",
  }
  if (step === "secure-payment") action = { label: "Öde ve rezervasyonu oluştur", onClick: goNext, disabled: !securePaymentReady, tone: "green" }
  if (step === "confirmation") action = { label: "Detaylara git", onClick: close, tone: "coral" }

  const canUseFrameForward = (() => {
    if (currentIndex < 0 || currentIndex >= flowSteps.length - 1 || step === "confirmation") return false
    if (step === "pet") return Boolean(petType)
    if (step === "dog-size") return Boolean(dogSize)
    if (step === "cat-carrier") return hasCarrier !== null
    if (step === "service") return Boolean(tripType)
    if (step === "outbound-date") return Boolean(outboundDate)
    if (step === "return-date") return Boolean(returnDate)
    if (step === "pickup") return Boolean(pickupPoint)
    if (step === "dropoff") return Boolean(dropoffPoint)
    if (step === "roundtrip-waiting" || step === "accompanied-waiting") return true
    if (step === "outbound-time" || step === "accompanied-time") return Boolean(outboundSlot)
    if (step === "return-time") return Boolean(returnSlot)
    if (step === "summary") return !contactComplete || paymentPreference === "card-online"
    if (step === "contact-auth") return customerNameComplete && (phoneVerified || smsConfirmed)
    if (step === "payment-preference") return !contactComplete || paymentPreference === "card-online"
    return false
  })()

  const goForwardFromFrame = () => {
    if (!canUseFrameForward) return
    if (action && !action.disabled && step !== "summary" && step !== "payment-preference") {
      action.onClick()
      return
    }
    goNext()
  }

  return (
    <WizardFrame
      step={step}
      motion={stepMotion}
      canGoBack={canGoBack}
      canGoForward={canUseFrameForward}
      onBack={goBack}
      onForward={goForwardFromFrame}
      phaseTargets={phaseTargets}
      onPhaseClick={goToPhase}
      onClose={close}
      hint={hint}
      action={action}
    >
      {step === "pet" && (
        <div>
          <SectionTitle title="Nereye Patilioz?" subtitle="Patili dostunuz için doğru yolculuk planını tek dokunuşlarla oluşturalım." />
          <div className="grid grid-cols-2 gap-3">
            {PETS.map((pet) => {
              const selected = petType === pet.type
              return (
                <button
                  key={pet.type}
                  type="button"
                  onClick={() => selectPet(pet.type)}
                  className={cn(
                    "relative overflow-hidden rounded-[22px] border bg-card text-left shadow-sm transition-all active:scale-[0.98]",
                    selected ? "border-[var(--coral)] ring-4 ring-[var(--coral)]/10" : "border-border",
                  )}
                >
                  <AutoPhoto src={pet.image} gradient={pet.gradient} alt={pet.label} selected={selected} />
                  <SelectCheck active={selected} />
                  <div className="p-3">
                    <p className="text-[15px] font-extrabold text-foreground">{pet.label}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">{pet.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === "dog-size" && (
        <div>
          <SectionTitle title="Köpeğinizin boyu" subtitle="Araç içi alanı ve sabitleme planını buna göre hazırlıyoruz." />
          <div className="grid grid-cols-3 gap-2.5">
            {DOG_SIZES.map((size) => {
              const selected = dogSize === size.value
              return (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => {
                    setDogSize(size.value)
                    autoAdvance("service")
                  }}
                  className={cn(
                    "relative overflow-hidden rounded-[20px] border bg-card text-left shadow-sm transition-all active:scale-[0.98]",
                    selected ? "border-[var(--coral)] ring-4 ring-[var(--coral)]/10" : "border-border",
                  )}
                >
                  <AutoPhoto src={size.image} gradient={size.gradient} alt={size.label} selected={selected} />
                  <SelectCheck active={selected} />
                  <div className="p-2.5">
                    <p className="text-[14px] font-extrabold text-foreground">{size.label}</p>
                    <p className="mt-0.5 text-[11px] font-extrabold text-muted-foreground">{size.kg}</p>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-muted-foreground/75">{size.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="mt-4 rounded-[22px] border border-border bg-secondary/70 p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Yaklaşık kilo</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setWeightKg((current) => Math.max(1, (current ?? 10) - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm active:scale-95"
              >
                <Minus size={15} />
              </button>
              <div className="flex-1 rounded-2xl bg-card px-4 py-2 text-center text-[18px] font-extrabold text-foreground shadow-sm">
                {weightKg ?? "—"} <span className="text-[12px] text-muted-foreground">kg</span>
              </div>
              <button
                type="button"
                onClick={() => setWeightKg((current) => Math.min(80, (current ?? 10) + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--coral)] text-white shadow-sm active:scale-95"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "cat-carrier" && (
        <div>
          <SectionTitle title="Taşıma kutusu" subtitle="Kutuyu araç içinde sabitliyoruz; yolculuk daha sakin başlıyor." />
          <div className="grid grid-cols-2 gap-3">
            {CARRIER_OPTIONS.map((option) => {
              const selected = hasCarrier === option.value
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    setHasCarrier(option.value)
                    autoAdvance("service")
                  }}
                  className={cn(
                    "relative overflow-hidden rounded-[22px] border bg-card text-left shadow-sm transition-all active:scale-[0.98]",
                    selected ? "border-[var(--coral)] ring-4 ring-[var(--coral)]/10" : "border-border",
                  )}
                >
                  <AutoPhoto src={option.image} gradient={option.gradient} alt={option.label} selected={selected} />
                  <SelectCheck active={selected} />
                  <div className="p-3">
                    <p className="text-[14px] font-extrabold text-foreground">{option.label}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">{option.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="mt-4 rounded-2xl border border-border bg-secondary/70 p-3 text-[12px] font-semibold leading-relaxed text-muted-foreground">
            Kedilerde kapalı taşıma kutusu zorunludur. Kendi kutunuz yoksa Patilioz kutusu satın alma olarak plana eklenir.
          </div>
        </div>
      )}

      {step === "service" && (
        <div>
          <SectionTitle title="Nasıl eşlik edelim?" subtitle="Hizmet türü; tarih, bekleme ve saat seçimlerini belirler." />
          <div className="space-y-3">
            {SERVICES.map((service) => {
              const selected = tripType === service.value
              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => selectService(service.value)}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-[22px] border bg-card p-3.5 text-left shadow-sm transition-all active:scale-[0.99]",
                    selected ? "border-[var(--coral)] ring-4 ring-[var(--coral)]/10" : "border-border",
                  )}
                >
                  <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white", selected ? "bg-[var(--coral)]" : "bg-[var(--navy)]")}>
                    {service.value === "one-way" && <Navigation size={20} />}
                    {service.value === "round-trip" && <CalendarDays size={20} />}
                    {service.value === "accompanied" && <ShieldCheck size={20} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-extrabold text-foreground">{service.label}</span>
                    <span className="mt-0.5 block text-[12px] font-semibold text-muted-foreground">{service.desc}</span>
                    <span className="mt-1 block text-[11px] text-muted-foreground/70">{service.meta}</span>
                  </span>
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border", selected ? "border-[var(--coral)] bg-[var(--coral)] text-white" : "border-border text-transparent")}>
                    <Check size={13} strokeWidth={3} />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === "outbound-date" && (
        <div>
          <SectionTitle
            title="Gidiş tarihi"
            subtitle={tripType === "one-way" ? "Tek yön için tarihi seçin; ardından teslim noktasını netleştireceğiz." : "Müsaitlik tarih, rota ve hizmet tipine göre hesaplanır."}
          />
          <QuickDateChips mode="outbound" onSelect={selectOutboundDate} />
          <CompactCalendar value={outboundDate} onChange={selectOutboundDate} />
          {tripType === "round-trip" && (
            <div className="mt-3">
              <MiniTimeline outboundDate={outboundDate} returnDate={returnDate} />
            </div>
          )}
        </div>
      )}

      {step === "return-date" && (
        <div>
          <SectionTitle title="Dönüş tarihi" subtitle="Dönüş aynı gün olmak zorunda değil; operasyonu net tarihe göre planlarız." />
          <QuickDateChips mode="return" outboundDate={outboundDate} onSelect={selectReturnDate} />
          <CompactCalendar value={returnDate} minIso={outboundDate} onChange={selectReturnDate} />
          <p className="mt-2 text-[11px] font-semibold text-muted-foreground">Dönüş gidişten önce olamaz.</p>
          <div className="mt-3">
            <MiniTimeline outboundDate={outboundDate} returnDate={returnDate} />
          </div>
        </div>
      )}

      {step === "pickup" && (
        <div>
          <SectionTitle
            title="Teslim noktasını seçin"
            subtitle={tripType === "one-way" ? "Teslim araç yanında yapılır. Bu nokta onaylanınca varış noktasına geçeceğiz." : "Teslim araç yanında yapılır. Kapı önü teslim yok."}
          />
          <PointSelector kind="pickup" value={pickupPoint} onSelect={selectPickup} onUseLocation={useCurrentLocation} locating={locating} />
        </div>
      )}

      {step === "dropoff" && (
        <div>
          <SectionTitle
            title="Varış noktasını seçin"
            subtitle={tripType === "one-way" ? "Varış noktası onaylanınca tek yön için uygun gidiş saatlerini göstereceğiz." : "Varışta teslim yine araç yanında yapılır."}
          />
          <PointSelector kind="dropoff" value={dropoffPoint} pickup={pickupPoint} onSelect={selectDropoff} />
        </div>
      )}

      {step === "roundtrip-waiting" && (
        <div>
          <SectionTitle title="Ek bekleme ister misiniz?" subtitle="5 dk bekleme dahil. Ek süre satın alabilirsiniz." />
          <WaitingBlocks service="round-trip" value={extraWaitingBlocks} showPrice={phoneVerified} onChange={selectRoundTripWaiting} />
        </div>
      )}

      {step === "accompanied-waiting" && (
        <div>
          <SectionTitle title="Refakat süresi" subtitle="5 dk bekleme dahil. Ek refakat 15 dk bloklarla planlanır." />
          <WaitingBlocks service="accompanied" value={accompaniedWaitingBlocks} showPrice={phoneVerified} onChange={selectAccompaniedWaiting} />
        </div>
      )}

      {step === "outbound-time" && (
        <div>
          <SectionTitle
            title="Gidiş saati"
            subtitle={
              tripType === "round-trip"
                ? `${formatDateShort(outboundDate)} · Teslim noktasından varışa`
                : tripType === "one-way"
                  ? `${formatDateShort(outboundDate)} · Saat seçilince tek yön özetini göstereceğiz.`
                  : `${formatDateShort(outboundDate)} için müsait zamanlar`
            }
          />
          <div className="mb-4 rounded-[22px] border border-border bg-secondary/70 p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Rota</p>
            <p className="mt-1 line-clamp-2 text-[12px] font-bold text-foreground">{pickupPoint || "Teslim"} → {dropoffPoint || "Varış"}</p>
          </div>
          <TimeSlotPicker value={outboundSlot} onSelect={selectOutboundSlot} />
        </div>
      )}

      {step === "return-time" && (
        <div>
          <SectionTitle title="Dönüş saati" subtitle={`${formatDateShort(returnDate)} · Varış noktasından teslim noktasına`} />
          <div className="mb-4">
            <MiniTimeline outboundDate={outboundDate} returnDate={returnDate} outboundSlot={outboundSlot} returnSlot={returnSlot} />
          </div>
          <TimeSlotPicker value={returnSlot} onSelect={selectReturnSlot} accent="navy" />
        </div>
      )}

      {step === "accompanied-time" && (
        <div>
          <SectionTitle title="Refakat başlangıcı" subtitle={`${formatDateShort(outboundDate)} · +${accompaniedWaitingBlocks * WAITING_BLOCK_MIN} dk ek refakat`} />
          <div className="mb-4 rounded-[22px] border border-border bg-secondary/70 p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Refakat planı</p>
            <p className="mt-1 text-[13px] font-extrabold text-foreground">{FREE_WAIT_MIN} dk dahil · +{accompaniedWaitingBlocks * WAITING_BLOCK_MIN} dk ek refakat</p>
          </div>
          <TimeSlotPicker value={outboundSlot} onSelect={selectAccompaniedSlot} />
        </div>
      )}

      {step === "summary" && (
        <div>
          <SectionTitle
            title={canShowPrice ? "Son kontrol ve ödeme" : "Bilgileri kontrol edin"}
            subtitle={
              canShowPrice
                ? "Özet, indirim ve ödeme yöntemi."
                : "Düzenleme gerekiyorsa satıra dokunun. Tutar telefon doğrulamasından sonra gösterilir."
            }
          />
          <div className="space-y-2 rounded-[20px] border border-border bg-card p-2.5 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => goTo("service")} className="min-w-0 rounded-2xl bg-secondary/70 p-2.5 text-left active:scale-[0.99]">
                <span className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Hizmet</span>
                <span className="mt-0.5 block truncate text-[13px] font-extrabold text-foreground">{SERVICES.find((item) => item.value === tripType)?.label ?? "Seçilmedi"}</span>
              </button>
              <button type="button" onClick={() => goTo("pet")} className="min-w-0 rounded-2xl bg-secondary/70 p-2.5 text-left active:scale-[0.99]">
                <span className="block text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground">Patili dost</span>
                <span className="mt-0.5 block truncate text-[13px] font-extrabold text-foreground">
                  {`${petLabel(petType)}${petType === "dog" ? ` · ${dogSizeLabel(dogSize)}` : ""}${petType === "cat" ? ` · ${hasCarrier ? "Kendi kutusu" : "Kutu satın alındı"}` : ""}`}
                </span>
              </button>
            </div>
            <RouteMiniSummary pickup={pickupPoint} dropoff={dropoffPoint} onPickupEdit={() => goTo("pickup")} onDropoffEdit={() => goTo("dropoff")} />
            <div className={cn("grid gap-2", tripType === "one-way" ? "grid-cols-1" : "grid-cols-3")}>
              <SummaryMiniButton label="Gidiş" value={`${formatDateShort(outboundDate)} · ${outboundSlot ?? "Saat yok"}`} onEdit={() => goTo("outbound-date")} />
              {tripType === "round-trip" && (
                <SummaryMiniButton label="Dönüş" value={`${formatDateShort(returnDate)} · ${returnSlot ?? "Saat yok"}`} onEdit={() => goTo("return-date")} />
              )}
              {tripType === "round-trip" && (
                <SummaryMiniButton
                  label="Bekleme"
                  value={extraWaitingBlocks ? `+${extraWaitingBlocks * WAITING_BLOCK_MIN} dk` : "5 dk dahil"}
                  onEdit={() => goTo("roundtrip-waiting")}
                />
              )}
              {tripType === "accompanied" && (
                <SummaryMiniButton label="Refakat" value={`+${accompaniedWaitingBlocks * WAITING_BLOCK_MIN} dk`} onEdit={() => goTo("accompanied-waiting")} />
              )}
            </div>
          </div>

          {canShowPrice ? (
            <div className="mt-3 space-y-2">
              <div className="rounded-[18px] bg-[var(--navy)] px-3 py-2.5 text-white">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/50">Ödenecek tutar</p>
                    <p className="mt-0.5 text-[22px] font-extrabold leading-none">₺{discounted.toLocaleString("tr-TR")}</p>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="rounded-xl bg-emerald-400/15 px-2.5 py-1 text-right">
                      <p className="text-[9px] font-bold text-emerald-100">İndirim</p>
                      <p className="text-[13px] font-extrabold text-emerald-100">-₺{couponDiscount}</p>
                    </div>
                  )}
                </div>
              </div>

              <DiscountChooser
                availableCoupons={availableCoupons}
                couponCode={couponCode}
                couponApplied={couponApplied}
                couponDiscount={couponDiscount}
                couponMatch={couponMatch}
                couponAvailable={couponAvailable}
                price={price}
                onSelectCoupon={applyCouponCode}
                onCouponInput={updateCouponCode}
              />

              <div className="grid grid-cols-3 gap-1.5 rounded-[18px] border border-border bg-card p-1.5 shadow-sm">
                {PAYMENT_OPTIONS.map((option) => {
                  const Icon = option.Icon
                  const selected = paymentPreference === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectPayment(option.value)}
                      className={cn(
                        "relative flex h-11 items-center justify-center gap-1.5 rounded-[13px] text-center transition-all active:scale-[0.98]",
                        selected ? "bg-[var(--coral)] text-white shadow-sm shadow-coral/20" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      <Icon size={14} />
                      <span className="truncate text-[11px] font-extrabold leading-tight">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-[20px] border border-border bg-secondary/80 p-3">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--navy)] text-white">
                  <LockKeyhole size={15} />
                </span>
                <div>
                  <p className="text-[13px] font-extrabold text-foreground">Tutar doğrulamadan sonra gösterilir</p>
                  <p className="mt-1 text-[11px] font-semibold leading-relaxed text-muted-foreground">
                    Rezervasyon hesabınıza bağlanınca rota, süre ve ek hizmetlere göre net tutarı göstereceğiz.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === "contact-auth" && (
        <div>
          <SectionTitle
            title={phoneVerified || smsConfirmed ? "Ad soyad bilgisi" : "Rezervasyonu bağlayalım"}
            subtitle={
              phoneVerified || smsConfirmed
                ? "Telefon doğrulandı. Hizmet kaydı için ad ve soyad bilgisi gerekir."
                : "Telefon doğrulanınca ad soyad alıp ödeme ve indirim seçeneklerine geçeceğiz."
            }
          />
          {!phoneVerified && !smsConfirmed && (
            <div className="rounded-[20px] border border-border bg-card p-3 shadow-sm">
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--coral)]/10 text-[var(--coral)]">
                  <Smartphone size={16} />
                </span>
                <div>
                  <p className="text-[13px] font-extrabold text-foreground">Telefon doğrulama</p>
                  <p className="text-[10px] font-semibold text-muted-foreground">Tek seferlik SMS kodu gönderilir.</p>
                </div>
              </div>
              <label htmlFor="booking-phone" className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Telefon numarası</label>
              <div className="mt-1.5 flex overflow-hidden rounded-2xl border border-border bg-secondary focus-within:border-[var(--coral)]">
                <span className="flex h-11 items-center border-r border-border px-3 text-[13px] font-extrabold text-foreground">+90</span>
                <input
                  id="booking-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                    setSmsSent(false)
                    setSmsConfirmed(false)
                    setSmsCode("")
                    setSmsError("")
                  }}
                  placeholder="5XX XXX XX XX"
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[15px] font-extrabold tracking-widest text-foreground outline-none placeholder:text-muted-foreground/45"
                />
              </div>
              {smsSent && (
                <div className="mt-3 rounded-2xl border border-border bg-secondary p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="booking-sms-code" className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                      SMS kodu
                    </label>
                    <span className="text-[10px] font-bold text-muted-foreground">Mock: {MOCK_SMS_CODE}</span>
                  </div>
                  <input
                    id="booking-sms-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={smsCode}
                    onChange={(event) => {
                      setSmsCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                      setSmsError("")
                    }}
                    placeholder="000000"
                    className="mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3 text-center text-[18px] font-extrabold tracking-[0.45em] text-foreground outline-none focus:border-[var(--coral)]"
                  />
                  {smsError && <p className="mt-1.5 text-[10px] font-bold text-[var(--coral)]">{smsError}</p>}
                </div>
              )}
              <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                <ShieldCheck size={13} className="text-emerald-600" />
                Numara yalnızca rezervasyon ve ekip koordinasyonu için kullanılır.
              </div>
            </div>
          )}

          {(phoneVerified || smsConfirmed) && (
            <div className="rounded-[20px] border border-border bg-card p-3 shadow-sm">
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Check size={16} strokeWidth={3} />
                </span>
                <div>
                  <p className="text-[13px] font-extrabold text-foreground">Telefon doğrulandı</p>
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    {verifiedPhone ? `+90 ${verifiedPhone}` : `+90 ${phoneDigits}`}
                  </p>
                </div>
              </div>
              <label htmlFor="booking-customer-name" className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Ad soyad</label>
              <input
                id="booking-customer-name"
                type="text"
                autoComplete="name"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Ad Soyad"
                className="mt-1.5 h-11 w-full rounded-2xl border border-border bg-secondary px-3 text-[15px] font-extrabold text-foreground outline-none focus:border-[var(--coral)]"
              />
              <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                <ShieldCheck size={13} className="text-emerald-600" />
                Ad soyad teslim ve rezervasyon kaydı için kullanılır.
              </div>
            </div>
          )}

          {!phoneVerified && !smsConfirmed && (
          <div className="mt-2 rounded-[18px] border border-border bg-secondary/70 p-2.5">
            <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Hesaba bağla</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleProvider("google")}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card text-[11px] font-extrabold text-foreground active:scale-[0.98]"
              >
                <span className="text-[14px]">G</span>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleProvider("apple")}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card text-[11px] font-extrabold text-foreground active:scale-[0.98]"
              >
                <Apple size={14} />
                Apple
              </button>
            </div>
          </div>
          )}
          {socialNotice && (
            <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-[12px] font-semibold text-emerald-800">
              {socialNotice}
            </div>
          )}
        </div>
      )}

      {step === "payment-preference" && (
        <div>
          <SectionTitle
            title="Ödeme ve indirim"
            subtitle={
              canShowPrice
                ? tripType === "one-way"
                  ? "Tek yön tutarını netleştirin, ödeme yöntemini seçin."
                  : "Tutarı netleştirin, ödeme yöntemini seçin."
                : "Tutar için önce iletişim bilgileri tamamlanmalıdır."
            }
          />
          <div className="mb-2 rounded-[20px] bg-[var(--navy)] p-3 text-white">
            {canShowPrice ? (
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/50">Ödenecek tutar</p>
                  <p className="mt-0.5 text-[27px] font-extrabold leading-none">₺{discounted.toLocaleString("tr-TR")}</p>
                </div>
                {couponDiscount > 0 && (
                  <div className="rounded-xl bg-emerald-400/15 px-2.5 py-1.5 text-right">
                    <p className="text-[10px] font-bold text-emerald-100">İndirim</p>
                    <p className="text-[14px] font-extrabold text-emerald-100">-₺{couponDiscount}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <LockKeyhole size={18} className="text-white/70" />
                <div>
                  <p className="text-[13px] font-extrabold">Tutar kilitli</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-white/65">İletişim bilgileri tamamlanınca açılır.</p>
                </div>
              </div>
            )}
          </div>

          {canShowPrice && (
            <div className="mb-2">
              <DiscountChooser
                availableCoupons={availableCoupons}
                couponCode={couponCode}
                couponApplied={couponApplied}
                couponDiscount={couponDiscount}
                couponMatch={couponMatch}
                couponAvailable={couponAvailable}
                price={price}
                onSelectCoupon={applyCouponCode}
                onCouponInput={updateCouponCode}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-1.5">
            {PAYMENT_OPTIONS.map((option) => {
              const Icon = option.Icon
              const selected = paymentPreference === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectPayment(option.value)}
                  className={cn(
                    "relative flex min-h-[76px] flex-col items-start justify-between rounded-[18px] border bg-card p-2.5 text-left shadow-sm transition-all active:scale-[0.99]",
                    selected ? "border-[var(--coral)] ring-4 ring-[var(--coral)]/10" : "border-border",
                  )}
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", selected ? "bg-[var(--coral)] text-white" : "bg-secondary text-muted-foreground")}>
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-extrabold leading-tight text-foreground">{option.label}</span>
                    <span className="mt-0.5 block line-clamp-2 text-[9px] font-semibold leading-tight text-muted-foreground">{option.desc}</span>
                  </span>
                  <span className={cn("absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border", selected ? "border-[var(--coral)] bg-[var(--coral)] text-white" : "border-border text-transparent")}>
                    <Check size={11} strokeWidth={3} />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === "secure-payment" && (
        <div>
          <SectionTitle title="Güvenli ödeme" subtitle="Ödeme tamamlanınca tek yön rezervasyon kodunuz oluşturulur." />
          <div className="mb-2 rounded-[18px] border border-border bg-secondary/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Tutar</p>
                <p className="mt-0.5 text-[22px] font-extrabold text-foreground">₺{discounted.toLocaleString("tr-TR")}</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <LockKeyhole size={16} />
              </span>
            </div>
          </div>
          <div className="space-y-2 rounded-[20px] border border-border bg-card p-3 shadow-sm">
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Kart üzerindeki ad</label>
              <input
                value={onlinePayment.cardholder}
                onChange={(event) => setOnlinePayment((current) => ({ ...current, cardholder: event.target.value }))}
                placeholder="Ad Soyad"
                className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-[13px] font-bold outline-none focus:border-[var(--coral)]"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Kart numarası</label>
              <div className="relative mt-1">
                <input
                  value={showCard ? onlinePayment.cardNumber : maskCard(onlinePayment.cardNumber)}
                  onChange={(event) => setOnlinePayment((current) => ({ ...current, cardNumber: event.target.value.replace(/[^\d\s]/g, "").slice(0, 19) }))}
                  onFocus={() => setShowCard(true)}
                  onBlur={() => setShowCard(false)}
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                  className="h-10 w-full rounded-xl border border-border bg-secondary px-3 pr-10 text-[13px] font-extrabold tracking-wider outline-none focus:border-[var(--coral)]"
                />
                <button
                  type="button"
                  onClick={() => setShowCard((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Kart numarası görünürlüğü"
                >
                  {showCard ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Son kullanma</label>
                <input
                  value={onlinePayment.expiry}
                  onChange={(event) => setOnlinePayment((current) => ({ ...current, expiry: event.target.value.replace(/[^\d/]/g, "").slice(0, 5) }))}
                  placeholder="AA/YY"
                  inputMode="numeric"
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-[13px] font-extrabold outline-none focus:border-[var(--coral)]"
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">CVC</label>
                <input
                  value={onlinePayment.cvc}
                  onChange={(event) => setOnlinePayment((current) => ({ ...current, cvc: event.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  placeholder="123"
                  inputMode="numeric"
                  className="mt-1 h-10 w-full rounded-xl border border-border bg-secondary px-3 text-[13px] font-extrabold outline-none focus:border-[var(--coral)]"
                />
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[10px] font-semibold text-emerald-800">
            <LockKeyhole size={13} />
            Ödeme güvenli altyapı ile alınır.
          </div>
        </div>
      )}

      {step === "confirmation" && (
        <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-emerald-100 bg-emerald-500 text-white shadow-sm">
            <Check size={38} strokeWidth={3} />
          </div>
          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.28em] text-[var(--coral)]">Patilioz</p>
          <h2 className="mt-2 text-[27px] font-extrabold leading-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Yolculuk planınız alındı
          </h2>
          <div className="mt-5 rounded-[22px] border border-dashed border-foreground/20 bg-secondary px-5 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Rezervasyon kodu</p>
            <p className="mt-1 font-mono text-[22px] font-extrabold tracking-wider text-foreground">{confirmationCode}</p>
          </div>
          <div className="mt-5 w-full rounded-[24px] border border-border bg-card p-4 text-left shadow-sm">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Plan özeti</p>
            <p className="mt-2 text-[13px] font-extrabold leading-relaxed text-foreground">
              {formatDateShort(outboundDate)} {outboundSlot} · {pickupPoint || "Teslim"} → {dropoffPoint || "Varış"}
            </p>
            {tripType === "round-trip" && (
              <p className="mt-1 text-[12px] font-semibold text-muted-foreground">Dönüş: {formatDateShort(returnDate)} {returnSlot}</p>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{paymentLabel(paymentPreference)}</span>
              <span className="text-[17px] font-extrabold text-foreground">₺{discounted.toLocaleString("tr-TR")}</span>
            </div>
          </div>
          <div className="mt-4 w-full space-y-2">
            {["SMS gönderildi", "Ekip planlama onayı", "Sürücü atanınca bildirim"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-left text-[12px] font-bold text-emerald-900">
                <CheckCircle2 size={15} className="text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </WizardFrame>
  )
}
