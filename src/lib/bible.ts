// Verse lookup helper — French references are translated to the English book
// names understood by the public bible-api.com service.

const BOOKS: Record<string, string> = {
  genèse: "Genesis",
  genese: "Genesis",
  exode: "Exodus",
  lévitique: "Leviticus",
  nombres: "Numbers",
  deutéronome: "Deuteronomy",
  josué: "Joshua",
  juges: "Judges",
  ruth: "Ruth",
  "1 samuel": "1 Samuel",
  "2 samuel": "2 Samuel",
  "1 rois": "1 Kings",
  "2 rois": "2 Kings",
  "1 chroniques": "1 Chronicles",
  "2 chroniques": "2 Chronicles",
  esdras: "Ezra",
  néhémie: "Nehemiah",
  esther: "Esther",
  job: "Job",
  psaume: "Psalms",
  psaumes: "Psalms",
  proverbes: "Proverbs",
  ecclésiaste: "Ecclesiastes",
  cantique: "Song of Solomon",
  ésaïe: "Isaiah",
  esaie: "Isaiah",
  jérémie: "Jeremiah",
  lamentations: "Lamentations",
  ézéchiel: "Ezekiel",
  daniel: "Daniel",
  osée: "Hosea",
  joël: "Joel",
  amos: "Amos",
  abdias: "Obadiah",
  jonas: "Jonah",
  michée: "Micah",
  nahum: "Nahum",
  habacuc: "Habakkuk",
  sophonie: "Zephaniah",
  aggée: "Haggai",
  zacharie: "Zechariah",
  malachie: "Malachi",
  matthieu: "Matthew",
  marc: "Mark",
  luc: "Luke",
  jean: "John",
  actes: "Acts",
  romains: "Romans",
  "1 corinthiens": "1 Corinthians",
  "2 corinthiens": "2 Corinthians",
  galates: "Galatians",
  éphésiens: "Ephesians",
  philippiens: "Philippians",
  colossiens: "Colossians",
  "1 thessaloniciens": "1 Thessalonians",
  "2 thessaloniciens": "2 Thessalonians",
  "1 timothée": "1 Timothy",
  "2 timothée": "2 Timothy",
  tite: "Titus",
  philémon: "Philemon",
  hébreux: "Hebrews",
  jacques: "James",
  "1 pierre": "1 Peter",
  "2 pierre": "2 Peter",
  "1 jean": "1 John",
  "2 jean": "2 John",
  "3 jean": "3 John",
  jude: "Jude",
  apocalypse: "Revelation",
};

export const TRANSLATIONS = [
  { id: "kjv", label: "King James Version" },
  { id: "web", label: "World English Bible" },
  { id: "clementine", label: "Vulgate clémentine (latin)" },
] as const;

export function toApiReference(reference: string): string {
  const match = reference.trim().match(/^(.+?)\s+(\d+[\d:,\-\s]*)$/);
  if (!match) return reference;
  const [, rawBook, rest] = match;
  const key = rawBook!.trim().toLowerCase();
  const book = BOOKS[key] ?? rawBook!.trim();
  return `${book} ${rest!.trim()}`;
}

export type VerseResult = { reference: string; text: string; translation: string };

export async function fetchVerse(reference: string, translation: string): Promise<VerseResult> {
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
