# Patilioz — Değişiklik Logu

> Her AI oturumunda yapılan önemli değişiklikler buraya kaydedilir.
> Format: `[TARİH] [KONU] — Açıklama`

---

## 2026-05-24 — Başlangıç

**Hafıza sistemi kuruldu**
- `CLAUDE.md` oluşturuldu: projenin tüm kilit bilgilerini içeren hafıza dosyası
- `PROJECT_LOG.md` oluşturuldu: bu dosya — değişiklik takibi için

**Proje tarandı ve CLAUDE.md'ye şunlar yazıldı:**
- Tech stack (Next.js 16, React 19, Tailwind v4, pnpm)
- 3 hizmetin slug/tip haritası
- Auth durumu (mock → Firebase planı)
- Rezervasyon akışı adımları
- Tüm route haritası
- Kritik geliştirme kuralları (özellikle Tailwind v4, shadcn ui klasörü, slug değiştirme yasağı)

---

## 2026-05-25 — Stabilizasyon

**Ne yapıldı:**
- Next config tek dosyaya indirildi: `next.config.ts`; `next.config.mjs` kaldırıldı ve build'in tip hatalarını saklaması engellendi.
- Next 16 konvansiyonuna geçildi: `middleware.ts` yerine `proxy.ts` kullanılıyor, `/hesap/:path*` matcher ve mock auth davranışı korundu.
- ESLint zemini eklendi: `eslint`, `eslint-config-next`, `eslint.config.mjs`; `pnpm lint`, `pnpm typecheck`, `pnpm check` komutları tanımlandı.
- Kullanılmayan `styles/globals.css` ve üretilmiş `tsconfig.tsbuildinfo` temizlendi; `tsconfig.tsbuildinfo` `.gitignore` kapsamına alındı.
- Görsel asset eksikleri ve Git repo başlatılmaması bilinçli kapsam dışı kararlar olarak `CLAUDE.md` içine işlendi.

---

## 2026-05-26 — Rezervasyon Sihirbazı Yeniden Yazıldı

