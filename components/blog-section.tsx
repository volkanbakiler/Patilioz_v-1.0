import Link from "next/link"
import { ArrowRight, Clock3 } from "lucide-react"
import { posts } from "@/lib/blog"
import { MediaFrame } from "@/components/media-frame"

export function BlogSection() {
  const featured = posts.slice(0, 3)

  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
              Blog
            </p>
            <h2
              className="mt-2 text-3xl font-extrabold text-foreground text-balance sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bilgi ve rehberler
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--coral)] hover:underline"
          >
            Tüm yazılar
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <MediaFrame
                src={post.image}
                alt={post.title}
                variant={post.variant}
                videoDuration={post.videoDuration}
                badge={post.category}
                className="aspect-[16/9] w-full"
              />
              <div className="flex flex-1 flex-col gap-2 p-5">
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
                  Devamını oku
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
