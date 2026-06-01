"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, CalendarCheck, Home, Sparkles, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { openBooking } from "@/lib/booking-bus"

type Tab = {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  highlight?: boolean
}

const tabs: Tab[] = [
  { label: "Anasayfa", href: "/", icon: Home },
  { label: "Hizmetler", href: "/hizmetler", icon: Sparkles },
  { label: "Rezervasyon", href: "#booking", icon: CalendarCheck, highlight: true },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Hesap", href: "/hesap", icon: User },
]

export function AppShellBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav
      aria-label="Alt navigasyon"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 mx-auto w-full bg-white/95 text-foreground shadow-[0_-14px_34px_rgba(20,31,53,0.12)] backdrop-blur-xl md:hidden",
        "border-t border-foreground/10",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <ul className="mx-auto flex h-16 w-full max-w-md items-stretch justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          if (tab.highlight) {
            return (
              <li key={tab.href} className="flex-1">
                <button
                  type="button"
                  onClick={() => openBooking()}
                  className="group flex h-full w-full flex-col items-center justify-center gap-1 text-[var(--coral)]"
                  aria-label={tab.label}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--coral)] text-white",
                      "shadow-sm shadow-[var(--coral)]/25",
                      "transition-transform group-hover:scale-105 group-active:scale-95",
                    )}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="text-[10px] font-bold leading-none">{tab.label}</span>
                </button>
              </li>
            )
          }

          const active = isActive(tab.href)

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 px-1 py-2 transition-colors",
                  active
                    ? "text-[var(--coral)]"
                    : "text-foreground/50 hover:text-foreground",
                )}
              >
                <span className="relative">
                  <Icon size={20} />
                </span>
                <span className={cn("text-[10px] leading-none", active ? "font-bold" : "font-semibold")}>
                  {tab.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
