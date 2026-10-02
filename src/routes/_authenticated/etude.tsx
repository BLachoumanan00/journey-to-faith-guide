import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { VerseChip } from "@/components/VerseChip";
import { useLang } from "@/lib/i18n";
import appIcon from "@/assets/app-icon.png.asset.json";
import { BOOKS } from "@/data/study/books";
import { AUTHORS } from "@/data/study/authors";
import { PEOPLE } from "@/data/study/people";
import { TIMELINE } from "@/data/study/timeline";
import { TOPICS } from "@/data/study/topics";
import { NUMBERS } from "@/data/study/numbers";
import { PLACES } from "@/data/study/places";
import { GENEALOGIES } from "@/data/study/genealogy";
import { STATS, WHAT_IS_BIBLE, SOURCES_NOTE } from "@/data/study/overview";
import type { Bi, Certainty } from "@/data/study/types";

export const Route = createFileRoute("/_authenticated/etude")({
  head: () => ({
    meta: [
      { title: "Étude biblique — Bible en Main" },
      { name: "description", content: "Livres, auteurs, personnages, lieux, chronologie et sujets de la Bible." },
      { property: "og:title", content: "Étude biblique — Bible en Main" },
      { property: "og:description", content: "Une bibliothèque d'étude biblique bilingue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudyPage,
});

type Entry = { id: string; title: string; meta?: string; body: string[]; refs: string[]; certainty?: Certainty };
type Section = { id: string; icon: string; label: Bi; entries: (l: "fr" | "en") => Entry[] };

const CERT: Record<Certainty, Bi> = {
  biblical: { fr: "Texte biblique", en: "Biblical text" },
  traditional: { fr: "Tradition", en: "Tradition" },
  historical: { fr: "Histoire", en: "Historical" },
  scholarly: { fr: "Estimation savante", en: "Scholarly estimate" },
  disputed: { fr: "Débattu", en: "Disputed" },
};

const SECTIONS: Section[] = [
  { id: "books", icon: "📖", label: { fr: "66 livres", en: "66 Books" }, entries: (l) =>
    BOOKS.map((b) => ({ id: b.id, title: b.name[l], meta: `${b.chapters} ch. · ${b.period[l]}`, certainty: b.authorCertainty,
      body: [b.summary[l], `${l === "fr" ? "Auteur" : "Author"} : ${b.author[l]}`, `${l === "fr" ? "Thème" : "Theme"} : ${b.theme[l]}`], refs: b.refs })) },
  { id: "authors", icon: "✍️", label: { fr: "Auteurs", en: "Authors" }, entries: (l) =>
    AUTHORS.map((a) => ({ id: a.id, title: a.name[l], meta: `${a.role[l]} · ${a.period[l]}`, certainty: a.booksCertainty,
      body: [a.bio[l], ...(a.attribution ? [a.attribution[l]] : [])], refs: [] })) },
  { id: "genealogy", icon: "🌳", label: { fr: "Généalogies", en: "Genealogies" }, entries: (l) =>
    GENEALOGIES.map((g) => ({ id: g.id, title: g.title[l], body: [g.intro[l], g.nodes.map((n) => n.name[l]).join(" → "), ...(g.caution ? [g.caution[l]] : [])], refs: g.refs })) },
  { id: "timeline", icon: "⏳", label: { fr: "Chronologie", en: "Timeline" }, entries: (l) =>
    TIMELINE.map((e) => ({ id: e.id, title: e.title[l], meta: e.date[l], certainty: e.dateCertainty, body: [e.description[l]], refs: e.refs })) },
  { id: "people", icon: "👥", label: { fr: "Personnages", en: "People" }, entries: (l) =>
    PEOPLE.map((p) => ({ id: p.id, title: p.name[l], meta: p.period[l], body: [p.bio[l], p.family[l], p.lesson[l]], refs: p.refs })) },
  { id: "places", icon: "📍", label: { fr: "Lieux", en: "Places" }, entries: (l) =>
    PLACES.map((p) => ({ id: p.id, title: p.name[l], meta: p.region[l], body: [p.description[l], p.significance[l]], refs: p.refs })) },
  { id: "topics", icon: "📚", label: { fr: "Sujets", en: "Topics" }, entries: (l) =>
    TOPICS.map((t) => ({ id: t.id, title: t.name[l], body: [t.summary[l]], refs: [...t.ot, ...t.nt] })) },
  { id: "numbers", icon: "🔢", label: { fr: "Nombres", en: "Numbers" }, entries: (l) =>
    NUMBERS.map((n) => ({ id: n.id, title: n.value[l],
      body: [`${l === "fr" ? "Ce que dit le texte" : "What the text says"} : ${n.textSays[l]}`, `${l === "fr" ? "Interprétation" : "Interpretation"} : ${n.interpretation[l]}`],
      refs: n.examples.map((x) => x.ref) })) },
];

function StudyPage() {
  const { lang } = useLang();
  const [active, setActive] = useState("books");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTIONS.map((s) => ({
      s,
      items: s.entries(lang).filter((e) => !q ? s.id === active : (e.title + " " + e.body.join(" ") + e.refs.join(" ")).toLowerCase().includes(q)),
    })).filter((g) => g.items.length);
  }, [query, active, lang]);

  return (
    <AppShell>
      <div className="flex items-center gap-4 rounded-xl border border-ribbon/30 bg-card p-4 shadow-[0_0_32px_-12px_var(--ribbon)]">
        <img src={appIcon.url} alt="" className="size-14 rounded-xl" />
        <div>
          <span className="eyebrow text-ribbon">{lang === "fr" ? "Bibliothèque" : "Library"}</span>
          <h2 className="font-serif text-2xl font-medium leading-tight">{lang === "fr" ? "Étude biblique" : "Bible Study"}</h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-clay">{WHAT_IS_BIBLE[lang]}</p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {STATS.slice(0, 3).map((s) => (
          <div key={s.id} className="rounded-xl bg-sand/60 p-3 text-center">
            <p className="font-serif text-2xl text-ribbon">{s.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-clay">{s.label[lang]}</p>
          </div>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={lang === "fr" ? "🔍 Rechercher un livre, une personne, un verset…" : "🔍 Search a book, person, verse…"}
        className="mt-6 w-full rounded-lg border border-ribbon/30 bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring/40"
      />

      {!query ? (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {SECTIONS.map((s) => (
            <button key={s.id} type="button" onClick={() => setActive(s.id)}
              className={["flex flex-col items-center gap-1 rounded-xl px-1 py-3 text-center transition-colors",
                active === s.id ? "bg-ribbon text-paper shadow-[0_0_18px_-6px_var(--ribbon)]" : "border border-border bg-card text-ink hover:bg-sand/50"].join(" ")}>
              <span className="text-xl">{s.icon}</span>
              <span className="text-[10px] font-semibold uppercase leading-tight tracking-wide">{s.label[lang]}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-6 space-y-8">
        {results.length === 0 ? <p className="italic text-clay">{lang === "fr" ? "Aucun résultat." : "No results."}</p> : null}
        {results.map(({ s, items }) => (
          <section key={s.id}>
            <span className="eyebrow">{s.icon} {s.label[lang]} · {items.length}</span>
            <div className="mt-3 space-y-2">
              {items.map((e) => {
                const key = s.id + e.id;
                const isOpen = open === key;
                return (
                  <div key={key} className={["rounded-xl border bg-card transition-colors", isOpen ? "border-ribbon/50" : "border-border"].join(" ")}>
                    <button type="button" onClick={() => setOpen(isOpen ? null : key)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                      <span>
                        <span className="block font-serif text-lg leading-snug">{e.title}</span>
                        {e.meta ? <span className="text-xs text-clay">{e.meta}</span> : null}
                      </span>
                      <span className={["text-ribbon transition-transform", isOpen ? "rotate-45" : ""].join(" ")}>+</span>
                    </button>
                    {isOpen ? (
                      <div className="border-t border-border px-4 pb-4">
                        {e.certainty ? (
                          <span className="mt-3 inline-block rounded-full bg-ribbon/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ribbon">
                            {CERT[e.certainty][lang]}
                          </span>
                        ) : null}
                        {e.body.filter(Boolean).map((p, i) => <p key={i} className="mt-3 text-sm leading-relaxed text-ink/90">{p}</p>)}
                        {e.refs.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {e.refs.slice(0, 8).map((r) => <VerseChip key={r} reference={r} showHint={false} />)}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-xs italic leading-relaxed text-clay">{SOURCES_NOTE[lang]}</p>
    </AppShell>
  );
}
