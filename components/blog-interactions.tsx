"use client"

import { useCallback, useEffect, useState } from "react"
import { Bookmark, Check, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

/* ---------------- Kaydet (bookmark) — localStorage ---------------- */

const SAVED_KEY = "patilioz:saved-posts"
const SAVED_EVENT = "patilioz:saved-changed"

function readSaved(): string[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(window.localStorage.getItem(SAVED_KEY) || "[]")
  } catch {
    return []
  }
}

function writeSaved(slugs: string[]) {
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(slugs))
    window.dispatchEvent(new CustomEvent(SAVED_EVENT))
  } catch {
    /* sessiz */
  }
}

export function useSavedPost(slug: string) {
  const [saved, setSaved] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const sync = () => setSaved(readSaved().includes(slug))
    sync()
    setHydrated(true)
    window.addEventListener(SAVED_EVENT, sync)
    return () => window.removeEventListener(SAVED_EVENT, sync)
  }, [slug])

  const toggle = useCallback(() => {
    const cur = readSaved()
    writeSaved(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug])
  }, [slug])

  return { saved: hydrated && saved, toggle }
}

/* ---------------- Paylaş — Web Share API + kopyala fallback ---------------- */

export function useShare(title: string) {
  const [copied, setCopied] = useState(false)

  const share = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        /* kullanıcı iptal etti — sessiz */
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* sessiz */
    }
  }, [title])

  return { share, copied }
}

/* ---------------- Reading progress bar (yazı üstü) ---------------- */

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Hangi element gerçekten dikey scroll ediyor? AppShell'in <main>'i
    // overflow-x-hidden; dikey scroll genelde window/document'tedir. Runtime'da
    // tespit et: <main> kendi içinde scroll ediyorsa onu, değilse window'u dinle.
    const main = document.querySelector("main") as HTMLElement | null
    const mainScrolls =
      !!main && main.scrollHeight > main.clientHeight + 4

    const compute = () => {
      if (mainScrolls && main) {
        const max = main.scrollHeight - main.clientHeight
        setProgress(max > 0 ? Math.min(100, (main.scrollTop / max) * 100) : 0)
      } else {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0)
      }
    }

    const target: HTMLElement | Window = mainScrolls && main ? main : window
    compute()
    target.addEventListener("scroll", compute, { passive: true })
    window.addEventListener("resize", compute, { passive: true })
    return () => {
      target.removeEventListener("scroll", compute)
      window.removeEventListener("resize", compute)
    }
  }, [])

  return (
    <div className="sticky top-0 z-30 h-1 w-full bg-transparent">
      <div
        className="h-full bg-[var(--coral)] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/* ---------------- Kategori filtre chip bar (feed) ---------------- */

export function CategoryChips<T extends string>({
  categories,
  active,
  onChange,
}: {
  categories: { label: string; value: T }[]
  active: T
  onChange: (value: T) => void
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-none pb-1"
      style={{ scrollbarWidth: "none" }}
      role="tablist"
      aria-label="İçerik kategorileri"
    >
      {categories.map((c) => (
        <button
          key={c.value}
          type="button"
          role="tab"
          aria-selected={active === c.value}
          onClick={() => onChange(c.value)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors active:scale-[0.97]",
            active === c.value
              ? "bg-[var(--navy)] text-white"
              : "bg-foreground/[0.06] text-foreground/70 hover:bg-foreground/10",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

/* ---------------- Kart/satır içi kaydet butonu ---------------- */

export function SaveButton({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const { saved, toggle } = useSavedPost(slug)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle()
      }}
      aria-pressed={saved}
      aria-label={saved ? "Kaydedildi" : "Kaydet"}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors",
        saved ? "text-[var(--coral)]" : "text-foreground/45 hover:text-foreground/70",
        className,
      )}
    >
      <Bookmark size={18} className={saved ? "fill-current" : ""} />
    </button>
  )
}

/* ---------------- Paylaş butonu (etiketli/ikon) ---------------- */

export function ShareButton({
  title,
  withLabel,
  className,
}: {
  title: string
  withLabel?: boolean
  className?: string
}) {
  const { share, copied } = useShare(title)
  return (
    <button
      type="button"
      onClick={share}
      aria-label="Paylaş"
      className={cn("inline-flex items-center justify-center gap-2 transition-colors", className)}
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      {withLabel && <span>{copied ? "Kopyalandı" : "Paylaş"}</span>}
    </button>
  )
}
