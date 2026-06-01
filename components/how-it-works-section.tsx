import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Hizmet Seçimi",
    desc: "Tek yön, gidiş-dönüş veya refakatli seçeneklerinden birini belirleyin.",
  },
  {
    number: "02",
    title: "Bilgiler",
    desc: "Daire, kapı zili dahil tüm adres detaylarını ve patili dostunuzun bilgilerini paylaşın.",
  },
  {
    number: "03",
    title: "Zaman Dilimi",
    desc: "Size uygun zaman dilimini seçin. Rezervasyon onaylanır.",
  },
  {
    number: "04",
    title: "Yolculuk",
    desc: "Belirtilen saatte kapınıza geliriz. Patili dostunuzu teslim alırız ve yolculuk boyunca sizi bilgilendiririz.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 px-3 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto w-full max-w-[1120px] rounded-lg border border-foreground/10 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase text-[var(--coral)]">
              Süreç
            </p>
            <h2
              className="mt-1 text-2xl font-extrabold text-foreground text-balance sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nasıl çalışır?
            </h2>
          </div>
          <span className="hidden rounded-md border border-[var(--coral)]/20 bg-[var(--coral)]/10 px-2.5 py-1.5 text-xs font-bold text-[var(--coral)] sm:inline-flex">
            4 adım
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="absolute left-full top-8 z-10 hidden w-6 -translate-x-3 items-center justify-center lg:flex"
                  aria-hidden="true"
                >
                  <ArrowRight size={16} className="text-foreground/20" />
                </div>
              )}

              <div className="h-full space-y-3 rounded-lg border border-foreground/10 bg-foreground/[0.025] p-4">
                <span
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[var(--coral)]/10 px-2 font-mono text-xs font-bold text-[var(--coral)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.number}
                </span>
                <h3
                  className="text-sm font-extrabold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
