import type { ArtworkVariant } from "@/components/media-frame"
import type { BookingService } from "./booking-bus"

/** Editöryal gövde blokları — "oku" modunda zengin render için. */
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; title: string; body: string }
  | { type: "quote"; text: string }

export type BlogCategory = "Sağlık" | "Seyahat" | "Yaşam"

export type BlogPost = {
  /** URL slug — kalıcı (SEO). */
  slug: string
  category: BlogCategory
  /** Liste/feed kartı için kısa başlık. */
  title: string
  /** Feed kartı + meta description özeti. */
  excerpt: string
  /** Görsel fallback varyantı (foto yoksa SVG). */
  variant: ArtworkVariant
  /** public/images altındaki kapak fotoğrafı (opsiyonel; yoksa SVG). */
  image?: string
  /** Varsa video kaynağı — "izle" modunu aktive eder, kartta play overlay gösterir. */
  video?: string
  /** Videonun süresi etiketi (örn. "2:10"). */
  videoDuration?: string
  /** Okuma süresi etiketi. */
  readTime: string
  date: string
  /** ISO tarih (datetime / sitemap için). */
  dateISO: string
  /** Öne çıkan yazı mı? (feed'in üstündeki büyük kapak.) */
  featured?: boolean
  /** Funnel: yazı sonundaki bağlamsal dönüşüm CTA'sı. */
  cta: {
    headline: string
    body: string
    label: string
    /** Bu hizmetle rezervasyon başlatır (openBooking'e gider). */
    service?: BookingService
  }
  /** Editöryal gövde — "oku" modunda render edilir. */
  body: ContentBlock[]
  faq?: { q: string; a: string }[]
}

