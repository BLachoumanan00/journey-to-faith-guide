import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { CountryCode } from "libphonenumber-js/max";
import { Download, LoaderCircle, LogOut, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneAccountForm, emptyDetails, normalizedPhone } from "./PhoneAccountForm";
import { getAccount, updateAccount, exportOwnData, withdrawSensitiveConsent, deleteOwnAccount } from "@/lib/account.functions";
import { profileSchema } from "@/lib/account-rules";
import { downloadText } from "@/lib/download";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export function AccountControls() {
  const { lang } = useLang(); const fr = lang === "fr"; const navigate = useNavigate(); const qc = useQueryClient();
  const read = useServerFn(getAccount); const save = useServerFn(updateAccount); const exportData = useServerFn(exportOwnData); const withdraw = useServerFn(withdrawSensitiveConsent); const erase = useServerFn(deleteOwnAccount);
  const account = useQuery({ queryKey: ["private-account"], queryFn: () => read(), gcTime: 0 });
  const [draft, setDraft] = useState(emptyDetails); const [country, setCountry] = useState<CountryCode>("MU");
  const [errors, setErrors] = useState<Record<string, string>>({}); const [pending, setPending] = useState(false); const [message, setMessage] = useState(""); const [confirmation, setConfirmation] = useState<"withdraw" | "delete" | null>(null);
  useEffect(() => { if (account.data) setDraft({ ...emptyDetails, ...account.data }); }, [account.data]);
  const run = async (action: () => Promise<void>) => { setPending(true); setMessage(""); try { await action(); } catch { setMessage(fr ? "Impossible de terminer. Réessayez plus tard." : "Could not finish. Please try again later."); } finally { setPending(false); } };
  const signOut = async () => { const result = await supabase.auth.signOut(); if (result.error) throw result.error; qc.clear(); await navigate({ to: "/auth", replace: true }); };
  if (account.isPending) return <p role="status" className="py-6 text-clay">{fr ? "Chargement de vos données…" : "Loading your data…"}</p>;
  if (account.isError || !account.data) return <div className="py-6"><p className="text-sm text-destructive">{fr ? "Vos données ne sont pas disponibles." : "Your data is unavailable."}</p><Button variant="outline" onClick={() => void account.refetch()} className="mt-3">{fr ? "Réessayer" : "Retry"}</Button></div>;
  return <div className="space-y-6">
    <form noValidate className="space-y-5" onSubmit={e => { e.preventDefault(); const parsed = profileSchema.safeParse({ ...draft, phone: normalizedPhone(draft.phone, country) }); if (!parsed.success) { const next: Record<string, string> = {}; parsed.error.issues.forEach(i => { next[String(i.path[0])] = fr ? "Champ obligatoire ou invalide." : "Required or invalid field."; }); setErrors(next); return; } setErrors({}); void run(async () => { await save({ data: parsed.data }); await qc.invalidateQueries(); setMessage(fr ? "Coordonnées enregistrées." : "Details saved."); }); }}>
      <PhoneAccountForm value={draft} onChange={setDraft} errors={errors} countryCode={country} setCountryCode={setCountry} />
      <Button type="submit" className="w-full" disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : <Save />}{fr ? "Enregistrer" : "Save"}</Button>
    </form>
    <section className="space-y-3 border-t border-border pt-5"><h2 className="font-serif text-xl">{fr ? "Mes consentements" : "My consents"}</h2><p className="text-xs leading-6 text-clay">{fr ? "Compte créé" : "Account created"} : {new Date(account.data.created_at).toLocaleDateString(lang)}<br />{fr ? "Dernière connexion" : "Last sign-in"} : {new Date(account.data.last_login).toLocaleDateString(lang)}<br />{fr ? "Confidentialité" : "Privacy"} : {new Date(account.data.consent_privacy_at).toLocaleDateString(lang)}<br />{fr ? "Réponses et mentor" : "Responses and mentor"} : {account.data.consent_sensitive_at ? new Date(account.data.consent_sensitive_at).toLocaleDateString(lang) : fr ? "Consentement retiré" : "Consent withdrawn"}<br />{fr ? "Politique" : "Policy"} : {account.data.policy_version}</p><Link to={fr ? "/confidentialite" : "/privacy"} target="_blank" rel="noopener noreferrer" className="text-sm text-ribbon underline">{fr ? "Lire la politique" : "Read policy"}</Link>{account.data.consent_sensitive_at && <Button variant="outline" className="w-full" disabled={pending} onClick={() => setConfirmation("withdraw")}>{fr ? "Retirer le consentement aux réponses et au mentor" : "Withdraw responses and mentor consent"}</Button>}</section>
    <section className="space-y-3 border-t border-border pt-5"><Button variant="outline" className="w-full" disabled={pending} onClick={() => void run(async () => { const data = await exportData(); downloadText(JSON.stringify(data, null, 2), "bible-en-main-mes-donnees.json", "application/json"); })}><Download />{fr ? "Exporter mes données" : "Export my data"}</Button><Button variant="outline" className="w-full" disabled={pending} onClick={() => void run(signOut)}><LogOut />{fr ? "Me déconnecter" : "Sign out"}</Button><Button variant="destructive" className="w-full" disabled={pending} onClick={() => setConfirmation("delete")}><Trash2 />{fr ? "Supprimer mon compte" : "Delete my account"}</Button></section>
    {confirmation && <div role="alertdialog" aria-label={fr ? "Confirmer la suppression" : "Confirm deletion"} className="space-y-4 border-y border-destructive py-5"><p className="text-sm leading-relaxed">{confirmation === "delete" ? fr ? "Votre compte, vos coordonnées, réponses, notes et échanges seront définitivement supprimés." : "Your account, contact details, answers, notes and exchanges will be permanently deleted." : fr ? "Vos réponses, notes, demandes de baptême et échanges seront effacés et vos liens avec les mentors supprimés. Vous pourrez encore lire les leçons." : "Your answers, notes, baptism requests and exchanges will be erased and mentor links removed. You can still read lessons."}</p><div className="flex gap-3"><Button variant="outline" disabled={pending} onClick={() => setConfirmation(null)}>{fr ? "Annuler" : "Cancel"}</Button><Button variant="destructive" disabled={pending} onClick={() => void run(async () => { if (confirmation === "delete") { await erase({ data: { confirm: true } }); await signOut(); } else { await withdraw(); await qc.cancelQueries(); qc.clear(); await account.refetch(); setConfirmation(null); } })}>{fr ? "Confirmer" : "Confirm"}</Button></div></div>}
    {message && <p role="status" className="text-sm text-clay">{message}</p>}
  </div>;
}