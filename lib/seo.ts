import type { ServiceContent } from "./services"
import type { BlogPost } from "./blog"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://patilioz.com"
const BRAND = "Patilioz"

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`
  return `${SITE_URL}${path}`
}

/** Bir hizmet sayfası için Schema.org Service + FAQPage + BreadcrumbList graph üretir. */
export function buildServiceSchema(svc: ServiceContent) {
  const url = absoluteUrl(`/hizmetler/${svc.slug}`)

  const serviceNode = {
    "@type": "Service",
    "@id": `${url}#service`,
    name: svc.name,
    serviceType: svc.name,
    description: svc.description,
    url,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}#org`,
      name: BRAND,
      url: SITE_URL,
      areaServed: {
        "@type": "City",
        name: "İstanbul",
      },
    },
    areaServed: {
      "@type": "City",
      name: "İstanbul",
    },
    audience: {
      "@type": "PeopleAudience",
      audienceType: "Evcil hayvan sahipleri",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
      url,
      description: svc.pricing.body,
    },
  }

  const faqNode = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: svc.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  }

  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Anasayfa",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hizmetler",
        item: absoluteUrl("/hizmetler"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: svc.name,
        item: url,
      },
    ],
  }

  return {
    "@context": "https://schema.org",
    "@graph": [serviceNode, faqNode, breadcrumbNode],
  }
}

/** Bir blog yazısı için Article + BreadcrumbList (+ varsa VideoObject) graph üretir. */
export function buildArticleSchema(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`)
  const image = post.image ? absoluteUrl(post.image) : absoluteUrl("/images/hero-pet.jpg")

  const articleNode = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    articleSection: post.category,
    image,
    author: { "@type": "Organization", name: BRAND, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: BRAND,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }

  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Anasayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  }

  const graph: object[] = [articleNode, breadcrumbNode]

  if (post.faq && post.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    })
  }

  return { "@context": "https://schema.org", "@graph": graph }
}

/** LocalBusiness — anasayfada veya hub'da kullanılabilir. */
export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}#org`,
    name: BRAND,
    url: SITE_URL,
    description:
      "İstanbul'da evcil hayvanlar için sigortalı, takip edilebilir pet taksi ve refakatçi taşıma hizmetleri.",
    areaServed: {
      "@type": "City",
      name: "İstanbul",
    },
    image: absoluteUrl("/images/hero-pet.jpg"),
  }
}

export const SITE = {
  url: SITE_URL,
  brand: BRAND,
}
