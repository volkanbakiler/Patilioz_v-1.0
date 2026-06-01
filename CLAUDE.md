# Patilioz — Proje Hafızası (CLAUDE.md)

> Bu dosya her yeni AI oturumu başında ilk okunacak dosyadır.
> Projeyi sıfırdan okumadan bağlam sağlar. Değişikliklerden sonra güncelle.
> Son güncelleme: 2026-05-26

---

## Proje Özeti

**Patilioz** — İstanbul'da evcil hayvan (pet) taşımacılığı platformu.
- Web sitesi + rezervasyon akışı (Next.js 16, React 19, TypeScript, Tailwind v4)
- Şu an **ön görünüm / mock aşamasında**: gerçek backend/auth yok
- Deployment hedefi: Vercel (`patilioz.com`)
- Dil: Türkçe (tr-TR)
- UI: Mobil öncelikli (mobile-first), PWA manifest var
- Git repo şu an bilinçli olarak başlatılmadı; proje geliştirme klasörü olarak ilerliyor
- Görsel asset'ler (favicon, PWA ikonları, OG/blog görselleri) şimdilik placeholder/fallback mantığıyla bekletiliyor; gerçek görseller sonra eklenecek

---

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19, Tailwind CSS v4, Radix UI |
| Form | react-hook-form + zod |
| Auth | **MOCK** — localStorage tabanlı, ileride Firebase (telefon/SMS + sosyal) |
| State | Custom event bus (`booking-bus.ts`), localStorage draft |
| Analytics | Vercel Analytics |
| Font | Inter + Plus Jakarta Sans |
| Paket yöneticisi | pnpm |

### Doğrulama Komutları

| Komut | Amaç |
|-------|------|
| `pnpm lint` | ESLint + Next core web vitals kontrolü |
| `pnpm typecheck` | TypeScript tip kontrolü |
| `pnpm build` | Production build |
| `pnpm check` | Lint + typecheck + build sıralı kontrol |

---

## Klasör Yapısı (Özet)

```
app/                    → Next.js App Router sayfaları
  page.tsx              → Ana sayfa (Hero, Hizmetler, Features, HowItWorks, Blog, CTA)
  layout.tsx            → Root layout, metadata, AppShell
  hesap/                → Kullanıcı hesap sayfaları (korumalı)
  hizmetler/[slug]/     → Hizmet detay sayfaları (dinamik)
  blog/[slug]/          → Blog detay (dinamik)
  katil/                → Üyelik/Giriş sayfası
  basin/, sss/, kariyer/, iletisim/ → Statik sayfalar

components/             → React bileşenleri
  ui/                   → shadcn/ui temel bileşenleri (dokunma!)
  booking-sheet.tsx     → Ana rezervasyon bottom sheet
  booking-widget.tsx    → Rezervasyon widget
  app-shell.tsx         → Layout sarmalayıcı (header + bottom nav)

lib/                    → Veri & mantık katmanı
  services.ts           → 3 hizmetin tüm içeriği (slug, metin, FAQ vb.)
  auth-mock.ts          → Mock auth hook (useAuth), kullanıcı tipleri
  booking-bus.ts        → Rezervasyon event bus (openBooking / onOpenBooking)
  booking-draft.ts      → Rezervasyon adım state'i (localStorage draft)
  blog.ts               → Blog yazıları içeriği
  seo.ts                → SEO yardımcıları
  breeds.ts             → Köpek/kedi ırkları listesi
```

---

## Hizmetler (3 Adet)

| Slug | Tür | Kısa Ad |
|------|-----|---------|
| `standart-pet-taksi` | `one-way` | Standart Pet Taksi |
| `gidis-donus-pet-taksi` | `round-trip` | Gidiş–Dönüş Pet Taksi |
| `refakatci-pet-taksi` | `accompanied` | Refakatçili Pet Taksi |

---

## Auth Durumu (Mock → Firebase)

- **Şu an**: `localStorage` ile mock, gerçek doğrulama yok
- **Planlanan**: Firebase Authentication — telefon/SMS (birincil), Google, Apple, Facebook, Instagram (custom token)
- `proxy.ts`: `/hesap/*` rotaları korumalı — şu an client-side hydration ile, ileride session cookie ile
- Cookie adı: `patilioz:session`
- LocalStorage anahtarı: `patilioz:auth-mock`

---

## Rezervasyon Akışı

```
BookingStep sırası:
pet → pet-detail → service → date → pickup → dropoff → time → summary → phone → payment → confirmation
```
- Tür: `BookingDraft` (booking-draft.ts)
- Tetikleyici: `openBooking(opts)` — custom DOM event
- Draft localStorage'da saklanır, yarım bırakılan rezervasyon devam ettirilebilir

---

## Kritik Kurallar (Geliştirme için)

1. `components/ui/` klasörüne dokunma — shadcn/ui otomatik üretimi
2. `lib/services.ts` içindeki slug'lar SEO için kalıcı — değiştirme
3. Tailwind v4 kullanılıyor (`@tailwindcss/postcss`) — v3 syntax farklı
4. Tek Next config dosyası `next.config.ts` — `next.config.mjs` geri ekleme
5. Vercel Analytics `<Analytics />` layout.tsx'te mevcut
6. Renk değişkenleri CSS custom property: `--coral`, `--navy` vb.
7. Font değişkenleri: `--font-inter`, `--font-plus-jakarta` (display için)
8. Next 16 koruma dosyası `proxy.ts` — eski `middleware.ts` konvansiyonuna dönme
9. Aktif global stil dosyası `app/globals.css` — eski `styles/globals.css` kaldırıldı

---

## Sayfalar (Route Haritası)

| Rota | Dosya | Notlar |
|------|-------|--------|
| `/` | app/page.tsx | Ana sayfa |
| `/hizmetler` | app/hizmetler/page.tsx | Hizmetler listesi |
| `/hizmetler/[slug]` | app/hizmetler/[slug]/page.tsx | Dinamik |
| `/blog` | app/blog/page.tsx | Blog feed |
| `/blog/[slug]` | app/blog/[slug]/page.tsx | Dinamik |
| `/katil` | app/katil/page.tsx | Giriş/Kayıt |
| `/hesap` | app/hesap/page.tsx | Dashboard (korumalı) |
| `/hesap/profil` | app/hesap/profil/page.tsx | |
| `/hesap/dostlarim` | app/hesap/dostlarim/page.tsx | Evcil hayvan listesi |
| `/hesap/adreslerim` | app/hesap/adreslerim/page.tsx | |
| `/hesap/bildirimler` | app/hesap/bildirimler/page.tsx | |
| `/hesap/gizlilik` | app/hesap/gizlilik/page.tsx | |
| `/hesap/dil` | app/hesap/dil/page.tsx | |
| `/sss` | app/sss/page.tsx | SSS |
| `/iletisim` | app/iletisim/page.tsx | |
| `/hakkimizda` | app/hakkimizda/page.tsx | |
| `/basin` | app/basin/page.tsx | Basın |
| `/kariyer` | app/kariyer/page.tsx | |
| `/is-birligi` | app/is-birligi/page.tsx | |
| `/gizlilik-politikasi` | app/gizlilik-politikasi/page.tsx | |
| `/kullanim-kosullari` | app/kullanim-kosullari/page.tsx | |

---

## Değişiklik Logu → Ayrı Dosya

Tüm değişiklikler `PROJECT_LOG.md` dosyasında tutulur.
Her önemli değişiklikten sonra oraya yaz.
