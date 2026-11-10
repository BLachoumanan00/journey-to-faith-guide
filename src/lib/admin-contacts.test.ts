import { describe, expect, it } from "vitest";
import { requireAdminPermission, announcementRecipients, uniqueContactValues, type AdminContact } from "./admin-contacts";
const contact = { id: "1", full_name: "Marie", email: "marie@example.com", phone: "+33612345678", street: "Rue", city: "Paris", country: "France", created_at: "2026-11-10", last_login: "2026-11-10", consent_announcements_at: null } satisfies AdminContact;
describe("Admin contact access", () => {
  it("allows only a verified admin role", () => {
    expect(() => requireAdminPermission({ data: true, error: null })).not.toThrow();
    for (const data of [false, null, "admin"]) expect(() => requireAdminPermission({ data, error: null })).toThrow();
    expect(() => requireAdminPermission({ data: true, error: new Error("Denied") })).toThrow();
  });
  it("excludes accounts without separate announcement consent", () => {
    const optedIn = { ...contact, id: "2", consent_announcements_at: "2026-11-10T04:03:00Z" };
    expect(announcementRecipients([contact, optedIn])).toEqual([optedIn]);
    expect(uniqueContactValues([contact], "email")).toEqual([]);
    expect(uniqueContactValues([contact, optedIn, optedIn], "email")).toEqual(["marie@example.com"]);
    expect(uniqueContactValues([contact, optedIn], "phone")).toEqual(["+33612345678"]);
  });
});