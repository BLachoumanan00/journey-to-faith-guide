import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { useProfile, useSessionUser } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/profil")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Mon compte — Bible en Main" },
      {
        name: "description",
        content:
          "Votre nom, votre langue, vos rappels hebdomadaires et votre code d'invitation pour Bible en Main.",
      },
      { property: "og:title", content: "Mon compte — Bible en Main" },
      {
        property: "og:description",
        content: "Gérez votre nom, votre langue et vos rappels d'étude biblique.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function ProfilePage() {
  const { lang, t, setLang } = useLang();
  const { user } = useSessionUser();
  const profile = useProfile(user?.id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  useEffect(() => {
    if (profile.data?.display_name) setName(profile.data.display_name);
  }, [profile.data?.display_name]);

  const update = useMutation({
    mutationFn: async (patch: { display_name?: string; reminders_enabled?: boolean; preferred_lang?: string }) => {
      const { error } = await supabase.from("profiles").update(patch).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(lang === "fr" ? "Enregistré" : "Saved");
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
    onError: () => toast.error(lang === "fr" ? "Impossible d'enregistrer." : "Could not save."),
  });

  return (
    <AppShell>
      <span className="eyebrow">{lang === "fr" ? "Mon compte" : "My account"}</span>
      <h1 className="mt-2 font-serif text-3xl font-medium leading-tight">
        {lang === "fr" ? "Vous êtes chez vous ici" : "You are at home here"}
      </h1>

      <div className="mt-8 space-y-8">
        <div>
          <label htmlFor="display-name" className="eyebrow">
            {lang === "fr" ? "Votre prénom" : "Your first name"}
          </label>
          <input
            id="display-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              const next = name.trim();
              if (next && next !== profile.data?.display_name) update.mutate({ display_name: next });
            }}
            className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div>
          <span className="eyebrow">{lang === "fr" ? "Langue" : "Language"}</span>
          <div className="mt-2 flex gap-2">
            {(["fr", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLang(code);
                  update.mutate({ preferred_lang: code });
                }}
                className={
                  lang === code
                    ? "rounded-full bg-ink px-4 py-1.5 text-xs uppercase tracking-widest text-paper"
                    : "rounded-full border border-border px-4 py-1.5 text-xs uppercase tracking-widest text-clay"
                }
              >
                {code === "fr" ? "Français" : "English"}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <span className="eyebrow">{t("reminders")}</span>
          <button
            type="button"
            onClick={() => update.mutate({ reminders_enabled: !profile.data?.reminders_enabled })}
            className="mt-2 flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-3 text-left"
          >
            <span className="text-sm leading-relaxed text-clay">{t("remindersHelp")}</span>
            <span
              className={
                profile.data?.reminders_enabled
                  ? "ml-3 rounded-full bg-ribbon/15 px-3 py-1 text-[10px] uppercase tracking-widest text-ribbon"
                  : "ml-3 rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-widest text-clay"
              }
            >
              {profile.data?.reminders_enabled
                ? lang === "fr"
                  ? "Activé"
                  : "On"
                : lang === "fr"
                  ? "Désactivé"
                  : "Off"}
            </span>
          </button>
        </div>

        <div className="border-t border-border pt-6">
          <span className="eyebrow">{t("inviteCode")}</span>
          <p className="mt-2 font-serif text-2xl tracking-[0.3em]">{profile.data?.invite_code ?? "······"}</p>
          <p className="mt-2 text-xs leading-relaxed text-clay">
            {lang === "fr"
              ? "Partagez ce code avec la personne qui vous accompagne."
              : "Share this code with the person walking alongside you."}
          </p>
        </div>

      </div>
    </AppShell>
  );
}
