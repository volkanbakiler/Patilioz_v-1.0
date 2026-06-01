import type { Metadata } from "next"
import Link from "next/link"
import { Stethoscope, Scissors, Building2, ChevronRight } from "lucide-react"
import { absoluteUrl, SITE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Kurumsal İş Birliği",
  description:
    "Veteriner klinikleri, tımar salonları ve pet markaları için Patilioz iş birliği programı. Güvenilir, özenli pet ulaşımı.",
  alternates: { canonical: absoluteUrl("/is-birligi") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/is-birligi"),
    title: `Kurumsal İş Birliği | ${SITE.brand}`,
    description:
      "Veteriner klinikleri, tımar salonları ve pet markaları için Patilioz iş birliği programı.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

const partnerTypes = [
  {
    icon: Stethoscope,
    title: "Veteriner Klinikleri",
    body:
      "Hastanıza gelen hayvanların transferini biz üstleniyoruz. Rezervasyon, lojistik ve aile bildirimi Patilioz tarafından yönetilir. Siz kliniğe odaklanın.",
    bullets: [
      "Doğrudan rezervasyon entegrasyonu",
      "Hasta transferi için öncelikli erişim",
      "Haftalık transfer raporu",
    ],
  },
  {
    icon: Scissors,
    title: "Tımar Salonları",
    body:
      "Müşterilerinize 'teslim alma ve bırakma' hizmeti sunun. Patilioz, randevu saatinize göre esnekçe çalışır.",
    bullets: [
      "Randevu entegrasyonuna uygun planlama",
      "Salon markalı iletişim seçeneği",
      "Aylık iş birliği özeti",
    ],
  },
  {
    icon: Building2,
    title: "Marka ve Platform Ortaklıkları",
    body:
      "Pet gıda, sigorta veya uygulama gibi alanlarda Patilioz kullanıcılarına ulaşmak isteyen markalar için seçici bir ortaklık programı yürütüyoruz.",
    bullets: [
      "İçerik ve e-posta ortaklıkları",
      "Paket ve kampanya entegrasyonu",
      "Veri paylaşımı yok — değer odaklı iş birliği",
    ],
  },
]

const steps = [
  { n: "1", text: "Formu doldurun veya bize yazın — iki iş günü içinde yanıt veririz." },
  { n: "2", text: "Gereksinimlerinizi ve beklentilerinizi birlikte değerlendiriyoruz." },
  { n: "3", text: "İş birliği çerçevesini yazılı olarak netleştiriyoruz." },
  { n: "4", text: "Küçük bir pilot ile başlıyoruz, sonra birlikte değerlendiriyoruz." },
]

export default function IsBirligiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Hero */}
      <div className="mb-14">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
          Kurumsal İş Birliği
        </p>
        <h1
          className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Birlikte daha iyi yolculuklar.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Patilioz, veteriner klinikleri, tımar salonları ve pet ekosistemindeki markalarla seçici
          ve uzun vadeli iş birlikleri kuruyor. Hız değil, uyum önceliğimiz.
        </p>
      </div>

      {/* Ortaklık Türleri */}
      <div className="mb-14">
        <h2
          className="mb-6 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Kiminle çalışıyoruz
        </h2>
        <div className="space-y-4">
          {partnerTypes.map(({ icon: Icon, title, body, bullets }) => (
            <div
              key={title}
              className="rounded-2xl border border-foreground/[0.07] bg-white p-5 shadow-[0_1px_4px_rgba(20,31,53,0.05)]"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--coral)]/10 text-[var(--coral)]">
                  <Icon size={20} />
                </span>
                <h3 className="text-sm font-extrabold text-foreground">{title}</h3>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <ul className="space-y-1.5 pl-4">
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="list-disc text-sm leading-relaxed text-foreground/75 marker:text-[var(--coral)]"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Nasıl Çalışır */}
      <div className="mb-14">
        <h2
          className="mb-6 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Süreç nasıl işliyor
        </h2>
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`flex items-start gap-4 px-5 py-4 ${i < steps.length - 1 ? "border-b border-foreground/[0.06]" : ""}`}
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--coral)]/10 text-xs font-extrabold text-[var(--coral)]">
                {s.n}
              </span>
              <p className="text-sm leading-relaxed text-foreground/80">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* İletişim */}
      <div className="mb-14 rounded-2xl border border-foreground/[0.07] bg-white px-5 py-6 shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        <h2
          className="mb-3 text-base font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          İş birliği başlatın
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Kurumunuzu ve iş birliği beklentinizi kısaca açıklayan bir mesaj yeterli. Geri kalan her
          şeyi birlikte konuşuruz.
        </p>
        <a
          href="mailto:isbirligi@patilioz.com"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--coral)] px-5 py-2.5 text-sm font-extrabold text-white transition-opacity hover:opacity-90"
        >
          isbirligi@patilioz.com
        </a>
      </div>

      {/* Alt linkler */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/hakkimizda"
          className="flex items-center justify-between rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:border-[var(--coral)]/30"
        >
          <div>
            <p className="text-sm font-extrabold text-foreground">Hakkımızda</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Değerlerimiz ve hikayemiz</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
        <Link
          href="/iletisim"
          className="flex items-center justify-between rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:border-[var(--coral)]/30"
        >
          <div>
            <p className="text-sm font-extrabold text-foreground">İletişim</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Diğer sorularınız için</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
      </div>

    </div>
  )
}
