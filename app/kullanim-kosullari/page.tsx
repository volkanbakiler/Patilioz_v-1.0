import type { Metadata } from "next"
import { absoluteUrl, SITE } from "@/lib/seo"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description:
    "Patilioz hizmetlerini kullanmadan önce lütfen kullanım koşullarını okuyun.",
  alternates: { canonical: absoluteUrl("/kullanim-kosullari") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/kullanim-kosullari"),
    title: `Kullanım Koşulları | ${SITE.brand}`,
    description: "Patilioz hizmetlerini kullanmadan önce kullanım koşullarını okuyun.",
    siteName: SITE.brand,
    locale: "tr_TR",
  },
}

const EFFECTIVE_DATE = "1 Ocak 2025"

export default function KullanimKosullariPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Başlık */}
      <div className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
          Yasal
        </p>
        <h1
          className="text-3xl font-extrabold text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Kullanım Koşulları
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Yürürlük tarihi: {EFFECTIVE_DATE}
        </p>
      </div>

      <div className="space-y-8 text-[15px] leading-relaxed text-foreground/85">

        <Section title="1. Kabul">
          <p>
            Patilioz web sitesi veya uygulamasını kullanarak ya da rezervasyon oluşturarak bu
            Kullanım Koşulları&apos;nı ("Koşullar") kabul etmiş sayılırsınız. Kabul etmiyorsanız
            hizmetlerimizi kullanmayın.
          </p>
        </Section>

        <Section title="2. Hizmet Kapsamı">
          <p>
            Patilioz; evcil hayvan taşıma, klinik transferi ve refakatli pet ulaşımı hizmetleri sunar.
            Hizmetler İstanbul ile sınırlıdır; hizmet alanı önceden bildirim yapılarak değiştirilebilir.
          </p>
        </Section>

        <Section title="3. Üyelik ve Hesap">
          <ul>
            <li>Hesap oluşturmak için 18 yaşını doldurmuş olmanız gerekir.</li>
            <li>Hesap bilgilerinizin doğruluğundan siz sorumlusunuz.</li>
            <li>Hesabınızın yetkisiz kullanımını derhal bize bildirin.</li>
            <li>Bir kişiye ait yalnızca bir aktif hesap açılabilir.</li>
          </ul>
        </Section>

        <Section title="4. Rezervasyon ve İptal">
          <ul>
            <li>Rezervasyon, ödeme onayının ardından kesinleşir.</li>
            <li>Hizmet saatinden 12 saat öncesine kadar yapılan iptallerde ücret alınmaz.</li>
            <li>Daha geç iptallerde veya sürücü bekleme süresi aşımında kısmi ücret uygulanabilir.</li>
            <li>Patilioz, mücbir sebep halinde rezervasyonu ücret iadesiyle iptal edebilir.</li>
          </ul>
        </Section>

        <Section title="5. Kullanıcı Yükümlülükleri">
          <ul>
            <li>Rezervasyon bilgilerini doğru ve eksiksiz girin.</li>
            <li>Pet&apos;inizin sağlık durumunu belirtin; bulaşıcı hastalık şüphesi varsa önceden bildirin.</li>
            <li>Sürücünün makul taleplerine uyun; araçta hayvan güvenliğini tehlikeye atacak davranışlardan kaçının.</li>
            <li>Platformu kötüye kullanmayın, yanlış bilgi vermeyin.</li>
          </ul>
        </Section>

        <Section title="6. Fiyatlar ve Ödeme">
          <p>
            Fiyatlar rezervasyon anında gösterilir ve KDV dahildir. Patilioz fiyatları önceden
            duyurarak değiştirme hakkını saklı tutar. Onaylanmış rezervasyonlara fiyat değişikliği
            uygulanmaz.
          </p>
        </Section>

        <Section title="7. Sorumluluk Sınırlaması">
          <p>
            Patilioz, pet taşıma sürecinde gerekli özeni göstermekle yükümlüdür. Ancak önceden
            bildirilen sağlık sorunundan kaynaklanan durumlar, mücbir sebepler ve kullanıcı
            hatası nedeniyle oluşan zararlardan sorumluluk kabul edilmez. Azami sorumluluk tutarı
            ilgili hizmet bedeli ile sınırlıdır.
          </p>
        </Section>

        <Section title="8. Fikri Mülkiyet">
          <p>
            Site içeriği, tasarımı ve markası Patilioz&apos;a aittir. İzinsiz kopyalanması,
            dağıtılması veya ticari amaçla kullanılması yasaktır.
          </p>
        </Section>

        <Section title="9. Uygulanacak Hukuk">
          <p>
            Bu Koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri
            ve İcra Müdürlükleri yetkilidir.
          </p>
        </Section>

        <Section title="10. Değişiklikler">
          <p>
            Koşullar güncellendiğinde yürürlük tarihi değiştirilir. Hizmeti kullanmaya devam etmeniz
            güncel koşulları kabul ettiğiniz anlamına gelir.
          </p>
        </Section>

        <Section title="11. İletişim">
          <p>
            Sorularınız için{" "}
            <Link href="/iletisim" className="font-semibold text-[var(--coral)] hover:underline">
              iletişim sayfamızı
            </Link>{" "}
            ziyaret edin veya{" "}
            <a
              href="mailto:merhaba@patilioz.com"
              className="font-semibold text-[var(--coral)] hover:underline"
            >
              merhaba@patilioz.com
            </a>{" "}
            adresine yazın.
          </p>
        </Section>

      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/gizlilik-politikasi"
          className="text-sm font-semibold text-[var(--coral)] hover:underline"
        >
          Gizlilik Politikası →
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="mb-3 text-base font-extrabold text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <div className="space-y-2 text-[15px] leading-relaxed text-foreground/80 [&_ul]:space-y-1.5 [&_ul]:pl-4 [&_li]:list-disc [&_li]:marker:text-[var(--coral)]">
        {children}
      </div>
    </div>
  )
}
