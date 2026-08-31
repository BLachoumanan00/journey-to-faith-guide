// Verse lookup helper.
//
// French references are read in the Louis Segond 1910 ("FRLSG") text served by
// bolls.life, which indexes books by number (Genèse = 1 … Apocalypse = 66).
// English references keep using the King James / World English Bible texts.

type BookInfo = { en: string; num: number };

const BOOKS: Record<string, BookInfo> = {
  genèse: { en: "Genesis", num: 1 },
  genese: { en: "Genesis", num: 1 },
  exode: { en: "Exodus", num: 2 },
  lévitique: { en: "Leviticus", num: 3 },
  levitique: { en: "Leviticus", num: 3 },
  nombres: { en: "Numbers", num: 4 },
  deutéronome: { en: "Deuteronomy", num: 5 },
  deuteronome: { en: "Deuteronomy", num: 5 },
  josué: { en: "Joshua", num: 6 },
  josue: { en: "Joshua", num: 6 },
  juges: { en: "Judges", num: 7 },
  ruth: { en: "Ruth", num: 8 },
  "1 samuel": { en: "1 Samuel", num: 9 },
  "2 samuel": { en: "2 Samuel", num: 10 },
  "1 rois": { en: "1 Kings", num: 11 },
  "2 rois": { en: "2 Kings", num: 12 },
  "1 chroniques": { en: "1 Chronicles", num: 13 },
  "2 chroniques": { en: "2 Chronicles", num: 14 },
  esdras: { en: "Ezra", num: 15 },
  néhémie: { en: "Nehemiah", num: 16 },
  nehemie: { en: "Nehemiah", num: 16 },
  esther: { en: "Esther", num: 17 },
  job: { en: "Job", num: 18 },
  psaume: { en: "Psalms", num: 19 },
  psaumes: { en: "Psalms", num: 19 },
  proverbes: { en: "Proverbs", num: 20 },
  ecclésiaste: { en: "Ecclesiastes", num: 21 },
  ecclesiaste: { en: "Ecclesiastes", num: 21 },
  cantique: { en: "Song of Solomon", num: 22 },
  "cantique des cantiques": { en: "Song of Solomon", num: 22 },
  ésaïe: { en: "Isaiah", num: 23 },
  esaie: { en: "Isaiah", num: 23 },
  isaïe: { en: "Isaiah", num: 23 },
  jérémie: { en: "Jeremiah", num: 24 },
  jeremie: { en: "Jeremiah", num: 24 },
  lamentations: { en: "Lamentations", num: 25 },
  ézéchiel: { en: "Ezekiel", num: 26 },
  ezechiel: { en: "Ezekiel", num: 26 },
  daniel: { en: "Daniel", num: 27 },
  osée: { en: "Hosea", num: 28 },
  osee: { en: "Hosea", num: 28 },
  joël: { en: "Joel", num: 29 },
  joel: { en: "Joel", num: 29 },
  amos: { en: "Amos", num: 30 },
  abdias: { en: "Obadiah", num: 31 },
  jonas: { en: "Jonah", num: 32 },
  michée: { en: "Micah", num: 33 },
  michee: { en: "Micah", num: 33 },
  nahum: { en: "Nahum", num: 34 },
  habacuc: { en: "Habakkuk", num: 35 },
  sophonie: { en: "Zephaniah", num: 36 },
  aggée: { en: "Haggai", num: 37 },
  aggee: { en: "Haggai", num: 37 },
  zacharie: { en: "Zechariah", num: 38 },
  malachie: { en: "Malachi", num: 39 },
  matthieu: { en: "Matthew", num: 40 },
  marc: { en: "Mark", num: 41 },
  luc: { en: "Luke", num: 42 },
  jean: { en: "John", num: 43 },
  actes: { en: "Acts", num: 44 },
  romains: { en: "Romans", num: 45 },
  "1 corinthiens": { en: "1 Corinthians", num: 46 },
  "2 corinthiens": { en: "2 Corinthians", num: 47 },
  galates: { en: "Galatians", num: 48 },
  éphésiens: { en: "Ephesians", num: 49 },
  ephesiens: { en: "Ephesians", num: 49 },
  philippiens: { en: "Philippians", num: 50 },
  colossiens: { en: "Colossians", num: 51 },
  "1 thessaloniciens": { en: "1 Thessalonians", num: 52 },
  "2 thessaloniciens": { en: "2 Thessalonians", num: 53 },
  "1 timothée": { en: "1 Timothy", num: 54 },
  "1 timothee": { en: "1 Timothy", num: 54 },
  "2 timothée": { en: "2 Timothy", num: 55 },
  "2 timothee": { en: "2 Timothy", num: 55 },
  tite: { en: "Titus", num: 56 },
  philémon: { en: "Philemon", num: 57 },
  philemon: { en: "Philemon", num: 57 },
  hébreux: { en: "Hebrews", num: 58 },
  hebreux: { en: "Hebrews", num: 58 },
  jacques: { en: "James", num: 59 },
  "1 pierre": { en: "1 Peter", num: 60 },
  "2 pierre": { en: "2 Peter", num: 61 },
  "1 jean": { en: "1 John", num: 62 },
  "2 jean": { en: "2 John", num: 63 },
  "3 jean": { en: "3 John", num: 64 },
  jude: { en: "Jude", num: 65 },
  apocalypse: { en: "Revelation", num: 66 },
};

