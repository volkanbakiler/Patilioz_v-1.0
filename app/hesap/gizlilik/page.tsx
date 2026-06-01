"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Lock, MapPin, PawPrint, Phone, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-mock"
import { RequireAuth } from "@/components/account/ui"

export default function GizlilikPage() {
  return (
    <RequireAuth>
      <GizlilikScreen />
    </RequireAuth>
  )
}

function GizlilikScreen() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!user) return null

  const exportData = () => {
    const blob = new Blob([JSON.stringify(user, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "patilioz-hesap-verilerim.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const wipe = () => {
    signOut()
    router.replace("/")
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Gizlilik ve Veriler" />

      {/* Veri kullanımı */}
      <SettingGroup label="Verileriniz Nasıl Kullanılır?">
        <DataRow
          icon={<Phone size={16} />}
          label="Telefon numaranız"
          desc="Yalnızca rezervasyon bildirimleri için kullanılır. Üçüncü taraflara iletilmez."
          divider
        />
        <DataRow
          icon={<MapPin size={16} />}
          label="Adresleriniz"
          desc="Hizmet noktalarını belirlemek için kullanılır, gizli tutulur."
          divider
        />
        <DataRow
          icon={<PawPrint size={16} />}
          label="Pet bilgileri"
          desc="Sağlayıcılarımıza daha iyi hizmet sunabilmek için iletilir."
        />
      </SettingGroup>

      {/* Veri yönetimi */}
      <SettingGroup label="Verilerinizi Yönetin">
        <button
          type="button"
          onClick={exportData}
          className="flex w-full items-center gap-3.5 border-b border-foreground/[0.06] px-4 py-3.5 text-left transition-colors active:bg-foreground/[0.03]"
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07] text-[var(--navy)]/70">
            <Download size={16} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-foreground">Verilerimi indir</span>
            <span className="block text-xs text-muted-foreground">Hesap bilgilerini JSON olarak kaydet</span>
          </span>
          <span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            JSON
          </span>
        </button>

        {/* Hesap silme */}
        {confirmDelete ? (
          <div className="px-4 py-4">
            <p className="mb-1 text-sm font-bold text-foreground">
              Hesabını silmek istediğine emin misin?
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              Bu cihazdaki tüm veriler kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-xl border border-foreground/10 bg-white py-2.5 text-sm font-bold text-foreground transition-colors active:bg-foreground/[0.03]"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={wipe}
                className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white transition-opacity active:opacity-90"
              >
                Evet, sil
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors active:bg-rose-50"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <Trash2 size={16} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-rose-500">Hesabımı sil</span>
              <span className="block text-xs text-muted-foreground">Tüm verileriniz silinir</span>
            </span>
          </button>
        )}
      </SettingGroup>

      <SettingGroup label="Güvenlik">
        <div className="flex items-start gap-3.5 px-4 py-4">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Lock size={15} />
          </span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Ön görünümde tüm veriler bu cihazda saklanmaktadır. Production sürümünde veriler
            şifreli sunucularda tutulacak ve KVKK kapsamında korunacaktır.
          </p>
        </div>
      </SettingGroup>

      <div className="pb-10" />
    </div>
  )
}

/* ── Primitifler ── */

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

function SettingGroup({ label, children }: { label: string; children: React.ReactNode }) {
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

function DataRow({
  icon,
  label,
  desc,
  divider,
}: {
  icon: React.ReactNode
  label: string
  desc: string
  divider?: boolean
}) {
  return (
    <div className={`flex items-start gap-3.5 px-4 py-3.5 ${divider ? "border-b border-foreground/[0.06]" : ""}`}>
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07] text-[var(--navy)]/70">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}
