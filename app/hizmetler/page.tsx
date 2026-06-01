import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { services } from "@/lib/services"
import { absoluteUrl, SITE } from "@/lib/seo"

export const metadata: Metadata = {
  title: `Pet Taksi Hizmetleri | ${SITE.brand}`,
  description:
    "Standart, gidiş–dönüş ve refakatçili pet taksi seçenekleri. Sigortalı, takip edilebilir ve aile dostu. İstanbul'da hizmet veriyoruz.",
  alternates: { canonical: absoluteUrl("/hizmetler") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/hizmetler"),
    title: `Pet Taksi Hizmetleri | ${SITE.brand}`,
    description:
      "Standart, gidiş–dönüş ve refakatçili pet taksi seçenekleri. İstanbul.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

export default function ServicesHubPage() {
  return (
    <article className="bg-background">
      {/* Breadcrumb */}
      <nav
        aria-label="Sayfa konumu"
        className="px-6 lg:px-10 pt-6 max-w-4xl mx-auto"
      >
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Anasayfa
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={12} />
          </li>
          <li className="text-foreground font-medium" aria-current="page">
            Hizmetler
          </li>
        </ol>
      </nav>

      <header className="px-6 lg:px-10 pt-8 pb-10 sm:pt-12 sm:pb-14 max-w-4xl mx-auto">
        <p className="text-[var(--coral)] text-xs font-bold uppercase tracking-widest mb-3">
          Hizmetlerimiz
        </p>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground text-balance leading-tight mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Patili dostlarımızla
          <br />
          <span className="text-[var(--coral)]">birlikte yoldayız.</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl">
          Üç farklı hizmet, üç farklı sorumluluk seviyesi. İhtiyacınıza uygun
          olanı seçin; sürecin her adımında yanınızdayız.
        </p>
      </header>

      <section className="max-w-4xl mx-auto px-6 lg:px-10 pb-16 sm:pb-24 grid gap-4">
        {services.map((svc) => (
          <Link
            key={svc.slug}
            href={`/hizmetler/${svc.slug}`}
            className="group flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-6 rounded-2xl bg-white border border-border hover:border-[var(--coral)]/40 hover:shadow-lg transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-muted-foreground mb-1">
                {svc.id}
              </p>
              <h2
                className="text-xl font-extrabold text-foreground mb-1.5 leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {svc.name}
              </h2>
              <p className="text-sm text-foreground/80 font-medium mb-1">
                {svc.tagline}
              </p>
              <p className="text-xs text-muted-foreground">{svc.duration}</p>
            </div>
            <ArrowRight
              size={20}
              className="text-muted-foreground group-hover:text-[var(--coral)] group-hover:translate-x-1 transition-all flex-shrink-0"
            />
          </Link>
        ))}
      </section>
    </article>
  )
}
