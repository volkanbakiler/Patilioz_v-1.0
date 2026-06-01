import type { BookingService } from "./booking-bus"

export type ServiceBadge = {
  icon: "shield" | "clock" | "userCheck" | "rotateCcw" | "gift"
  label: string
}

export type ProcessStep = {
  step: number
  title: string
  body: string
}

export type Faq = {
  q: string
  a: string
}

export type ServiceContent = {
  /** URL slug — değiştirilemez (SEO için kalıcı). */
  slug: string
  /** booking-bus'ın anladığı id — kart tıklaması bunu openBooking'e gönderir. */
  booking: BookingService
  /** Numara (01, 02, 03) — kart için. */
  id: string
  /** Lucide icon adı — services-section ve detail sayfasında map edilir. */
  icon: "route" | "repeat" | "userCheck"
  /** Kısa marka adı (kart başlığı, breadcrumb). */
  name: string
  /** Tek satırlık değer önermesi (kart taglinesi + meta description için). */
  tagline: string
  /** "~25–45 dk" gibi süre/kapsam göstergesi (kart). */
  duration: string
  /** Kart altındaki 3 trust badge. */
  badges: [ServiceBadge, ServiceBadge, ServiceBadge]
  /** Sayfa H1 (kart başlığından daha SEO odaklı). */
  pageTitle: string
  /** OG/meta description ve hero açıklama. */
  description: string
  /** Detay sayfasının hero altındaki 2-3 paragraflık editöryal giriş. */
  intro: string[]
  /** "Kimler için uygun" — kartlardan kalkan içerik burada genişletilmiş hâlde. */
  suitableFor: { title: string; body: string }[]
  /** "Nasıl çalışır" — 4-5 adımlı süreç. */
  process: ProcessStep[]
  /** Fiyatlandırma bilgisi (rakam vermeden, dürüst). */
  pricing: {
    headline: string
    body: string
  }
  /** SSS — FAQ schema'ya beslenir. */
  faq: Faq[]
}

const COMMON_BADGES = {
  insured: { icon: "shield" as const, label: "Sigortalı" },
  liveTrack: { icon: "clock" as const, label: "Canlı takip" },
  welcome: { icon: "gift" as const, label: "%10 hoş geldin" },
  flexible: { icon: "rotateCcw" as const, label: "Esnek dönüş" },
  escort: { icon: "userCheck" as const, label: "Refakat dahil" },
}

