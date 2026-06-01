import type { Metadata } from "next"
import { posts } from "@/lib/blog"
import { absoluteUrl, SITE } from "@/lib/seo"
import { BlogFeed } from "@/components/blog-feed"

export const metadata: Metadata = {
  title: `Blog — Pet Bakım, Sağlık ve Seyahat Rehberi | ${SITE.brand}`,
  description:
    "Evcil hayvan bakımı, sağlığı ve şehir hayatı için pratik rehberler. Veteriner ziyaretinden seyahate, patili dostunuz için bilmeniz gerekenler.",
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog"),
    title: `Blog | ${SITE.brand}`,
    description:
      "Evcil hayvan bakımı, sağlığı ve seyahat için pratik rehberler.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

export default function BlogPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/blog/${p.slug}`),
      name: p.title,
    })),
  }

  return (
    <section className="px-3 py-4 sm:px-4 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="mx-auto w-full max-w-[1120px]">
        <header className="mb-5 px-1">
          <p className="text-[10px] font-bold uppercase text-[var(--coral)]">
            Blog
          </p>
          <h1
            className="mt-1 text-3xl font-extrabold text-foreground text-balance sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bilgi ve rehberler
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Evcil hayvanınızın bakımı, sağlığı ve şehir hayatı için pratik
            rehberler. Kısa videolarla izleyebilir, dilerseniz tüm yazıyı
            okuyabilirsiniz.
          </p>
        </header>

        <BlogFeed posts={posts} />
      </div>
    </section>
  )
}
