"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, ArrowLeft, ShieldCheck, MessageSquare, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth, PROVIDERS, type AuthProvider } from "@/lib/auth-mock"
import { OtpInput } from "@/components/otp-input"
import { PhoneField, isPhoneValid } from "@/components/phone-field"
import { formatPhoneNumberIntl } from "react-phone-number-input"

type Step = "phone" | "code"

const OTP_LENGTH = 6
const RESEND_SECONDS = 30

export default function KatilPage() {
  const router = useRouter()
  const { isAuthed, hydrated, signIn, signInWithProvider } = useAuth()

  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState<string | undefined>(undefined) // E.164: +905xx...
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  // Zaten giriş yapmışsa hesaba yönlendir.
  useEffect(() => {
    if (hydrated && isAuthed) router.replace("/hesap")
  }, [hydrated, isAuthed, router])

  // Geri sayım sayacı (tekrar gönder).
  useEffect(() => {
    if (resendIn <= 0) return
    const t = window.setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(t)
  }, [resendIn])

  const phoneValid = isPhoneValid(phone)

  const sendCode = useCallback(() => {
    setStep("code")
    setCode("")
    setCodeError(false)
    setResendIn(RESEND_SECONDS)
  }, [])

  const verify = useCallback(
    (value: string) => {
      if (value.length !== OTP_LENGTH) return
      setVerifying(true)
      // ÖN GÖRÜNÜM: gerçek doğrulama yok. Firebase'de confirmationResult.confirm(code).
      // Demoda kısa bir gecikmeyle "başarılı" simülasyonu.
      window.setTimeout(() => {
        signIn(phone ?? "")
        router.replace("/hesap")
      }, 450)
    },
    [phone, signIn, router],
  )

  const handleSocial = (provider: Exclude<AuthProvider, "phone">) => {
    signInWithProvider(provider)
    router.replace("/hesap")
  }

  return (
    <section className="flex min-h-[calc(100dvh-8rem)] flex-col px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col">
        {/* Marka başlığı */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--navy)] shadow-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                fill="white"
              />
            </svg>
          </div>
          <h1
            className="text-2xl font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {step === "phone" ? "Patilio'ya katıl" : "Telefonunu doğrula"}
          </h1>
          <p className="mx-auto mt-1.5 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
            {step === "phone"
              ? "Telefon numaranla saniyeler içinde üye ol. Rezervasyonların, adreslerin ve patili dostların hep yanında."
              : "Sana SMS ile gönderdiğimiz 6 haneli kodu gir."}
          </p>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-white p-5 shadow-sm sm:p-6">
          {step === "phone" ? (
            <PhoneStep
              phone={phone}
              setPhone={setPhone}
              valid={phoneValid}
              onContinue={sendCode}
              onSocial={handleSocial}
            />
          ) : (
            <CodeStep
              phoneDisplay={phone ? formatPhoneNumberIntl(phone) : ""}
              code={code}
              setCode={(v) => {
                setCode(v)
                if (codeError) setCodeError(false)
              }}
              error={codeError}
              verifying={verifying}
              resendIn={resendIn}
              onVerify={verify}
              onResend={sendCode}
              onBack={() => setStep("phone")}
            />
          )}
        </div>

        {/* Güven + yasal */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} className="text-[var(--coral)]" />
          Numaran yalnızca rezervasyon ve bilgilendirme için kullanılır.
        </div>
        <p className="mx-auto mt-3 max-w-[36ch] text-center text-xs leading-relaxed text-muted-foreground">
          Devam ederek{" "}
          <Link href="/kullanim-kosullari" className="font-semibold text-foreground underline-offset-2 hover:underline">
            Kullanım Koşulları
          </Link>{" "}
          ve{" "}
          <Link href="/gizlilik-politikasi" className="font-semibold text-foreground underline-offset-2 hover:underline">
            Gizlilik Politikası
          </Link>
          ‘nı kabul etmiş olursun.
        </p>
      </div>
    </section>
  )
}

/* ---------------- Adım 1: Telefon ---------------- */

function PhoneStep({
  phone,
  setPhone,
  valid,
  onContinue,
  onSocial,
}: {
  phone: string | undefined
  setPhone: (v: string | undefined) => void
  valid: boolean
  onContinue: () => void
  onSocial: (p: Exclude<AuthProvider, "phone">) => void
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onContinue()
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-bold text-foreground">
          Telefon numarası
        </label>
        <PhoneField id="phone" value={phone} onChange={setPhone} autoFocus />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Ülkeni seç, numaranı gir. Doğrulama kodu SMS ile gönderilir; mesaj ve
          veri ücretleri uygulanabilir.
        </p>
      </div>

      <button
        type="submit"
        disabled={!valid}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:scale-[0.98]",
          valid
            ? "bg-[var(--coral)] text-white hover:opacity-90"
            : "cursor-not-allowed bg-border text-muted-foreground",
        )}
      >
        Kod gönder
        <ArrowRight size={16} />
      </button>

      <SocialOptions onSelect={onSocial} />
    </form>
  )
}

