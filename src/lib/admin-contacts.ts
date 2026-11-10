export type AdminContact = {
  id: string; full_name: string; email: string; phone: string;
  street: string; city: string; country: string; created_at: string;
  last_login: string; consent_announcements_at: string | null;
};

export function requireAdminPermission(result: { data: unknown; error: unknown }) {
  if (result.error || result.data !== true) throw new Error("Administrator access required");
}

export function announcementRecipients(contacts: AdminContact[]) {
  return contacts.filter(contact => Boolean(contact.consent_announcements_at));
}

export function uniqueContactValues(contacts: AdminContact[], field: "email" | "phone") {
  return [...new Set(announcementRecipients(contacts).map(contact => contact[field].trim()).filter(Boolean))];
}