export const posts: BlogPost[] = [
  {
    slug: "pet-seyahat-rehberi",
    category: "Seyahat",
    title: "Evcil Hayvanınızla Seyahat Ederken Dikkat Etmeniz Gerekenler",
    excerpt:
      "İlk yolculuk hem sizin hem patili dostunuz için stresli olabilir. Taşıma çantasından mola planına, sakin bir seyahatin tüm adımlarını derledik.",
    variant: "travel",
    image: "/images/blog-1.jpg",
    videoDuration: "2:10",
    readTime: "4 dk okuma",
    date: "10 Mart 2026",
    dateISO: "2026-03-10",
    featured: true,
    cta: {
      headline: "Yolculuğu siz değil, biz planlayalım",
      body: "Stresli trafiği ve park derdini bırakın. Patili dostunuzu güvenle, sigortalı ve takip edilebilir şekilde taşıyalım.",
      label: "Rezervasyona başla",
      service: "one-way",
    },
    body: [
      {
        type: "p",
        text: "Bir köpeğin ya da kedinin ilk uzun yolculuğu, çoğu zaman sahibinin tahmininden daha belirleyicidir. Hayvanlar mekân değişimini koku, ses ve titreşimle okur; bu yüzden iyi planlanmamış bir yolculuk, sonraki tüm seyahatlere sinen bir tedirginlik bırakabilir. İyi haber şu: birkaç temel hazırlıkla bu deneyimi sakin, hatta keyifli hâle getirmek mümkün.",
      },
      { type: "h2", text: "Yola çıkmadan önce" },
      {
        type: "p",
        text: "Hazırlık, yolculuğun yarısıdır. Patili dostunuzu yola çıkmadan günler önce taşıma çantasıyla tanıştırın; çantayı evin sakin bir köşesinde açık bırakın, içine sevdiği bir örtü veya oyuncak koyun. Amaç, çantanın bir “kapatılma” değil bir “güvenli alan” olarak algılanması.",
      },
      {
        type: "list",
        items: [
          "Aşı kartı ve varsa kimlik/mikroçip bilgilerini yanınıza alın.",
          "Yolculuktan 3-4 saat önce hafif besleyin; tok mideyle yola çıkmak bulantı yapabilir.",
          "Su kabını ve küçük bir mama porsiyonunu erişilebilir tutun.",
          "Tanıdık kokulu bir örtü, kaygıyı belirgin biçimde azaltır.",
        ],
      },
      {
        type: "tip",
        title: "Sakinleştirici feromonlar",
        body: "Kediler için sentetik yüz feromonu spreyleri, taşıma çantasına yolculuktan 15 dakika önce sıkıldığında stres davranışlarını azaltabilir. Köpekler için benzer ürünler tasma aparatı olarak bulunur.",
      },
      { type: "h2", text: "Yol boyunca" },
      {
        type: "p",
        text: "Uzun yolculuklarda her 2-3 saatte bir kısa molalar planlayın. Köpekler için tuvalet ve su molası şart; kediler genelde çantada kalmayı tercih eder, zorlamayın. Aracı asla doğrudan güneş alan bir yerde, hayvan içerideyken park etmeyin — kapalı araç içi sıcaklığı dakikalar içinde tehlikeli seviyeye çıkar.",
      },
      {
        type: "quote",
        text: "Sakin bir sahip, sakin bir hayvan demektir. Stresiniz tasmadan ve sesinizden ona geçer.",
      },
      {
        type: "p",
        text: "Eğer yolculuk planlaması, trafik ve park stresi gözünüzü korkutuyorsa, bu yükü tamamen devretmek de bir seçenek. Profesyonel bir pet taksi, hem aracı hayvan taşımacılığına uygun donatır hem de yolculuğu sizin adınıza takip eder.",
      },
    ],
    faq: [
      {
        q: "Kedimi seyahatte çantadan çıkarmalı mıyım?",
        a: "Hayır. Hareket hâlindeki araçta kedinin çantadan çıkması hem onun hem sürücünün güvenliği için risklidir. Çanta, kedi için en güvenli alandır.",
      },
      {
        q: "Yolculuk öncesi sakinleştirici ilaç vermeli miyim?",
        a: "Bu kararı yalnızca veterineriniz verebilir. Kendi başınıza ilaç vermeyin; çoğu durumda feromon ve doğru hazırlık yeterlidir.",
      },
    ],
  },
  {
    slug: "veteriner-ziyaretleri",
    category: "Sağlık",
    title: "Veteriner Ziyaretini Stressiz Hâle Getirmenin 5 Yolu",
    excerpt:
      "Klinik kapısında başlayan panik, doğru alışkanlıklarla önlenebilir. Kedi ve köpekler için ziyareti kolaylaştıran beş pratik adım.",
    variant: "health",
    image: "/images/blog-2.jpg",
    videoDuration: "1:45",
    readTime: "3 dk okuma",
    date: "5 Mart 2026",
    dateISO: "2026-03-05",
    cta: {
      headline: "Kliniğe gidiş-dönüş tek seferde",
      body: "Randevuya götürelim, kontrol bitince yine evinize getirelim. 15 dakika ücretsiz bekleme dahil.",
      label: "Gidiş-dönüş ayarla",
      service: "round-trip",
    },
    body: [
      {
        type: "p",
        text: "Çoğu kedi ve köpek için veteriner ziyareti, yılın en stresli anlarından biridir. Oysa bu tedirginliğin büyük kısmı kliniğin kendisinden değil, ona giden yoldan ve hazırlık eksikliğinden kaynaklanır. Aşağıdaki beş alışkanlık, ziyareti her iki taraf için de katlanılır hâle getirir.",
      },
      { type: "h2", text: "1. Taşıma çantasını düşman olmaktan çıkarın" },
      {
        type: "p",
        text: "Çantayı yalnızca veterinere giderken ortaya çıkarırsanız, hayvan onu kötü bir deneyimle eşleştirir. Çantayı evde her zaman erişilebilir, içi rahat bir köşe hâline getirin.",
      },
      { type: "h2", text: "2. Aç karnına değil, hafif tok götürün" },
      {
        type: "p",
        text: "Hafif bir öğün, yolculuk kaygısını azaltır; ayrıca klinikte ödül muamelesi yapılacak küçük atıştırmalıklar pozitif pekiştirme sağlar.",
      },
      {
        type: "list",
        items: [
          "Randevuyu günün sakin saatlerine alın; kalabalık bekleme salonu stresi artırır.",
          "Kedinizi havluyla örtülü çantayla taşıyın; görüş alanının kapanması güven verir.",
          "Klinikte sakin ve alçak sesle konuşun; panik sesiniz hayvana geçer.",
        ],
      },
      {
        type: "tip",
        title: "Yolculuğu siz sürmeyin",
        body: "Sahibinin direksiyonda gergin olması, arka koltuktaki hayvana doğrudan yansır. Yolculuğu profesyonel bir ekibe bırakmak, siz dostunuzla ilgilenirken yol stresini ortadan kaldırır.",
      },
      {
        type: "quote",
        text: "Veteriner korkusu çoğu zaman kliniğin değil, kontrolsüz yolculuğun korkusudur.",
      },
    ],
    faq: [
      {
        q: "Kedim çantaya hiç girmiyor, ne yapmalıyım?",
        a: "Çantayı günler öncesinden açık bırakın, içine mama ve sevdiği örtüyü koyun. Zorla sokmak çantayı kalıcı olarak korkutucu hâle getirir.",
      },
    ],
  },
  {
    slug: "sehirde-pet-yasami",
    category: "Yaşam",
    title: "Şehirde Pet Sahibi Olmanın Püf Noktaları",
    excerpt:
      "Daireden parka, günlük rutinden acil durumlara: yoğun şehir hayatında patili dostunuzla uyumlu, sağlıklı bir düzen kurmanın yolları.",
    variant: "cityLife",
    image: "/images/blog-3.jpg",
    videoDuration: "3:05",
    readTime: "5 dk okuma",
    date: "28 Şubat 2026",
    dateISO: "2026-02-28",
    cta: {
      headline: "Şehir içi her ihtiyaç için yanınızdayız",
      body: "Kuaför, veteriner, otel ya da bir arkadaş ziyareti — patili dostunuzu güvenle taşıyalım.",
      label: "Hizmetleri keşfet",
    },
    body: [
      {
        type: "p",
        text: "Şehirde evcil hayvanla yaşamak, kırsaldakinden çok farklı bir denge ister. Sınırlı alan, yoğun tempo ve dış uyaranlar; hem sahibi hem hayvanı zorlayabilir. Ancak doğru bir günlük düzen kurulduğunda, apartman dairesi de bir kedi ya da köpek için tatmin edici bir yuva olabilir.",
      },
      { type: "h2", text: "Alanı dikey kullanın" },
      {
        type: "p",
        text: "Metrekareniz azsa yukarı doğru genişleyin. Kediler için tırmanma rafları ve pencere yatakları, köpekler için kendine ait sabit bir köşe; hayvana “bu alan benim” hissi verir ve davranış sorunlarını azaltır.",
      },
      {
        type: "list",
        items: [
          "Günlük rutini sabitleyin: hayvanlar öngörülebilirlikle rahatlar.",
          "Köpekler için günde en az iki kez nitelikli yürüyüş planlayın.",
          "Kediler için tek başına kaldıkları saatlere oyun ve avlanma uyaranı bırakın.",
          "Acil durum çantası hazır olsun: aşı kartı, mama, su, taşıma çantası.",
        ],
      },
      {
        type: "tip",
        title: "Yoğun bir günde transfer derdi",
        body: "Mesai, trafik ve randevuların sıkıştığı günlerde patili dostunuzun kuaför ya da veteriner transferini bir pet taksiye devretmek, gününüzü ciddi biçimde rahatlatır.",
      },
      {
        type: "p",
        text: "Şehir hayatının ritmi içinde patili dostunuzun ihtiyaçlarını ihmal etmemek, küçük ama tutarlı alışkanlıklarla mümkün. Geri kalanı için — özellikle ulaşım gibi zaman alan kısımlar için — yükü paylaşabileceğiniz çözümler var.",
      },
    ],
  },
  {
    slug: "mikrocip-rehberi",
    category: "Sağlık",
    title: "Mikroçip Nedir, Neden Önemli? Kedi ve Köpekler İçin Rehber",
    excerpt:
      "Mikroçip, kaybolan dostunuzu sahibine kavuşturan pirinç tanesi büyüklüğünde bir kimliktir. Türkiye'de neden zorunlu, nasıl yapılır ve nelere dikkat etmeli — hepsi burada.",
    variant: "health",
    image: "/images/blog-mikrocip.jpg",
    videoDuration: "2:30",
    readTime: "5 dk okuma",
    date: "18 Mart 2026",
    dateISO: "2026-03-18",
    cta: {
      headline: "Veterinere mikroçip için gitmek mi gerek?",
      body: "Patili dostunuzu kliniğe biz götürelim, işlem bitince yine evinize getirelim. Stres sizde değil, bizde kalsın.",
      label: "Gidiş-dönüş ayarla",
      service: "round-trip",
    },
    body: [
      {
        type: "p",
        text: "Bir tasma kaybolabilir, künye düşebilir; ama mikroçip patili dostunuzla ömür boyu kalır. Pirinç tanesi büyüklüğündeki bu küçük cihaz tek bir numaradan ibaret değil: kaybolduğunda onu size geri getiren, sahiplik kaydını kanıtlayan dijital kimliğidir.",
      },
      { type: "h2", text: "Mikroçip tam olarak nedir?" },
      {
        type: "p",
        text: "Mikroçip, deri altına yerleştirilen, içinde benzersiz bir kimlik numarası taşıyan pasif bir cihazdır. Pil veya konum (GPS) içermez; yani hayvanı canlı olarak haritada izlemez. Bir okuyucu yaklaştırıldığında numarasını iletir, bu numara da ulusal veri tabanındaki sahip bilgilerine bağlanır.",
      },
      {
        type: "tip",
        title: "Mikroçip ≠ GPS takip",
        body: "Yaygın bir yanlış anlama: mikroçip hayvanın yerini canlı göstermez. Yalnızca bulunduğunda, bir veteriner ya da yetkili tarafından okutulunca kimliğini açığa çıkarır. Canlı konum için ayrı bir GPS tasma gerekir.",
      },
      { type: "h2", text: "Türkiye'de zorunlu mu?" },
      {
        type: "p",
        text: "Evet. 5199 sayılı Hayvanları Koruma Kanunu kapsamında, sahipli kedi, köpek ve gelinciklere mikroçip ile dijital kimliklendirme zorunludur. Kayıtlar Tarım ve Orman Bakanlığı'nın PETVET / HAYBİS sistemine işlenir. Belirlenen süre içinde kayıt yaptırmayan sahiplere idari para cezası uygulanır.",
      },
      {
        type: "p",
        text: "İşlemi yalnızca veteriner hekim (veya hekim gözetiminde yetkili sağlık personeli) yapabilir. Çip, enseye birkaç saniyede, aşı gibi tek bir iğneyle yerleştirilir; çoğu hayvan bunu fark etmez bile.",
      },
      { type: "h2", text: "Kayıt nasıl işler?" },
      {
        type: "list",
        items: [
          "Veteriner çipi yerleştirir ve okuyucuyla numarayı doğrular.",
          "Hayvanın ve sahibin bilgileri ulusal veri tabanına (PETVET) işlenir.",
          "Aşı, tedavi ve sahiplik geçmişi bu kimliğe bağlanır.",
          "Adres veya telefon değişirse kaydı güncellemeyi unutmayın — eski bilgi işe yaramaz.",
        ],
      },
      {
        type: "quote",
        text: "Mikroçip, kaybolduğunda dostunuzu adınızı bilen tek şey olabilir. Onu güncel tutmak, takmak kadar önemlidir.",
      },
      { type: "h2", text: "Patilioz'a kaydederken" },
      {
        type: "p",
        text: "Dostunuzu Patilioz profiline eklerken mikroçip numarasını da kaydedebilirsiniz — ama bu alan zorunlu değildir. Numaranı bilmiyorsan ya da henüz çip taktırmadıysan boş bırakabilir, dilediğinde sonradan ekleyebilirsin. Kayıtlı olması, yolculuk sırasında dostunun kimliğini ekibimizle hızlıca paylaşmamızı kolaylaştırır.",
      },
    ],
    faq: [
      {
        q: "Mikroçip hayvana zarar verir mi?",
        a: "Hayır. İşlem aşı kadar kısa sürer ve kalıcı bir rahatsızlık vermez. Çip vücutla uyumlu bir kapsül içindedir ve yıllarca yerinde kalır.",
      },
      {
        q: "Mikroçip ile dostumun yerini telefondan görebilir miyim?",
        a: "Hayır. Mikroçip GPS değildir; canlı konum vermez. Yalnızca bir okuyucuyla okutulduğunda kimlik numarasını iletir. Canlı takip için GPS'li bir tasma gerekir.",
      },
      {
        q: "Numarayı bilmiyorum, ne yapmalıyım?",
        a: "Veteriner hekiminiz okuyucuyla saniyeler içinde numarayı okuyabilir. Patilioz profilinde bu alanı şimdilik boş bırakabilir, öğrendiğinizde ekleyebilirsiniz.",
      },
    ],
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getFeaturedPost(): BlogPost {
  return posts.find((p) => p.featured) ?? posts[0]
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const current = getPostBySlug(slug)
  if (!current) return posts.slice(0, limit)
  // Önce aynı kategori, sonra diğerleri.
  const sameCat = posts.filter((p) => p.slug !== slug && p.category === current.category)
  const others = posts.filter((p) => p.slug !== slug && p.category !== current.category)
  return [...sameCat, ...others].slice(0, limit)
}

export const CATEGORIES: { label: "Tümü" | BlogCategory; value: "all" | BlogCategory }[] = [
  { label: "Tümü", value: "all" },
  { label: "Sağlık", value: "Sağlık" },
  { label: "Seyahat", value: "Seyahat" },
  { label: "Yaşam", value: "Yaşam" },
]
