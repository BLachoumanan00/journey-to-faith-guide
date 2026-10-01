import { createFileRoute, Link } from "@tanstack/react-router";

import { useLang } from "@/lib/i18n";
import appIcon from "@/assets/app-icon.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bible en Main — étudier la Bible, une leçon à la fois" },
      {
        name: "description",
        content:
          "Un compagnon d'étude biblique en 24 leçons, à votre rythme, accompagné par un mentor si vous le souhaitez.",
      },
      { property: "og:title", content: "Bible en Main — étudier la Bible, une leçon à la fois" },
      {
        property: "og:description",
        content: "Un compagnon d'étude biblique en 24 leçons, à votre rythme, avec un mentor si vous le souhaitez.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { lang, setLang, t } = useLang();
  const fr = lang === "fr";

  return (
    <div className="min-h-screen text-ink">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-12">
        <div className="flex items-start justify-between">
          <span className="eyebrow">{t("eyebrow")}</span>
          <button
            type="button"
            onClick={() => setLang(fr ? "en" : "fr")}
            className="rounded-sm px-2 py-1 text-xs font-medium ring-1 ring-border"
          >
            {fr ? "FR / EN" : "EN / FR"}
          </button>
        </div>

        <img src={appIcon.url} alt="Bible en Main" className="mt-10 size-24 rounded-3xl shadow-[0_0_40px_-6px_var(--ribbon)]" />
        <h1 className="mt-8 font-serif text-5xl font-medium leading-[1.05]">
          {fr ? (
            <>
              La Bible,
              <br />
              en main.
            </>
          ) : (
            <>
              The Bible,
              <br />
              in hand.
            </>
          )}
        </h1>

        <p className="mt-6 text-base leading-relaxed text-clay">
          {fr
            ? "Vingt-quatre leçons pour découvrir le message de Jésus, verset par verset. Vous répondez avec vos mots ; un mentor vous accompagne si vous le souhaitez."
            : "Twenty-four lessons to discover the message of Jesus, verse by verse. You answer in your own words; a mentor walks with you if you wish."}
        </p>

        <ol className="mt-10 space-y-4 border-t border-border pt-6">
          {(fr
            ? [
                ["Leçons 1 – 7", "Les fondations : la Parole, Dieu, le salut."],
                ["Leçons 8 – 16", "La prophétie, la loi, le sabbat, l'espérance."],
                ["Leçons 17 – 24", "Le corps, l'Église, le baptême, la marche quotidienne."],
              ]
            : [
                ["Lessons 1 – 7", "Foundations: the Word, God, salvation."],
                ["Lessons 8 – 16", "Prophecy, the law, the Sabbath, hope."],
                ["Lessons 17 – 24", "The body, the church, baptism, daily walk."],
              ]
          ).map(([label, body]) => (
            <li key={label}>
              <span className="eyebrow">{label}</span>
              <p className="mt-1 font-serif text-lg leading-snug">{body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-auto pt-12">
          <Link
            to="/parcours"
            className="block w-full rounded-lg bg-ribbon px-4 py-3.5 text-center text-sm font-medium text-paper"
          >
            {fr ? "Commencer la première leçon" : "Start the first lesson"}
          </Link>
          <p className="mt-3 text-center text-xs text-clay">
            {fr ? "Gratuit. À votre rythme. Sans pression." : "Free. At your pace. No pressure."}
          </p>
        </div>
      </div>
    </div>
  );
}
