import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import {
  getServiceBySlug,
  getRelatedServices,
  services,
  type ServiceContent,
} from "@/lib/services"
import { absoluteUrl, buildServiceSchema, SITE } from "@/lib/seo"
import { ServiceCtaButton } from "@/components/service-cta-button"
import { ServiceFaq } from "@/components/service-faq"

type RouteParams = { slug: string }

export function generateStaticParams(): RouteParams[] {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { slug } = await params
  const svc = getServiceBySlug(slug)
  if (!svc) return {}
  const url = absoluteUrl(`/hizmetler/${svc.slug}`)
  return {
    title: `${svc.pageTitle} | ${SITE.brand}`,
    description: svc.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: svc.pageTitle,
      description: svc.description,
      siteName: SITE.brand,
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title: svc.pageTitle,
      description: svc.description,
    },
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { slug } = await params
  const svc = getServiceBySlug(slug)
  if (!svc) notFound()

  const schema = buildServiceSchema(svc)
  const related = getRelatedServices(svc.slug)

  return (
    <article className="bg-background">
      {/* JSON-LD: Service + FAQPage + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

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
          <li>
            <Link
              href="/hizmetler"
              className="hover:text-foreground transition-colors"
            >
              Hizmetler
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={12} />
          </li>
          <li className="text-foreground font-medium" aria-current="page">
            {svc.name}
          </li>
        </ol>
      </nav>

      {/* Hero / H1 */}
      <header className="px-6 lg:px-10 pt-8 pb-12 sm:pt-12 sm:pb-16 max-w-4xl mx-auto">
        <p className="text-[var(--coral)] text-xs font-bold uppercase tracking-widest mb-3">
          {svc.id} · Hizmet detayı
        </p>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground text-balance leading-tight mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {svc.pageTitle}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl">
          {svc.description}
        </p>
        <div className="mt-7">
          <ServiceCtaButton service={svc.booking} label="Bu hizmetle başla" />
        </div>
      </header>

      {/* Editöryal giriş */}
      <section className="px-6 lg:px-10 pb-12 max-w-3xl mx-auto space-y-4 text-foreground/85 leading-relaxed">
        {svc.intro.map((p, i) => (
          <p key={i} className="text-[15px] sm:text-base">
            {p}
          </p>
        ))}
      </section>

      {/* Nasıl çalışır */}
      <section
        aria-labelledby="process-heading"
        className="bg-[var(--card)] py-14 sm:py-20"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <h2
            id="process-heading"
            className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nasıl çalışır
          </h2>
          <ol className="space-y-5">
            {svc.process.map((p) => (
              <li key={p.step} className="flex gap-4 sm:gap-5">
                <span
                  aria-hidden="true"
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--navy)] text-white flex items-center justify-center font-bold font-mono text-sm"
                >
                  {p.step}
                </span>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Kimler için uygun */}
      <section
        aria-labelledby="suitable-heading"
        className="py-14 sm:py-20 max-w-4xl mx-auto px-6 lg:px-10"
      >
        <h2
          id="suitable-heading"
          className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Kimler için uygun
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {svc.suitableFor.map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl border border-border bg-white"
            >
              <h3 className="font-bold text-foreground mb-1.5 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Fiyatlandırma */}
      <section
        aria-labelledby="pricing-heading"
        className="bg-[var(--card)] py-14 sm:py-20"
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <h2
            id="pricing-heading"
            className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fiyatlandırma
          </h2>
          <p className="text-sm font-semibold text-[var(--coral)] mb-3 uppercase tracking-wider">
            {svc.pricing.headline}
          </p>
          <p className="text-foreground/85 leading-relaxed">{svc.pricing.body}</p>
        </div>
      </section>

      {/* Hizmet alanı */}
      <section
        aria-labelledby="area-heading"
        className="py-14 sm:py-20 max-w-3xl mx-auto px-6 lg:px-10"
      >
        <h2
          id="area-heading"
          className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Hizmet alanı
        </h2>
        <p className="text-foreground/85 leading-relaxed">
          Şu an <strong className="font-semibold">İstanbul</strong> Anadolu ve
          Avrupa yakasında hizmet veriyoruz. Şehirler arası transferler için{" "}
          <Link
            href="/hizmetler/refakatci-pet-taksi"
            className="text-[var(--coral)] underline-offset-2 hover:underline"
          >
            Refakatçili Pet Taksi
          </Link>{" "}
          hizmetimizi inceleyebilirsiniz.
        </p>
      </section>

      {/* SSS */}
      <section
        aria-labelledby="faq-heading"
        className="bg-[var(--card)] py-14 sm:py-20"
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sık sorulanlar
          </h2>
          <ServiceFaq items={svc.faq} />
        </div>
      </section>

      {/* CTA bandı */}
      <section className="py-12 sm:py-16 max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Hazır mısın?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Rezervasyonu birlikte tamamlayalım — sadece birkaç adım.
        </p>
        <div className="inline-flex">
          <ServiceCtaButton service={svc.booking} label="Rezervasyona başla" />
        </div>
      </section>

      {/* İlgili hizmetler */}
      <section
        aria-labelledby="related-heading"
        className="bg-[var(--card)] py-14 sm:py-20"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <h2
            id="related-heading"
            className="text-xl font-extrabold text-foreground mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Diğer hizmetler
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <RelatedCard key={r.slug} card={r} />
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}

function RelatedCard({ card }: { card: ServiceContent }) {
  return (
    <Link
      href={`/hizmetler/${card.slug}`}
      className="group flex items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-border hover:border-[var(--coral)]/40 hover:shadow-md transition-all"
    >
      <div>
        <p className="text-xs font-mono text-muted-foreground mb-1">{card.id}</p>
        <h3 className="font-bold text-foreground mb-1">{card.name}</h3>
        <p className="text-sm text-muted-foreground">{card.tagline}</p>
      </div>
      <ArrowRight
        size={18}
        className="text-muted-foreground group-hover:text-[var(--coral)] group-hover:translate-x-1 transition-all flex-shrink-0"
      />
    </Link>
  )
}
