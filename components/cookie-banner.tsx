"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const CONSENT_KEY = "patilioz:cookie-consent"

type ConsentState = "accepted" | "declined" | null

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>("accepted")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null
    setConsent(stored)
    if (stored === null) {
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = (value: ConsentState) => {
    setVisible(false)
    setTimeout(() => {
      localStorage.setItem(CONSENT_KEY, value!)
      setConsent(value)
    }, 300)
  }

  if (consent !== null) return null

  return (
    <div
      role="region"
      aria-label="Çerez bildirimi"
      aria-live="polite"
      className={cn(
        // Masaüstünde gizle — alt bar yok, footer yeterli
        "fixed inset-x-0 z-50 md:hidden",
        // Alt barın (h-16 + safe area) tam üstüne yapışık
        "bottom-[calc(4rem+env(safe-area-inset-bottom))]",
        "transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      {/* h-8 = 32px = alt bar yüksekliğinin tam yarısı */}
      <div className="flex h-8 items-center justify-between gap-3 border-t border-foreground/[0.08] bg-white/95 px-4 shadow-[0_-4px_12px_rgba(20,31,53,0.07)] backdrop-blur-md">
        <p className="min-w-0 truncate text-[11px] text-muted-foreground">
          Hizmet kalitesini artırmak için anonim analitik çerezler kullanıyoruz.{" "}
          <Link
            href="/gizlilik-politikasi#cerezler"
            className="font-semibold text-[var(--coral)] hover:underline"
          >
            Detay
          </Link>
        </p>
        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => dismiss("accepted")}
            className="rounded-lg bg-[var(--coral)] px-3 py-1 text-[11px] font-extrabold text-white transition-opacity hover:opacity-90 active:scale-[0.97]"
          >
            Kabul
          </button>
          <button
            type="button"
            onClick={() => dismiss("declined")}
            className="rounded-lg px-2 py-1 text-[11px] font-semibold text-foreground/45 transition-colors hover:text-foreground"
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  )
}
