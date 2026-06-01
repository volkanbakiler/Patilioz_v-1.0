import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
        404
      </p>
      <h1
        className="mb-4 text-3xl font-extrabold text-foreground sm:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Bu sayfa bulunamadı.
      </h1>
      <p className="mb-10 max-w-sm text-base leading-relaxed text-muted-foreground">
        Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--coral)] px-6 text-sm font-extrabold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Anasayfaya dön
        </Link>
        <Link
          href="/iletisim"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-foreground/10 bg-white px-6 text-sm font-extrabold text-foreground transition-colors hover:border-foreground/20"
        >
          Bize ulaşın
        </Link>
      </div>
    </div>
  )
}
