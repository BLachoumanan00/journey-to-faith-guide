import { OT_BOOKS } from "./books.ot";
import { NT_BOOKS } from "./books.nt";
import type { BibleBook, Bi, Division } from "./types";

export const BOOKS: BibleBook[] = [...OT_BOOKS, ...NT_BOOKS];

export const DIVISION_LABELS: Record<Division, Bi> = {
  law: { fr: "Loi (Pentateuque)", en: "Law (Pentateuch)" },
  history: { fr: "Livres historiques", en: "History" },
  wisdom: { fr: "Poésie et sagesse", en: "Poetry and wisdom" },
  "major-prophets": { fr: "Grands prophètes", en: "Major prophets" },
  "minor-prophets": { fr: "Petits prophètes", en: "Minor prophets" },
  gospels: { fr: "Évangiles", en: "Gospels" },
  acts: { fr: "Actes des apôtres", en: "Acts" },
  pauline: { fr: "Lettres de Paul", en: "Letters of Paul" },
  general: { fr: "Lettres générales", en: "General letters" },
  apocalyptic: { fr: "Prophétie apocalyptique", en: "Apocalyptic prophecy" },
};

export function bookById(id: string): BibleBook | undefined {
  return BOOKS.find((b) => b.id === id);
}

export const TOTAL_CHAPTERS = BOOKS.reduce((sum, b) => sum + b.chapters, 0);
