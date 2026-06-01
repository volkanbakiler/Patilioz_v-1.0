import type { Metadata } from "next"
import { absoluteUrl, SITE } from "@/lib/seo"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Patilioz'un kişisel veri işleme prensipleri, çerez raporu, konum verisi, KVKK kapsamındaki haklarınız.",
  alternates: { canonical: absoluteUrl("/gizlilik-politikasi") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/gizlilik-politikasi"),
    title: `Gizlilik Politikası | ${SITE.brand}`,
    description: "Patilioz KVKK kapsamında kişisel veri işleme prensipleri ve haklarınız.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

const EFFECTIVE_DATE = "1 Ocak 2025"

export default function GizlilikPolitikasiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
          Yasal
        </p>
        <h1
          className="text-3xl font-extrabold text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Gizlilik Politikası
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Yürürlük tarihi: {EFFECTIVE_DATE}
        </p>
      </div>

      <div className="space-y-10 text-[15px] leading-relaxed text-foreground/85">

        {/* 1 */}
        <Section title="1. Veri Sorumlusu">
          <p>
            Bu politika, <strong>Patilioz</strong> ("Şirket", "biz") tarafından sunulan pet taşıma
            ve klinik transfer hizmetlerine ilişkin kişisel veri işleme faaliyetlerini kapsar.
            Şirket, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında{" "}
            <strong>veri sorumlusudur.</strong>
          </p>
          <p className="mt-2">
            Veri sorumlusuna ait iletişim bilgileri: <br />
            <a href="mailto:kvkk@patilioz.com" className="font-semibold text-[var(--coral)] hover:underline">
              kvkk@patilioz.com
            </a>
          </p>
        </Section>

        {/* 2 */}
        <Section title="2. Topladığımız Kişisel Veriler">
          <p className="mb-3">
            KVKK Madde 10 uyarınca aşağıdaki kategorilerde veri işlediğimizi bildiririz:
          </p>
          <div className="overflow-hidden rounded-2xl border border-foreground/[0.07]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground/[0.04]">
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Veriler</th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Zorunlu?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/[0.05]">
                {[
                  ["Kimlik ve iletişim", "Ad soyad, telefon numarası, e-posta", "Evet"],
                  ["Adres bilgileri", "Teslim alma ve bırakma noktaları", "Evet"],
                  ["Konum verisi", "Rezervasyon sırasında talep edilirse anlık GPS konumu; saklanmaz, yalnızca alış adresi doldurma amacıyla kullanılır", "Hayır — isteğe bağlı"],
                  ["Pet bilgileri", "Hayvan adı, türü, ırkı, yaşı, sağlık notları, aşı kayıtları, fotoğraf", "Kısmen zorunlu"],
                  ["İşlem verileri", "Rezervasyon geçmişi, ödeme referansı (kart numarası saklanmaz)", "Evet"],
                  ["Teknik veriler", "IP adresi, tarayıcı türü, oturum çerezleri", "Otomatik"],
                  ["Analitik veriler", "Anonim sayfa görüntüleme, tıklama, funnel verisi — kişisel tanımlayıcı içermez", "Otomatik / rızaya bağlı"],
                ].map(([cat, data, req]) => (
                  <tr key={cat} className="bg-white">
                    <td className="px-4 py-3 font-semibold text-foreground align-top">{cat}</td>
                    <td className="px-4 py-3 text-foreground/75 align-top">{data}</td>
                    <td className="px-4 py-3 align-top">
                      <span className={
                        req === "Evet"
                          ? "inline-flex rounded-full bg-foreground/[0.07] px-2 py-0.5 text-[11px] font-bold text-foreground/70"
                          : req === "Hayır — isteğe bağlı"
                          ? "inline-flex rounded-full bg-[var(--coral)]/10 px-2 py-0.5 text-[11px] font-bold text-[var(--coral)]"
                          : "inline-flex rounded-full bg-foreground/[0.04] px-2 py-0.5 text-[11px] font-bold text-foreground/50"
                      }>
                        {req}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 3 */}
        <Section title="3. Verilerin İşlenme Amaçları ve Hukuki Dayanakları">
          <div className="overflow-hidden rounded-2xl border border-foreground/[0.07]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground/[0.04]">
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Amaç</th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">KVKK Dayanağı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/[0.05]">
                {[
                  ["Rezervasyon oluşturma, yönetme, iptal", "Madde 5/2(c) — sözleşmenin ifası"],
                  ["Müşteri desteği ve hizmet bildirimleri", "Madde 5/2(c) — sözleşmenin ifası"],
                  ["Ödeme işlemleri", "Madde 5/2(ç) — yasal yükümlülük"],
                  ["Vergi ve muhasebe kayıtları", "Madde 5/2(ç) — yasal yükümlülük"],
                  ["Hizmet kalitesi ölçümü ve geliştirme", "Madde 5/2(f) — meşru menfaat"],
                  ["Analitik (anonim kullanım istatistikleri)", "Açık rıza — çerez onayı"],
                  ["Pazarlama ve kampanya bildirimleri", "Açık rıza — ayrıca alınır"],
                ].map(([purpose, basis]) => (
                  <tr key={purpose} className="bg-white">
                    <td className="px-4 py-3 text-foreground/80 align-top">{purpose}</td>
                    <td className="px-4 py-3 font-semibold text-foreground/70 align-top">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 4 — Çerezler */}
        <Section title="4. Çerezler" id="cerezler">
          <p className="mb-4">
            Çerezler, tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Patilioz aşağıdaki
            çerezleri kullanmaktadır:
          </p>
          <div className="overflow-hidden rounded-2xl border border-foreground/[0.07]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground/[0.04]">
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Çerez</th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Amaç</th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Tür</th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Süre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/[0.05]">
                {[
                  ["patilioz:auth-mock", "Oturum ve kullanıcı tercihleri", "Zorunlu (işlevsel)", "Oturum süresi"],
                  ["patilioz:cookie-consent", "Çerez tercihlerinizi hatırlar", "Zorunlu (işlevsel)", "1 yıl"],
                  ["patilioz:booking-draft", "Yarım kalan rezervasyon taslağı", "Zorunlu (işlevsel)", "7 gün"],
                  ["_vercel_insights", "Anonim sayfa görüntüleme ve performans (Vercel Analytics)", "Analitik — rızaya bağlı", "Oturum"],
                ].map(([name, purpose, type, duration]) => (
                  <tr key={name} className="bg-white">
                    <td className="px-4 py-3 font-mono text-[12px] text-foreground/80 align-top break-all">{name}</td>
                    <td className="px-4 py-3 text-foreground/75 align-top">{purpose}</td>
                    <td className="px-4 py-3 align-top">
                      <span className={
                        type.includes("Analitik")
                          ? "inline-flex rounded-full bg-[var(--coral)]/10 px-2 py-0.5 text-[11px] font-bold text-[var(--coral)]"
                          : "inline-flex rounded-full bg-foreground/[0.07] px-2 py-0.5 text-[11px] font-bold text-foreground/60"
                      }>
                        {type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground/60 align-top">{duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Section>

        {/* 5 — Konum */}
        <Section title="5. Konum Verisi">
          <p>
            Rezervasyon formunda <strong>"Mevcut konumumu kullan"</strong> butonuna tıkladığınızda
            tarayıcınız konum izni ister. Bu izin:
          </p>
          <ul className="mt-3 space-y-1.5 pl-4">
            <li className="list-disc marker:text-[var(--coral)]">Tamamen isteğe bağlıdır; vermemeniz halinde adresinizi elle girebilirsiniz.</li>
            <li className="list-disc marker:text-[var(--coral)]">Alış adresi alanını doldurmak için anlık olarak kullanılır ve cihazınızda işlenir; sunucularımıza gönderilmez, saklanmaz.</li>
            <li className="list-disc marker:text-[var(--coral)]">İzni geri almak için tarayıcı site ayarlarından "Konum: Engelle" seçeneğini kullanabilirsiniz.</li>
          </ul>
        </Section>

        {/* 6 */}
        <Section title="6. Üçüncü Taraflarla Paylaşım">
          <p>
            Kişisel verileriniz aşağıdaki durumların dışında üçüncü taraflarla paylaşılmaz ve satılmaz:
          </p>
          <ul className="mt-3 space-y-1.5 pl-4">
            <li className="list-disc marker:text-[var(--coral)]"><strong>Görevli sürücüler:</strong> Yalnızca ilgili rezervasyonu gerçekleştirmek için ad, telefon ve adres bilgisi.</li>
            <li className="list-disc marker:text-[var(--coral)]"><strong>Ödeme altyapısı:</strong> Ödeme işlemi için gerekli minimum veri; kart numarası Patilioz sistemlerinde saklanmaz.</li>
            <li className="list-disc marker:text-[var(--coral)]"><strong>Vercel Analytics:</strong> Rızanız olması halinde anonim sayfa istatistikleri (kişisel tanımlayıcı içermez).</li>
            <li className="list-disc marker:text-[var(--coral)]"><strong>Yasal zorunluluk:</strong> Mahkeme kararı veya yetkili kamu kurumu talebi.</li>
          </ul>
        </Section>

        {/* 7 */}
        <Section title="7. Saklama Süreleri">
          <div className="overflow-hidden rounded-2xl border border-foreground/[0.07]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground/[0.04]">
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Veri Kategorisi</th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Süre</th>
                  <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-foreground/60">Dayanak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/[0.05]">
                {[
                  ["Hesap ve profil bilgileri", "Üyelik + 3 yıl", "Meşru menfaat"],
                  ["Rezervasyon kayıtları", "5 yıl", "Yasal yükümlülük (TTK)"],
                  ["Ödeme/fatura kayıtları", "10 yıl", "Yasal yükümlülük (VUK)"],
                  ["Analitik veriler (anonim)", "26 ay", "Endüstri standardı"],
                  ["Konum verisi", "Saklanmaz", "—"],
                ].map(([cat, duration, basis]) => (
                  <tr key={cat} className="bg-white">
                    <td className="px-4 py-3 text-foreground/80 align-top">{cat}</td>
                    <td className="px-4 py-3 font-semibold text-foreground align-top">{duration}</td>
                    <td className="px-4 py-3 text-foreground/60 align-top">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 8 — KVKK hakları */}
        <Section title="8. KVKK Kapsamındaki Haklarınız (Madde 11)">
          <p className="mb-4">
            Kişisel verilerinize ilişkin aşağıdaki haklara sahipsiniz. Bu hakları kullanmak için
            kimliğinizi doğrulayan bir belge ile{" "}
            <a href="mailto:kvkk@patilioz.com" className="font-semibold text-[var(--coral)] hover:underline">
              kvkk@patilioz.com
            </a>{" "}
            adresine başvurabilirsiniz. Başvurular <strong>30 gün</strong> içinde yanıtlanır.
          </p>
          <div className="overflow-hidden rounded-2xl border border-foreground/[0.07]">
            {[
              ["Bilgi edinme", "Kişisel verilerinizin işlenip işlenmediğini öğrenme"],
              ["Bilgi talep etme", "İşlenmişse buna ilişkin bilgi alma"],
              ["Amaç sorgulama", "İşlenme amacını ve amacına uygun kullanımı öğrenme"],
              ["Aktarım sorgusu", "Yurt içi veya dışında aktarılan üçüncü kişileri öğrenme"],
              ["Düzeltme", "Eksik veya yanlış verilerin düzeltilmesini isteme"],
              ["Silme / unutulma", "Şartlar oluştuğunda verilerin silinmesini isteme"],
              ["İşleme itirazı", "Yalnızca meşru menfaat dayanağıyla işlenen verilere itiraz etme"],
              ["Karar itirazı", "Otomatik sistemler sonucu aleyhinize çıkan karara itiraz etme"],
              ["Zarar tazminatı", "Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme"],
            ].map(([right, desc], i, arr) => (
              <div
                key={right}
                className={`flex items-start gap-3 bg-white px-4 py-3 ${i < arr.length - 1 ? "border-b border-foreground/[0.05]" : ""}`}
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--coral)]/10 text-[10px] font-extrabold text-[var(--coral)]">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-extrabold text-foreground">{right}</p>
                  <p className="text-sm text-foreground/65">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Başvurunuzun reddedilmesi veya yanıtsız kalması durumunda Kişisel Verileri Koruma
            Kurumu'na (KVKK) şikayette bulunabilirsiniz:{" "}
            <a
              href="https://www.kvkk.gov.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--coral)] hover:underline"
            >
              kvkk.gov.tr
            </a>
          </p>
        </Section>

        {/* 9 */}
        <Section title="9. Güvenlik Önlemleri">
          <p>
            Verileriniz TLS şifrelemesi, erişim kontrollü sistemler ve düzenli güvenlik denetimleriyle
            korunmaktadır. Veri ihlali tespit edilmesi durumunda KVKK'nın öngördüğü{" "}
            <strong>72 saat</strong> içinde Kurul'a bildirim yapılır; etkilenen kullanıcılara da en
            kısa sürede haber verilir.
          </p>
        </Section>

        {/* 10 */}
        <Section title="10. Yurt Dışı Veri Transferi">
          <p>
            Vercel Analytics hizmeti ABD'de barındırılmaktadır. Aktarım, KVKK Madde 9 kapsamında
            Kişisel Verileri Koruma Kurulu'nun yeterli korumayı sağladığını belirlediği ülkeler veya
            uygun güvencelerin varlığı koşuluyla gerçekleştirilmektedir. Analitik veriler kişisel
            tanımlayıcı içermez.
          </p>
        </Section>

        {/* 11 */}
        <Section title="11. Politika Değişiklikleri">
          <p>
            Bu politika güncellendiğinde yürürlük tarihi değiştirilir. Önemli değişiklikler için
            kayıtlı kullanıcılara e-posta veya SMS bildirimi gönderilir. Hizmeti kullanmaya devam
            etmeniz güncel koşulları kabul ettiğiniz anlamına gelir.
          </p>
        </Section>

      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/kullanim-kosullari"
          className="text-sm font-semibold text-[var(--coral)] hover:underline"
        >
          Kullanım Koşulları →
        </Link>
        <Link
          href="/iletisim"
          className="text-sm font-semibold text-[var(--coral)] hover:underline"
        >
          Bize Ulaşın →
        </Link>
      </div>
    </div>
  )
}

function Section({
  title,
  id,
  children,
}: {
  title: string
  id?: string
  children: React.ReactNode
}) {
  return (
    <div id={id}>
      <h2
        className="mb-4 text-base font-extrabold text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-foreground/80">
        {children}
      </div>
    </div>
  )
}
