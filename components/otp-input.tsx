"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Segment OTP girişi — her hane ayrı kutu.
 * - Yazınca otomatik sonraki kutuya ilerler, backspace ile geri döner.
 * - Yapıştırma (paste) tüm kodu dağıtır.
 * - İlk kutuya otomatik odak.
 * - autoComplete="one-time-code" + tek görünür akış: iOS/Android SMS autofill çalışır.
 * - Sadece rakam; numeric klavye.
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  autoFocus = true,
}: {
  length?: number
  value: string
  onChange: (v: string) => void
  onComplete?: (v: string) => void
  error?: boolean
  autoFocus?: boolean
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const completedRef = useRef(false)

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  // Tamamlandığında bir kez onComplete tetikle.
  useEffect(() => {
    if (value.length === length && !completedRef.current) {
      completedRef.current = true
      onComplete?.(value)
    }
    if (value.length < length) completedRef.current = false
  }, [value, length, onComplete])

  const setCharAt = (index: number, char: string) => {
    const chars = value.split("")
    chars[index] = char
    // Diziyi length'e kadar doldur.
    const next = Array.from({ length }, (_, i) => chars[i] ?? "").join("").slice(0, length)
    onChange(next.replace(/\D/g, ""))
  }

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "")
    if (!digit) {
      setCharAt(index, "")
      return
    }
    // Birden fazla karakter geldiyse (autofill/paste) dağıt.
    if (digit.length > 1) {
      const merged = (value.slice(0, index) + digit).replace(/\D/g, "").slice(0, length)
      onChange(merged)
      const focusAt = Math.min(merged.length, length - 1)
      refs.current[focusAt]?.focus()
      return
    }
    setCharAt(index, digit)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        setCharAt(index, "")
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
        setCharAt(index - 1, "")
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (pasted) {
      onChange(pasted)
      const focusAt = Math.min(pasted.length, length - 1)
      refs.current[focusAt]?.focus()
    }
  }

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          aria-label={`Kod hanesi ${i + 1}`}
          className={cn(
            "h-12 w-full min-w-0 rounded-xl border bg-secondary text-center text-xl font-bold text-foreground outline-none transition-all sm:h-14",
            "focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/30",
            error
              ? "border-[var(--coral)] ring-2 ring-[var(--coral)]/25"
              : value[i]
              ? "border-[var(--coral)]/40"
              : "border-border",
          )}
        />
      ))}
    </div>
  )
}
