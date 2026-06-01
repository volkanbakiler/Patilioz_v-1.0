"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-mock"

/** Hesap formlarında ortak kullanılan input sınıfı. */
export const inputCls =
  "w-full rounded-xl border border-foreground/[0.12] bg-white px-3.5 py-3 text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/50 focus:border-[var(--coral)] focus:ring-2 focus:ring-[var(--coral)]/20 transition-all"

/**
 * Korumalı hesap sayfaları için sarmalayıcı.
 * Giriş yapılmamışsa /katil sayfasına yönlendirir.
 * (Ön görünüm: client-side hydration ile; ileride session cookie ile.)
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthed, hydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (hydrated && !isAuthed) router.replace("/katil")
  }, [hydrated, isAuthed, router])

  if (!hydrated) return <div className="min-h-[60vh]" aria-hidden="true" />
  if (!isAuthed) return null

  return <>{children}</>
}
