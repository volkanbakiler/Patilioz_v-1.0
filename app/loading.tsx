export default function GlobalLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      {/* Başlık iskelet */}
      <div className="mb-10 space-y-3">
        <div className="h-3 w-16 rounded-full bg-foreground/10" />
        <div className="h-8 w-2/3 rounded-xl bg-foreground/10" />
        <div className="h-4 w-full rounded-lg bg-foreground/[0.07]" />
        <div className="h-4 w-4/5 rounded-lg bg-foreground/[0.07]" />
      </div>
      {/* Kart iskelet */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-foreground/[0.06]"
          />
        ))}
      </div>
    </div>
  )
}
