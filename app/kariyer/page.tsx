import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Clock, ChevronRight } from "lucide-react"
import { absoluteUrl, SITE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Kariyer",
  description:
    "Patilioz'da patili dostların şehir yolculuklarını güvenli ve sakin kılmak için çalışın. Açık pozisyonlar ve başvuru bilgileri.",
  alternates: { canonical: absoluteUrl("/kariyer") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/kariyer"),
    title: `Kariyer | ${SITE.brand}`,
    description:
      "Patilioz'da patili dostların şehir yolculuklarını güvenli ve sakin kılmak için çalışın.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

const positions = [
  {
    title: "Pet Ulaşım Uzmanı (Sürücü)",
    department: "Operasyon",
    type: "Tam Zamanlı",
    location: "İstanbul — Anadolu Yakası",
    description:
      "Patili dostları klinik, tımar ve günlük transferlerde güvenli biçimde taşır; aile ile iletişimi sürdürürsünüz.",
  },
  {
    title: "Pet Ulaşım Uzmanı (Sürücü)",
    department: "Operasyon",
    type: "Tam Zamanlı",
    location: "İstanbul — Avrupa Yakası",
    description:
      "Patili dostları klinik, tımar ve günlük transferlerde güvenli biçimde taşır; aile ile iletişimi sürdürürsünüz.",
  },
  {
    title: "Müşteri Deneyimi Uzmanı",
    department: "Destek",
    type: "Tam Zamanlı / Hibrit",
    location: "İstanbul",
    description:
      "Rezervasyon, iptal ve süreç sorularında ailelere yardımcı olur; geri bildirimleri ürün ekibiyle paylaşırsınız.",
  },
  {
    title: "Kurumsal İş Birliği Koordinatörü",
    department: "Büyüme",
    type: "Tam Zamanlı",
    location: "İstanbul",
    description:
      "Veteriner klinikleri ve tımar salonlarıyla ortaklık süreçlerini yönetir, sahaya çıkarak ilişki kurarsınız.",
  },
]

const values = [
  {
    title: "Patili dost önce gelir",
    body: "Kararlarımız her zaman patili dostun konforundan başlar. Bu, işe alımda da geçerlidir.",
  },
  {
    title: "Yavaş ve doğru büyüme",
    body: "Hızlı ölçeklenme yerine sürdürülebilir büyümeyi seçiyoruz. Doğru insanla büyümek, fazla insanla büyümekten iyidir.",
  },
  {
    title: "Sakin ve açık iletişim",
    body: "İçeride de dışarıda da abartısız, net ve dürüst konuşuruz. Söylentiye değil, gerçeğe dayandırırız.",
  },
]

export default function KariyerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Hero */}
      <div className="mb-14">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
          Kariyer
        </p>
        <h1
          className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Patili dostlarla birlikte çalışın.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Patilioz küçük ve özenli bir ekip. Her rolde, patili dostun yolculuğunu daha güvenli ve
          sakin kılmak için çalışıyoruz. Hızlı büyüme değil, doğru insanla doğru işi yapmak
          önceliğimiz.
        </p>
      </div>

      {/* Değerlerimiz */}
      <div className="mb-14">
        <h2
          className="mb-6 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Nasıl çalışıyoruz
        </h2>
        <div className="space-y-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)]"
            >
              <p className="mb-1 text-sm font-extrabold text-foreground">{v.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Açık Pozisyonlar */}
      <div className="mb-14">
        <h2
          className="mb-6 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Açık pozisyonlar
        </h2>
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
          {positions.map((pos, i) => (
            <div
              key={`${pos.title}-${pos.location}`}
              className={`px-5 py-4 ${i < positions.length - 1 ? "border-b border-foreground/[0.06]" : ""}`}
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-foreground">{pos.title}</p>
                  <p className="mt-0.5 text-xs font-semibold text-[var(--coral)]">{pos.department}</p>
                </div>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-foreground/75">{pos.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-[var(--coral)]" />
                  {pos.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-[var(--coral)]" />
                  {pos.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Başvuru */}
      <div className="mb-14 rounded-2xl border border-foreground/[0.07] bg-white px-5 py-6 shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        <h2
          className="mb-3 text-base font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Nasıl başvurulur?
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          İlgilendiğiniz pozisyonu ve kısa bir tanıtım yazısını{" "}
          <a
            href="mailto:kariyer@patilioz.com"
            className="font-semibold text-[var(--coral)] hover:underline"
          >
            kariyer@patilioz.com
          </a>{" "}
          adresine gönderin. CV, özgeçmiş ya da LinkedIn profilinizi ekleyebilirsiniz — biçim
          değil, içerik önemli.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Uygun bir pozisyon şu an yoksa bile bize yazabilirsiniz. Ekibe uygun kişilerle her zaman
          görüşmeye açığız.
        </p>
      </div>

      {/* Alt linkler */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/hakkimizda"
          className="flex items-center justify-between rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:border-[var(--coral)]/30"
        >
          <div>
            <p className="text-sm font-extrabold text-foreground">Hakkımızda</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Biz kimiz, nasıl çalışıyoruz</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
        <Link
          href="/iletisim"
          className="flex items-center justify-between rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:border-[var(--coral)]/30"
        >
          <div>
            <p className="text-sm font-extrabold text-foreground">İletişim</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Bize ulaşın</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
      </div>

    </div>
  )
}
