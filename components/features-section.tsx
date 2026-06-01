import { ShieldCheck, MapPinned, HeartHandshake, Clock4 } from "lucide-react"

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Sigortalı taşıma",
    body: "Her yolculuk sigorta kapsamındadır. Patili dostunuz yola çıktığı andan teslime kadar güvende.",
  },
  {
    icon: MapPinned,
    title: "Canlı takip",
    body: "Yolculuk boyunca konum paylaşımı. Bir gecikme olduğunda anlık bilgilendirme alırsınız.",
  },
  {
    icon: HeartHandshake,
    title: "Hayvan dostu ekip",
    body: "Araçlar havalandırma, sabitleme noktası ve hayvan dostu ekipmanla donatılmıştır.",
  },
  {
    icon: Clock4,
    title: "Esnek planlama",
    body: "Tek yön, gidiş–dönüş veya refakatli. Randevu saatinizden 2 saat öncesine kadar ücretsiz iptal.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
            Neden Patilioz
          </p>
          <h2
            className="mt-2 text-3xl font-extrabold text-foreground text-balance sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Güven veren bir yolculuk deneyimi
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-white p-6"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--coral)]/10 text-[var(--coral)]">
                <feature.icon size={20} />
              </span>
              <h3 className="font-extrabold text-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
