import type { Metadata } from "next"
import Link from "next/link"
import { Download, ChevronRight } from "lucide-react"
import { absoluteUrl, SITE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Basın",
  description:
    "Patilioz basın kiti, marka görselleri, hakkımızdaki yayınlar ve medya iletişim bilgileri.",
  alternates: { canonical: absoluteUrl("/basin") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/basin"),
    title: `Basın | ${SITE.brand}`,
    description:
      "Patilioz basın kiti, marka görselleri, hakkımızdaki yayınlar ve medya iletişim bilgileri.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

const pressItems = [
  {
    outlet: "PetLife Türkiye",
    date: "Mart 2025",
    title: "İstanbul'da evcil hayvan taşımacılığında yeni dönem",
    summary:
      "Patilioz'un veteriner klinikleriyle kurduğu doğrudan iş birliği modeli ve şehir içi pet transferine getirdiği standart.",
  },
  {
    outlet: "Startup İstanbul",
    date: "Kasım 2024",
    title: "1.000 yolculuk: Küçük kalmayı seçen startup",
    summary:
      "İlk yılında ölçek yerine kaliteyi seçen Patilioz'un büyüme yaklaşımı ve pet ulaşımı pazarındaki boşluk.",
  },
  {
    outlet: "Köpekler ve Kediler Dergisi",
    date: "Eylül 2024",
    title: "Kliniğe taşıma artık daha az stresli",
    summary:
      "Patilioz'un sakin araç ortamı ve aile bilgilendirme protokolünün veterinere transfer stresini nasıl azalttığı.",
  },
]

const kitItems = [
  {
    label: "Marka Logoları",
    desc: "SVG ve PNG, koyu/açık arka plan versiyonları",
    href: "#",
  },
  {
    label: "Marka Renkleri ve Tipografi",
    desc: "Renk kodları, font kullanım rehberi",
    href: "#",
  },
  {
    label: "Şirket Gerçekleri",
    desc: "Kuruluş tarihi, hizmet alanı, temel rakamlar",
    href: "#",
  },
]

export default function BasinPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Hero */}
      <div className="mb-14">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
          Basın
        </p>
        <h1
          className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Medya ve kaynaklar.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Patilioz hakkında yazmak ya da bir röportaj talep etmek için doğru yere geldiniz. Aşağıda
          basın kiti, yayınlar ve medya iletişim bilgilerini bulabilirsiniz.
        </p>
      </div>

      {/* Basın İletişimi */}
      <div className="mb-14 rounded-2xl border border-foreground/[0.07] bg-white px-5 py-6 shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        <h2
          className="mb-3 text-base font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Medya iletişimi
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Röportaj talepleri, açıklama ihtiyaçları ve yayın öncesi bilgi için{" "}
          <a
            href="mailto:basin@patilioz.com"
            className="font-semibold text-[var(--coral)] hover:underline"
          >
            basin@patilioz.com
          </a>{" "}
          adresine ulaşabilirsiniz. Yayın tarihini ve konu özetini belirtmeniz süreci hızlandırır.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Taleplere genellikle 1–2 iş günü içinde yanıt veriyoruz.
        </p>
      </div>

      {/* Basın Kiti */}
      <div className="mb-14">
        <h2
          className="mb-6 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Basın kiti
        </h2>
        <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
          {kitItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between px-5 py-4 transition-colors hover:bg-foreground/[0.02] ${
                i < kitItems.length - 1 ? "border-b border-foreground/[0.06]" : ""
              }`}
            >
              <div>
                <p className="text-sm font-extrabold text-foreground">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Download size={15} className="flex-shrink-0 text-[var(--coral)]" />
            </a>
          ))}
        </div>
        <p className="mt-3 px-1 text-xs text-muted-foreground">
          Görseller yalnızca Patilioz hakkındaki editoryal içeriklerde kullanılabilir; ticari amaçla kullanılamaz.
        </p>
      </div>

      {/* Haberlerde Patilioz */}
      <div className="mb-14">
        <h2
          className="mb-6 text-xl font-extrabold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Haberlerde Patilioz
        </h2>
        <div className="space-y-4">
          {pressItems.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)]"
            >
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground/70">{item.outlet}</span>
                <span>·</span>
                <span>{item.date}</span>
              </div>
              <p className="mb-1.5 text-sm font-extrabold text-foreground">{item.title}</p>
              <p className="text-sm leading-relaxed text-foreground/75">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alt linkler */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/hakkimizda"
          className="flex items-center justify-between rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:border-[var(--coral)]/30"
        >
          <div>
            <p className="text-sm font-extrabold text-foreground">Hakkımızda</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Şirket hikayesi ve değerler</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
        <Link
          href="/is-birligi"
          className="flex items-center justify-between rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:border-[var(--coral)]/30"
        >
          <div>
            <p className="text-sm font-extrabold text-foreground">Kurumsal İş Birliği</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Klinik ve marka ortaklıkları</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </Link>
      </div>

    </div>
  )
}