**Ne yapıldı:**
- `components/booking-widget.tsx` baştan yazıldı: ekran/şikayet bazında topyekun UX/UI revizyonu.
- **İlerleme göstergesi**: "X/10" adım numarası kaldırıldı, üstte sadece ince ilerleme çubuğu + sayfa başında "1 dakikada rezervasyonunu yap" mikrocopy. Adım etiketi kısaldı.
- **Slogan kullanımı**: Varış (dropoff) ekranı başlığı "Nereye patılıyoruz?" oldu. Diğer ekranlarda doğal Türkçe.
- **Tutarlı renk sözlüğü** (`app/globals.css`'e yeni token'lar): coral = aktif seçim, emerald (`--book-ok`) = doğrulama, soft-navy (`--book-soft-navy`) = ikincil/dönüş, nötr gri (`--book-pending`) = dolu/pasif, kırmızı = sadece hata. Eski yeşil/sky/amber kart sınırları kaldırıldı.
- **Hizmet seçimi** davranışsal dile çevrildi: "Sadece götür" / "Götür ve geri getir" / "Randevu boyunca bekle".
- **Tarih ekranı**: hızlı seçim pill'leri eklendi (Bugün / Yarın / Sonrası) + takvim. Round-trip için gidiş/dönüş toggle'ı, dönüş için soft-navy renk kullanılarak gidişten görsel olarak ayrıldı. Demo "dolu gün" mantığı kaldırıldı.
- **Adres ekranları** taksi/Uber benzeri kalıba taşındı: arama + canlı öneriler + mevcut konum + ayrı "Kat/daire/kapı" alanı. Coral renkli "kesik çizgi mevcut konum" yanıltıcılığı düzeltildi.
- **Saat ekranı**: "Popüler" muğlak etiketi kaldırıldı. Sadece **müsait / dolu** ayrımı var; dolu saatler üzeri çizili ve seçilemez. Refakatçili'de dönüş bekleme süresinden otomatik hesaplanır (mikrocopy ile söylenir). Round-trip'te dönüş saati soft-navy ile rengi gidişten ayrı; aynı günde gidişten erken saat seçilemez.
- **Köpek boy ekranı** kg aralığı baskın, ırklar ikinci planda; "yaklaşık seçebilirsiniz" rahatlatıcı mikrocopy eklendi.
- **Özet ekranı**: tek toplam yerine fiyat **kırılımı** (yolculuk + büyük ırk + kutu + bekleme + indirim → toplam). Markaya uygun, jenerik sigorta/sürücü-deneyimi laflarından kaçınan tek güven satırı: "Yolculuk başlamadan önce ücretsiz iptal/değişiklik."
- **Telefon ekranı** başlığı "Telefon numaranızı doğrulayın" oldu; aynı ekranda iletişim tercihi (SMS / WhatsApp / Arama) seçtiriliyor.
- **Onay ekranı**: net 4 sonraki adım (onay mesajı, sürücü atama zamanı, canlı takip, iptal hakkı) + iletişim tercihine göre kanal etiketi.
- `lib/booking-bus.ts` ve `lib/booking-draft.ts`: `ContactPref` tipi + `pickupNote`/`dropoffNote`/`returnNote`/`contactPref` alanları draft'a eklendi; mevcut localStorage anahtarı korundu (eski draft'lar kırılmadan yüklenir).
- `app/globals.css`: `--book-ok / --book-ok-bg / --book-ok-border / --book-pending / --book-pending-bg / --book-warn / --book-soft-navy` token'ları eklendi; hem `:root` hem `@theme inline` blokları güncellendi.
- Görseller: `/public/images/booking/pet-{type}.jpg`, `dog-{size}.jpg`, `box-{own,rental}.jpg` slot şeması korundu. Dosya yoksa otomatik Unsplash placeholder gösterilir; sen gerçek fotoğrafları slot'lara koyduğunda otomatik onlar görünür. (Production'a çıkmadan önce Unsplash bağımlılığı kaldırılmalı.)
- `pnpm typecheck` ve `pnpm build` temiz; mevcut lint warning'leri (eski `auth-mock`/`booking-draft` set-state-in-effect uyarıları) korundu — yeni hata eklenmedi.

---

## 2026-05-26 — Rezervasyon: Ayrı Ekran Mimarisi + Ödeme İyileştirmesi

**Ne yapıldı:**
- Gidiş/dönüş seçimlerinin tek ekranda toggle'la verilmesi kafa karıştırıcıydı. Akış **ayrı ekranlara** bölündü.
- `lib/booking-draft.ts` `BookingStep` tipine eklendi: `waiting`, `return-date`, `return-location`, `return-time`.
- `components/booking-widget.tsx` `Step` tipi, `ALL_STEPS`, `STEP_LABEL` ve `getActiveSteps` hizmet tipine göre koşullu adım listesi üretecek şekilde güncellendi.
- **Hizmet tipi başına net akış:**
  - **Tek yön**: pet → pet-detail → service → date → pickup → dropoff → time → summary → phone → payment → confirmation
  - **Gidiş–dönüş**: pet → pet-detail → service → **date** → **return-date** → pickup → dropoff → **return-location** → **time** → **return-time** → summary → ...
  - **Refakatçili**: pet → pet-detail → service → **waiting** → date → pickup → dropoff → **return-location** → time → summary → ...
