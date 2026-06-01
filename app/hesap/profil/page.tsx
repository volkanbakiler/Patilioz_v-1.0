"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  ChevronRight,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-mock"
import { AvatarInitials } from "@/components/avatar-initials"
import { PhoneField, isPhoneValid } from "@/components/phone-field"
import { formatPhoneNumberIntl } from "react-phone-number-input"
import { RequireAuth } from "@/components/account/ui"

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export default function ProfilPage() {
  return (
    <RequireAuth>
      <ProfilScreen />
    </RequireAuth>
  )
}

type EditTarget = "name" | "email" | "phone" | null

function ProfilScreen() {
  const { user, update, signOut } = useAuth()
  const [editing, setEditing] = useState<EditTarget>(null)

  if (!user) return null

  if (editing) {
    return (
      <InlineEditor
        field={editing}
        user={user}
        onSave={(patch) => { update(patch); setEditing(null) }}
        onClose={() => setEditing(null)}
      />
    )
  }

  const displayPhone = user.phone ? formatPhoneNumberIntl(user.phone) : null
  const providerLabel =
    user.provider === "phone" ? "Telefon (SMS)"
    : user.provider === "google" ? "Google"
    : user.provider === "apple" ? "Apple"
    : user.provider === "facebook" ? "Facebook"
    : "Instagram"

  return (
    <div className="min-h-screen">
      {/* ── Sayfa başlığı ── */}
      <div className="flex items-center gap-3 border-b border-foreground/8 bg-white px-4 py-3.5">
        <Link
          href="/hesap"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-base font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Profilim
        </h1>
      </div>

      {/* ── Avatar bloğu ── */}
      <div className="flex flex-col items-center gap-3 bg-white px-4 pb-6 pt-6">
        <AvatarInitials name={user.name} size={80} className="rounded-[24px] shadow-md" />
        <div className="text-center">
          <p className="text-lg font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            {user.name}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">{providerLabel} ile giriş</p>
        </div>
      </div>

      {/* ── Kişisel bilgiler ── */}
      <SettingGroup label="Kişisel Bilgiler">
        <EditableRow
          icon={<User size={16} />}
          label="Ad Soyad"
          value={user.name === "Patilio Üyesi" ? undefined : user.name}
          placeholder="Adınızı girin"
          onEdit={() => setEditing("name")}
        />
        <EditableRow
          icon={<Phone size={16} />}
          label="Telefon"
          value={displayPhone ?? undefined}
          placeholder="Numara ekle"
          onEdit={() => setEditing("phone")}
        />
        <EditableRow
          icon={<Mail size={16} />}
          label="E-posta"
          value={user.email}
          placeholder="E-posta ekle"
          onEdit={() => setEditing("email")}
        />
        <StaticRow
          icon={<ShieldCheck size={16} />}
          label="Giriş yöntemi"
          value={providerLabel}
        />
      </SettingGroup>

      {/* ── Üyelik bilgisi ── */}
      <SettingGroup label="Üyelik">
        <LinkRow
          icon={<span className="text-base">🐾</span>}
          label="Patili dostlarım"
          href="/hesap/dostlarim"
          value={user.pets.length ? `${user.pets.length} kayıtlı` : "Henüz eklenmedi"}
        />
        <LinkRow
          icon={<span className="text-base">📍</span>}
          label="Adreslerim"
          href="/hesap/adreslerim"
          value={user.addresses.length ? `${user.addresses.length} kayıtlı` : "Henüz eklenmedi"}
        />
      </SettingGroup>

      {/* ── Tehlikeli alan ── */}
      <SettingGroup label="Hesap İşlemleri">
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors active:bg-foreground/[0.03]"
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
            <LogOut size={15} />
          </span>
          <span className="flex-1 text-sm font-semibold text-rose-500">Çıkış yap</span>
        </button>
        <div className="border-t border-foreground/[0.06]">
          <Link
            href="/hesap/gizlilik"
            className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors active:bg-foreground/[0.03]"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <Trash2 size={15} />
            </span>
            <span className="flex-1 text-sm font-semibold text-rose-500">Hesabı sil</span>
            <ChevronRight size={15} className="text-rose-300" />
          </Link>
        </div>
      </SettingGroup>

      <p className="pb-10 pt-2 text-center text-[11px] text-muted-foreground/50">
        Veriler yalnızca bu cihazda saklanır · Ön görünüm
      </p>
    </div>
  )
}

/* ─────────────────────── INLINE EDITOR ─────────────────────── */

type AuthUserPatch = { name?: string; email?: string; phone?: string }

