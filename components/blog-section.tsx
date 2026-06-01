import Link from "next/link"
import { ArrowRight, Clock3 } from "lucide-react"
import { posts } from "@/lib/blog"
import { MediaFrame } from "@/components/media-frame"

export function BlogSection() {
  // Anasayfada ilk 3 yazı — feed'in önizlemesi.
  const preview = posts.slice(0, 3)

  return (
    <section id="blog" className="scroll-mt-20 px-3 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto w-full max-w-[1120px] rounded-lg border border-foreground/10 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase text-[var(--coral)]">Patilio Akış</p>
            <h2
              className="mt-1 text-2xl font-extrabold text-foreground text-balance sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bilgiler ve Rehber
            </h2>
          </div>
          <Link
            href="/blog"
            className="flex flex-shrink-0 items-center gap-2 text-sm font-bold text-[var(--coral)] transition-opacity hover:opacity-80"
          >
            Tüm içerikler <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {preview.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex gap-3 overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.025] p-3 transition-colors duration-300 hover:border-[var(--coral)]/35 hover:bg-white lg:flex-col lg:p-0"
            >
              <MediaFrame
                src={post.image}
                alt={post.title}
                variant={post.variant}
                videoDuration={post.videoDuration}
                badge={post.category}
                className="h-20 w-20 flex-shrink-0 rounded-lg lg:h-32 lg:w-full lg:rounded-b-none"
              />
              <div className="min-w-0 flex-1 space-y-2 lg:p-3 lg:pt-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={post.dateISO}>{post.date}</time>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} />
                    {post.readTime}
                  </span>
                </div>
                <h3
                  className="text-sm font-extrabold leading-snug text-foreground text-balance"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {post.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--coral)]">
                  {post.video ? "İzle veya oku" : "Devamını oku"}
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
