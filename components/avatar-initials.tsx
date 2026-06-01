import { getInitials } from "@/lib/auth-mock"
import { cn } from "@/lib/utils"

/**
 * Evrensel "initials" avatar — foto yoksa ismin baş harf(ler)ini gösterir.
 * Foto yükleme (Firebase Storage) ileride eklenecek; o zaman `src` prop'u
 * verilince <img> render edilir.
 */
export function AvatarInitials({
  name,
  src,
  size = 40,
  className,
}: {
  name?: string
  src?: string
  size?: number
  className?: string
}) {
  const initials = getInitials(name)

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--navy)] font-extrabold leading-none text-white",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  )
}
