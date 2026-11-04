import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useRoles, useSessionUser } from "@/hooks/useSession";
import { adminUsersCsv } from "@/lib/account.functions";
import { downloadText } from "@/lib/download";
import { useLang } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";
export const Route = createFileRoute("/_authenticated/admin")({ head: () => pageMeta("Export des comptes — Bible en Main", "Export privé des comptes réservé aux administrateurs autorisés de Bible en Main."), component: AdminPage });
function AdminPage() {
  const { lang } = useLang(); const fr = lang === "fr"; const { user } = useSessionUser(); const roles = useRoles(user?.id);
  const exportCsv = useServerFn(adminUsersCsv); const [pending, setPending] = useState(false); const [message, setMessage] = useState("");
  return <AppShell><h1 className="font-serif text-3xl">{fr ? "Export des comptes" : "Account export"}</h1>
    <div className="mt-8 border-t border-border pt-6">{roles.isPending ? <LoaderCircle className="animate-spin text-ribbon" /> : !roles.data?.includes("admin") ? <p role="alert" className="text-sm text-destructive">{fr ? "Accès réservé aux administrateurs autorisés." : "Access restricted to authorized administrators."}</p> : <><p className="mb-5 text-sm leading-6 text-clay">{fr ? "Cet export contient des coordonnées personnelles. Conservez-le de manière sécurisée et ne le partagez pas sans autorisation." : "This export contains personal contact details. Keep it secure and do not share it without authorization."}</p><Button disabled={pending} onClick={async () => { setPending(true); setMessage(""); try { const result = await exportCsv(); downloadText("\uFEFF" + result.csv, "bible-en-main-comptes.csv", "text/csv;charset=utf-8"); setMessage(`${result.count} ${fr ? "comptes exportés." : "accounts exported."}`); } catch { setMessage(fr ? "Export indisponible ou accès refusé." : "Export unavailable or access denied."); } finally { setPending(false); } }}>{pending ? <LoaderCircle className="animate-spin" /> : <Download />}{fr ? "Télécharger le CSV" : "Download CSV"}</Button></>}{message && <p role="status" className="mt-4 text-sm text-clay">{message}</p>}</div>
  </AppShell>;
}