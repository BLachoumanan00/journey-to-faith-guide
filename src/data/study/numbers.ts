import type { BibleNumber } from "./types";

/**
 * Numbers that recur in Scripture.
 * `textSays` keeps to what the text states; `interpretation` is marked as later symbolic reading.
 */
export const NUMBERS: BibleNumber[] = [
  {
    id: "3",
    value: { fr: "3", en: "3" },
    textSays: {
      fr: "Trois jours reviennent souvent dans les récits : Jonas dans le poisson, Esther jeûnant, Jésus au tombeau. Le texte compte les jours sans les commenter.",
      en: "Three days recur in the narratives: Jonah in the fish, Esther fasting, Jesus in the tomb. The text counts the days without commenting on them.",
    },
    interpretation: {
      fr: "Interprétation traditionnelle : le trois marque un délai complet avant une intervention de Dieu, et la tradition chrétienne y voit un signe de plénitude. Le texte ne l'explique pas lui-même.",
      en: "Traditional reading: three marks a completed interval before God acts, and Christian tradition sees it as a sign of fullness. The text does not explain it itself.",
    },
    examples: [
      { ref: "Jonas 1:17", note: { fr: "Trois jours dans le poisson.", en: "Three days in the fish." } },
      { ref: "Esther 4:16", note: { fr: "Trois jours de jeûne.", en: "Three days of fasting." } },
      { ref: "Matthieu 12:40", note: { fr: "Jésus rapproche les deux.", en: "Jesus links the two." } },
      { ref: "Luc 24:46", note: { fr: "Ressuscité le troisième jour.", en: "Raised on the third day." } },
    ],
  },
  {
    id: "7",
    value: { fr: "7", en: "7" },
    textSays: {
      fr: "Sept jours de la semaine de création, le septième béni et sanctifié ; sept fois autour de Jéricho ; sept églises, sceaux, trompettes et coupes dans l'Apocalypse.",
      en: "Seven days of the creation week, the seventh blessed and set apart; seven circuits around Jericho; seven churches, seals, trumpets and bowls in Revelation.",
    },
    interpretation: {
      fr: "Interprétation largement partagée : le sept évoque l'achèvement, parce que la semaine de création se termine ainsi. C'est une lecture symbolique, pas une définition biblique explicite.",
      en: "Widely shared reading: seven suggests completion, because the creation week ends that way. This is a symbolic reading, not an explicit biblical definition.",
    },
    examples: [
      { ref: "Genèse 2:2-3", note: { fr: "Le septième jour, sanctifié.", en: "The seventh day, set apart." } },
      { ref: "Josué 6:4", note: { fr: "Sept tours, sept trompettes.", en: "Seven circuits, seven trumpets." } },
      { ref: "Matthieu 18:22", note: { fr: "« Soixante-dix fois sept fois ».", en: "'Seventy times seven'." } },
      { ref: "Apocalypse 1:20", note: { fr: "Les sept églises d'Asie.", en: "The seven churches of Asia." } },
    ],
  },
  {
    id: "10",
    value: { fr: "10", en: "10" },
    textSays: {
      fr: "Dix plaies en Égypte, dix commandements écrits sur deux tables, la dîme fixée au dixième.",
      en: "Ten plagues in Egypt, Ten Commandments written on two tablets, the tithe set at a tenth.",
    },
    interpretation: {
      fr: "Lecture courante : le dix exprime un ensemble complet et mesurable. Le texte l'emploie surtout comme un compte concret.",
      en: "Common reading: ten expresses a complete, measurable set. The text mostly uses it as a plain count.",
    },
    examples: [
      { ref: "Exode 20:1-17", note: { fr: "Les dix paroles.", en: "The ten words." } },
      { ref: "Deutéronome 4:13", note: { fr: "« Les dix commandements ».", en: "'The ten commandments'." } },
      { ref: "Malachie 3:10", note: { fr: "La dîme apportée à la maison de Dieu.", en: "The tithe brought to God's house." } },
      { ref: "Matthieu 25:1", note: { fr: "Les dix vierges.", en: "The ten virgins." } },
    ],
  },
  {
    id: "12",
    value: { fr: "12", en: "12" },
    textSays: {
      fr: "Douze fils de Jacob, douze tribus, douze apôtres, douze portes de la nouvelle Jérusalem.",
      en: "Twelve sons of Jacob, twelve tribes, twelve apostles, twelve gates of the new Jerusalem.",
    },
    interpretation: {
      fr: "Interprétation traditionnelle : le douze représente le peuple de Dieu organisé. À noter que les listes de tribus varient (Lévi, Éphraïm, Manassé) : le chiffre est maintenu même quand les noms changent.",
      en: "Traditional reading: twelve represents God's organised people. Note that tribe lists vary (Levi, Ephraim, Manasseh): the number is kept even when the names change.",
    },
    examples: [
      { ref: "Genèse 35:22", note: { fr: "Les douze fils de Jacob.", en: "Jacob's twelve sons." } },
      { ref: "Luc 6:13", note: { fr: "Jésus choisit douze apôtres.", en: "Jesus chooses twelve apostles." } },
      { ref: "Apocalypse 21:12", note: { fr: "Douze portes, douze noms.", en: "Twelve gates, twelve names." } },
    ],
  },
  {
    id: "40",
    value: { fr: "40", en: "40" },
    textSays: {
      fr: "Quarante jours de pluie, quarante ans au désert, quarante jours de Moïse sur la montagne, d'Élie en route vers l'Horeb, de Jésus au désert.",
      en: "Forty days of rain, forty years in the wilderness, forty days for Moses on the mountain, for Elijah travelling to Horeb, for Jesus in the desert.",
    },
    interpretation: {
      fr: "Lecture traditionnelle : une durée d'épreuve, de préparation ou de génération. Le texte donne ces durées comme des faits sans en expliquer le symbolisme.",
      en: "Traditional reading: a span of testing, preparation or of one generation. The text reports these durations as facts without explaining any symbolism.",
    },
    examples: [
      { ref: "Genèse 7:12", note: { fr: "Quarante jours de pluie.", en: "Forty days of rain." } },
      { ref: "Exode 24:18", note: { fr: "Moïse quarante jours sur la montagne.", en: "Moses forty days on the mountain." } },
      { ref: "Nombres 14:33", note: { fr: "Quarante ans au désert.", en: "Forty years in the wilderness." } },
      { ref: "Matthieu 4:2", note: { fr: "Jésus jeûne quarante jours.", en: "Jesus fasts forty days." } },
    ],
  },
  {
    id: "70",
    value: { fr: "70", en: "70" },
    textSays: {
      fr: "Soixante-dix personnes descendent en Égypte ; soixante-dix anciens ; soixante-dix ans d'exil annoncés par Jérémie ; soixante-dix disciples envoyés ; « soixante-dix semaines » en Daniel 9.",
      en: "Seventy people go down to Egypt; seventy elders; seventy years of exile foretold by Jeremiah; seventy disciples sent out; 'seventy weeks' in Daniel 9.",
    },
    interpretation: {
      fr: "Les soixante-dix ans d'exil sont explicitement datés par le texte (Jérémie 25:11 ; Daniel 9:2). En revanche, l'interprétation des « soixante-dix semaines » de Daniel 9 varie entre écoles chrétiennes : plusieurs lectures existent et aucune n'est imposée par le texte lui-même.",
      en: "The seventy years of exile are explicitly dated by the text (Jeremiah 25:11; Daniel 9:2). How the 'seventy weeks' of Daniel 9 are read, however, varies between Christian schools: several readings exist and none is imposed by the text itself.",
    },
    examples: [
      { ref: "Exode 1:5", note: { fr: "Soixante-dix personnes en Égypte.", en: "Seventy people in Egypt." } },
      { ref: "Jérémie 25:11", note: { fr: "Soixante-dix ans annoncés.", en: "Seventy years foretold." } },
      { ref: "Daniel 9:24", note: { fr: "« Soixante-dix semaines ».", en: "'Seventy weeks'." } },
      { ref: "Luc 10:1", note: { fr: "Soixante-dix envoyés deux à deux.", en: "Seventy sent out two by two." } },
    ],
  },
  {
    id: "144000",
    value: { fr: "144 000", en: "144,000" },
    textSays: {
      fr: "L'Apocalypse mentionne 144 000 « marqués du sceau », douze mille de chacune des douze tribus (Ap 7:4-8), puis les décrit debout avec l'Agneau, chantant un cantique nouveau (Ap 14:1-5).",
      en: "Revelation mentions 144,000 'sealed', twelve thousand from each of the twelve tribes (Rev 7:4-8), then describes them standing with the Lamb, singing a new song (Rev 14:1-5).",
    },
    interpretation: {
      fr: "Ce nombre est interprété très diversement : total symbolique (12 × 12 × 1000) désignant l'ensemble du peuple de Dieu, ou groupe particulier de la fin des temps. Le texte ne tranche pas explicitement, et il faut se garder de présenter une lecture comme certaine.",
      en: "This number is read in very different ways: a symbolic total (12 × 12 × 1000) for God's whole people, or a particular end-time group. The text does not explicitly settle it, and no reading should be presented as certain.",
    },
    examples: [
      { ref: "Apocalypse 7:4", note: { fr: "Douze mille par tribu.", en: "Twelve thousand per tribe." } },
      { ref: "Apocalypse 14:1", note: { fr: "Debout avec l'Agneau.", en: "Standing with the Lamb." } },
      { ref: "Apocalypse 7:9", note: { fr: "Juste après : une foule que personne ne peut compter.", en: "Immediately after: a crowd no one can number." } },
    ],
  },
];

export function numberById(id: string): BibleNumber | undefined {
  return NUMBERS.find((n) => n.id === id);
}
