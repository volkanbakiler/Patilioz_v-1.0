# Görseller

Bu klasöre gerçek fotoğrafları aşağıdaki dosya adlarıyla koyduğunuzda,
ilgili alanlar otomatik olarak SVG illüstrasyon yerine fotoğrafı gösterir.
Dosya yoksa bağlama özel, markaya uygun bir SVG illüstrasyon görünür
(kod: `components/media-frame.tsx`).

## Beklenen dosyalar

| Dosya | Kullanım | Önerilen oran / boyut |
|---|---|---|
| `hero-pet.jpg` | Sosyal paylaşım / Google önizleme (og:image, schema) | 1200×630 (yatay) |
| `blog-1.jpg` | Blog: "Evcil hayvanınızla seyahat" | 16:9, ~800×450+ |
| `blog-2.jpg` | Blog: "Veteriner ziyareti" | 16:9, ~800×450+ |
| `blog-3.jpg` | Blog: "Şehirde pet yaşamı" | 16:9, ~800×450+ |

## Notlar
- Format: `.jpg`, `.png` veya `.webp` olabilir; ad birebir eşleşmeli
  (örn. `blog-1.jpg`). Farklı uzantı kullanacaksanız ilgili bileşendeki
  `src` değerini de güncelleyin.
- Görseller `next.config.mjs` içinde `images.unoptimized: true` ile servis
  edilir; ekstra yapılandırma gerekmez.
- Telif: yalnızca kullanım hakkına sahip olduğunuz görselleri koyun.
