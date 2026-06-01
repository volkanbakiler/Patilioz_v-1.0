"use client"

import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { RequireAuth } from "@/components/account/ui"

export default function DilPage() {
  return (
    <RequireAuth>
      <DilScreen />
    </RequireAuth>
  )
}

function DilScreen() {
  return (
    <div className="min-h-screen">
      <PageHeader title="Dil" />

      <SettingGroup label="Arayüz Dili">
        {/* Aktif seçenek */}
        <div className="flex items-center gap-3.5 border-b border-foreground/[0.06] px-4 py-3.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07] text-lg">
            🇹🇷
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-foreground">Türkçe</span>
            <span className="block text-xs text-muted-foreground">Varsayılan dil</span>
          </span>
          <Check size={18} className="flex-shrink-0 text-[var(--coral)]" />
        </div>

        {/* Yakında */}
        <div className="flex items-center gap-3.5 px-4 py-3.5 opacity-50">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-foreground/[0.05] text-lg">
            🇬🇧
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-foreground">English</span>
            <span className="block text-xs text-muted-foreground">Yakında eklenecek</span>
          </span>
          <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            Yakında
          </span>
        </div>
      </SettingGroup>

      <SettingGroup label="Hakkında">
        <div className="px-4 py-4 text-sm leading-relaxed text-muted-foreground">
          Patilioz şu an yalnızca Türkçe olarak sunulmaktadır. Uluslararası dil desteği
          yakında eklenecektir.
        </div>
      </SettingGroup>

      <div className="pb-10" />
    </div>
  )
}

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
