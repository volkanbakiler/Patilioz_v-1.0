import { Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const PHONE = "+908500000000"

/**
 * Sağ-altta sabit destek butonu. Şimdilik telefon araması;
 * ileride buraya bir chatbot tetikleyicisi de eklenebilir (aynı stack).
 */
export function SupportFab() {
  return (
    <div
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end gap-2",
        // Mobilde alt tab bar'ın (h-16) üstünde; masaüstünde alta yakın.
        "bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-5",
      )}
    >
      <a
        href={`tel:${PHONE}`}
        aria-label="Bizi arayın"
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--navy)] text-white shadow-[0_10px_30px_rgba(20,31,53,0.30)] transition-transform hover:scale-105 active:scale-95"
      >
        <Phone size={20} />
      </a>
    </div>
  )
}
