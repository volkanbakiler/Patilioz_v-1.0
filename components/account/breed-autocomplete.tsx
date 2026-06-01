"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { filterBreeds } from "@/lib/breeds"
import { inputCls } from "./ui"

/**
 * Cins autocomplete — TR+EN arama, serbest yazım kabul eder.
 * Değer = seçilen/yazılan metin (string). Listede olmayan cins de geçerlidir.
 */
export function BreedAutocomplete({
  type,
  value,
  onChange,
  placeholder = "Cins ara veya yaz (örn. Golden, Tekir)",
}: {
  type: "dog" | "cat" | "other"
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const options = useMemo(() => filterBreeds(type, value), [type, value])

  // Dışarı tıklayınca kapat.
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  // Liste değişince aktif index'i sınırla.
  useEffect(() => setActive(0), [value, type])

  const choose = (label: string) => {
    onChange(label)
    setOpen(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(options.length - 1, a + 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === "Enter") {
      if (options[active]) {
        e.preventDefault()
        choose(options[active].label)
      }
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          className={cn(inputCls, "pl-9")}
        />
      </div>

      {open && options.length > 0 && (
        <ul
          className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-foreground/10 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {options.map((opt, i) => {
            const selected = value.trim().toLocaleLowerCase("tr") === opt.label.toLocaleLowerCase("tr")
            return (
              <li key={opt.label} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(opt.label)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition-colors",
                    i === active ? "bg-[var(--coral)]/[0.08]" : "hover:bg-foreground/[0.03]",
                    opt.pinned ? "font-bold text-foreground" : "font-medium text-foreground/80",
                  )}
                >
                  <span>{opt.label}</span>
                  {selected && <Check size={15} className="text-[var(--coral)]" />}
                </button>
              </li>
            )
          })}
          {value.trim() &&
            !options.some(
              (o) => o.label.toLocaleLowerCase("tr") === value.trim().toLocaleLowerCase("tr"),
            ) && (
              <li className="border-t border-foreground/10">
                <button
                  type="button"
                  onClick={() => choose(value.trim())}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-foreground/[0.03]"
                >
                  “<span className="font-semibold text-foreground">{value.trim()}</span>” olarak ekle
                </button>
              </li>
            )}
        </ul>
      )}
    </div>
  )
}
