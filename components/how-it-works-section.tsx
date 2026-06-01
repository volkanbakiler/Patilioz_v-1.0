const STEPS = [
  {
    step: "1",
    title: "Rezervasyon oluşturun",
    body: "Patili dostunuzu, hizmet türünü, alış–varış adreslerini ve uygun zaman dilimini seçin.",
  },
  {
    step: "2",
    title: "Onay alın",
    body: "Müsaitlik kontrolü sonrası net fiyat ve sürücü bilgisiyle rezervasyonunuz onaylanır.",
  },
  {
    step: "3",
    title: "Güvenle yolculuk",
    body: "Belirlenen saatte adrestesiniz. Canlı takip ile yolculuğu izleyin, güvenli teslimle tamamlayın.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-[var(--card)] py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--coral)]">
            Nasıl çalışır
          </p>
          <h2
            className="mt-2 text-3xl font-extrabold text-foreground text-balance sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Üç adımda yola çıkın
          </h2>
        </div>

        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((item) => (
            <li key={item.step} className="relative rounded-2xl bg-white p-6">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--navy)] font-mono text-base font-bold text-white"
                aria-hidden="true"
              >
                {item.step}
              </span>
              <h3 className="mt-4 font-extrabold text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
