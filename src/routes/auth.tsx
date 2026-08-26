import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Se connecter — Bible en Main" },
      {
        name: "description",
        content: "Connectez-vous pour reprendre votre étude biblique là où vous l'avez laissée.",
      },
      { property: "og:title", content: "Se connecter — Bible en Main" },
      {
        property: "og:description",
        content: "Connectez-vous pour reprendre votre étude biblique là où vous l'avez laissée.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/parcours", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || "Ami(e)" },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/parcours", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("La connexion Google n'a pas abouti.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/parcours", replace: true });
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto flex max-w-md flex-col px-6 pt-12 pb-16">
        <div className="flex items-start justify-between">
          <div>
            <span className="eyebrow">{t("eyebrow")}</span>
            <h1 className="mt-1 font-serif text-4xl font-medium leading-tight">{t("appName")}</h1>
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="rounded-sm px-2 py-1 text-xs font-medium ring-1 ring-border"
          >
            {lang === "fr" ? "FR / EN" : "EN / FR"}
          </button>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-clay">
          {lang === "fr"
            ? "Vingt-quatre leçons, à votre rythme. Aucune obligation, aucun jugement — juste la Bible ouverte devant vous."
            : "Twenty-four lessons, at your own pace. No obligation, no judgement — just the Bible open in front of you."}
        </p>

        {sent ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-5">
            <h2 className="font-serif text-xl">
              {lang === "fr" ? "Vérifiez votre boîte mail" : "Check your inbox"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-clay">
              {lang === "fr"
                ? "Nous vous avons envoyé un lien de confirmation. Cliquez dessus pour ouvrir votre parcours."
                : "We sent you a confirmation link. Click it to open your journey."}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex gap-1 rounded-lg bg-sand p-1">
              {(["in", "up"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={
                    mode === m
                      ? "flex-1 rounded-md bg-paper px-3 py-2 text-sm font-medium"
                      : "flex-1 rounded-md px-3 py-2 text-sm font-medium text-clay"
                  }
                >
                  {m === "in" ? t("signIn") : t("signUp")}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "up" ? (
                <label className="block">
                  <span className="eyebrow">{t("name")}</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="eyebrow">{t("email")}</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-ring/40"
                />
              </label>

              <label className="block">
                <span className="eyebrow">{t("password")}</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-ring/40"
                />
              </label>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-ink px-4 py-3 text-sm font-medium text-paper disabled:opacity-60"
              >
                {mode === "in" ? t("signIn") : t("signUp")}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="eyebrow">ou</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={google}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium"
            >
              {t("withGoogle")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
