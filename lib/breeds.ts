/**
 * Cins veri seti — kedi & köpek.
 *
 * Her cins: görünen ad (TR) + arama anahtarları (TR + EN + yaygın yazımlar).
 * Böylece kullanıcı "golden" da yazsa "Altın" da yazsa aynı sonuca ulaşır.
 *
 * Terminoloji notu (araştırmaya dayalı):
 * - "Sokak köpeği" bir cins değil, yaşam durumudur. Doğru kavramlar:
 *   "Melez / Kırma" (iki ırk karışımı) ve sahipsiz/yerli köpeklerin morfolojik
 *   tanımı olarak "Anadolu (yerli)". İkisi de listenin başında sunulur.
 */

export type BreedOption = {
  /** Görünen ad (kaydedilen değer). */
  label: string
  /** Arama eşleşmesi için anahtarlar (küçük harf, TR+EN). */
  keywords: string[]
  /** Listenin başına sabitlenen genel seçenekler. */
  pinned?: boolean
}

const COMMON: BreedOption[] = [
  { label: "Melez / Kırma", keywords: ["melez", "kirma", "kırma", "mixed", "mix", "crossbreed"], pinned: true },
  { label: "Anadolu (yerli)", keywords: ["anadolu", "yerli", "sokak", "tekir doğal", "native", "street", "mongrel"], pinned: true },
  { label: "Bilmiyorum", keywords: ["bilmiyorum", "tanimsiz", "tanımsız", "belirsiz", "unknown"], pinned: true },
]

export const DOG_BREEDS: BreedOption[] = [
  ...COMMON,
  { label: "Golden Retriever", keywords: ["golden", "retriever", "altın", "altin"] },
  { label: "Labrador Retriever", keywords: ["labrador", "lab", "retriever"] },
  { label: "Alman Çoban Köpeği", keywords: ["alman coban", "çoban", "german shepherd", "kurt köpeği", "gsd"] },
  { label: "Kangal", keywords: ["kangal", "anatolian shepherd", "çoban"] },
  { label: "Akbaş", keywords: ["akbas", "akbaş"] },
  { label: "Pomeranian (Boo)", keywords: ["pomeranian", "boo", "pom"] },
  { label: "Pug", keywords: ["pug", "mops"] },
  { label: "Fransız Bulldog", keywords: ["fransiz bulldog", "french bulldog", "frenchie", "bulldog"] },
  { label: "İngiliz Bulldog", keywords: ["ingiliz bulldog", "english bulldog", "bulldog"] },
  { label: "Chihuahua", keywords: ["chihuahua", "çivava", "civava"] },
  { label: "Beagle", keywords: ["beagle", "bigıl"] },
  { label: "Rottweiler", keywords: ["rottweiler", "rotvayler"] },
  { label: "Doberman", keywords: ["doberman", "dobermann"] },
  { label: "Husky (Sibirya Kurdu)", keywords: ["husky", "sibirya", "siberian husky"] },
  { label: "Border Collie", keywords: ["border collie", "kolli"] },
  { label: "Cocker Spaniel", keywords: ["cocker", "spaniel"] },
  { label: "Maltese (Maltız)", keywords: ["maltese", "maltiz", "maltız", "malta"] },
  { label: "Yorkshire Terrier", keywords: ["yorkshire", "yorkie", "terrier"] },
  { label: "Shih Tzu", keywords: ["shih tzu", "shitzu"] },
  { label: "Poodle (Kaniş)", keywords: ["poodle", "kanis", "kaniş"] },
  { label: "Dalmaçyalı", keywords: ["dalmacyali", "dalmaçyalı", "dalmatian"] },
  { label: "Samoyed", keywords: ["samoyed", "samoy"] },
  { label: "Terrier", keywords: ["terrier", "teriyer"] },
]

export const CAT_BREEDS: BreedOption[] = [
  ...COMMON,
  { label: "Tekir (yerli)", keywords: ["tekir", "tabby", "yerli", "sokak"] },
  { label: "British Shorthair", keywords: ["british", "britanya", "shorthair", "ingiliz"] },
  { label: "Scottish Fold", keywords: ["scottish fold", "skoç", "skoc", "katlak kulak"] },
  { label: "Van Kedisi", keywords: ["van", "van kedisi"] },
  { label: "Ankara Kedisi", keywords: ["ankara", "angora", "ankara kedisi"] },
  { label: "İran Kedisi (Persian)", keywords: ["iran", "persian", "pers", "persa"] },
  { label: "Siyam (Siamese)", keywords: ["siyam", "siamese"] },
  { label: "Maine Coon", keywords: ["maine coon", "main kun", "mainecoon"] },
  { label: "Sphynx (Tüysüz)", keywords: ["sphynx", "sfenks", "tüysüz", "tuysuz"] },
  { label: "Ragdoll", keywords: ["ragdoll", "ragdol"] },
  { label: "Bengal", keywords: ["bengal", "bengala"] },
  { label: "Abyssinian", keywords: ["abyssinian", "habeş", "habes"] },
  { label: "Russian Blue", keywords: ["russian blue", "rus mavisi", "rus"] },
]

/** Türe göre cins listesini döndürür. "other" için cins listesi yoktur. */
export function breedsFor(type: "dog" | "cat" | "other"): BreedOption[] {
  if (type === "dog") return DOG_BREEDS
  if (type === "cat") return CAT_BREEDS
  return []
}

/** Sorguya göre filtrele; boş sorguda pinned + ilk birkaç popüleri döndür. */
export function filterBreeds(type: "dog" | "cat" | "other", query: string, limit = 8): BreedOption[] {
  const list = breedsFor(type)
  if (list.length === 0) return []
  const q = query.trim().toLocaleLowerCase("tr")
  if (!q) {
    const pinned = list.filter((b) => b.pinned)
    const rest = list.filter((b) => !b.pinned).slice(0, limit - pinned.length)
    return [...pinned, ...rest]
  }
  return list
    .filter(
      (b) =>
        b.label.toLocaleLowerCase("tr").includes(q) ||
        b.keywords.some((k) => k.includes(q) || q.includes(k)),
    )
    .slice(0, limit)
}
