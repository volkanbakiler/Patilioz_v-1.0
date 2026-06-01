import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppShell } from "@/components/app-shell"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://patilioz.com"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0f8" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Patilioz — İstanbul Pet Taksi Hizmeti",
    template: "%s | Patilioz",
  },
  description:
    "İstanbul'da patili dostlarınız için güvenli, sakin ve özenli şehir içi ulaşım. Klinik transferi, tımar ve günlük transferlerde yanınızdayız.",
  keywords: [
    "pet taksi",
    "evcil hayvan taşıma",
    "İstanbul",
    "klinik transfer",
    "kedi köpek taşıma",
    "veteriner transfer",
    "patilioz",
  ],
  authors: [{ name: "Patilioz", url: SITE_URL }],
  creator: "Patilioz",
  publisher: "Patilioz",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
    languages: { "tr-TR": SITE_URL },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "Patilioz",
    title: "Patilioz — İstanbul Pet Taksi Hizmeti",
    description:
      "İstanbul'da patili dostlarınız için güvenli, sakin ve özenli şehir içi ulaşım.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Patilioz — İstanbul Pet Taksi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patilioz — İstanbul Pet Taksi Hizmeti",
    description:
      "İstanbul'da patili dostlarınız için güvenli, sakin ve özenli şehir içi ulaşım.",
    images: ["/images/og-default.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  )
}
