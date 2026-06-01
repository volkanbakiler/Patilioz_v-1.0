"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-mock"
import { AvatarInitials } from "@/components/avatar-initials"
import { openBooking } from "@/lib/booking-bus"

const desktopLinks = [
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Blog", href: "/blog" },
  { label: "SSS", href: "/sss" },
  { label: "Hakkımızda", href: "/hakkimizda" },
]

export function AppShellHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { isAuthed, user } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-foreground/10 bg-white/90 text-foreground backdrop-blur-xl transition-shadow duration-300",
        "pt-[env(safe-area-inset-top)]",
        scrolled && "shadow-sm",
      )}
    >
      <div className="mx-auto w-full max-w-[1120px] px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between gap-3 md:h-16">

          {/* Logo */}
          <Link href="/" className="group flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--navy)] shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                  fill="white"
                />
              </svg>
            </div>
            <span
              className="truncate text-lg font-extrabold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              patilioz
            </span>
          </Link>

          {/* Desktop nav — sadece md+ */}
          <nav aria-label="Ana navigasyon" className="hidden md:flex items-center gap-1">
            {desktopLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "bg-foreground/[0.06] text-foreground"
                      : "text-foreground/60 hover:bg-foreground/[0.04] hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Sağ: Rezervasyon CTA + hesap */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openBooking()}
              className="hidden md:inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--coral)] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              Rezervasyon Yap
            </button>

            {isAuthed ? (
              <Link
                href="/hesap"
                aria-label="Hesabım"
                className="rounded-full ring-offset-2 transition-shadow hover:ring-2 hover:ring-[var(--coral)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coral)]"
              >
                <AvatarInitials name={user?.name} size={40} />
              </Link>
            ) : (
              <Link
                href="/katil"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--coral)] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                <User size={16} aria-hidden="true" />
                Katıl
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