export type Translation = { id: string; label: string; lang: "fr" | "en" };

export const TRANSLATIONS: Translation[] = [
  { id: "FRLSG", label: "Louis Segond 1910", lang: "fr" },
  { id: "BDS", label: "Bible du Semeur", lang: "fr" },
  { id: "kjv", label: "King James Version", lang: "en" },
  { id: "web", label: "World English Bible", lang: "en" },
];

export const translationsFor = (lang: "fr" | "en") => TRANSLATIONS.filter((t) => t.lang === lang);

export const defaultTranslation = (lang: "fr" | "en") => (lang === "fr" ? "FRLSG" : "kjv");

const isFrench = (translation: string) => translation === translation.toUpperCase();

type ParsedRef = {
  book: string;
  bookNum: number | null;
  chapter: number;
  from: number | null;
  to: number | null;
};

export function parseReference(reference: string): ParsedRef | null {
  const match = reference
    .trim()
    .match(/^(\d?\s?[^\d]+?)\s+(\d+)(?:\s*[:.]\s*(\d+)(?:\s*[-–]\s*(\d+))?)?\s*$/);
  if (!match) return null;
  const [, rawBook, chapter, from, to] = match;
  const key = rawBook!.trim().toLowerCase().replace(/\s+/g, " ");
  const info = BOOKS[key];
  return {
    book: info?.en ?? rawBook!.trim(),
    bookNum: info?.num ?? null,
    chapter: Number(chapter),
    from: from ? Number(from) : null,
    to: to ? Number(to) : null,
  };
}

/** English reference string understood by bible-api.com. */
export function toApiReference(reference: string): string {
  const parsed = parseReference(reference);
  if (!parsed) return reference;
  const verses = parsed.from ? `:${parsed.from}${parsed.to ? `-${parsed.to}` : ""}` : "";
  return `${parsed.book} ${parsed.chapter}${verses}`;
}

/** Reference shown in the UI: French book names in FR, English book names in EN. */
export function displayReference(reference: string, lang: "fr" | "en"): string {
  if (lang !== "en") return reference;
  return toApiReference(reference);
}


export type VerseResult = { reference: string; text: string; translation: string };

async function fetchFrench(
  reference: string,
  translation: string,
  parsed: ParsedRef,
): Promise<VerseResult> {
  if (!parsed.bookNum) throw new Error("verse-not-found");
  const res = await fetch(`https://bolls.life/get-text/${translation}/${parsed.bookNum}/${parsed.chapter}/`);
  if (!res.ok) throw new Error("verse-not-found");
  const json = (await res.json()) as { verse: number; text: string }[];
  if (!Array.isArray(json) || json.length === 0) throw new Error("verse-not-found");

  const from = parsed.from ?? 1;
  const to = parsed.to ?? parsed.from ?? json.length;
  const picked = json.filter((v) => v.verse >= from && v.verse <= to);
  if (picked.length === 0) throw new Error("verse-not-found");

  const text = picked
    .map((v) => `${picked.length > 1 ? `${v.verse}. ` : ""}${stripTags(v.text)}`)
    .join(" ")
    .trim();

  return {
    reference,
    text,
    translation: TRANSLATIONS.find((t) => t.id === translation)?.label ?? translation,
  };
}

const stripTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function fetchVerse(reference: string, translation: string): Promise<VerseResult> {
  const parsed = parseReference(reference);
  if (isFrench(translation) && parsed) return fetchFrench(reference, translation, parsed);

  const query = encodeURIComponent(toApiReference(reference));
  const res = await fetch(`https://bible-api.com/${query}?translation=${translation}`);
  if (!res.ok) throw new Error("verse-not-found");
  const json = (await res.json()) as {
    reference?: string;
    text?: string;
    translation_name?: string;
  };
  if (!json.text) throw new Error("verse-not-found");
  return {
    reference: json.reference ?? reference,
    text: json.text.replace(/\n+/g, " ").trim(),
    translation: json.translation_name ?? translation.toUpperCase(),
  };
}
