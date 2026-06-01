"use client"

import PhoneInput from "react-phone-number-input"
import { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import "./phone-field.css"

/**
 * Uluslararası telefon girişi (E.164 çıktı: "+905xx...", "+1...").
 * react-phone-number-input + libphonenumber-js: ülke seçici, bayrak, otomatik
 * format ve ülkeye özel doğrulama hazır gelir. Firebase Phone Auth E.164 bekler.
 */
export function PhoneField({
  value,
  onChange,
  autoFocus,
  id = "phone",
}: {
  value: string | undefined
  onChange: (v: string | undefined) => void
  autoFocus?: boolean
  id?: string
}) {
  return (
    <PhoneInput
      id={id}
      international
      defaultCountry="TR"
      countryCallingCodeEditable={false}
      value={value}
      onChange={onChange}
      autoFocus={autoFocus}
      placeholder="Telefon numarası"
      numberInputProps={{
        className: "pf-number",
        autoComplete: "tel",
        name: "tel",
      }}
      className="pf-root"
    />
  )
}

/** E.164 değerin geçerli bir telefon numarası olup olmadığını döndürür. */
export function isPhoneValid(value: string | undefined): boolean {
  if (!value) return false
  try {
    return isValidPhoneNumber(value)
  } catch {
    return false
  }
}
