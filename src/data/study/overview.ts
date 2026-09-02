import type { Bi, Certainty } from "./types";

/** Headline statistics for the overview cards. Counts follow the Protestant canon (KJV verse count). */
export const STATS: Array<{ id: string; value: string; label: Bi; note: Bi; certainty: Certainty }> = [
  {
    id: "books",
    value: "66",
    label: { fr: "Livres au total", en: "Books in total" },
    note: { fr: "Canon protestant, celui utilisé dans ce cours.", en: "The Protestant canon, used in this course." },
    certainty: "historical",
  },
  {
    id: "ot",
    value: "39",
    label: { fr: "Livres de l'Ancien Testament", en: "Old Testament books" },
    note: { fr: "La Bible hébraïque compte les mêmes textes en 24 rouleaux.", en: "The Hebrew Bible contains the same texts in 24 scrolls." },
    certainty: "historical",
  },
  {
    id: "nt",
    value: "27",
    label: { fr: "Livres du Nouveau Testament", en: "New Testament books" },
    note: { fr: "Reconnus ensemble dès le IVe siècle.", en: "Recognised together from the 4th century." },
    certainty: "historical",
  },
  {
    id: "chapters",
    value: "1 189",
    label: { fr: "Chapitres", en: "Chapters" },
    note: { fr: "929 dans l'Ancien Testament, 260 dans le Nouveau.", en: "929 in the Old Testament, 260 in the New." },
    certainty: "historical",
  },
  {
    id: "verses",
    value: "≈ 31 100",
    label: { fr: "Versets (approximatif)", en: "Verses (approximate)" },
    note: {
      fr: "Le découpage en versets est postérieur (XVIe s.) : le total varie selon les éditions.",
      en: "Verse divisions are later (16th century): totals vary between editions.",
    },
    certainty: "historical",
  },
  {
    id: "authors",
    value: "≈ 40",
    label: { fr: "Auteurs humains", en: "Human writers" },
    note: {
      fr: "Estimation : plusieurs livres sont anonymes.",
      en: "An estimate: several books are anonymous.",
    },
    certainty: "scholarly",
  },
  {
    id: "span",
    value: "≈ 1 500 ans",
    label: { fr: "Durée de rédaction", en: "Span of writing" },
    note: { fr: "De Moïse à l'apôtre Jean, selon la datation traditionnelle.", en: "From Moses to the apostle John, on traditional dating." },
    certainty: "traditional",
  },
  {
    id: "languages",
    value: "3",
    label: { fr: "Langues d'origine", en: "Original languages" },
    note: { fr: "Hébreu, araméen, grec.", en: "Hebrew, Aramaic, Greek." },
    certainty: "historical",
  },
];

export const WHAT_IS_BIBLE: Bi = {
  fr: "La Bible est une bibliothèque de 66 livres écrits par une quarantaine d'auteurs sur environ quinze siècles : lois, récits, poèmes, prophéties, évangiles et lettres. Les chrétiens la reçoivent comme la Parole de Dieu, qui témoigne d'un même fil du commencement jusqu'au royaume promis.",
  en: "The Bible is a library of 66 books written by around forty writers across roughly fifteen centuries: laws, narratives, poems, prophecies, gospels and letters. Christians receive it as the Word of God, tracing one thread from the beginning to the promised kingdom.",
};

export const TESTAMENTS: Array<{ id: "ot" | "nt"; title: Bi; body: Bi; refs: string[] }> = [
  {
    id: "ot",
    title: { fr: "L'Ancien Testament", en: "The Old Testament" },
    body: {
      fr: "39 livres écrits surtout en hébreu, avant la venue de Jésus. Ils racontent la création, l'histoire d'Israël, et annoncent un Messie.",
      en: "39 books written mostly in Hebrew, before the coming of Jesus. They tell of creation, the story of Israel, and announce a Messiah.",
    },
    refs: ["Luc 24:44", "2 Timothée 3:16"],
  },
  {
    id: "nt",
    title: { fr: "Le Nouveau Testament", en: "The New Testament" },
    body: {
      fr: "27 livres écrits en grec au Ier siècle : quatre évangiles, les Actes, 21 lettres et l'Apocalypse. Ils annoncent Jésus venu, mort, ressuscité et revenant.",
      en: "27 books written in Greek in the first century: four gospels, Acts, 21 letters and Revelation. They proclaim Jesus come, crucified, risen and returning.",
    },
    refs: ["Jean 20:31", "Actes 1:8"],
  },
];

