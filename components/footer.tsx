import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react"

const footerLinks = {
  Hizmetler: [
    { label: "Standart Pet Taksi", href: "/hizmetler/standart-pet-taksi" },
    { label: "Gidiş-Dönüş Pet Taksi", href: "/hizmetler/gidis-donus-pet-taksi" },
    { label: "Refakatli Pet Taksi", href: "/hizmetler/refakatci-pet-taksi" },
    { label: "Tüm Hizmetler", href: "/hizmetler" },
  ],
  Şirket: [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Kariyer", href: "/kariyer" },
    { label: "Basın", href: "/basin" },
    { label: "İş Birliği", href: "/is-birligi" },
  ],
  Destek: [
    { label: "SSS", href: "/sss" },
    { label: "İletişim", href: "/iletisim" },
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
  ],
}

// Sosyal medya hesapları hazır olduğunda buraya gerçek URL'ler girilir.
const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/patilioz",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/patilioz",
    icon: Facebook,
  },
]

export function Footer() {
  return (
    <footer aria-label="Site alt bilgisi" className="px-3 pb-24 pt-4 sm:px-4 md:pb-5 lg:px-6">
      <div className="mx-auto w-full max-w-[1120px] rounded-lg border border-foreground/10 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_2fr]">

          {/* Marka + iletişim */}
          <div className="space-y-4">
            <Link href="/" aria-label="Patilioz anasayfa" className="flex items-center gap-2">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--navy)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                    fill="white"
                  />
                </svg>
              </div>
              <span
                className="text-lg font-extrabold tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                patilioz
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              İstanbul'da patili dostlarınızın şehir içi yolculuklarında güvenli, sakin ve özenli biçimde yanınızdayız.
            </p>

            <div className="grid gap-2">
              <a
                href="tel:+908500000000"
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone size={14} className="text-[var(--coral)]" aria-hidden="true" />
                0850 000 00 00
              </a>
              <a
                href="mailto:merhaba@patilioz.com"
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail size={14} className="text-[var(--coral)]" aria-hidden="true" />
                merhaba@patilioz.com
              </a>
              <div className="flex items-start gap-2 text-sm font-semibold text-muted-foreground">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[var(--coral)]" aria-hidden="true" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Link grupları */}
          <nav aria-label="Footer navigasyon">
            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(footerLinks).map(([group, links]) => (
                <div key={group} className="rounded-lg border border-foreground/10 bg-foreground/[0.025] p-3">
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-wide text-foreground/60">
                    {group}
                  </p>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

        </div>

        {/* Alt çizgi */}
        <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Patilioz. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
