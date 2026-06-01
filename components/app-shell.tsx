"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PawPrint, Newspaper, Phone, User, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { onOpenBooking, type OpenBookingOptions } from "@/lib/booking-bus"
import { BookingWidget } from "@/components/booking-widget"
import { SupportFab } from "@/components/support-fab"
import { CookieBanner } from "@/components/cookie-banner"

const NAV_LINKS = [
  { href: "/", label: "Ana sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/blog", label: "Blog" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
]

const TABS = [
  { href: "/", label: "Ana sayfa", icon: Home },
  { href: "/hizmetler", label: "Hizmetler", icon: PawPrint },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/iletisim", label: "İletişim", icon: Phone },
  { href: "/hesap", label: "Hesap", icon: User },
]

const FOOTER_GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Hizmetler",
    links: [
      { href: "/hizmetler/standart-pet-taksi", label: "Standart Pet Taksi" },
      { href: "/hizmetler/gidis-donus-pet-taksi", label: "Gidiş–Dönüş Pet Taksi" },
      { href: "/hizmetler/refakatci-pet-taksi", label: "Refakatçili Pet Taksi" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/basin", label: "Basın" },
      { href: "/kariyer", label: "Kariyer" },
      { href: "/is-birligi", label: "İş birliği" },
    ],
  },
  {
    title: "Destek",
    links: [
      { href: "/sss", label: "Sıkça sorulanlar" },
      { href: "/iletisim", label: "İletişim" },
      { href: "/katil", label: "Üye ol" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
      { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [booking, setBooking] = useState<{ open: boolean; initial?: OpenBookingOptions }>({
    open: false,
  })

  // Rezervasyon overlay tetikleyicisini dinle.
  useEffect(() => {
    return onOpenBooking((opts) => setBooking({ open: true, initial: opts }))
  }, [])

  // Rota değişince mobil menüyü kapat.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Overlay açıkken arka planı kilitle.
  useEffect(() => {
    if (booking.open || menuOpen) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [booking.open, menuOpen])

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader
        pathname={pathname}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
      />

      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      <SiteFooter />

      {/* Mobil alt tab bar */}
      <BottomNav pathname={pathname} />

      {/* Yüzen destek butonu */}
      <SupportFab />

      {/* Çerez bildirimi */}
      <CookieBanner />

      {/* Rezervasyon overlay */}
      {booking.open && (
        <BookingOverlay
          initial={booking.initial}
          onClose={() => setBooking({ open: false })}
        />
      )}
    </div>
  )
}

function SiteHeader({
  pathname,
  menuOpen,
  onToggleMenu,
}: {
  pathname: string
  menuOpen: boolean
  onToggleMenu: () => void
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/[0.07] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--navy)] text-white">
            <PawPrint size={18} />
          </span>
          <span
            className="text-lg font-extrabold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Patilioz
          </span>
        </Link>

        {/* Masaüstü nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-bold transition-colors",
                isActive(pathname, link.href)
                  ? "bg-[var(--coral)]/10 text-[var(--coral)]"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/hesap"
            className="hidden items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-sm font-bold text-foreground transition-colors hover:border-foreground/30 md:inline-flex"
          >
            <User size={15} /> Hesap
          </Link>
          {/* Mobil menü düğmesi */}
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobil açılır menü */}
      {menuOpen && (
        <nav className="border-t border-foreground/[0.07] bg-white px-4 py-3 md:hidden">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-xl px-3.5 py-3 text-sm font-bold transition-colors",
                    isActive(pathname, link.href)
                      ? "bg-[var(--coral)]/10 text-[var(--coral)]"
                      : "text-foreground/80 active:bg-foreground/[0.04]",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-foreground/[0.07] bg-[var(--card)]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--navy)] text-white">
                <PawPrint size={18} />
              </span>
              <span
                className="text-lg font-extrabold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Patilioz
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              İstanbul&apos;da patili dostlarınız için güvenli, sigortalı ve takip
              edilebilir pet taksi hizmeti.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                {group.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/75 transition-colors hover:text-[var(--coral)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-foreground/[0.07] pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Patilioz. Tüm hakları saklıdır.</p>
          <p className="text-xs text-muted-foreground/70">İstanbul, Türkiye</p>
        </div>
      </div>
    </footer>
  )
}

function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Alt gezinme"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/[0.07] bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex h-16 items-stretch">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href)
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors",
                  active ? "text-[var(--coral)]" : "text-foreground/50",
                )}
              >
                <tab.icon size={20} />
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function BookingOverlay({
  initial,
  onClose,
}: {
  initial?: OpenBookingOptions
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Rezervasyonu kapat"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="relative w-full sm:max-w-[440px]">
        <div className="overflow-hidden rounded-t-[28px] bg-card shadow-2xl sm:rounded-[28px]">
          <BookingWidget initial={initial} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
