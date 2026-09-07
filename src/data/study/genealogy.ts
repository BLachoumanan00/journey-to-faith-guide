import type { GenealogyLine } from "./types";

/**
 * Genealogical lines. Only relationships the biblical text states are recorded;
 * where the text is compressed, incomplete, or where two accounts differ, the
 * `caution` field says so instead of harmonising silently.
 */
export const GENEALOGIES: GenealogyLine[] = [
  {
    id: "adam-noah",
    title: { fr: "D'Adam à Noé", en: "From Adam to Noah" },
    intro: {
      fr: "Genèse 5 donne dix générations d'Adam à Noé par la ligne de Seth.",
      en: "Genesis 5 lists ten generations from Adam to Noah through the line of Seth.",
    },
    refs: ["Genèse 4:25", "Genèse 5:1-32", "Luc 3:36-38"],
    roots: ["adam"],
    caution: {
      fr: "Les âges de Genèse 5 sont donnés par le texte. Savoir si la liste est complète ou sélective est discuté : les généalogies bibliques omettent parfois des générations.",
      en: "The ages in Genesis 5 are given by the text. Whether the list is complete or selective is debated: biblical genealogies sometimes omit generations.",
    },
    nodes: [
      { id: "adam", name: { fr: "Adam", en: "Adam" }, spouses: [{ fr: "Ève", en: "Eve" }], children: ["cain", "abel", "seth"], note: { fr: "Le premier homme ; le texte mentionne aussi d'autres fils et filles.", en: "The first man; the text also mentions other sons and daughters." }, refs: ["Genèse 5:4"] },
      { id: "cain", name: { fr: "Caïn", en: "Cain" }, parents: ["adam"], note: { fr: "Aîné ; sa lignée est donnée séparément en Genèse 4.", en: "The eldest; his line is given separately in Genesis 4." }, refs: ["Genèse 4:17"] },
      { id: "abel", name: { fr: "Abel", en: "Abel" }, parents: ["adam"], note: { fr: "Tué par son frère ; sans descendance mentionnée.", en: "Killed by his brother; no descendants mentioned." }, refs: ["Genèse 4:8"] },
      { id: "seth", name: { fr: "Seth", en: "Seth" }, parents: ["adam"], children: ["enosh"], note: { fr: "Né après la mort d'Abel ; la lignée de la promesse passe par lui.", en: "Born after Abel's death; the line of promise runs through him." }, refs: ["Genèse 4:25", "Genèse 5:3"] },
      { id: "enosh", name: { fr: "Énosch", en: "Enosh" }, parents: ["seth"], children: ["kenan"], note: { fr: "« Alors on commença à invoquer le nom de l'Éternel ».", en: "'Then people began to call on the name of the Lord'." }, refs: ["Genèse 4:26"] },
      { id: "kenan", name: { fr: "Kénan", en: "Kenan" }, parents: ["enosh"], children: ["mahalalel"], note: { fr: "Quatrième génération depuis Adam.", en: "Fourth generation from Adam." }, refs: ["Genèse 5:9"] },
      { id: "mahalalel", name: { fr: "Mahalaleel", en: "Mahalalel" }, parents: ["kenan"], children: ["jared"], note: { fr: "Mentionné uniquement dans les listes.", en: "Mentioned only in the lists." }, refs: ["Genèse 5:12"] },
      { id: "jared", name: { fr: "Jéred", en: "Jared" }, parents: ["mahalalel"], children: ["enoch"], note: { fr: "Père d'Énoch.", en: "Father of Enoch." }, refs: ["Genèse 5:15"] },
      { id: "enoch", name: { fr: "Énoch", en: "Enoch" }, parents: ["jared"], children: ["methuselah"], note: { fr: "« Il marcha avec Dieu » et fut enlevé sans mourir.", en: "'He walked with God' and was taken without dying." }, refs: ["Genèse 5:24", "Hébreux 11:5"] },
      { id: "methuselah", name: { fr: "Metuschélah", en: "Methuselah" }, parents: ["enoch"], children: ["lamech"], note: { fr: "L'âge le plus élevé du texte : 969 ans.", en: "The greatest age in the text: 969 years." }, refs: ["Genèse 5:27"] },
      { id: "lamech", name: { fr: "Lémec", en: "Lamech" }, parents: ["methuselah"], children: ["noah"], note: { fr: "Père de Noé ; à distinguer du Lémec de la lignée de Caïn.", en: "Father of Noah; not the Lamech of Cain's line." }, refs: ["Genèse 5:28-29"] },
      { id: "noah", name: { fr: "Noé", en: "Noah" }, parents: ["lamech"], children: ["shem", "ham", "japheth"], note: { fr: "Sauvé du déluge avec sa famille.", en: "Saved from the flood with his family." }, refs: ["Genèse 6:9"] },
      { id: "shem", name: { fr: "Sem", en: "Shem" }, parents: ["noah"], children: [], note: { fr: "Ancêtre des peuples sémitiques, dont Abraham.", en: "Ancestor of the Semitic peoples, including Abraham." }, refs: ["Genèse 10:21", "Genèse 11:10"] },
      { id: "ham", name: { fr: "Cham", en: "Ham" }, parents: ["noah"], note: { fr: "Ancêtre notamment de Canaan, Cusch et Mitsraïm.", en: "Ancestor of Canaan, Cush and Mizraim among others." }, refs: ["Genèse 10:6"] },
      { id: "japheth", name: { fr: "Japhet", en: "Japheth" }, parents: ["noah"], note: { fr: "Ancêtre de peuples du nord et de l'ouest selon Genèse 10.", en: "Ancestor of northern and western peoples in Genesis 10." }, refs: ["Genèse 10:2"] },
    ],
  },
  {
    id: "abraham-family",
    title: { fr: "La famille d'Abraham", en: "Abraham's family" },
    intro: {
      fr: "D'Abraham naissent deux lignées : Ismaël par Agar, Isaac par Sara — puis Isaac a deux fils, Ésaü et Jacob.",
      en: "Two lines come from Abraham: Ishmael through Hagar, Isaac through Sarah — then Isaac has two sons, Esau and Jacob.",
    },
    refs: ["Genèse 16:15", "Genèse 21:3", "Genèse 25:9", "Genèse 25:24-26"],
    roots: ["terah"],
    nodes: [
      { id: "terah", name: { fr: "Térach", en: "Terah" }, children: ["abraham"], note: { fr: "Père d'Abraham ; parti d'Ur pour Charan.", en: "Abraham's father; left Ur for Haran." }, refs: ["Genèse 11:31"] },
      { id: "abraham", name: { fr: "Abraham", en: "Abraham" }, parents: ["terah"], spouses: [{ fr: "Sara ; Agar ; Ketura", en: "Sarah; Hagar; Keturah" }], children: ["ishmael", "isaac"], note: { fr: "Père des croyants selon Romains 4.", en: "Father of believers according to Romans 4." }, refs: ["Genèse 17:5", "Genèse 25:1"] },
      { id: "ishmael", name: { fr: "Ismaël", en: "Ishmael" }, parents: ["abraham"], note: { fr: "Fils d'Agar ; Dieu promet de le bénir aussi (Genèse 21:18).", en: "Hagar's son; God promises to bless him too (Genesis 21:18)." }, refs: ["Genèse 16:15", "Genèse 25:16"] },
      { id: "isaac", name: { fr: "Isaac", en: "Isaac" }, parents: ["abraham"], spouses: [{ fr: "Rebecca", en: "Rebekah" }], children: ["esau", "jacob"], note: { fr: "Le fils de la promesse.", en: "The son of promise." }, refs: ["Genèse 21:3", "Genèse 24:67"] },
      { id: "esau", name: { fr: "Ésaü (Édom)", en: "Esau (Edom)" }, parents: ["isaac"], note: { fr: "Aîné jumeau ; ancêtre des Édomites.", en: "The elder twin; ancestor of the Edomites." }, refs: ["Genèse 25:25", "Genèse 36:1"] },
      { id: "jacob", name: { fr: "Jacob (Israël)", en: "Jacob (Israel)" }, parents: ["isaac"], spouses: [{ fr: "Léa, Rachel, Bilha, Zilpa", en: "Leah, Rachel, Bilhah, Zilpah" }], children: [], note: { fr: "Père des douze tribus.", en: "Father of the twelve tribes." }, refs: ["Genèse 32:29", "Genèse 35:23-26"] },
    ],
  },
  {
    id: "twelve-tribes",
    title: { fr: "Jacob et les douze tribus", en: "Jacob and the twelve tribes" },
    intro: {
      fr: "Les douze fils de Jacob, avec leurs mères, deviennent les tribus d'Israël (Genèse 35:23-26).",
      en: "Jacob's twelve sons, with their mothers, become the tribes of Israel (Genesis 35:23-26).",
    },
    refs: ["Genèse 29:32-35", "Genèse 30:1-24", "Genèse 35:18", "Genèse 49:1-28"],
    roots: ["jacob"],
    caution: {
      fr: "Les listes des « douze tribus » varient selon les textes : Lévi n'a pas de territoire, et Joseph est parfois compté comme deux tribus, Éphraïm et Manassé (Josué 14:4 ; Apocalypse 7:5-8).",
      en: "Lists of the 'twelve tribes' vary between texts: Levi has no territory, and Joseph is sometimes counted as two tribes, Ephraim and Manasseh (Joshua 14:4; Revelation 7:5-8).",
    },
    nodes: [
      { id: "jacob", name: { fr: "Jacob", en: "Jacob" }, children: ["reuben", "simeon", "levi", "judah", "dan", "naphtali", "gad", "asher", "issachar", "zebulun", "joseph", "benjamin"], note: { fr: "Douze fils de quatre mères.", en: "Twelve sons by four mothers." }, refs: ["Genèse 35:22"] },
      { id: "reuben", name: { fr: "Ruben", en: "Reuben" }, parents: ["jacob"], tribe: { fr: "Fils de Léa", en: "Son of Leah" }, note: { fr: "Aîné ; perd son droit d'aînesse.", en: "The firstborn; loses his birthright." }, refs: ["Genèse 49:3-4"] },
      { id: "simeon", name: { fr: "Siméon", en: "Simeon" }, parents: ["jacob"], tribe: { fr: "Fils de Léa", en: "Son of Leah" }, note: { fr: "Réprimandé avec Lévi pour sa violence.", en: "Rebuked with Levi for violence." }, refs: ["Genèse 49:5"] },
      { id: "levi", name: { fr: "Lévi", en: "Levi" }, parents: ["jacob"], tribe: { fr: "Fils de Léa", en: "Son of Leah" }, note: { fr: "Tribu sacerdotale, sans territoire propre.", en: "The priestly tribe, with no territory of its own." }, refs: ["Nombres 18:20"] },
      { id: "judah", name: { fr: "Juda", en: "Judah" }, parents: ["jacob"], tribe: { fr: "Fils de Léa", en: "Son of Leah" }, note: { fr: "Tribu royale : David et Jésus en descendent.", en: "The royal tribe: David and Jesus descend from him." }, refs: ["Genèse 49:10", "Hébreux 7:14"] },
      { id: "dan", name: { fr: "Dan", en: "Dan" }, parents: ["jacob"], tribe: { fr: "Fils de Bilha", en: "Son of Bilhah" }, note: { fr: "Tribu de Samson.", en: "Samson's tribe." }, refs: ["Genèse 30:6", "Juges 13:2"] },
      { id: "naphtali", name: { fr: "Nephthali", en: "Naphtali" }, parents: ["jacob"], tribe: { fr: "Fils de Bilha", en: "Son of Bilhah" }, note: { fr: "Territoire du nord, autour du lac.", en: "Northern territory around the lake." }, refs: ["Genèse 30:8", "Matthieu 4:13"] },
      { id: "gad", name: { fr: "Gad", en: "Gad" }, parents: ["jacob"], tribe: { fr: "Fils de Zilpa", en: "Son of Zilpah" }, note: { fr: "Installé à l'est du Jourdain.", en: "Settled east of the Jordan." }, refs: ["Genèse 30:11", "Nombres 32:34"] },
      { id: "asher", name: { fr: "Aser", en: "Asher" }, parents: ["jacob"], tribe: { fr: "Fils de Zilpa", en: "Son of Zilpah" }, note: { fr: "Terre fertile du nord-ouest ; tribu d'Anne (Luc 2:36).", en: "Fertile north-west land; Anna's tribe (Luke 2:36)." }, refs: ["Genèse 30:13"] },
      { id: "issachar", name: { fr: "Issacar", en: "Issachar" }, parents: ["jacob"], tribe: { fr: "Fils de Léa", en: "Son of Leah" }, note: { fr: "Plaine de Jizreel.", en: "The Jezreel plain." }, refs: ["Genèse 30:18"] },
      { id: "zebulun", name: { fr: "Zabulon", en: "Zebulun" }, parents: ["jacob"], tribe: { fr: "Fils de Léa", en: "Son of Leah" }, note: { fr: "Région de Nazareth ; citée en Ésaïe 9:1.", en: "The Nazareth region; cited in Isaiah 9:1." }, refs: ["Genèse 30:20"] },
      { id: "joseph", name: { fr: "Joseph", en: "Joseph" }, parents: ["jacob"], tribe: { fr: "Fils de Rachel", en: "Son of Rachel" }, children: ["manasseh", "ephraim"], note: { fr: "Compté comme deux tribus par ses fils.", en: "Counted as two tribes through his sons." }, refs: ["Genèse 48:5"] },
      { id: "manasseh", name: { fr: "Manassé", en: "Manasseh" }, parents: ["joseph"], note: { fr: "Aîné de Joseph, béni en second par Jacob.", en: "Joseph's elder son, blessed second by Jacob." }, refs: ["Genèse 48:14"] },
      { id: "ephraim", name: { fr: "Éphraïm", en: "Ephraim" }, parents: ["joseph"], note: { fr: "Tribu dominante du royaume du Nord.", en: "The leading tribe of the northern kingdom." }, refs: ["Genèse 48:19"] },
      { id: "benjamin", name: { fr: "Benjamin", en: "Benjamin" }, parents: ["jacob"], tribe: { fr: "Fils de Rachel", en: "Son of Rachel" }, note: { fr: "Tribu de Saül et de l'apôtre Paul.", en: "The tribe of Saul and of the apostle Paul." }, refs: ["Genèse 35:18", "Romains 11:1"] },
    ],
  },
  {
    id: "judah-david",
    title: { fr: "De Juda à David", en: "From Judah to David" },
    intro: {
      fr: "La lignée royale suivie par Ruth 4 et par Matthieu 1 : de Juda à David en dix générations.",
      en: "The royal line traced in Ruth 4 and Matthew 1: from Judah to David in ten generations.",
    },
    refs: ["Genèse 38:29", "Ruth 4:18-22", "1 Chroniques 2:3-15", "Matthieu 1:3-6"],
    roots: ["judah"],
    caution: {
      fr: "Cette liste est probablement condensée : dix noms couvrent l'ensemble du séjour en Égypte, l'Exode et la période des juges.",
      en: "This list is probably compressed: ten names cover the whole stay in Egypt, the Exodus and the era of the judges.",
    },
    nodes: [
      { id: "judah", name: { fr: "Juda", en: "Judah" }, children: ["perez"], spouses: [{ fr: "Tamar (belle-fille)", en: "Tamar (daughter-in-law)" }], note: { fr: "Pérets naît de Tamar, dans une histoire que la Bible ne dissimule pas.", en: "Perez is born to Tamar, in a story the Bible does not conceal." }, refs: ["Genèse 38:29"] },
      { id: "perez", name: { fr: "Pérets", en: "Perez" }, parents: ["judah"], children: ["hezron"], note: { fr: "Fils de Juda et de Tamar.", en: "Son of Judah and Tamar." }, refs: ["Ruth 4:18"] },
      { id: "hezron", name: { fr: "Hetsron", en: "Hezron" }, parents: ["perez"], children: ["ram"], note: { fr: "Chef de clan en Juda.", en: "A clan head in Judah." }, refs: ["Nombres 26:21"] },
      { id: "ram", name: { fr: "Ram", en: "Ram" }, parents: ["hezron"], children: ["amminadab"], note: { fr: "Nommé dans les deux généalogies royales.", en: "Named in both royal genealogies." }, refs: ["Ruth 4:19"] },
      { id: "amminadab", name: { fr: "Amminadab", en: "Amminadab" }, parents: ["ram"], children: ["nahshon"], note: { fr: "Génération de l'Exode selon Nombres 1:7.", en: "Of the Exodus generation according to Numbers 1:7." }, refs: ["Nombres 1:7"] },
      { id: "nahshon", name: { fr: "Nachschon", en: "Nahshon" }, parents: ["amminadab"], children: ["salmon"], note: { fr: "Prince de Juda au désert.", en: "Prince of Judah in the wilderness." }, refs: ["Nombres 7:12"] },
      { id: "salmon", name: { fr: "Salmon", en: "Salmon" }, parents: ["nahshon"], children: ["boaz"], spouses: [{ fr: "Rahab (Matthieu 1:5)", en: "Rahab (Matthew 1:5)" }], note: { fr: "Matthieu le relie à Rahab de Jéricho.", en: "Matthew links him to Rahab of Jericho." }, refs: ["Matthieu 1:5"] },
      { id: "boaz", name: { fr: "Boaz", en: "Boaz" }, parents: ["salmon"], spouses: [{ fr: "Ruth la Moabite", en: "Ruth the Moabite" }], children: ["obed"], note: { fr: "Le « rédempteur » de Ruth.", en: "Ruth's kinsman-redeemer." }, refs: ["Ruth 4:13"] },
      { id: "obed", name: { fr: "Obed", en: "Obed" }, parents: ["boaz"], children: ["jesse"], note: { fr: "Grand-père de David.", en: "David's grandfather." }, refs: ["Ruth 4:17"] },
      { id: "jesse", name: { fr: "Isaï", en: "Jesse" }, parents: ["obed"], children: ["david"], note: { fr: "Père de huit fils, dont David.", en: "Father of eight sons, including David." }, refs: ["1 Samuel 16:10"] },
      { id: "david", name: { fr: "David", en: "David" }, parents: ["jesse"], children: [], note: { fr: "Roi ; la promesse d'un trône éternel lui est faite.", en: "King; the promise of an everlasting throne is given to him." }, refs: ["2 Samuel 7:16"] },
    ],
  },
  {
    id: "david-kings",
    title: { fr: "David, Salomon et les rois de Juda", en: "David, Solomon and the kings of Judah" },
    intro: {
      fr: "La dynastie davidique à Jérusalem, de Salomon jusqu'à l'exil babylonien.",
      en: "The Davidic dynasty in Jerusalem, from Solomon to the Babylonian exile.",
    },
    refs: ["2 Samuel 5:14", "1 Rois 11:43", "2 Rois 24:15", "Matthieu 1:7-11"],
    roots: ["david"],
    caution: {
      fr: "Les rois du royaume du Nord (Israël) ne forment pas une seule dynastie : plusieurs familles s'y succèdent par coups d'État, et les généalogies y sont beaucoup moins complètes.",
      en: "The kings of the northern kingdom (Israel) are not one dynasty: several families succeed one another by coups, and genealogies there are far less complete.",
    },
    nodes: [
      { id: "david", name: { fr: "David", en: "David" }, children: ["absalom", "solomon", "nathan_son_of_david"], note: { fr: "Plusieurs épouses et de nombreux enfants.", en: "Several wives and many children." }, refs: ["2 Samuel 3:2-5"] },
      { id: "absalom", name: { fr: "Absalom", en: "Absalom" }, parents: ["david"], note: { fr: "Fils révolté, mort avant son père.", en: "A rebellious son who died before his father." }, refs: ["2 Samuel 18:33"] },
      { id: "nathan_son_of_david", name: { fr: "Nathan (fils de David)", en: "Nathan (son of David)" }, parents: ["david"], note: { fr: "La généalogie de Luc 3 passe par lui, non par Salomon.", en: "Luke 3's genealogy runs through him, not through Solomon." }, refs: ["Luc 3:31", "2 Samuel 5:14"] },
      { id: "solomon", name: { fr: "Salomon", en: "Solomon" }, parents: ["david"], children: ["rehoboam"], note: { fr: "Fils de Bath-Schéba ; bâtisseur du temple.", en: "Bathsheba's son; builder of the temple." }, refs: ["2 Samuel 12:24"] },
      { id: "rehoboam", name: { fr: "Roboam", en: "Rehoboam" }, parents: ["solomon"], children: [], note: { fr: "Sous son règne le royaume se divise.", en: "The kingdom divides under his reign." }, refs: ["1 Rois 12:16"] },
      { id: "jehoshaphat", name: { fr: "Josaphat", en: "Jehoshaphat" }, parents: ["rehoboam"], children: ["uzziah"], note: { fr: "Roi réformateur ; la liste de Matthieu 1 est abrégée entre ces noms.", en: "A reforming king; Matthew 1's list is abbreviated between these names." }, refs: ["2 Chroniques 17:3", "Matthieu 1:8"], certainty: "biblical" },
      { id: "uzziah", name: { fr: "Ozias", en: "Uzziah" }, parents: ["jehoshaphat"], children: ["hezekiah"], note: { fr: "Roi puissant, frappé de lèpre pour son orgueil. Matthieu saute plusieurs rois avant lui.", en: "A powerful king struck with leprosy for his pride. Matthew omits several kings before him." }, refs: ["2 Chroniques 26:16", "Ésaïe 6:1"], certainty: "disputed" },
      { id: "hezekiah", name: { fr: "Ézéchias", en: "Hezekiah" }, parents: ["uzziah"], children: ["josiah"], note: { fr: "Roi de la réforme et du siège de Jérusalem.", en: "King of the reform and of the siege of Jerusalem." }, refs: ["2 Rois 18:5"] },
      { id: "josiah", name: { fr: "Josias", en: "Josiah" }, parents: ["hezekiah"], children: ["jehoiachin", "zedekiah"], note: { fr: "Dernier grand roi fidèle de Juda.", en: "Judah's last great faithful king." }, refs: ["2 Rois 23:25"] },
      { id: "jehoiachin", name: { fr: "Jojakin", en: "Jehoiachin" }, parents: ["josiah"], children: ["shealtiel"], note: { fr: "Déporté à Babylone ; petit-fils de Josias selon 2 Rois 24.", en: "Deported to Babylon; Josiah's grandson according to 2 Kings 24." }, refs: ["2 Rois 24:15", "Matthieu 1:11"], certainty: "disputed" },
      { id: "zedekiah", name: { fr: "Sédécias", en: "Zedekiah" }, parents: ["josiah"], note: { fr: "Dernier roi de Juda ; Jérusalem tombe en 586 av. J.-C.", en: "The last king of Judah; Jerusalem falls in 586 BC." }, refs: ["2 Rois 25:7"] },
      { id: "shealtiel", name: { fr: "Schealthiel", en: "Shealtiel" }, parents: ["jehoiachin"], children: ["zerubbabel"], note: { fr: "Génération de l'exil.", en: "Of the exile generation." }, refs: ["Matthieu 1:12"] },
      { id: "zerubbabel", name: { fr: "Zorobabel", en: "Zerubbabel" }, parents: ["shealtiel"], note: { fr: "Conduit le retour et rebâtit le temple ; présent dans les deux généalogies de Jésus.", en: "Leads the return and rebuilds the temple; appears in both genealogies of Jesus." }, refs: ["Esdras 3:2", "Matthieu 1:13", "Luc 3:27"] },
    ],
  },
  {
    id: "jesus-matthew",
    title: { fr: "Généalogie de Jésus — Matthieu 1", en: "Genealogy of Jesus — Matthew 1" },
    intro: {
      fr: "Matthieu part d'Abraham et descend jusqu'à Joseph, en trois séries de quatorze générations, par la lignée royale de Salomon. Il inclut quatre femmes : Tamar, Rahab, Ruth et « la femme d'Urie ».",
      en: "Matthew begins with Abraham and comes down to Joseph in three sets of fourteen generations, through Solomon's royal line. He includes four women: Tamar, Rahab, Ruth and 'the wife of Uriah'.",
    },
    refs: ["Matthieu 1:1-17"],
    roots: ["abraham"],
    caution: {
      fr: "Matthieu écrit lui-même en trois groupes de quatorze : il omet volontairement des rois connus (voir 1 Ch 3). Le mot « engendra » peut donc signifier « fut l'ancêtre de ».",
      en: "Matthew himself writes in three groups of fourteen: he deliberately omits known kings (compare 1 Chr 3). So 'begot' can mean 'was the ancestor of'.",
    },
    nodes: [
      { id: "abraham", name: { fr: "Abraham", en: "Abraham" }, children: ["isaac"], note: { fr: "Point de départ : Jésus est « fils d'Abraham ».", en: "Starting point: Jesus is 'son of Abraham'." }, refs: ["Matthieu 1:2"] },
      { id: "isaac", name: { fr: "Isaac", en: "Isaac" }, parents: ["abraham"], children: ["jacob"], note: { fr: "Deuxième patriarche.", en: "The second patriarch." }, refs: ["Matthieu 1:2"] },
      { id: "jacob", name: { fr: "Jacob", en: "Jacob" }, parents: ["isaac"], children: ["judah"], note: { fr: "Père des douze tribus.", en: "Father of the twelve tribes." }, refs: ["Matthieu 1:2"] },
      { id: "judah", name: { fr: "Juda", en: "Judah" }, parents: ["jacob"], children: ["david"], note: { fr: "La suite Juda → David est détaillée dans la lignée royale.", en: "The Judah → David steps are detailed in the royal line." }, refs: ["Matthieu 1:3-6"] },
      { id: "david", name: { fr: "David", en: "David" }, parents: ["judah"], children: ["solomon"], note: { fr: "Le roi : Jésus est aussi « fils de David ».", en: "The king: Jesus is also 'son of David'." }, refs: ["Matthieu 1:6"] },
      { id: "solomon", name: { fr: "Salomon", en: "Solomon" }, parents: ["david"], children: ["zerubbabel"], note: { fr: "Matthieu suit la lignée du trône, résumée jusqu'à l'exil.", en: "Matthew follows the throne line, summarised down to the exile." }, refs: ["Matthieu 1:7-11"] },
      { id: "zerubbabel", name: { fr: "Zorobabel", en: "Zerubbabel" }, parents: ["solomon"], children: ["joseph_nazareth"], note: { fr: "Après l'exil ; puis plusieurs générations peu connues jusqu'à Joseph.", en: "After the exile; then several little-known generations down to Joseph." }, refs: ["Matthieu 1:12-16"] },
      { id: "joseph_nazareth", name: { fr: "Joseph", en: "Joseph" }, parents: ["zerubbabel"], spouses: [{ fr: "Marie", en: "Mary" }], children: ["jesus"], note: { fr: "Matthieu précise « Joseph, l'époux de Marie, de laquelle est né Jésus » : la filiation est légale, non biologique.", en: "Matthew says 'Joseph, the husband of Mary, of whom Jesus was born': the sonship is legal, not biological." }, refs: ["Matthieu 1:16"] },
      { id: "jesus", name: { fr: "Jésus", en: "Jesus" }, parents: ["joseph_nazareth"], note: { fr: "« Appelé Christ ».", en: "'Called Christ'." }, refs: ["Matthieu 1:16"] },
    ],
  },
  {
    id: "jesus-luke",
    title: { fr: "Généalogie de Jésus — Luc 3", en: "Genealogy of Jesus — Luke 3" },
    intro: {
      fr: "Luc remonte de Jésus jusqu'à Adam et à Dieu, par Nathan, un autre fils de David. Il place la liste au baptême de Jésus, non à sa naissance.",
      en: "Luke goes back from Jesus to Adam and to God, through Nathan, another son of David. He places the list at Jesus' baptism, not at his birth.",
    },
    refs: ["Luc 3:23-38"],
    roots: ["jesus"],
    caution: {
      fr: "Les deux listes diffèrent entre David et Joseph. Les principales lectures proposées : (1) Matthieu donne la lignée légale de Joseph et Luc sa lignée biologique ; (2) Luc donne la lignée de Marie, Héli étant son père ; (3) l'une des listes suit le droit de succession au trône. Aucune de ces explications n'est certaine, et le texte ne tranche pas. Luc écrit d'ailleurs « étant, à ce que l'on croyait, fils de Joseph » (Luc 3:23).",
      en: "The two lists differ between David and Joseph. The main readings proposed: (1) Matthew gives Joseph's legal line and Luke his biological line; (2) Luke gives Mary's line, with Heli as her father; (3) one list follows the right of succession to the throne. None of these is certain, and the text does not settle it. Luke himself writes 'being, as was supposed, the son of Joseph' (Luke 3:23).",
    },
    nodes: [
      { id: "jesus", name: { fr: "Jésus", en: "Jesus" }, parents: ["joseph_nazareth"], note: { fr: "« Étant, à ce que l'on croyait, fils de Joseph ».", en: "'Being, as was supposed, the son of Joseph'." }, refs: ["Luc 3:23"] },
      { id: "joseph_nazareth", name: { fr: "Joseph", en: "Joseph" }, parents: ["heli"], children: ["jesus"], note: { fr: "Luc le rattache à Héli, là où Matthieu nomme Jacob comme père de Joseph.", en: "Luke links him to Heli, where Matthew names Jacob as Joseph's father." }, refs: ["Luc 3:23", "Matthieu 1:16"], certainty: "disputed" },
      { id: "heli", name: { fr: "Héli", en: "Heli" }, parents: ["nathan_son_of_david"], children: ["joseph_nazareth"], note: { fr: "Certains y voient le père de Marie ; c'est une interprétation, non une affirmation du texte.", en: "Some read him as Mary's father; that is an interpretation, not a statement of the text." }, refs: ["Luc 3:23"], certainty: "disputed" },
      { id: "nathan_son_of_david", name: { fr: "Nathan", en: "Nathan" }, parents: ["david"], children: ["heli"], note: { fr: "Fils de David — la branche non royale.", en: "A son of David — the non-royal branch." }, refs: ["Luc 3:31", "2 Samuel 5:14"] },
      { id: "david", name: { fr: "David", en: "David" }, parents: ["abraham"], children: ["nathan_son_of_david"], note: { fr: "Les deux généalogies se rejoignent en David.", en: "Both genealogies meet at David." }, refs: ["Luc 3:31"] },
      { id: "abraham", name: { fr: "Abraham", en: "Abraham" }, parents: ["noah"], children: ["david"], note: { fr: "Luc poursuit au-delà d'Abraham, ce que Matthieu ne fait pas.", en: "Luke continues beyond Abraham, which Matthew does not." }, refs: ["Luc 3:34"] },
      { id: "noah", name: { fr: "Noé", en: "Noah" }, parents: ["adam"], children: ["abraham"], note: { fr: "Par Sem.", en: "Through Shem." }, refs: ["Luc 3:36"] },
      { id: "adam", name: { fr: "Adam", en: "Adam" }, children: ["noah"], note: { fr: "« Fils de Dieu » : Luc relie Jésus à toute l'humanité.", en: "'Son of God': Luke links Jesus to all humanity." }, refs: ["Luc 3:38"] },
    ],
  },
];

export function genealogyById(id: string): GenealogyLine | undefined {
  return GENEALOGIES.find((g) => g.id === id);
}
