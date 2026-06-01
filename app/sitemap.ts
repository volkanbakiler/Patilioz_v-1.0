import type { MetadataRoute } from "next"
import { services } from "@/lib/services"
import { posts } from "@/lib/blog"
import { absoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/hizmetler"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/sss"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/iletisim"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/hakkimizda"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/kariyer"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/basin"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/is-birligi"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/gizlilik-politikasi"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/kullanim-kosullari"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map((svc) => ({
    url: absoluteUrl(`/hizmetler/${svc.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.dateISO),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes]
}