export const LANGUAGES: Array<{ id: string; name: Bi; body: Bi }> = [
  {
    id: "hebrew",
    name: { fr: "Hébreu", en: "Hebrew" },
    body: {
      fr: "Langue de presque tout l'Ancien Testament : concrète, imagée, faite pour être dite à haute voix.",
      en: "The language of almost all the Old Testament: concrete, vivid, made to be spoken aloud.",
    },
  },
  {
    id: "aramaic",
    name: { fr: "Araméen", en: "Aramaic" },
    body: {
      fr: "Langue du Proche-Orient après l'exil. On la trouve notamment en Daniel 2-7 et Esdras 4-7, et Jésus la parlait.",
      en: "The Near East's common language after the exile. It appears in Daniel 2-7 and Ezra 4-7, and Jesus spoke it.",
    },
  },
  {
    id: "greek",
    name: { fr: "Grec (koinè)", en: "Greek (koine)" },
    body: {
      fr: "Grec courant de l'Empire : langue de tout le Nouveau Testament, comprise d'un bout à l'autre du monde méditerranéen.",
      en: "The empire's everyday Greek: the language of the whole New Testament, understood across the Mediterranean world.",
    },
  },
];

/** Historical outline. Each step is marked so history is not read as biblical statement. */
export const HISTORY_STEPS: Array<{ id: string; title: Bi; body: Bi; certainty: Certainty }> = [
  {
    id: "oral",
    title: { fr: "Transmission orale et premiers écrits", en: "Oral transmission and first writings" },
    body: {
      fr: "Les récits sont d'abord racontés et récités en famille, puis fixés par écrit. Le texte lui-même mentionne l'ordre d'écrire (Exode 17:14).",
      en: "The accounts are first told and recited in families, then written down. The text itself records the command to write (Exodus 17:14).",
    },
    certainty: "biblical",
  },
  {
    id: "scribes",
    title: { fr: "Les scribes et les copistes", en: "Scribes and copyists" },
    body: {
      fr: "Des générations de scribes recopient à la main, avec des règles très strictes de comptage des lettres et des lignes.",
      en: "Generations of scribes copied by hand under strict rules, counting letters and lines.",
    },
    certainty: "historical",
  },
  {
    id: "septuagint",
    title: { fr: "La Septante (IIIe-IIe s. av. J.-C.)", en: "The Septuagint (3rd-2nd century BC)" },
    body: {
      fr: "L'Ancien Testament est traduit en grec à Alexandrie ; c'est souvent cette version que citent les auteurs du Nouveau Testament.",
      en: "The Old Testament is translated into Greek in Alexandria; New Testament writers often quote this version.",
    },
    certainty: "historical",
  },
  {
    id: "scrolls",
    title: { fr: "Les manuscrits de la mer Morte (1947)", en: "The Dead Sea Scrolls (1947)" },
    body: {
      fr: "Découverts à Qumrân, ils contiennent des copies bibliques d'environ mille ans plus anciennes que celles connues jusque-là, très proches du texte reçu.",
      en: "Found at Qumran, they contain biblical copies about a thousand years older than those previously known, very close to the received text.",
    },
    certainty: "historical",
  },
  {
    id: "canon",
    title: { fr: "La reconnaissance du canon", en: "Recognising the canon" },
    body: {
      fr: "Les 27 livres du Nouveau Testament circulent tôt et sont reconnus ensemble au IVe siècle ; l'Église reconnaît un usage déjà établi plutôt qu'elle ne le crée.",
      en: "The 27 New Testament books circulate early and are recognised together in the 4th century; the church acknowledged an established usage rather than creating it.",
    },
    certainty: "historical",
  },
  {
    id: "translations",
    title: { fr: "Traductions et imprimerie", en: "Translations and printing" },
    body: {
      fr: "Vulgate latine (IVe s.), puis l'imprimerie de Gutenberg (1455) et les traductions modernes — dont la Louis Segond (1880-1910) utilisée ici.",
      en: "The Latin Vulgate (4th century), then Gutenberg's press (1455) and modern translations — including the Louis Segond (1880-1910) used here.",
    },
    certainty: "historical",
  },
];

export const SOURCES_NOTE: Bi = {
  fr: "Cette bibliothèque distingue toujours quatre niveaux : le texte biblique (références citées), l'interprétation chrétienne traditionnelle, l'information historique extérieure, et les hypothèses savantes. Quand une paternité, une date ou une généalogie est débattue, c'est écrit.",
  en: "This library always distinguishes four levels: the biblical text (with references), traditional Christian interpretation, outside historical information, and scholarly hypotheses. Where authorship, dating or genealogy is debated, it says so.",
};
