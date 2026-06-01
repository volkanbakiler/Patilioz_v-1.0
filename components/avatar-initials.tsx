import { getInitials } from "@/lib/auth-mock"
import { cn } from "@/lib/utils"

/**
 * İsimden üretilen baş harf avatarı.
 * Foto yoksa navy zeminde initials gösterir.
 */
export function AvatarInitials({
  name,
  size = 48,
  className,
}: {
  name?: string
  size?: number
  className?: string
}) {
  const initials = getInitials(name)
  return (
    <span
      className={cn(
        "inline-flex flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--navy)] font-extrabold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        fontFamily: "var(--font-display)",
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
