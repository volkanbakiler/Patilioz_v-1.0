import type { Metadata } from "next"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { absoluteUrl, SITE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "Patilioz hakkında merak ettikleriniz: rezervasyon süreci, fiyatlandırma, güvenlik ve daha fazlası.",
  alternates: { canonical: absoluteUrl("/sss") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/sss"),
    title: `Sık Sorulan Sorular | ${SITE.brand}`,
    description: "Patilioz hakkında merak ettikleriniz: rezervasyon, fiyatlandırma, güvenlik.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

type FaqItem = { q: string; a: string }

const sections: { title: string; items: FaqItem[] }[] = [
  {
    title: "Rezervasyon ve Süreç",
    items: [
      {
        q: "Nasıl rezervasyon oluşturabilirim?",
        a: "Web sitemizden veya uygulamadan 'Rezervasyon' butonuna tıklayarak hizmet türü, tarih ve pati bilgilerini girin. Ödeme onayının ardından rezervasyonunuz kesinleşir ve size SMS ile bildirim gönderilir.",
      },
      {
        q: "Ne kadar önceden rezervasyon yapmalıyım?",
        a: "En az 24 saat öncesinden rezervasyon yapmanızı öneririz. Acil durumlar için müsaitlik durumuna göre aynı gün hizmet sunmaya çalışıyoruz; bizimle iletişime geçin.",
      },
      {
        q: "Rezervasyonumu nasıl iptal edebilirim?",
        a: "Hizmet saatinden 12 saat öncesine kadar yapılan iptallerde ücret alınmaz. Daha geç iptallerde yarım saat ücret uygulanabilir. İptal için bize ulaşın veya hesabınızdan yönetin.",
      },
      {
        q: "Sürüş sırasında petimi takip edebilir miyim?",
        a: "Evet. Araç yola çıktığında SMS ile bilgilendirilirsiniz; tahmini varış süresi ve sürücü iletişim bilgisi paylaşılır. Uygulama içi canlı konum özelliği yakında eklenecek.",
      },
    ],
  },
  {
    title: "Fiyatlandırma ve Ödeme",
    items: [
      {
        q: "Fiyatlar nasıl belirleniyor?",
        a: "Fiyatlar mesafe, hizmet türü ve pet sayısına göre değişir. Rezervasyon sırasında kesin fiyat gösterilir; gizli ek ücret yoktur.",
      },
      {
        q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        a: "Kredi/banka kartı, havale ve kapıda nakit ödeme kabul ediyoruz. Tüm kart ödemeleri 3D Secure ile güvence altındadır.",
      },
      {
        q: "Birden fazla pet için ekstra ücret var mı?",
        a: "İkinci petten itibaren hafif ek ücret uygulanabilir. Kesin fiyatı rezervasyon akışında görebilirsiniz.",
      },
    ],
  },
  {
    title: "Güvenlik ve Sağlık",
    items: [
      {
        q: "Petim araç içinde güvende mi?",
        a: "Tüm araçlarımızda pet kafesi veya güvenlik kayışı mevcuttur. Sürücülerimiz pet ilk yardımı konusunda eğitimlidir. Klima her seferde aktiftir.",
      },
      {
        q: "Hasta veya yaşlı petlerle de çalışıyor musunuz?",
        a: "Evet, kronik rahatsızlığı veya yaşlılıktan kaynaklanan özel ihtiyaçları olan petleri özenle taşıyoruz. Rezervasyon sırasında sağlık notunu eklemenizi öneririz.",
      },
      {
        q: "Aşı kartı zorunlu mu?",
        a: "Klinik transferleri için veterinerinizin talebi doğrultusunda aşı kartı gerekebilir. Standart şehir içi taşımalar için zorunlu değildir; ancak temel aşıların güncel olması önerilir.",
      },
    ],
  },
  {
    title: "Hizmet Alanı",
    items: [
      {
        q: "Hangi şehirlerde hizmet veriyorsunuz?",
        a: "Şu an yalnızca İstanbul Anadolu ve Avrupa yakasında hizmet sunuyoruz. Yakın gelecekte Ankara ve İzmir'de de hizmet vermeyi planlıyoruz.",
      },
      {
        q: "Havalimanı transferi yapıyor musunuz?",
        a: "Evet, Sabiha Gökçen ve İstanbul Havalimanı'na pet taşıma hizmeti sunuyoruz. Kargo veya kabinden taşıma sürecinde rehberlik için bizimle iletişime geçin.",
      },
    ],
  },
]

export default function SssPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Başlık */}
      <div className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
          Destek
        </p>
        <h1
          className="text-3xl font-extrabold text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sık Sorulan Sorular
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Aradığınızı bulamazsanız{" "}
          <Link href="/iletisim" className="font-semibold text-[var(--coral)] hover:underline">
            bize ulaşın
          </Link>
          , en kısa sürede yanıt verelim.
        </p>
      </div>

      {/* Bölümler */}
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2
              className="mb-4 text-sm font-extrabold uppercase tracking-widest text-muted-foreground/60"
            >
              {section.title}
            </h2>
            <div className="divide-y divide-foreground/[0.07] overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
              {section.items.map((item) => (
                <FaqAccordion key={item.q} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Alt CTA */}
      <div className="mt-12 rounded-2xl bg-[var(--navy)] px-6 py-8 text-center">
        <p
          className="text-lg font-extrabold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Başka sorunuz mu var?
        </p>
        <p className="mt-1 text-sm text-white/70">
          Ekibimiz hafta içi 09:00–19:00 arasında hizmetinizde.
        </p>
        <Link
          href="/iletisim"
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--coral)] px-6 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Bize ulaşın
        </Link>
      </div>
    </div>
  )
}

function FaqAccordion({ item }: { item: FaqItem }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-foreground/[0.02] [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-semibold text-foreground">{item.q}</span>
        <ChevronDown
          size={16}
          className="flex-shrink-0 text-muted-foreground/50 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-foreground/[0.06] px-5 py-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
      </div>
    </details>
  )
}