function InlineEditor({
  field,
  user,
  onSave,
  onClose,
}: {
  field: EditTarget
  user: { name: string; email?: string; phone: string }
  onSave: (patch: AuthUserPatch) => void
  onClose: () => void
}) {
  const [name, setName] = useState(user.name === "Patilio Üyesi" ? "" : user.name)
  const [email, setEmail] = useState(user.email ?? "")
  const [phone, setPhone] = useState<string | undefined>(user.phone || undefined)
  const [touched, setTouched] = useState(false)

  const nameErr  = field === "name"  && name.trim() === ""
  const emailErr = field === "email" && email.trim() !== "" && !isValidEmail(email.trim())
  const phoneErr = field === "phone" && phone !== undefined && phone !== "" && !isPhoneValid(phone)
  const canSave  = !nameErr && !emailErr && !phoneErr

  const fieldMeta = {
    name:  { title: "Ad Soyad" },
    email: { title: "E-posta" },
    phone: { title: "Telefon" },
  }[field as string] ?? { title: "" }

  const handleSave = () => {
    setTouched(true)
    if (!canSave) return
    const patch: AuthUserPatch = {}
    if (field === "name")  patch.name  = name.trim()
    if (field === "email") patch.email = email.trim() || undefined
    if (field === "phone") patch.phone = phone || user.phone
    onSave(patch)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-foreground/8 bg-white px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/50 transition-colors hover:text-foreground"
        >
          <X size={20} />
        </button>
        <h2 className="text-sm font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          {fieldMeta.title}
        </h2>
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-all",
            canSave
              ? "bg-[var(--coral)] text-white"
              : "bg-foreground/10 text-muted-foreground",
          )}
        >
          <Check size={14} /> Kaydet
        </button>
      </div>

      {/* Form */}
      <div className="px-4 pt-6">
        <SettingGroup>
          {field === "name" && (
            <div className="px-4 py-3.5">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Ad Soyad
              </p>
              <input
                autoFocus
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız Soyadınız"
                className={cn(
                  "w-full bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/40",
                  touched && nameErr && "text-rose-500",
                )}
              />
              {touched && nameErr && (
                <p className="mt-2 text-xs text-rose-500">Ad boş bırakılamaz.</p>
              )}
            </div>
          )}

          {field === "phone" && (
            <div className="px-4 py-3.5">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Telefon Numarası
              </p>
              <PhoneField value={phone} onChange={setPhone} />
              {phoneErr && (
                <p className="mt-2 text-xs text-rose-500">Geçerli bir numara girin.</p>
              )}
            </div>
          )}

          {field === "email" && (
            <div className="px-4 py-3.5">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                E-posta Adresi
              </p>
              <input
                autoFocus
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@eposta.com"
                className={cn(
                  "w-full bg-transparent text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/40",
                  emailErr && "text-rose-500",
                )}
              />
              {emailErr && (
                <p className="mt-2 text-xs text-rose-500">Geçerli bir e-posta girin.</p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                E-posta isteğe bağlıdır. Rezervasyon onayları için kullanılır.
              </p>
            </div>
          )}
        </SettingGroup>
      </div>
    </div>
  )
}

/* ─────────────────────── UI PRİMİTİFLERİ ─────────────────────── */

function SettingGroup({
  label,
  children,
}: {
  label?: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-6 px-4">
      {label && (
        <p className="mb-1 px-0.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-white shadow-[0_1px_4px_rgba(20,31,53,0.05)]">
        {children}
      </div>
    </div>
  )
}

function EditableRow({
  icon,
  label,
  value,
  placeholder,
  onEdit,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  placeholder: string
  onEdit: () => void
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors active:bg-foreground/[0.03] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-foreground/[0.06]"
    >
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07] text-[var(--navy)]/70">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
          {label}
        </span>
        <span className={cn(
          "block truncate text-sm font-semibold",
          value ? "text-foreground" : "text-muted-foreground/40",
        )}>
          {value ?? placeholder}
        </span>
      </span>
      <span className="text-[11px] font-bold text-[var(--coral)]">Düzenle</span>
    </button>
  )
}

function StaticRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-foreground/[0.06]">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07] text-[var(--navy)]/70">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50">
          {label}
        </span>
        <span className="block truncate text-sm font-semibold text-foreground">{value}</span>
      </span>
    </div>
  )
}

function LinkRow({
  icon,
  label,
  href,
  value,
}: {
  icon: React.ReactNode
  label: string
  href: string
  value?: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-foreground/[0.03] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-foreground/[0.06]"
    >
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/[0.07]">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        {value && (
          <span className="block text-xs text-muted-foreground">{value}</span>
        )}
      </span>
      <ChevronRight size={15} className="flex-shrink-0 text-foreground/25" />
    </Link>
  )
}
