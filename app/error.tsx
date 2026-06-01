"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Production'da burası Sentry / benzeri servisine gönderilir.
    console.error("[Patilioz Error]", error)
  }, [error])

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
        Hata
      </p>
      <h1
        className="mb-4 text-2xl font-extrabold text-foreground sm:text-3xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Bir şeyler ters gitti.
      </h1>
      <p className="mb-10 max-w-sm text-base leading-relaxed text-muted-foreground">
        Geçici bir sorun oluştu. Yeniden denemek ister misiniz?
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--coral)] px-6 text-sm font-extrabold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Tekrar dene
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-foreground/10 bg-white px-6 text-sm font-extrabold text-foreground transition-colors hover:border-foreground/20"
        >
          Anasayfaya dön
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-xs text-muted-foreground/60">
          Hata kodu: {error.digest}
        </p>
      )}
    </div>
  )
}