- Yeni ekranlar:
  - **`waiting`** (refakatçili): büyük dakika göstergesi + ±20 dk blok kontrolü + ek ücret canlı görünür.
  - **`return-date`** (round-trip): "Aynı gün / Ertesi gün / +2 gün" hızlı pill'leri + minIso=gidiş tarihi olan takvim. Soft-navy aksanlı → gidişten görsel ayrım.
  - **`return-location`** (round-trip + accompanied): "Aldığınız yere / Farklı adrese" 2'li kart seçimi; "Aldığımız yere" seçildiğinde alış adresi özet kartında gösterilir, "Farklı adrese" seçildiğinde adres alanı otomatik focus.
  - **`return-time`** (round-trip): kendi başına saat ızgarası, soft-navy aksanlı. Aynı gün ise gidişten önceki saatler otomatik disable.
- `time` ekranı sadeleşti — sadece gidiş saati. Refakatçili'de altta "Randevu ~X dk sürer" not satırı.
- `dropoff` ekranı sadeleşti — sadece varış adresi + not. Bekleme süresi ve dönüş noktası artık bu ekranda değil.
- `summary` edit linkleri yeni step'lere yönlendirildi: dönüş tarihi → `return-date`, dönüş yeri → `return-location`, dönüş saati → `return-time`, bekleme → `waiting`. Refakatçili için "Tahmini dönüş" satırı eklendi (gidiş saatinden bekleme süresi sonrası).
- **Ödeme ekranı yeniden tasarlandı:**
  - Üstte **mini özet kartı**: alış/varış noktası, tarih+saat (round-trip için her iki), "Özeti düzenle" linki.
  - Tutar kartı, sağ tarafta iletişim no + tercih (SMS/WhatsApp/Arama) etiketi.
  - Ödeme yöntemleri ve kupon ayrı başlıklar altında — daha okunaklı.
  - Altta KVKK/Kullanım koşulları linki, ücretsiz iptal güven satırı.
  - "Rezervasyonu oluştur" butonu artık `processing` state'i tetikliyor: 900 ms spinner sonra confirmation. Mock — backend bağlanınca burası API çağrısına çevrilir.
- `returnDateMode` state'i kaldırıldı (artık gerek yok); yerine `processing` state'i eklendi.
- `pnpm typecheck` + `pnpm build` temiz.

---

## 2026-05-26 — Rezervasyon: Konsept Analizine Göre 5 Kritik İyileştirme + Döngü Bug Düzeltmesi

**Bağlam:** `REZERVASYON_ANALIZ.md` (Patilioz konsept tasarımı ile karşılaştırma raporu)
sonrası uygulanan düzeltmeler. Kullanıcı ayrıca "bazı adımlar bitmeden döngüye giriyor"
geri bildirimi verdi.

**Ne yapıldı:**

1. **Döngü bug'ı düzeltildi:**
   - `lib/booking-draft.ts` → `update()` artık patch'teki tüm değerler mevcut state'le
     eşitse yazma yapmıyor. `writeDraft` her seferinde `CustomEvent` dispatch ediyordu;
     bu da `useBookingDraft` hook'unun `setDraft(readDraft())` callback'ini
     tetikleyip gereksiz re-render zinciri yaratıyordu. No-op kontrolüyle bu kapatıldı.
   - `components/booking-widget.tsx` → draft hydration `useEffect`'inin bağımlılığı
     `[hydrated, draft, initial]`'dan `[hydrated]`'a indirildi. Hydration tek sefer
     `hydratedRef` ile bloklanıyor ama her draft değişiminde re-eval olması yine
     de döngü riski oluşturuyordu — artık sadece bir kez çalışıyor.
   - `autoAdvance` çift tıklamaya karşı `clearTimeout` koruması eklendi (`advanceTimerRef`)
     ve unmount cleanup. Önceden kullanıcı hızlı arka arkaya iki karta basarsa
     iki `setStep` kuyruğa girip yanlış step'e atlatabiliyordu.

