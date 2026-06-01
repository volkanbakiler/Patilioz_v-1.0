"use client"

import { useState } from "react"
import { Play, BookText, ArrowRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BlogPost, ContentBlock } from "@/lib/blog"
import { openBooking } from "@/lib/booking-bus"
import { MediaFrame } from "@/components/media-frame"
import {
  ReadingProgress,
  SaveButton,
  ShareButton,
} from "@/components/blog-interactions"

type Mode = "watch" | "read"

export function BlogArticle({ post }: { post: BlogPost }) {
  const hasVideo = Boolean(post.video || post.videoDuration)
  // Video varsa varsayılan "izle"; yoksa direkt "oku".
  const [mode, setMode] = useState<Mode>(hasVideo ? "watch" : "read")

  return (
    <>
      <ReadingProgress />

      <div className="mx-auto w-full max-w-[760px] px-4 pb-28 pt-3 sm:px-5 md:pb-12 lg:px-6">
        {/* Başlık bloğu */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-[var(--coral)]/10 px-2 py-0.5 font-bold text-[var(--coral)]">
              {post.category}
            </span>
            <time dateTime={post.dateISO}>{post.date}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1
            className="text-2xl font-extrabold leading-tight text-foreground text-balance sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.title}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </div>

        {/* Medya — video varsa player iskeleti, yoksa kapak */}
        <ArticleMedia post={post} mode={mode} />

        {/* İzle / Oku toggle — sadece video varsa */}
        {hasVideo && (
          <div className="mt-4 inline-flex rounded-full border border-foreground/10 bg-foreground/[0.04] p-1">
            <ModeButton
              active={mode === "watch"}
              onClick={() => setMode("watch")}
              icon={<Play size={15} className="fill-current" />}
              label={`İzle${post.videoDuration ? ` · ${post.videoDuration}` : ""}`}
            />
            <ModeButton
              active={mode === "read"}
              onClick={() => setMode("read")}
              icon={<BookText size={15} />}
              label={`Oku · ${post.readTime.replace(" okuma", "")}`}
            />
          </div>
        )}

        {/* Gövde — "oku" modunda */}
        {(!hasVideo || mode === "read") && (
          <article className="mt-6 space-y-5">
            {post.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}

            {post.faq && post.faq.length > 0 && (
              <div className="space-y-3 pt-2">
                <h2
                  className="text-xl font-extrabold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Sık sorulanlar
                </h2>
                {post.faq.map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-foreground/10 bg-white p-4"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-3 font-bold text-foreground">
                      {f.q}
                      <span className="text-[var(--coral)] transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            )}
          </article>
        )}

        {/* Watch modunda kısa özet daveti */}
        {hasVideo && mode === "watch" && (
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}{" "}
            <button
              type="button"
              onClick={() => setMode("read")}
              className="font-bold text-[var(--coral)] hover:underline"
            >
              Yazının tamamını oku →
            </button>
          </p>
        )}

        {/* Funnel CTA */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-[var(--navy)] p-5 text-white sm:p-6">
          <h2
            className="text-lg font-extrabold sm:text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {post.cta.headline}
          </h2>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/70">
            {post.cta.body}
          </p>
          <button
            type="button"
            onClick={() =>
              post.cta.service ? openBooking({ service: post.cta.service }) : openBooking()
            }
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--coral)] px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            {post.cta.label}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Yapışkan alt aksiyon çubuğu — mobil */}
      <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-[760px] px-4 pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-white/95 p-1.5 shadow-[0_8px_28px_rgba(20,31,53,0.16)] backdrop-blur-xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/[0.05]">
            <SaveButton slug={post.slug} />
          </span>
          <ShareButton
            title={post.title}
            withLabel
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-foreground/[0.05] text-sm font-bold text-foreground"
          />
          <button
            type="button"
            onClick={() =>
              post.cta.service ? openBooking({ service: post.cta.service }) : openBooking()
            }
            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--coral)] text-sm font-bold text-white active:scale-[0.98]"
          >
            Rezervasyon
          </button>
        </div>
      </div>
    </>
  )
}

function ArticleMedia({ post, mode }: { post: BlogPost; mode: Mode }) {
  // Gerçek video kaynağı varsa ve "izle" modundaysak <video>; aksi halde MediaFrame.
  if (post.video && mode === "watch") {
    return (
      <div className="overflow-hidden rounded-2xl bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={post.video}
          controls
          playsInline
          poster={post.image}
          className="aspect-video w-full"
        />
      </div>
    )
  }
  return (
    <MediaFrame
      src={post.image}
      alt={post.title}
      variant={post.variant}
      // Video var ama henüz dosya yoksa: izle modunda yine play overlay göster (placeholder).
      videoDuration={post.video || mode !== "watch" ? undefined : post.videoDuration}
      priority
      className="aspect-video w-full rounded-2xl"
    />
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors",
        active ? "bg-[var(--navy)] text-white" : "text-foreground/60 hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          className="pt-2 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {block.text}
        </h2>
      )
    case "p":
      return (
        <p className="text-[15px] leading-relaxed text-foreground/85">{block.text}</p>
      )
    case "list":
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] text-foreground/85">
              <span
                className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--coral)]"
                aria-hidden="true"
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )
    case "tip":
      return (
        <div className="rounded-2xl border border-[var(--coral)]/20 bg-[var(--coral)]/[0.06] p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--coral)]">
            İpucu · {block.title}
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">{block.body}</p>
        </div>
      )
    case "quote":
      return (
        <blockquote className="flex gap-3 rounded-2xl bg-foreground/[0.04] p-4">
          <Quote size={20} className="flex-shrink-0 text-[var(--coral)]" />
          <p
            className="text-base font-semibold leading-relaxed text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {block.text}
          </p>
        </blockquote>
      )
  }
}
