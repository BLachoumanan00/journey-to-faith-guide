import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, Download, LoaderCircle, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useRoles, useSessionUser } from "@/hooks/useSession";
import { getAdminContacts } from "@/lib/account.functions";
import { announcementRecipients, uniqueContactValues } from "@/lib/admin-contacts";
import { csvRows } from "@/lib/account-rules";
import { downloadText } from "@/lib/download";
import { useLang } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/_authenticated/admin")({ head: () => pageMeta("Administration — Bible en Main", "Répertoire privé des comptes et contacts ayant accepté les annonces de Bible en Main."), component: AdminPage });
function AdminPage() {
  const { lang } = useLang(); const fr = lang === "fr";
  const { user } = useSessionUser(); const roles = useRoles(user?.id);
  const read = useServerFn(getAdminContacts);
  const contacts = useQuery({ queryKey: ["admin-contacts", user?.id], queryFn: () => read(), enabled: roles.data?.includes("admin") === true, gcTime: 0, staleTime: 0, retry: false });
  const [search, setSearch] = useState(""); const [onlyRecipients, setOnlyRecipients] = useState(false); const [message, setMessage] = useState("");
  const all = contacts.data ?? [];
  const filtered = useMemo(() => {
    const source = onlyRecipients ? announcementRecipients(contacts.data ?? []) : contacts.data ?? [];
    const term = search.trim().toLocaleLowerCase(lang);
    return source.filter(c => [c.full_name, c.email, c.phone, c.city, c.country].some(value => value.toLocaleLowerCase(lang).includes(term)));
  }, [contacts.data, onlyRecipients, search, lang]);
  const recipients = announcementRecipients(filtered);
  const exportContacts = (broadcast: boolean) => {
    const rows = broadcast ? recipients : filtered;
    downloadText("\uFEFF" + csvRows(rows.map(c => ({ full_name: c.full_name, email: c.email, phone: c.phone, street: c.street, city: c.city, country: c.country, created_at: c.created_at, last_login: c.last_login, consent_announcements_at: c.consent_announcements_at }))), broadcast ? "bible-en-main-annonces.csv" : "bible-en-main-comptes.csv", "text/csv;charset=utf-8");
    setMessage(`${rows.length} ${fr ? "contacts exportés." : "contacts exported."}`);
  };
  const copy = async (field: "email" | "phone") => {
    try { await navigator.clipboard.writeText(uniqueContactValues(filtered, field).join(field === "email" ? "; " : "\n")); setMessage(fr ? "Contacts autorisés copiés." : "Opted-in contacts copied."); }
    catch { setMessage(fr ? "Copie indisponible. Téléchargez le CSV." : "Copy unavailable. Download the CSV instead."); }
  };
  return <AppShell>
    <div className="flex items-center gap-2 text-ribbon"><ShieldCheck className="size-4" /><span className="text-xs">{fr ? "Espace privé" : "Private workspace"}</span></div>
    <h1 className="mt-2 font-serif text-3xl">{fr ? "Administration" : "Administration"}</h1>
    {roles.isPending ? <LoaderCircle aria-label={fr ? "Chargement" : "Loading"} className="mt-8 animate-spin text-ribbon" /> : roles.isError || !roles.data?.includes("admin") ? <p role="alert" className="mt-8 text-sm text-destructive">{fr ? "Accès réservé aux administrateurs autorisés." : "Access restricted to authorized administrators."}</p> : <>
      <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-border py-5"><div><p className="flex items-center gap-2 font-serif text-3xl"><Users className="size-5 text-ribbon" />{all.length}</p><p className="mt-1 text-xs text-clay">{fr ? "Comptes" : "Accounts"}</p></div><div><p className="font-serif text-3xl">{announcementRecipients(all).length}</p><p className="mt-1 text-xs text-clay">{fr ? "Accords pour les annonces" : "Announcement opt-ins"}</p></div><Button variant="outline" size="icon" className="ml-auto" title={fr ? "Actualiser" : "Refresh"} aria-label={fr ? "Actualiser" : "Refresh"} disabled={contacts.isFetching} onClick={() => void contacts.refetch()}><RefreshCw className={contacts.isFetching ? "animate-spin" : ""} /></Button></div>
      <div className="mt-6 flex flex-wrap gap-2"><Button disabled={!filtered.length || contacts.isFetching} variant="outline" onClick={() => exportContacts(false)}><Download />{fr ? "CSV des comptes" : "Accounts CSV"}</Button><Button disabled={!recipients.length || contacts.isFetching} onClick={() => exportContacts(true)}><Download />{fr ? "CSV des annonces" : "Announcements CSV"}</Button><Button variant="outline" disabled={!uniqueContactValues(filtered, "email").length || contacts.isFetching} onClick={() => void copy("email")}><Copy />{fr ? "E-mails (CCI)" : "Emails (BCC)"}</Button><Button variant="outline" disabled={!recipients.length || contacts.isFetching} onClick={() => void copy("phone")}><Copy />{fr ? "Téléphones" : "Phones"}</Button></div>
      <p className="mt-4 text-xs leading-6 text-clay">{fr ? "Données confidentielles. Les listes d’annonces incluent uniquement les personnes ayant donné leur accord. Pour les e-mails groupés, utilisez la CCI." : "Confidential data. Announcement lists include only people who opted in. Use BCC for group emails."}</p>
      <div className="mt-6 space-y-3"><label className="relative block"><Search className="absolute left-3 top-3 size-4 text-clay" /><input aria-label={fr ? "Rechercher un contact" : "Search contacts"} type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={fr ? "Nom, e-mail, ville…" : "Name, email, city…"} className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-3 text-sm" /></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyRecipients} onChange={e => setOnlyRecipients(e.target.checked)} className="size-4 accent-primary" />{fr ? "Accord pour les annonces uniquement" : "Announcement opt-ins only"}</label></div>
      {contacts.isPending ? <p role="status" className="py-8 text-sm text-clay">{fr ? "Chargement des contacts…" : "Loading contacts…"}</p> : contacts.isError ? <p role="alert" className="py-8 text-sm text-destructive">{fr ? "Répertoire indisponible. Réessayez." : "Directory unavailable. Please retry."}</p> : !filtered.length ? <p role="status" className="py-8 text-sm text-clay">{fr ? "Aucun contact à afficher." : "No contacts to display."}</p> : <div className="mt-5 divide-y divide-border">{filtered.map(c => <article key={c.id} className="py-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="break-words font-serif text-xl">{c.full_name}</h2><span className={c.consent_announcements_at ? "text-xs text-ribbon" : "text-xs text-clay"}>{c.consent_announcements_at ? fr ? "Annonces acceptées" : "Announcements accepted" : fr ? "Pas d’accord pour les annonces" : "No announcement consent"}</span></div><div className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div className="space-y-1"><p className="break-all">{c.email || "—"}</p><p>{c.phone}</p></div><div className="text-clay"><p className="break-words">{c.street}</p><p className="break-words">{c.city} · {c.country}</p></div></div><p className="mt-3 text-xs text-clay">{fr ? "Inscription" : "Joined"} : {new Date(c.created_at).toLocaleDateString(lang)} · {fr ? "Dernière connexion" : "Last sign-in"} : {new Date(c.last_login).toLocaleDateString(lang)}</p></article>)}</div>}
    </>}
    {message && <p role="status" className="mt-4 text-sm text-ribbon">{message}</p>}
  </AppShell>;
}