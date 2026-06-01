"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Clock3, Search, X } from "lucide-react"
import { CATEGORIES, type BlogCategory, type BlogPost } from "@/lib/blog"
import { MediaFrame } from "@/components/media-frame"
import { CategoryChips, SaveButton } from "@/components/blog-interactions"

type Filter = "all" | BlogCategory

export function BlogFeed({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")

  const visible = useMemo(() => {
    let result = filter === "all" ? posts : posts.filter((p) => p.category === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    return result
  }, [filter, posts, search])

  return (
    <div className="space-y-5">
      {/* Arama çubuğu */}
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Başlık, kategori veya konu ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--coral)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/20"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Aramayı temizle"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Kategori chip bar */}
      <CategoryChips categories={CATEGORIES} active={filter} onChange={setFilter} />

      {/* Eşit kart ızgarası — hiçbir yazı diğerinden baskın değil */}
      {visible.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <FeedCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {search ? "Arama sonucu bulunamadı. Lütfen başka bir arama yapın." : "Bu kategoride henüz içerik yok. Yakında ekleyeceğiz."}
        </p>
      )}
    </div>
  )
}

function FeedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <MediaFrame
        src={post.image}
        alt={post.title}
        variant={post.variant}
        videoDuration={post.videoDuration}
        badge={post.category}
        className="aspect-[16/9] w-full"
      />
      {/* kaydet — kartın sağ üstünde, görselin üstünde */}
      <span className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
        <SaveButton slug={post.slug} />
      </span>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={post.dateISO}>{post.date}</time>
          <span className="inline-flex items-center gap-1">
            <Clock3 size={12} />
            {post.readTime}
          </span>
        </div>
        <h3
          className="text-base font-extrabold leading-snug text-foreground text-balance"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-[var(--coral)]">
          {post.video ? "İzle veya oku" : "Devamını oku"}
          <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  )
}
