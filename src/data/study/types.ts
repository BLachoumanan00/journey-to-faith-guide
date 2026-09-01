/**
 * Shared types for the Bible Study reference library.
 *
 * Every dataset is plain, versioned, in-app data so new material can be added
 * later without a migration. Every entry carries French + English text and, where
 * relevant, an explicit `certainty` marker so traditional attribution, historical
 * information and scholarly debate are never presented as biblical statement.
 */

export type Bi = { fr: string; en: string };

/** How firmly a statement is established. Surfaced in the UI, never hidden. */
export type Certainty =
  | "biblical" // the biblical text states it
  | "traditional" // long-standing Jewish/Christian attribution
  | "historical" // outside historical/archaeological information
  | "scholarly" // a scholarly reconstruction or estimate
  | "disputed"; // genuinely debated, no consensus

export type Testament = "ot" | "nt";

export type Division =
  | "law"
  | "history"
  | "wisdom"
  | "major-prophets"
  | "minor-prophets"
  | "gospels"
  | "acts"
  | "pauline"
  | "general"
  | "apocalyptic";

export interface BibleBook {
  id: string;
  name: Bi;
  testament: Testament;
  division: Division;
  chapters: number;
  /** Traditional authorship, with its certainty marker. */
  author: Bi;
  authorCertainty: Certainty;
  /** Author ids in `authors.ts`, when a profile exists. */
  authorIds?: string[];
  period: Bi;
  periodCertainty: Certainty;
  /** Approximate year for the timeline rail (negative = BC). */
  year: number;
  language: Array<"hebrew" | "aramaic" | "greek">;
  theme: Bi;
  people: string[];
  events: Bi[];
  refs: string[];
  related: string[];
  summary: Bi;
}

export interface BibleAuthor {
  id: string;
  name: Bi;
  role: Bi;
  period: Bi;
  periodCertainty: Certainty;
  bio: Bi;
  books: string[];
  booksCertainty: Certainty;
  /** Notes on authorship debate, shown verbatim when present. */
  attribution?: Bi;
  events: Bi[];
  relatedPeople: string[];
  refs: string[];
}

export type PersonCategory =
  | "patriarchs"
  | "prophets"
  | "kings"
  | "judges"
  | "apostles"
  | "disciples"
  | "women"
  | "priests"
  | "leaders"
  | "other";

export interface BiblePerson {
  id: string;
  name: Bi;
  categories: PersonCategory[];
  period: Bi;
  bio: Bi;
  family: Bi;
  events: Bi[];
  traits: Bi;
  lesson: Bi;
  refs: string[];
  related: string[];
}

export interface GenealogyNode {
  id: string;
  name: Bi;
  parents?: string[];
  spouses?: Bi[];
  children?: string[];
  tribe?: Bi;
  note: Bi;
  refs: string[];
  certainty?: Certainty;
}

export interface GenealogyLine {
  id: string;
  title: Bi;
  intro: Bi;
  refs: string[];
  nodes: GenealogyNode[];
  /** Roots of the tree drawn for this line. */
  roots: string[];
  caution?: Bi;
}

export interface TimelineEvent {
  id: string;
  title: Bi;
  date: Bi;
  dateCertainty: Certainty;
  /** Sort key, negative = BC. */
  year: number;
  description: Bi;
  people: string[];
  refs: string[];
  related: string[];
}

export interface Topic {
  id: string;
  name: Bi;
  summary: Bi;
  ot: string[];
  nt: string[];
  related: string[];
}

export interface BibleNumber {
  id: string;
  value: Bi;
  textSays: Bi;
  interpretation: Bi;
  examples: Array<{ ref: string; note: Bi }>;
}

export interface BiblePlace {
  id: string;
  name: Bi;
  region: Bi;
  /** Approximate coordinates for the map. */
  lat: number;
  lng: number;
  description: Bi;
  significance: Bi;
  events: Bi[];
  people: string[];
  refs: string[];
}

export type ProphecyGroup = "messianic" | "kingdom" | "israel" | "nations" | "endtimes" | "prophets";

export type LinkKind = "quotation" | "thematic" | "interpretation";

export interface Prophecy {
  id: string;
  group: ProphecyGroup;
  title: Bi;
  otRef: string[];
  ntRef: string[];
  linkKind: LinkKind;
  explanation: Bi;
}

export type MiracleGroup = "creation" | "exodus" | "prophets" | "jesus" | "apostolic";

export interface Miracle {
  id: string;
  group: MiracleGroup;
  title: Bi;
  through: string[];
  place: Bi;
  description: Bi;
  refs: string[];
  related: string[];
}

export interface CrossRefEntry {
  id: string;
  ref: string;
  theme: Bi;
  parallels: string[];
  ot: string[];
  nt: string[];
  people: string[];
  places: string[];
  topics: string[];
  note: Bi;
}

export type StudyKind =
  | "book"
  | "author"
  | "person"
  | "place"
  | "topic"
  | "event"
  | "prophecy"
  | "miracle"
  | "number"
  | "genealogy"
  | "crossref";
