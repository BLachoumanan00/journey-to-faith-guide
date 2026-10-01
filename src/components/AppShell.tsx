import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useLang } from "@/lib/i18n";
import appIcon from "@/assets/app-icon.png.asset.json";

const NAV = [
  { to: "/parcours", key: "journey" as const },
  { to: "/lecons", key: "lessons" as const },
  { to: "/journal", key: "journal" as const },
  { to: "/mentor", key: "mentor" as const },
];

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
          className="rounded-sm px-2 py-1 text-xs font-medium ring-1 ring-border transition-colors hover:bg-sand"
        >
          {lang === "fr" ? "FR / EN" : "EN / FR"}
        </button>
      </header>

      <main className="mx-auto max-w-md px-6 pb-32">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-paper/90 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-1 text-clay"
              activeProps={{ className: "flex flex-col items-center gap-1 text-ribbon" }}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={
                      isActive ? "size-1.5 rounded-full bg-ribbon" : "size-1.5 rounded-full bg-transparent"
                    }
                  />
                  <span className="text-[10px] font-medium uppercase tracking-wide">{t(item.key)}</span>
                </>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
