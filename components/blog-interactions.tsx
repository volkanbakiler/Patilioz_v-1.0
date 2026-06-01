"use client"

import { useEffect, useState } from "react"
import { Bookmark, Check, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BlogCategory } from "@/lib/blog"

/* ─── Kategori chip bar ─── */

type Filter = "all" | BlogCategory

export function CategoryChips({
  categories,
  active,
  onChange,
}: {
  categories: { label: "Tümü" | BlogCategory; value: Filter }[]
  active: Filter
  onChange: (value: Filter) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = cat.value === active
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-bold transition-all active:scale-[0.97]",
              isActive
                ? "border-[var(--coral)] bg-[var(--coral)] text-white"
                : "border-foreground/10 bg-white text-foreground/70 hover:border-foreground/20",
            )}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Kaydet butonu (localStorage) ─── */

const SAVE_KEY = "patilioz:saved-posts"
const SAVE_EVENT = "patilioz:saved-changed"

function readSaved(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function writeSaved(list: string[]) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent(SAVE_EVENT))
  } catch {
    /* sessiz */
  }
}

export function SaveButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const sync = () => setSaved(readSaved().includes(slug))
    sync()
    window.addEventListener(SAVE_EVENT, sync)
    return () => window.removeEventListener(SAVE_EVENT, sync)
  }, [slug])

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const list = readSaved()
    writeSaved(
      list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug],
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Kaydedildi" : "Kaydet"}
      className="inline-flex items-center justify-center text-foreground/55 transition-colors hover:text-[var(--coral)]"
    >
      <Bookmark
        size={17}
        className={cn(saved && "fill-[var(--coral)] text-[var(--coral)]")}
      />
    </button>
  )
}

/* ─── Okuma ilerleme çubuğu ─── */

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-[var(--coral)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/* ─── Paylaş butonu ─── */

export function ShareButton({
  title,
  withLabel,
  className,
}: {
  title: string
  withLabel?: boolean
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        /* iptal edildi */
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* sessiz */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Paylaş"
      className={cn(
        !className &&
          "inline-flex items-center justify-center text-foreground/55 transition-colors hover:text-[var(--coral)]",
        className,
      )}
    >
      {copied ? <Check size={17} /> : <Share2 size={17} />}
      {withLabel && <span>{copied ? "Kopyalandı" : "Paylaş"}</span>}
    </button>
  )
}
