import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, Phone, Clock, MessageCircle, Instagram, Facebook } from "lucide-react"
import { absoluteUrl, SITE } from "@/lib/seo"

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Patilioz destek ekibiyle iletişime geçin. Telefon, e-posta veya WhatsApp üzerinden bize ulaşabilirsiniz.",
  alternates: { canonical: absoluteUrl("/iletisim") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/iletisim"),
    title: `İletişim | ${SITE.brand}`,
    description: "Patilioz destek ekibiyle iletişime geçin.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

export default function IletisimPage() {
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
          İletişim
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Sorularınız için size en hızlı ulaşabileceğimiz kanaldan yazın.
        </p>
      </div>

      {/* İletişim kanalları */}
      <div className="space-y-3">
        {/* WhatsApp */}
        <a
          href="https://wa.me/90XXXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 transition-colors hover:bg-emerald-100"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <MessageCircle size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">WhatsApp</p>
            <p className="text-xs text-muted-foreground">En hızlı yanıt — genellikle birkaç dakika</p>
          </div>
          <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
            Önerilen
          </span>
        </a>

        {/* Telefon */}
        <a
          href="tel:+900850XXXXXXX"
          className="flex items-center gap-4 rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:bg-foreground/[0.02]"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.08] text-[var(--navy)]">
            <Phone size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">Telefon</p>
            <p className="text-xs text-muted-foreground">0850 XXX XX XX</p>
          </div>
        </a>

        {/* E-posta */}
        <a
          href="mailto:merhaba@patilioz.com"
          className="flex items-center gap-4 rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:bg-foreground/[0.02]"
        >
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.08] text-[var(--navy)]">
            <Mail size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">E-posta</p>
            <p className="text-xs text-muted-foreground">merhaba@patilioz.com</p>
          </div>
        </a>
      </div>

      {/* Çalışma saatleri */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        <div className="flex items-center gap-3 border-b border-foreground/[0.07] px-5 py-4">
          <Clock size={16} className="text-[var(--coral)]" />
          <p className="text-sm font-bold text-foreground">Çalışma Saatleri</p>
        </div>
        <div className="divide-y divide-foreground/[0.06]">
          {[
            { day: "Pazartesi – Cuma", hours: "09:00 – 19:00" },
            { day: "Cumartesi", hours: "10:00 – 17:00" },
            { day: "Pazar", hours: "Kapalı" },
          ].map(({ day, hours }) => (
            <div key={day} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-muted-foreground">{day}</span>
              <span className={`text-sm font-semibold ${hours === "Kapalı" ? "text-muted-foreground/50" : "text-foreground"}`}>
                {hours}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-foreground/[0.07] bg-amber-50 px-5 py-3">
          <p className="text-xs text-amber-700">
            Acil durumlar için WhatsApp'tan 7/24 mesaj bırakabilirsiniz; ilk fırsatta dönüş yapılır.
          </p>
        </div>
      </div>

      {/* Konum */}
      <div className="mt-5 flex items-start gap-4 rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        <span className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.08] text-[var(--navy)]">
          <MapPin size={20} />
        </span>
        <div>
          <p className="text-sm font-bold text-foreground">Hizmet Alanı</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            İstanbul Anadolu ve Avrupa yakası. Havalimanı transferleri için ek bilgi almanız önerilir.
          </p>
        </div>
      </div>


      {/* Sosyal */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          Sosyal Medya
        </p>
        <div className="flex gap-3">
          {[
            { icon: <Instagram size={18} />, label: "Instagram", href: "#" },
            { icon: <Facebook size={18} />, label: "Facebook", href: "#" },
          ].map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-foreground/[0.07] bg-white px-4 py-2.5 text-sm font-semibold text-foreground shadow-[0_1px_4px_rgba(20,31,53,0.05)] transition-colors hover:bg-foreground/[0.02]"
            >
              {icon} {label}
            </a>
          ))}
        </div>
      </div>

      {/* SSS linki */}
      <div className="mt-10 rounded-2xl border border-foreground/[0.07] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        <p className="text-sm font-semibold text-foreground">
          Hızlı yanıt arıyorsanız{" "}
          <Link href="/sss" className="font-bold text-[var(--coral)] hover:underline">
            Sık Sorulan Sorular
          </Link>{" "}
          sayfamıza göz atın.
        </p>
      </div>
    </div>
  )
}
