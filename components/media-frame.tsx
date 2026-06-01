"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Bağlama uygun görsel çerçevesi.
 *
 * - `src` verildi ve dosya yüklenebiliyorsa gerçek fotoğrafı (next/image) gösterir.
 * - Dosya yoksa / yüklenemezse `variant`'a uygun, markaya özel SVG illüstrasyona düşer.
 *
 * Böylece `public/images/blog-1.jpg` gibi bir dosya eklendiğinde alan otomatik
 * olarak fotoğrafa geçer; dosya yoksa boş kutu yerine anlamlı bir görsel durur.
 */
export type ArtworkVariant = "travel" | "health" | "cityLife" | "pet" | "route"

export function MediaFrame({
  src,
  alt,
  variant,
  className,
  imageClassName,
  priority,
  videoDuration,
  badge,
}: {
  src?: string
  alt: string
  variant: ArtworkVariant
  className?: string
  imageClassName?: string
  priority?: boolean
  /** Verilirse "izlenebilir" sinyali: play overlay + süre rozeti gösterir. */
  videoDuration?: string
  /** Sol üstte küçük etiket (örn. kategori). */
  badge?: string
}) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <div
      className={cn(
        "group/media relative overflow-hidden bg-[var(--navy)]",
        className,
      )}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 360px"
          priority={priority}
          onError={() => setFailed(true)}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <Artwork variant={variant} title={alt} />
      )}

      {badge && (
        <span className="absolute left-2 top-2 z-10 rounded-md bg-black/45 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
          {badge}
        </span>
      )}

      {videoDuration && (
        <>
          {/* Play overlay — video içeriği olduğunu gösterir (Reels/TikTok refleksi) */}
          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[var(--navy)] shadow-lg transition-transform duration-300 group-hover/media:scale-110">
              <Play size={18} className="ml-0.5 fill-current" />
            </span>
          </span>
          <span className="absolute bottom-2 right-2 z-10 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {videoDuration}
          </span>
        </>
      )}
    </div>
  )
}

/** Markaya özel, navy zemin + coral aksanlı dekoratif SVG illüstrasyonlar. */
function Artwork({ variant, title }: { variant: ArtworkVariant; title: string }) {
  return (
    <svg
      viewBox="0 0 400 240"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`mf-bg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--navy)" />
          <stop offset="100%" stopColor="oklch(0.24 0.07 250)" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#mf-bg-${variant})`} />
      {/* hafif arka plan pati izleri (tüm varyantlarda ortak doku) */}
      <g fill="white" opacity="0.05">
        <Paw x={36} y={188} s={0.9} />
        <Paw x={350} y={48} s={0.7} />
      </g>
      {variant === "travel" && <TravelArt />}
      {variant === "health" && <HealthArt />}
      {variant === "cityLife" && <CityLifeArt />}
      {variant === "route" && <RouteArt />}
      {variant === "pet" && <PetArt />}
    </svg>
  )
}

// Tek bir pati izi — koordinat ve ölçek ile yerleştirilir.
function Paw({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="6" rx="7" ry="6" />
      <ellipse cx="-8" cy="-5" rx="3" ry="4" />
      <ellipse cx="-2" cy="-9" rx="3" ry="4" />
      <ellipse cx="5" cy="-9" rx="3" ry="4" />
      <ellipse cx="10" cy="-4" rx="3" ry="4" />
    </g>
  )
}

// Seyahat: yol + hareketli araç + valiz/çanta hissi
function TravelArt() {
  return (
    <g>
      <path
        d="M0 176 H400"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="2"
        strokeDasharray="14 12"
      />
      {/* basit araç gövdesi */}
      <g transform="translate(150 120)">
        <rect x="0" y="22" width="100" height="34" rx="10" fill="var(--coral)" />
        <path d="M14 22 Q24 4 52 4 H70 Q86 6 92 22 Z" fill="white" opacity="0.92" />
        <circle cx="26" cy="58" r="11" fill="white" />
        <circle cx="26" cy="58" r="5" fill="var(--navy)" />
        <circle cx="78" cy="58" r="11" fill="white" />
        <circle cx="78" cy="58" r="5" fill="var(--navy)" />
        {/* camda patili dost */}
        <g fill="var(--navy)" opacity="0.85">
          <Paw x={52} y={14} s={0.5} />
        </g>
      </g>
      <circle cx="320" cy="70" r="20" fill="white" opacity="0.12" />
    </g>
  )
}

// Sağlık: kalkan + kalp/artı (güven & bakım)
function HealthArt() {
  return (
    <g transform="translate(200 120)">
      <path
        d="M0 -58 L48 -40 V6 Q48 46 0 64 Q-48 46 -48 6 V-40 Z"
        fill="white"
        opacity="0.10"
        stroke="white"
        strokeOpacity="0.18"
        strokeWidth="2"
      />
      {/* artı işareti */}
      <rect x="-9" y="-30" width="18" height="62" rx="6" fill="var(--coral)" />
      <rect x="-31" y="-8" width="62" height="18" rx="6" fill="var(--coral)" />
      <g fill="white" opacity="0.9">
        <Paw x={0} y={44} s={0.55} />
      </g>
    </g>
  )
}

// Şehir yaşamı: silüet binalar + pencereler
function CityLifeArt() {
  const buildings = [
    { x: 70, w: 44, h: 96 },
    { x: 124, w: 56, h: 132 },
    { x: 190, w: 40, h: 80 },
    { x: 240, w: 52, h: 118 },
    { x: 302, w: 38, h: 92 },
  ]
  return (
    <g>
      {buildings.map((b, i) => (
        <g key={i}>
          <rect
            x={b.x}
            y={196 - b.h}
            width={b.w}
            height={b.h}
            rx="4"
            fill="white"
            opacity={i % 2 === 0 ? 0.12 : 0.08}
          />
          {/* pencereler */}
          {Array.from({ length: Math.floor(b.h / 22) }).map((_, r) => (
            <rect
              key={r}
              x={b.x + 8}
              y={196 - b.h + 12 + r * 22}
              width="10"
              height="10"
              rx="2"
              fill="var(--coral)"
              opacity={(i + r) % 3 === 0 ? 0.9 : 0.3}
            />
          ))}
        </g>
      ))}
      <line x1="40" y1="196" x2="360" y2="196" stroke="white" strokeOpacity="0.18" strokeWidth="2" />
    </g>
  )
}

// Rota: A→B noktaları arasında eğri + pati
function RouteArt() {
  return (
    <g>
      <path
        d="M70 178 C 140 178, 120 80, 200 80 S 290 92, 330 64"
        stroke="var(--coral)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 16"
        opacity="0.9"
      />
      <circle cx="70" cy="178" r="10" fill="var(--coral)" />
      <circle cx="70" cy="178" r="18" stroke="var(--coral)" strokeWidth="2" opacity="0.4" />
      <g fill="var(--coral)">
        <Paw x={330} y={56} s={0.9} />
      </g>
    </g>
  )
}

// Genel pet: büyük merkezi pati
function PetArt() {
  return (
    <g fill="var(--coral)" transform="translate(200 120) scale(3.4)">
      <Paw x={0} y={0} s={1} />
    </g>
  )
}
