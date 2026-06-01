import type { Metadata } from "next"
import Link from "next/link"
import { Heart, MapPin, ShieldCheck, Users } from "lucide-react"
import { absoluteUrl, SITE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Patilioz, İstanbul'da patili dostların yolculuklarında güvenli, sakin ve özenli biçimde yanında olan bir pet taksi hizmetidir.",
  alternates: { canonical: absoluteUrl("/hakkimizda") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/hakkimizda"),
    title: `Hakkımızda | ${SITE.brand}`,
    description:
      "Patilioz, İstanbul'da patili dostların yolculuklarında güvenli, sakin ve özenli biçimde yanında olan bir pet taksi hizmetidir.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

const values = [
  {
    icon: Heart,
    title: "Patili dostu önce gelir",
    body: "Her kararımızda, her süreçte patili dostun konforu ve güvenliği temel ölçütümüzdür. Hız ve pratiklik buna sonradan eklenir.",
  },
  {
    icon: ShieldCheck,
    title: "Güven, söylemde değil davranışta",
    body: "Net bilgilendiririz, abartmayız. Ne yaptığımızı biliriz ve bunu hissettiririz. Büyük vaat yerine tutarlı davranışı seçeriz.",
  },
  {
    icon: MapPin,
    title: "İstanbul'u tanıyoruz",
    body: "Her iki yakada düzinelerce klinik, park ve mahalle bilgisiyle hareket ederiz. Şehri bilen biriyle yola çıkmak fark yaratır.",
  },
  {
    icon: Users,
    title: "Aile ile birlikte düşünürüz",
    body: "Patili dostun ailesini döngünün içinde tutarız. Teslim alındığında, yoldayken ve varışta haberdar ederiz.",
  },
]

const milestones = [
  { year: "2023", text: "Patilioz İstanbul'un Anadolu yakasında ilk yolculuğunu tamamladı." },
  { year: "2024", text: "Avrupa yakasına genişledik. İlk 1.000 yolculuğa ulaştık." },
  { year: "2025", text: "Veteriner klinikleriyle doğrudan iş birliği programını başlattık." },
]

export default function HakkimizdaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Hero */}
      <div className="mb-14">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
          Şirket
        </p>
        <h1
          className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Patili dostlarımızla birlikte yoldayız.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Patilioz, İstanbul'da patili dostların şehir içi yolculuklarında güvenli, sakin ve özenli
          biçimde yanında olan bir pet taksi hizmetidir. Biz için önemli olan yolculuğun kendisini
          tanımlamak değil; bu yolculuk sırasında patili dostun nasıl hissettiğidir.
        </p>
      </div>

      {/* Değerler */}
      <div className="mb-14">
        <h2
          className="mb-6 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Bizi biz yapan ne?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-foreground/[0.07] bg-white p-5 shadow-[0_1px_4px_rgba(20,31,53,0.05)]"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--coral)]/10 text-[var(--coral)]">
                <Icon size={20} />
              </span>
              <h3 className="mb-1.5 text-sm font-extrabold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hikaye */}
      <div className="mb-14">
        <h2
          className="mb-4 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Nereden başladık
        </h2>
        <div className="space-y-3 text-[15px] leading-relaxed text-foreground/80">
          <p>
            Patilioz, İstanbul'da patili dostu olan ama her gün klinik transferi için çözüm arayan
            ailelerin gerçek ihtiyacından doğdu. Standart taşımacılık seçenekleri vardı; güvenli ve
            sakin bir ortam sunanı yoktu.
          </p>
          <p>
            İlk yolculuğumuzda tek bir araç, tek bir rotaydı. Bugün her iki yakada aktif olarak
            hizmet veriyoruz. Büyümek hedefimiz; ama bunu yavaş ve doğru yapmayı seçiyoruz.
          </p>
          <p>
            Her yeni şehir, her yeni hizmet kendi içinde bir soruyla başlar: bu patili dostun için
            doğru mu? Yanıt evet değilse, o adımı atmayız.
          </p>
        </div>
      </div>

      {/* Zaman çizelgesi */}
      <div className="mb-14">
        <h2
          className="mb-6 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Kilometre taşları
        </h2>
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
          {milestones.map((m, i) => (
            <div
              key={m.year}
              className={`flex items-start gap-4 px-5 py-4 ${i < milestones.length - 1 ? "border-b border-foreground/[0.06]" : ""}`}
            >
              <span className="flex-shrink-0 text-sm font-extrabold text-[var(--coral)]">
                {m.year}
              </span>
              <p className="text-sm leading-relaxed text-foreground/80">{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA'lar */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/is-birligi"
          className="rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 text-center shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:border-[var(--coral)]/30"
        >
          <p className="text-sm font-extrabold text-foreground">İş Birliği</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Klinik ve marka ortaklıkları</p>
        </Link>
        <Link
          href="/kariyer"
          className="rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 text-center shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:border-[var(--coral)]/30"
        >
          <p className="text-sm font-extrabold text-foreground">Kariyer</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Açık pozisyonlar</p>
        </Link>
        <Link
          href="/basin"
          className="rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 text-center shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:border-[var(--coral)]/30"
        >
          <p className="text-sm font-extrabold text-foreground">Basın</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Medya ve kaynaklar</p>
        </Link>
      </div>

    </div>
  )
}