2. **Online kart formu eklendi** (`components/booking-widget.tsx`):
   - Ödeme yönteminde "Online Kart" seçilince conditional form açılıyor: kart
     numarası (16 hane, 4'erli boşluklu), son kullanma (AA/YY auto-format),
     CVC (3-4 hane), kart üzerindeki ad (uppercase).
   - `canAdvance` payment case'i tüm alanlar dolup formata uyduğunda true.
   - Kart bilgileri **draft'a yazılmaz** — sadece state'te durur, ödeme sağlayıcısı
     bağlandığında tokenize edilecek.

3. **Confirmation ekranı yeniden tasarlandı:**
   - "Yolculuk planınız alındı" başlığı (konseptin daha sıcak dilinden).
   - Rezervasyon kodu + toplam tutar **yan yana** tek kart.
   - **Detay kartı/kartları**: gidiş ve dönüş (varsa) ayrı kartlarda, tarih·saat
     ve adres bilgisi ile.
   - Checklist tikleri (SMS gönderildi · sürücü 24 saat önce atanır · ücretsiz iptal).
   - **"Detaylara git"** birincil CTA → `/hesap` rotasına gider, draft sıfırlanır
     ve modal kapanır. Önceden sadece "Tamamlandı" vardı.

4. **Macro 5-blok step indicator** (`components/booking-widget.tsx`):
   - Yeni `Block` tipi: `dost | hizmet | rota | zaman | onay`.
   - `STEP_BLOCK` map'i her step'i bir bloğa atıyor (örn. `pet`/`pet-detail` → `dost`,
     `date`/`return-date`/`pickup`/`dropoff`/`return-location` → `rota`).
   - Header'da 5 eşit segment + altlarında blok etiketleri. Aktif blokta
     `STEP_LABEL[step]` küçük metin olarak görünüyor — "Rota'dayım, alt-adım
     Alış noktası" hissi.
   - Tamamlanan bloklar coral, aktif blok coral+beyaz etiket, gelmeyenler soluk.

5. **Soft-navy ikincil renk kaldırıldı:**
   - `app/globals.css` → `--book-soft-navy` ve `--color-book-soft-navy` token'ları
     silindi.
   - `components/booking-widget.tsx` → tüm `var(--book-soft-navy)` referansları
     `var(--coral)` ile değiştirildi (`sed -i` ile 13 yerden). `return-date` pill'leri,
     `return-location` kartları, `return-time` butonları artık ana coral aksanı
     kullanıyor. Gidiş/dönüş ayrımı ekran başlığı ile yapılıyor (renk değil) —
     `AddressField`'ın `accent="navy"` parametresi geride kaldı ama coral döndüğü
     için zararsız (ileri temizlikte kaldırılabilir).

6. **İletişim tercihi sadeleştirildi:**
   - Phone ekranındaki SMS/WhatsApp/Arama 3'lü grid kaldırıldı. Yerine "Devam
     edince numaranıza tek seferlik SMS doğrulama kodu gönderilir" mikrocopy
     kartı. `canAdvance` artık sadece telefon 10 haneli olduğunda true.
   - `CONTACT_OPTIONS` array'i ve `PhoneCall` import'u silindi. `contactPref`
     state'i ve draft alanı ileride yeniden açma esnekliği için bırakıldı.
   - Ödeme price card'ındaki kanal etiketi sabit "SMS" oldu.
   - Confirmation'daki "WhatsApp/Arama/SMS → +90 …" satırı checklist içine
     "Onay mesajı +90 … numarasına gönderildi" olarak entegre edildi.

- `pnpm typecheck` + `pnpm build` temiz; warning'ler eski set-state-in-effect
  uyarıları (yeni hata eklenmedi).

**Konseptten geri kalan kasıtlı eksikler** (ayrı yatırım gerektirir, sonraya):
harita + pin + rota çizimi, sosyal auth (Google/Apple), kayıtlı adres chip'leri,
manuel kg input, refakat slider'ı, gerçek hayvan/kafes fotoğrafları.

<!-- Yeni değişiklikler buraya eklenir -->
<!-- Format:
## YYYY-MM-DD — Konu başlığı
**Ne yapıldı:**
- Madde 1
- Madde 2
-->