export const services: ServiceContent[] = [
  {
    slug: "standart-pet-taksi",
    booking: "one-way",
    id: "01",
    icon: "route",
    name: "Standart Pet Taksi",
    tagline: "Tek yön, doğrudan transfer",
    duration: "Şehir içi 25–45 dk",
    badges: [COMMON_BADGES.insured, COMMON_BADGES.liveTrack, COMMON_BADGES.welcome],
    pageTitle: "İstanbul'da Standart Pet Taksi Hizmeti",
    description:
      "Patili dostunuzu tek yön olarak güvenli, sigortalı ve takip edilebilir şekilde A noktasından B noktasına ulaştırırız. Veteriner randevuları, kuaför ziyaretleri ve kısa transferler için.",
    intro: [
      "Standart Pet Taksi, patili dostunuzun günlük yolculuk ihtiyacını en sade hâliyle karşılayan hizmetimizdir. Tek yön bir transferdir — bir noktadan alır, bir noktaya bırakırız.",
      "Yolculuk boyunca araçta uygun havalandırma, sabitleme noktası ve hayvan dostu ekipman bulunur. Aile ister araçta refakat eder ister ekibimize emanet eder; ikisi de mümkündür.",
    ],
    suitableFor: [
      {
        title: "Veteriner randevuları",
        body: "Rutin kontroller, aşı tarihleri ve tek seferlik klinik ziyaretleri için ideal. Aile gidemediğinde dostunuzu kliniğe biz götürürüz.",
      },
      {
        title: "Bakım ve kuaför ziyaretleri",
        body: "Pet kuaförü, tırnak bakımı veya banyo randevuları için tek yön transfer. Geri dönüş için ayrıca rezervasyon oluşturabilirsiniz.",
      },
      {
        title: "Kısa süreli konaklama transferleri",
        body: "Pet otel veya bakıcıya bırakma ve alma süreçleri için kullanışlıdır.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Rezervasyon oluşturun",
        body: "Patili dostunuzu, alış–varış adreslerini ve uygun zaman dilimini seçin. Talep ekibimize iletilir.",
      },
      {
        step: 2,
        title: "Onay alın",
        body: "Müsaitlik kontrolü sonrası rezervasyonunuz onaylanır; net fiyat ve sürücü bilgisi sizinle paylaşılır.",
      },
      {
        step: 3,
        title: "Alış noktasına geliriz",
        body: "Belirlenen saatte adreste oluruz. Aile yolculuk öncesi kısa bir tanışma için zaman ayırır.",
      },
      {
        step: 4,
        title: "Yolculuk + canlı takip",
        body: "Yolculuk boyunca konum paylaşımı yapılır. Bir aksaklık veya gecikme olduğunda sizi anlık bilgilendiririz.",
      },
      {
        step: 5,
        title: "Güvenli teslim",
        body: "Varış noktasında dostunuzu teslim ederiz. İsterseniz fotoğraflı teslim onayı paylaşırız.",
      },
    ],
    pricing: {
      headline: "Mesafeye ve zamana göre",
      body: "Standart Pet Taksi fiyatı; alış–varış arası mesafe, gün ve saat dilimine göre hesaplanır. Rezervasyon talebinizden sonra net fiyat sizinle paylaşılır, onay verdiğinizde kesinleşir. Sürpriz ücret yoktur.",
    },
    faq: [
      {
        q: "Köpeğim için taşıma kutusu (kennel) gerekli mi?",
        a: "Küçük ırklar için taşıma kutusu önerilir ama zorunlu değildir. Orta ve büyük ırklarda araç içinde sabitleme noktası ve emniyet kemeri tasması kullanırız. Kuduz aşısı ve ağızlık (gerekli ırklar için) yasal zorunluluktur.",
      },
      {
        q: "Yolculuk sırasında kediler nasıl taşınır?",
        a: "Kediler için taşıma kutusu (sert veya yumuşak) zorunludur. Kutuyu siz sağlarsınız; ekibimiz araç içinde kutuyu sabitler ve stres göstergelerini takip eder.",
      },
      {
        q: "Aile araçta birlikte gelebilir mi?",
        a: "Evet, refakatçi olmak isteyen aile üyeleri yolculuğa katılabilir. Rezervasyon sırasında 'kaç kişi' bilgisini iletmeniz yeterli; ek ücret yoktur (araç kapasitesi sınırlıdır).",
      },
      {
        q: "Gecikme veya iptal durumunda ne oluyor?",
        a: "Rezervasyon saatinizden 2 saat öncesine kadar ücretsiz iptal mümkündür. Bu sürenin altında iptal veya 'gelinmedi' durumu için kısmi ücret uygulanır; detayları onay mailinde paylaşırız.",
      },
      {
        q: "Hangi bölgelerde hizmet veriyorsunuz?",
        a: "Şu an İstanbul Anadolu ve Avrupa yakasında hizmet veriyoruz. Şehirler arası transferler için Gidiş–Dönüş veya Refakatçili hizmetimizi inceleyebilirsiniz.",
      },
    ],
  },
  {
    slug: "gidis-donus-pet-taksi",
    booking: "round-trip",
    id: "02",
    icon: "repeat",
    name: "Gidiş–Dönüş Pet Taksi",
    tagline: "Aynı gün gidiş ve dönüş",
    duration: "15 dk ücretsiz bekleme dahil",
    badges: [COMMON_BADGES.insured, COMMON_BADGES.flexible, COMMON_BADGES.welcome],
    pageTitle: "Gidiş–Dönüş Pet Taksi: Aynı Gün Klinik ve Bakım Transferi",
    description:
      "Patili dostunuzu randevu için alır, işlem bittiğinde aynı gün içinde yeniden evine getiririz. Klinik kontrolleri, aşılar ve kuaför randevuları için tek seferde planlanan iki yönlü transfer.",
    intro: [
      "Gidiş–Dönüş Pet Taksi, aynı gün içinde planlanmış iki yolculuğu tek bir rezervasyonda birleştirir. Randevu süresince ekibimiz bekler; işlem bittiğinde geri dönüş için tekrar uğraşmazsınız.",
      "Klinikteki bekleme için 15 dakika ücretsizdir. Sonraki süre dakika başı düşük bir bekleme ücretiyle hesaplanır — ne kadar süreceğini önceden bilmediğiniz randevular için en sürtünmesiz seçenek budur.",
    ],
    suitableFor: [
      {
        title: "Klinik kontrolleri",
        body: "Süresi tahmin edilemeyen kontroller, kan tahlili, ultrason gibi işlemler için. Sonuç beklerken aileyi kliniğe takılı bırakmaz.",
      },
      {
        title: "Aşı ve tahlil randevuları",
        body: "Standart aşılama veya rutin tahlillerde hızlı gidiş–dönüş. Çoğu aşı randevusu 20–30 dk sürer — ücretsiz bekleme kapsamındadır.",
      },
      {
        title: "Kuaför ve bakım buluşmaları",
        body: "Tıraş, banyo ve tırnak bakımı seansları için. Aile randevu süresince başka işlerine devam edebilir.",
      },
    ],
    process: [
      {
        step: 1,
        title: "İki yönlü rezervasyon",
        body: "Tek seferde hem gidiş hem tahmini dönüş zamanını belirlersiniz. Ekibimiz iki yolculuk için de planlama yapar.",
      },
      {
        step: 2,
        title: "Onay ve net fiyat",
        body: "Mesafe + tahmini bekleme süresine göre fiyat hesaplanır, onayınıza sunulur.",
      },
      {
        step: 3,
        title: "Gidiş yolculuğu",
        body: "Adresinizden alış, randevu noktasına güvenli transfer. Teslim sırasında randevu personeline bilgi verilir.",
      },
      {
        step: 4,
        title: "Bekleme süresi",
        body: "Ekibimiz randevu süresince yakınında kalır. İlk 15 dk ücretsizdir. Süre uzarsa size haber verilir.",
      },
      {
        step: 5,
        title: "Dönüş ve teslim",
        body: "Randevu biter bitmez aynı araçla dönüş başlar. Evine güvenli teslim.",
      },
    ],
    pricing: {
      headline: "İki yolculuk + bekleme paketi",
      body: "Fiyat; toplam gidilen mesafe ve bekleme süresine göre hesaplanır. 15 dakika bekleme her zaman ücretsizdir. İki ayrı tek-yön rezervasyon yerine bu paketi seçmek genellikle daha ekonomiktir; rezervasyon talebinizden sonra net rakamı paylaşırız.",
    },
    faq: [
      {
        q: "Randevum 15 dakikadan uzun sürerse ne olur?",
        a: "15 dakikadan sonrası dakika başı düşük bir bekleme ücretiyle devam eder. Süre uzadıkça size SMS veya uygulama bildirimi göndeririz, böylece toplam ücreti her zaman bilirsiniz.",
      },
      {
        q: "Dönüş saatini önceden bilmiyorum, ne yapayım?",
        a: "Tahmini bir süre verirsiniz, ekibimiz buna göre planlar. Randevu bittiğinde 'hazırım' bildirimini gönderdiğinizde dönüş başlar. Tahmini süre çok aşılırsa ek bekleme veya yeni randevu seçenekleri konuşulur.",
      },
      {
        q: "Klinikte bizimle birlikte beklemeleri mümkün mü?",
        a: "Ekibimiz kapı önünde araçta veya yakın bir noktada hazır bekler. Klinik içinde refakat gereken durumlarda Refakatçili Pet Taksi hizmetimizi öneririz.",
      },
      {
        q: "İki yolculuk için iki ayrı sürücü mü gelir?",
        a: "Hayır, aynı araç ve aynı ekip hem gidiş hem dönüşte size eşlik eder. Bu, patili dostunuz için tanıdık bir yüz/koku anlamına gelir — stres azalır.",
      },
      {
        q: "Bekleme süresince hayvanım bağımsız nereye gidiyor?",
        a: "Patili dostunuz randevuda klinik/kuaför ekibinin sorumluluğundadır. Ekibimiz dışarıda araçta veya yakın bir noktada hazır bekler. Randevu içi süreç tamamen klinik yetkisindedir.",
      },
    ],
  },
  {
    slug: "refakatci-pet-taksi",
    booking: "accompanied",
    id: "03",
    icon: "userCheck",
    name: "Refakatçili Pet Taksi",
    tagline: "Yolculuk boyunca yanında bir kişi",
    duration: "Stresli yolculuklar için",
    badges: [COMMON_BADGES.escort, COMMON_BADGES.insured, COMMON_BADGES.welcome],
    pageTitle: "Refakatçili Pet Taksi: Yolculuk Boyunca Aileden Biri Yanında",
    description:
      "Patili dostunuza yolculuk boyunca bir ekip üyesi veya talep ederseniz aile bireyi eşlik eder. Stresli, uzun veya hassas sağlık durumları için tasarlanmış premium hizmet.",
    intro: [
      "Refakatçili Pet Taksi, yolculuk yalnız geçirilmemesi gereken patili dostlar içindir. Stres geçmişi olan, ilaç kullanan, yaşlı veya travma sonrası kaygılı hayvanlar için tasarlandı.",
      "Bir ekip üyemiz tüm yolculuk boyunca yanında oturur; suyunu, sakinleştirici nesnesini, gerekirse ilaç saatini takip eder. Aile dilerse refakatçi kendisi olur, ekibimiz sürüş ve lojistiği yönetir.",
    ],
    suitableFor: [
      {
        title: "Stresli olabilecek yolculuklar",
        body: "Otel taşıması, klinik sonrası dönüş, yeni bir eve geçiş gibi duygusal yüklü yolculuklar için. Yanında tanıdık bir varlık olması fark yaratır.",
      },
      {
        title: "Uzun mesafeli transferler",
        body: "Şehirler arası veya saat süren yolculuklarda mola, su, tuvalet ve sakinleştirme molaları planlı şekilde yönetilir.",
      },
      {
        title: "Hassas sağlık durumları",
        body: "Operasyon sonrası dönüş, kronik ilaç kullanımı, yaşlılık ve mobilite sınırlamaları için ekstra dikkat gerektiren yolculuklarda önerilir.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Detaylı rezervasyon",
        body: "Sağlık durumu, ilaçlar, sakinleştirici alışkanlıkları gibi özel notları rezervasyonda paylaşırsınız.",
      },
      {
        step: 2,
        title: "Brifing",
        body: "Refakatçimiz yolculuk öncesi aile ile kısa bir görüşme yapar; tetikleyiciler, sakinleştirme yöntemleri ve özel istekler not edilir.",
      },
      {
        step: 3,
        title: "Yolculukta refakat",
        body: "Ekip üyesi yolculuk boyunca yanında oturur; molalar, su, gerekirse ilaç saatleri ve sakinleştirici varlıklarla destek olur.",
      },
      {
        step: 4,
        title: "Anlık iletişim",
        body: "Aile ile yolculuk boyunca temas halinde kalınır; her mola öncesi/sonrası kısa bilgi verilir.",
      },
      {
        step: 5,
        title: "Detaylı teslim",
        body: "Varışta sadece teslim değil, yolculuk özeti de paylaşılır: nasıl geçti, ne yedi/içti, dikkat çeken durumlar.",
      },
    ],
    pricing: {
      headline: "Mesafe + refakat süresi",
      body: "Refakatçili hizmet, standart taksiden bir adım ileridir; fiyat mesafe ve toplam refakat süresine göre hesaplanır. Şehirler arası yolculuklarda yakıt, mola ve geceleme (gerekirse) bilgisi şeffaf şekilde sunulur. Onayınızdan önce her kalem netleşir.",
    },
    faq: [
      {
        q: "Refakatçim ekipten mi yoksa aileden mi olur?",
        a: "Tercih sizindir. Aileden birinin gelmesi en doğal seçenektir; bu durumda ekibimiz sürüş ve lojistikten sorumludur. Aile gelemiyorsa eğitimli bir ekip üyemiz refakat eder.",
      },
      {
        q: "Yolculuk sırasında ilaç verebilir misiniz?",
        a: "Evet, aileden net talimat ve dozaj bilgisi aldığımız ilaçları yolculuk sırasında veririz. İlaç saatlerini önceden paylaşmanız ve şişeyi etiketli olarak teslim etmeniz gerekir.",
      },
      {
        q: "Uzun yolculuklarda mola sıklığı nasıl ayarlanır?",
        a: "Genel kural her 2–3 saatte bir mola; ama yaş, sağlık durumu ve yolculuk geçmişine göre kısaltılır. Brifingte aile ile mola planı netleştirilir.",
      },
      {
        q: "Şehirler arası yolculukta geceleme oluyor mu?",
        a: "İstanbul–Ankara gibi mesafelerde tek seferde sürüyoruz. Daha uzun mesafelerde (örn. Antalya, İzmir uzak rotaları) aile ile birlikte geceleme planı yapılır; tüm masraflar onay öncesi paylaşılır.",
      },
      {
        q: "Refakatçili hizmet için minimum mesafe var mı?",
        a: "Hayır, kısa şehir içi yolculuklar için de tercih edebilirsiniz. Özellikle operasyon sonrası kısa dönüşlerde sıkça seçiliyor.",
      },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug)
}

export function getRelatedServices(slug: string): ServiceContent[] {
  return services.filter((s) => s.slug !== slug)
}
