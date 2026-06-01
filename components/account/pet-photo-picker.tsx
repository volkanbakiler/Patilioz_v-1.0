"use client"

import { useRef, useState } from "react"
import { Camera, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Pet fotoğrafı seçici (ön görünüm).
 * Cihazdan foto seçer, canvas ile ~320px'e küçültüp JPEG base64 üretir
 * (localStorage'ı şişirmemek için). Foto yoksa tür emojili placeholder.
 */
export function PetPhotoPicker({
  value,
  onChange,
  type,
  size = 96,
}: {
  value?: string
  onChange: (dataUrl: string | undefined) => void
  type: "dog" | "cat" | "other"
  size?: number
}) {
  const fallbackEmoji = type === "cat" ? "🐈" : type === "dog" ? "🐕" : "🐾"
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)

  const pick = () => inputRef.current?.click()

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    try {
      const dataUrl = await downscale(file, 320)
      onChange(dataUrl)
    } catch {
      // sessiz — desteklenmeyen dosya
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={pick}
        className="relative flex-shrink-0 overflow-hidden rounded-2xl border border-foreground/10 bg-[var(--coral)]/[0.06] transition-colors hover:bg-[var(--coral)]/[0.1]"
        style={{ width: size, height: size }}
        aria-label="Fotoğraf seç"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl">
            {fallbackEmoji}
          </span>
        )}
        <span
          className={cn(
            "absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/45 py-1 text-[10px] font-bold text-white backdrop-blur-sm",
          )}
        >
          <Camera size={11} /> {busy ? "…" : value ? "Değiştir" : "Foto"}
        </span>
      </button>

      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground">Profil fotoğrafı</p>
        <p className="text-xs text-muted-foreground">Kare foto en iyi görünür.</p>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--coral)] hover:underline"
          >
            <X size={12} /> Fotoğrafı kaldır
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  )
}

/** Görseli kare kırpıp max boyuta küçülterek JPEG data URL döndürür. */
function downscale(file: File, max: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2
        const canvas = document.createElement("canvas")
        canvas.width = max
        canvas.height = max
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("no ctx"))
        ctx.drawImage(img, sx, sy, side, side, 0, 0, max, max)
        resolve(canvas.toDataURL("image/jpeg", 0.82))
      }
      img.onerror = reject
      img.src = reader.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
