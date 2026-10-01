import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { defaultTranslation, displayReference, fetchVerse, translationsFor } from "@/lib/bible";
import { useLang } from "@/lib/i18n";

export function VerseChip({ reference, showHint = true }: { reference: string; showHint?: boolean }) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [translation, setTranslation] = useState<string>(() => defaultTranslation(lang));

  // Book names follow the language toggle (Jean 3:16 → John 3:16).
  const label = displayReference(reference, lang);

  // Following the language toggle keeps French readers in Louis Segond.
  useEffect(() => {
    setTranslation(defaultTranslation(lang));
  }, [lang]);


  const verse = useQuery({
    queryKey: ["verse", reference, translation],
    queryFn: () => fetchVerse(reference, translation),
    enabled: open,
    staleTime: Infinity,
  });


  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-sand/50 px-3 py-1.5 transition-colors hover:bg-sand"
      >
        <span className="text-xs font-medium tracking-tight">{label}</span>
        {showHint ? (
          <>
            <span className="size-1 rounded-full bg-clay/40" />
            <span className="text-[10px] uppercase tracking-wider text-clay">{t("readVerse")}</span>
          </>
        ) : null}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl border-sand bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-medium">{label}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            {translationsFor(lang).map((tr) => (
              <button
                key={tr.id}
                type="button"
                onClick={() => setTranslation(tr.id)}
                className={
                  translation === tr.id
                    ? "rounded-full bg-ribbon px-3 py-1 text-[10px] uppercase tracking-widest text-paper"
                    : "rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-widest text-clay"
                }
              >
                {tr.label}
              </button>
            ))}
          </div>


          <div className="min-h-24 text-base leading-relaxed">
            {verse.isPending ? (
              <p className="italic text-clay">{t("loading")}</p>
            ) : verse.isError ? (
              <p className="text-sm italic text-clay">
                {lang === "en"
                  ? `The text could not be loaded. Open your Bible at ${label}.`
                  : `Le texte n'a pas pu être chargé. Ouvrez votre Bible à ${label}.`}
              </p>
            ) : (
              <>
                <p className="font-serif text-lg leading-relaxed">{verse.data?.text}</p>
                <p className="mt-4 text-[10px] uppercase tracking-widest text-clay">
                  {verse.data?.translation}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
