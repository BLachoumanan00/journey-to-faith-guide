import { describe, expect, it } from "vitest";
import { detailsSchema, canAttempt, OTP_SECONDS, RESEND_SECONDS, MAX_OTP_ATTEMPTS, csvCell } from "./account-rules";
import { encryptValue, decryptValue, fingerprint } from "./account-crypto";
const valid = { full_name: "Marie Dupont", street: "10 Rue des Fleurs", city: "Paris", postal_code: "75001", country: "France", phone: "+33612345678", privacy: true, sensitive: true };
describe("Required account rules", () => {
  it("requires a full name of 2–80 characters", () => { expect(detailsSchema.safeParse({ ...valid, full_name: "A" }).success).toBe(false); expect(detailsSchema.safeParse({ ...valid, full_name: "A".repeat(80) }).success).toBe(true); expect(detailsSchema.safeParse({ ...valid, full_name: "A".repeat(81) }).success).toBe(false); });
  it("requires every address field", () => { for (const field of ["street", "city", "postal_code", "country"]) expect(detailsSchema.safeParse({ ...valid, [field]: "" }).success).toBe(false); });
  it("requires valid E.164 phone numbers", () => { expect(detailsSchema.safeParse(valid).success).toBe(true); expect(detailsSchema.safeParse({ ...valid, phone: "0612345678" }).success).toBe(false); });
  it("requires separate privacy consent", () => { expect(detailsSchema.safeParse({ ...valid, privacy: false }).success).toBe(false); });
  it("requires separate sensitive-data consent", () => { expect(detailsSchema.safeParse({ ...valid, sensitive: false }).success).toBe(false); });
  it("expires codes after exactly five minutes", () => { expect(OTP_SECONDS).toBe(300); expect(canAttempt(0, 300000, 299999)).toBe(true); expect(canAttempt(0, 300000, 300000)).toBe(false); });
  it("allows no more than five verification attempts", () => { expect(MAX_OTP_ATTEMPTS).toBe(5); expect(canAttempt(4, 10000, 0)).toBe(true); expect(canAttempt(5, 10000, 0)).toBe(false); });
  it("sets a resend cooldown", () => { expect(RESEND_SECONDS).toBe(60); });
  it("encrypts phone and address with authenticated randomized encryption", async () => { const key = "test-only-secret"; const a = await encryptValue(valid.phone, key); const b = await encryptValue(valid.phone, key); expect(a).not.toContain(valid.phone); expect(a).not.toBe(b); expect(await decryptValue(a, key)).toBe(valid.phone); const address = await encryptValue({ street: valid.street }, key); expect(address).not.toContain(valid.street); expect(await decryptValue(address, key)).toEqual({ street: valid.street }); await expect(decryptValue(a, "wrong-key")).rejects.toThrow(); });
  it("uses keyed fingerprints rather than plaintext phone lookups", async () => { expect(await fingerprint(valid.phone, "key1")).not.toBe(await fingerprint(valid.phone, "key2")); });
  it("neutralizes spreadsheet formulas in user exports", () => { expect(csvCell("=1+1")).toBe('"\'=1+1"'); expect(csvCell('a"b')).toBe('"a""b"'); });
});