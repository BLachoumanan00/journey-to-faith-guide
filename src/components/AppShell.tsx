import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useLang } from "@/lib/i18n";
import appIcon from "@/assets/app-icon.png.asset.json";

const NAV = [
  { to: "/parcours", label: { fr: "Parcours", en: "Journey" } },
  { to: "/lecons", label: { fr: "Leçons", en: "Lessons" } },
  { to: "/etude", label: { fr: "Étude", en: "Study" } },
  { to: "/journal", label: { fr: "Journal", en: "Journal" } },
  { to: "/mentor", label: { fr: "Mentor", en: "Mentor" } },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-screen text-ink">
      <header className="mx-auto flex max-w-md items-end justify-between px-6 pt-8 pb-6">
        <Link to="/parcours" className="flex min-w-0 items-center gap-3">
          <img src={appIcon.url} alt="" className="size-12 shrink-0 rounded-xl shadow-[0_0_24px_-4px_var(--ribbon)]" />
          <span className="block min-w-0">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="mt-1 font-serif text-3xl font-medium leading-tight">{t("appName")}</h1>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setLang(lang === "fr" ? "en" : "fr")}
          className="rounded-lg bg-ribbon px-2.5 py-1 text-xs font-medium text-paper"
        >
          {lang === "fr" ? "FR / EN" : "EN / FR"}
        </button>
      </header>

      <main className="mx-auto max-w-md px-6 pb-32">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-ribbon/25 bg-paper/95 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="flex-1">
              {({ isActive }) => (
                <span
                  className={[
                    "mx-auto flex w-fit flex-col items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors",
                    isActive ? "bg-ribbon text-paper shadow-[0_0_18px_-4px_var(--ribbon)]" : "text-clay",
                  ].join(" ")}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide">{item.label[lang]}</span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
