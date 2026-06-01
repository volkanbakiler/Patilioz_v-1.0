export default function HesapLoading() {
  return (
    <div className="mx-auto w-full max-w-xl animate-pulse px-4 py-6">
      {/* Kimlik şeridi */}
      <div className="mb-5 flex items-center gap-3 px-1">
        <div className="h-12 w-12 rounded-full bg-foreground/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded-lg bg-foreground/10" />
          <div className="h-3 w-24 rounded-lg bg-foreground/[0.07]" />
        </div>
      </div>
      {/* CTA butonu */}
      <div className="mb-6 h-12 w-full rounded-2xl bg-foreground/10" />
      {/* Section'lar */}
      {[1, 2, 3].map((s) => (
        <div key={s} className="mb-6">
          <div className="mb-2 ml-1 h-3 w-20 rounded-full bg-foreground/[0.07]" />
          <div className="overflow-hidden rounded-2xl bg-white">
            {[1, 2].map((r) => (
              <div
                key={r}
                className="flex items-center gap-3 border-b border-foreground/[0.05] px-4 py-3.5 last:border-0"
              >
                <div className="h-8 w-8 rounded-xl bg-foreground/[0.07]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-28 rounded-lg bg-foreground/10" />
                  <div className="h-3 w-20 rounded-lg bg-foreground/[0.07]" />
                </div>
                <div className="h-4 w-4 rounded bg-foreground/[0.07]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
