import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Patilioz — İstanbul Pet Taksi",
    short_name: "Patilioz",
    description: "İstanbul'da patili dostlarınız için güvenli ve sakin şehir içi ulaşım.",
    start_url: "/",
    display: "standalone",
    background_color: "#e8ecf5",
    theme_color: "#1e2d4a",
    orientation: "portrait",
    lang: "tr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Rezervasyon Yap",
        url: "/#book",
        description: "Hızlıca yeni rezervasyon oluştur",
      },
      {
        name: "Hesabım",
        url: "/hesap",
        description: "Hesap ve patili dostlarım",
      },
    ],
  }
}
