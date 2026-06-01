"use client"

import Link from "next/link"
import { ArrowLeft, Bell, Mail, Megaphone } from "lucide-react"
import { useAuth, type NotificationPrefs } from "@/lib/auth-mock"
import { RequireAuth } from "@/components/account/ui"

export default function BildirimlerPage() {
  return (
    <RequireAuth>
      <BildirimlerScreen />
    </RequireAuth>
  )
}

function BildirimlerScreen() {
  const { user, update } = useAuth()
  if (!user) return null

  const prefs = user.prefs
  const toggle = (key: keyof NotificationPrefs) =>
    update({ prefs: { ...prefs, [key]: !prefs[key] } })

  const items: {
    key: keyof NotificationPrefs
    icon: React.ReactNode
    label: string
    desc: string
  }[] = [
    {
      key: "sms",
      icon: <Bell size={17} />,
      label: "SMS bildirimleri",
      desc: "Rezervasyon onayı ve güncellemeleri",
    },
    {
      key: "email",
      icon: <Mail size={17} />,
      label: "E-posta bildirimleri",
      desc: "Makbuzlar ve hesap özetleri",
    },
    {
      key: "campaigns",
      icon: <Megaphone size={17} />,
      label: "Promosyon ve kampanyalar",
      desc: "İndirimler ve yeni hizmet duyuruları",
    },
  ]

  return (
    <div className="min-h-screen">
      <PageHeader title="Bildirimler" />

      <SettingGroup label="İletişim Tercihleri">
        {items.map((item, i) => (
          <ToggleRow
            key={item.key}
            icon={item.icon}
            label={item.label}
            desc={item.desc}
            checked={prefs[item.key]}
            onChange={() => toggle(item.key)}
            divider={i < items.length - 1}
          />
        ))}
      </SettingGroup>

      <SettingGroup label="Bilgi">
        <div className="space-y-3 px-4 py-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">SMS</span> bildirimleri yalnızca Türkiye
            (+90) numaraları için geçerlidir.
          </p>
          <p>
            <span className="font-semibold text-foreground">E-posta</span> bildirimleri profilinizdeki
            e-posta adresine gönderilir.
          </p>
          <p>
            Kampanya bildirimlerini istediğiniz zaman kapatabilirsiniz.
          </p>
        </div>
      </SettingGroup>

      <div className="pb-10" />
    </div>
  )
}

/* ── Paylaşılan primitifler ── */

function PageHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-foreground/8 bg-white px-4 py-3.5">
      <Link
        href="/hesap"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={20} />
      </Link>
      <h1
        className="text-base font-extrabold text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>
    </div>
  )
}

function SettingGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-6 px-4">
      <p className="mb-1 px-0.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        {children}
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  desc,
  checked,
  onChange,
  divider,
}: {
  icon: React.ReactNode
  label: string
  desc: string
  checked: boolean
  onChange: () => void
  divider?: boolean
}) {
  return (
    <div className={divider ? "border-b border-foreground/[0.06]" : undefined}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors active:bg-foreground/[0.03]"
      >
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07] text-[var(--navy)]/70">
          {icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold text-foreground">{label}</span>
          <span className="block text-xs text-muted-foreground">{desc}</span>
        </span>
        {/* Toggle track */}
        <span
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
            checked ? "bg-[var(--coral)]" : "bg-foreground/20"
          }`}
        >
          <span
            className={`pointer-events-none ml-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-200 ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </span>
      </button>
    </div>
  )
}
