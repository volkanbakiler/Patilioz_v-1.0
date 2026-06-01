import { Zap, MapPin, CalendarCheck, HeartHandshake, ShieldCheck, LocateFixed } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Net Bilgilendirme",
    desc: "Rezervasyondan başlayarak yolculuk boyunca her adımda sizi bilgilendiririz. Belirsizlik yoktur.",
  },
  {
    icon: MapPin,
    title: "Eksiksiz Adres",
    desc: "Bina, daire, kapı zili — tüm detaylar ile teslim süreci hatasız gerçekleşir.",
  },
  {
    icon: CalendarCheck,
    title: "Zaman Dilimleri",
    desc: "Sabitlenmiş zaman dilimlerini ön bilgilendirme ile sunarız. Plan değişikliklerinde onay alınır.",
  },
  {
    icon: HeartHandshake,
    title: "Refakatli Hizmet",
    desc: "Patili dostunuza eşlik etmek için uzman bir ekip üyesi yanında olur.",
  },
  {
    icon: ShieldCheck,
    title: "Sigorta Güvencesi",
    desc: "Her yolculuk, sigorta kapsamı ile gerçekleştirilir.",
  },
  {
    icon: LocateFixed,
    title: "Konum Takibi",
    desc: "Yolculuk boyunca düzenli bildirimler alırsınız. Patili dostunuz güvende olduğunu hissedersiniz.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 px-3 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto w-full max-w-[1120px] rounded-lg border border-foreground/10 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-[var(--coral)]">
              Hizmet içeriği
            </p>
            <h2
              className="mt-1 text-2xl font-extrabold text-foreground text-balance sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Yolculuk kontrol noktaları
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Her yolculukta patili dostunuzun sakinliği ve refahını ön planda tutarız.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-lg border border-foreground/10 bg-foreground/[0.025] p-4 transition-colors duration-300 hover:border-[var(--coral)]/35 hover:bg-white"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--coral)]/12 transition-colors group-hover:bg-[var(--coral)]/16">
                <Icon size={20} className="text-[var(--coral)]" />
              </div>
              <h3
                className="mb-2 text-sm font-extrabold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