/* ---------------- Adım 2: Kod ---------------- */

function CodeStep({
  phoneDisplay,
  code,
  setCode,
  error,
  verifying,
  resendIn,
  onVerify,
  onResend,
  onBack,
}: {
  phoneDisplay: string
  code: string
  setCode: (v: string) => void
  error: boolean
  verifying: boolean
  resendIn: number
  onVerify: (v: string) => void
  onResend: () => void
  onBack: () => void
}) {
  const valid = code.length === OTP_LENGTH

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} /> Numarayı değiştir
      </button>

      <div className="flex items-start gap-2.5 rounded-xl bg-[var(--coral)]/[0.06] p-3">
        <MessageSquare size={16} className="mt-0.5 flex-shrink-0 text-[var(--coral)]" />
        <p className="text-sm text-foreground/80">
          <span className="font-semibold">{phoneDisplay}</span> numarasına kod gönderildi.
        </p>
      </div>

      <OtpInput
        length={OTP_LENGTH}
        value={code}
        onChange={setCode}
        onComplete={onVerify}
        error={error}
      />

      {error && (
        <p className="text-center text-xs font-medium text-[var(--coral)]">
          Kod hatalı. Tekrar dene veya yeni kod iste.
        </p>
      )}

      <button
        type="button"
        disabled={!valid || verifying}
        onClick={() => onVerify(code)}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all active:scale-[0.98]",
          valid && !verifying
            ? "bg-[var(--coral)] text-white hover:opacity-90"
            : "cursor-not-allowed bg-border text-muted-foreground",
        )}
      >
        {verifying ? (
          <>
            <Check size={16} /> Doğrulanıyor…
          </>
        ) : (
          <>
            Doğrula ve katıl
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <div className="text-center text-xs text-muted-foreground">
        {resendIn > 0 ? (
          <span>
            Kod gelmedi mi? <span className="font-semibold text-foreground">{resendIn}s</span> sonra
            tekrar gönderebilirsin.
          </span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            className="font-semibold text-[var(--coral)] hover:underline"
          >
            Kodu tekrar gönder
          </button>
        )}
      </div>
    </div>
  )
}

/* ---------------- Sosyal giriş ---------------- */

function SocialOptions({
  onSelect,
}: {
  onSelect: (provider: Exclude<AuthProvider, "phone">) => void
}) {
  // Apple, App Store yönergesi gereği sosyal listenin üstünde.
  const ordered = [...PROVIDERS].sort((a, b) =>
    a.id === "apple" ? -1 : b.id === "apple" ? 1 : 0,
  )
  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">veya şununla devam et</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ordered.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.03] active:scale-[0.98]"
            aria-label={`${p.label} ile devam et`}
          >
            <ProviderGlyph id={p.id} />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Sağlayıcı marka rozeti — telifsiz, tanınabilir, evrensel render olan SVG. */
function ProviderGlyph({ id }: { id: Exclude<AuthProvider, "phone"> }) {
  if (id === "apple") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-foreground" fill="currentColor" aria-hidden="true">
        <path d="M16.37 12.6c-.02-2.06 1.68-3.05 1.76-3.1-.96-1.4-2.45-1.6-2.98-1.62-1.27-.13-2.48.75-3.12.75-.64 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.38 2.05-1.44 2.5-.37 6.2 1.04 8.23.69.99 1.51 2.1 2.58 2.06 1.03-.04 1.42-.67 2.67-.67 1.25 0 1.6.67 2.69.65 1.11-.02 1.81-1.01 2.49-2 .78-1.15 1.1-2.26 1.12-2.32-.02-.01-2.15-.83-2.17-3.29zM14.4 6.62c.57-.69.95-1.65.85-2.62-.82.03-1.81.55-2.4 1.23-.53.61-.99 1.59-.87 2.53.91.07 1.85-.46 2.42-1.14z" />
      </svg>
    )
  }
  if (id === "google") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
      </svg>
    )
  }
  if (id === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87V12h3.33l-.53 3.47h-2.8v8.38A12 12 0 0 0 24 12z"
        />
      </svg>
    )
  }
  // Instagram
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <defs>
        <radialGradient id="ig-g" cx="0.3" cy="1" r="1">
          <stop offset="0" stopColor="#fdf497" />
          <stop offset="0.05" stopColor="#fdf497" />
          <stop offset="0.45" stopColor="#fd5949" />
          <stop offset="0.6" stopColor="#d6249f" />
          <stop offset="0.9" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-g)" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" />
    </svg>
  )
}
