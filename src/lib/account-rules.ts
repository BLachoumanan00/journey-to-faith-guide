import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";

export const POLICY_VERSION = "2026-10-19";
export const OTP_SECONDS = 300;
export const MAX_OTP_ATTEMPTS = 5;
export const RESEND_SECONDS = 60;
const safeText = (min: number, max: number) => z.string().trim().min(min).max(max).refine(v => !/[\u0000-\u001f<>]/.test(v), "Invalid characters");
export const detailsSchema = z.object({
  full_name: safeText(2, 80),
  street: safeText(1, 200), city: safeText(1, 100), postal_code: safeText(1, 30), country: safeText(2, 100),
  phone: z.string().max(16).regex(/^\+[1-9]\d{7,14}$/).refine(v => parsePhoneNumberFromString(v)?.isValid() === true, "Invalid international phone number"),
  privacy: z.literal(true), sensitive: z.literal(true),
});
export type AccountDetails = z.infer<typeof detailsSchema>;
export const addressSchema = detailsSchema.pick({ full_name: true, street: true, city: true, postal_code: true, country: true });
export function canAttempt(attempts: number, expiresAt: number, now: number) { return attempts < MAX_OTP_ATTEMPTS && now < expiresAt; }
export function csvCell(value: unknown) {
  const text = String(value ?? "");
  const safe = /^[\s]*[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function csvRows(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const fields = Object.keys(rows[0]);
  return [fields.map(csvCell).join(","), ...rows.map(r => fields.map(k => csvCell(r[k])).join(","))].join("\r\n");
}