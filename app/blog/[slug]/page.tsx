import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, ArrowRight, Clock3 } from "lucide-react"
import { posts, getPostBySlug, getRelatedPosts, type BlogPost } from "@/lib/blog"
import { absoluteUrl, buildArticleSchema, SITE } from "@/lib/seo"
import { BlogArticle } from "@/components/blog-article"
import { MediaFrame } from "@/components/media-frame"

type RouteParams = { slug: string }

export function generateStaticParams(): RouteParams[] {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const url = absoluteUrl(`/blog/${post.slug}`)
  return {
    title: `${post.title} | ${SITE.brand}`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: SITE.brand,
      locale: "tr_TR",
      publishedTime: post.dateISO,
      images: post.image ? [{ url: absoluteUrl(post.image) }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const schema = buildArticleSchema(post)
  const related = getRelatedPosts(post.slug)

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Sayfa konumu"
        className="mx-auto max-w-[760px] px-4 pt-4 sm:px-5 lg:px-6"
      >
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              Anasayfa
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={12} />
          </li>
          <li>
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={12} />
          </li>
          <li className="font-medium text-foreground" aria-current="page">
            {post.category}
          </li>
        </ol>
      </nav>

      <BlogArticle post={post} />

      {/* İlgili yazılar */}
      <section
        aria-labelledby="related-heading"
        className="mx-auto max-w-[760px] px-4 pb-12 sm:px-5 lg:px-6"
      >
        <h2
          id="related-heading"
          className="mb-4 text-lg font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          İlgili içerikler
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {related.map((r) => (
            <RelatedCard key={r.slug} post={r} />
          ))}
        </div>
      </section>
    </div>
  )
}

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-3 overflow-hidden rounded-2xl border border-foreground/10 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md"
    >
      <MediaFrame
        src={post.image}
        alt={post.title}
        variant={post.variant}
        videoDuration={post.videoDuration}
        className="h-20 w-24 flex-shrink-0 rounded-xl"
      />
      <div className="min-w-0 flex-1 py-1">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-bold text-[var(--coral)]">{post.category}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 size={11} />
            {post.readTime}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-foreground">
          {post.title}
        </h3>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--coral)]">
          {post.video ? "İzle / oku" : "Oku"}
          <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  )
}
