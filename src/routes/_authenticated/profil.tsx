import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { AccountControls } from "@/components/AccountControls";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useProfile, useRoles, useSessionUser } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/_authenticated/profil")({
  component: ProfilePage,
  head: () => pageMeta("Mon compte — Bible en Main", "Vos coordonnées, consentements, préférences et droits sur vos données Bible en Main."),
});
function ProfilePage() {
  const { lang, t, setLang } = useLang(); const fr = lang === "fr";
  const { user } = useSessionUser(); const profile = useProfile(user?.id); const roles = useRoles(user?.id); const qc = useQueryClient();
  const update = useMutation({ mutationFn: async (patch: { reminders_enabled?: boolean; preferred_lang?: string }) => {
    if (!user) throw new Error("Sign in required");
    const { error } = await supabase.from("profiles").update(patch).eq("id", user.id); if (error) throw error;
  }, onSuccess: () => { toast.success(fr ? "Enregistré" : "Saved"); void qc.invalidateQueries({ queryKey: ["profile", user?.id] }); }, onError: () => toast.error(fr ? "Impossible d'enregistrer." : "Could not save.") });
  return <AppShell><span className="eyebrow">{fr ? "Mon compte" : "My account"}</span><h1 className="mt-2 font-serif text-3xl">{fr ? "Vos données, vos choix" : "Your data, your choices"}</h1>
    <div className="mt-8 space-y-8"><AccountControls />
      <section className="border-t border-border pt-6"><h2 className="font-serif text-xl">{fr ? "Langue" : "Language"}</h2><div className="mt-3 flex gap-2">{(["fr", "en"] as const).map(code => <Button key={code} variant={lang === code ? "default" : "outline"} disabled={update.isPending} onClick={() => { setLang(code); update.mutate({ preferred_lang: code }); }}>{code === "fr" ? "Français" : "English"}</Button>)}</div></section>
      <section className="flex items-center justify-between gap-4 border-t border-border pt-6"><label htmlFor="reminders" className="text-sm">{t("reminders")}</label><Switch id="reminders" checked={profile.data?.reminders_enabled ?? false} disabled={update.isPending} onCheckedChange={checked => update.mutate({ reminders_enabled: checked })} /></section>
      <section className="border-t border-border pt-6"><h2 className="font-serif text-xl">{t("inviteCode")}</h2><p className="mt-2 font-serif text-2xl">{profile.data?.invite_code ?? "······"}</p></section>
      {roles.data?.includes("admin") && <Button asChild variant="outline"><Link to="/admin">{fr ? "Administration" : "Administration"}</Link></Button>}
    </div></AppShell>;
}
