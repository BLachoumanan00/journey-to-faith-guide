import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";
import { useEffect, useState } from "react";

export type DetailsDraft = { full_name: string; street: string; city: string; country: string; phone: string; privacy: boolean; sensitive: boolean };
export const emptyDetails: DetailsDraft = { full_name: "", street: "", city: "", country: "", phone: "", privacy: false, sensitive: false };
export function normalizedPhone(value: string, country: CountryCode) { return parsePhoneNumberFromString(value, country)?.number ?? value; }

export function PhoneAccountForm({ value, onChange, errors = {}, countryCode, setCountryCode, phone = true }: {
  value: DetailsDraft; onChange: (value: DetailsDraft) => void; errors?: Record<string, string>; countryCode: CountryCode; setCountryCode: (c: CountryCode) => void; phone?: boolean;
}) {
  const { lang } = useLang(); const fr = lang === "fr";
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const names = hydrated ? new Intl.DisplayNames([lang], { type: "region" }) : null;
  const countries = getCountries()
    .map(code => ({ code, label: names?.of(code) ?? code }))
    .sort((a, b) => a.label.localeCompare(b.label, lang));
  const field = (key: "full_name" | "street" | "city", label: string, autoComplete: string, maxLength: number) => (
    <div className="min-w-0 space-y-2" key={key}>
      <label htmlFor={`account-${key}`} className="text-sm font-medium">{label} <span className="text-ribbon" aria-hidden="true">*</span></label>
      <Input id={`account-${key}`} name={key} autoComplete={autoComplete} value={value[key]} onChange={e => onChange({ ...value, [key]: e.target.value })} maxLength={maxLength} required aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined} className="h-11 bg-card" />
      {errors[key] && <p id={`error-${key}`} className="text-xs text-destructive">{errors[key]}</p>}
    </div>
  );
  return <div className="space-y-5">
    {field("full_name", fr ? "Nom complet" : "Full name", "name", 80)}
    {field("street", fr ? "Rue et numéro" : "Street address", "street-address", 200)}
    {field("city", fr ? "Ville" : "City", "address-level2", 100)}
    <div className="space-y-2"><label htmlFor="account-country" className="text-sm font-medium">{fr ? "Pays" : "Country"} <span className="text-ribbon">*</span></label>
      <select id="account-country" value={value.country} onChange={e => onChange({ ...value, country: e.target.value })} required autoComplete="country-name" className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm">
        <option value="">{fr ? "Choisir un pays" : "Select country"}</option>
        {countries.map(c => <option key={c.code} value={c.label}>{c.label}</option>)}
      </select>{errors['country'] && <p className="text-xs text-destructive">{errors['country']}</p>}
    </div>
    {phone && <div className="space-y-2"><label htmlFor="account-phone" className="text-sm font-medium">{fr ? "Numéro de téléphone" : "Phone number"} <span className="text-ribbon">*</span></label>
      <div className="flex min-w-0 gap-2"><select aria-label={fr ? "Indicatif du pays" : "Country calling code"} value={countryCode} onChange={e => setCountryCode(e.target.value as CountryCode)} className="h-11 w-28 shrink-0 rounded-md border border-input bg-card px-2 text-sm">
        {countries.map(c => <option key={c.code} value={c.code}>{c.code} +{getCountryCallingCode(c.code)}</option>)}
      </select><Input id="account-phone" type="tel" autoComplete="tel-national" inputMode="tel" required maxLength={25} value={value.phone} onChange={e => onChange({ ...value, phone: e.target.value })} aria-invalid={Boolean(errors['phone'])} aria-describedby={errors['phone'] ? "error-phone" : undefined} className="h-11 min-w-0 bg-card" /></div>
      {errors['phone'] && <p id="error-phone" className="text-xs text-destructive">{errors['phone']}</p>}
    </div>}
  </div>;
}
