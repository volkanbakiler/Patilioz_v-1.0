import { AppShellHeader } from "./app-shell-header"
import { AppShellBottomNav } from "./app-shell-bottom-nav"
import { BookingSheet } from "./booking-sheet"
import { SupportFab } from "./support-fab"
import { Footer } from "./footer"
import { CookieBanner } from "./cookie-banner"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[oklch(0.93_0.018_232)] lg:px-4 lg:py-4">
      {/* Erişilebilirlik: klavye kullanıcıları için içeriğe atla */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--navy)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        İçeriğe geç
      </a>

      <div className="mx-auto flex min-h-dvh w-full max-w-[1240px] flex-col bg-[oklch(0.975_0.006_230)] shadow-[0_24px_90px_rgba(20,31,53,0.16)] lg:min-h-[calc(100dvh-2rem)] lg:rounded-[24px] lg:border lg:border-white/70">
        <AppShellHeader />
        <main
          id="main-content"
          className="relative w-full flex-1 overflow-x-hidden pb-24 md:pb-7"
        >
          {children}
        </main>
        <Footer />
        <AppShellBottomNav />
        <BookingSheet />
        <SupportFab />
        <CookieBanner />
      </div>
    </div>
  )
}
