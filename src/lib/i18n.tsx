import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const dict = {
  appName: { fr: "Bible en Main", en: "Bible en Main" },
  eyebrow: { fr: "Étude biblique", en: "Bible study" },
  journey: { fr: "Parcours", en: "Journey" },
  lessons: { fr: "Leçons", en: "Lessons" },
  journal: { fr: "Journal", en: "Journal" },
  mentor: { fr: "Mentor", en: "Mentor" },
  nextStep: { fr: "Prochaine étape", en: "Next step" },
  continue: { fr: "Continuer", en: "Continue" },
  begin: { fr: "Commencer", en: "Begin" },
  completed: { fr: "Terminé", en: "Completed" },
  inProgress: { fr: "En cours", en: "In progress" },
  notStarted: { fr: "À découvrir", en: "Not started" },
  lesson: { fr: "Leçon", en: "Lesson" },
  readVerse: { fr: "Lire le verset", en: "Read the verse" },
  yourAnswer: { fr: "Votre réponse basée sur le texte…", en: "Your answer based on the text…" },
  chooseAnswer: { fr: "Choisissez la réponse du texte", en: "Choose the answer from the text" },
  goodAnswer: {
    fr: "C'est bien cela — le texte le dit ainsi.",
    en: "That's it — this is what the text says.",
  },
  tryAgain: {
    fr: "Relisez le verset et essayez encore, tranquillement.",
    en: "Read the verse again and try once more, gently.",
  },
  takeaway: { fr: "À retenir", en: "Takeaway" },
  explanation: { fr: "Explication complète", en: "Full explanation" },
  saved: { fr: "Réponse enregistrée", en: "Answer saved" },
  markComplete: { fr: "Marquer cette leçon comme terminée", en: "Mark this lesson complete" },
  answerAllFirst: {
    fr: "Répondez à toutes les questions pour marquer la leçon terminée — prenez votre temps.",
    en: "Answer every question to mark the lesson complete — take your time.",
  },

  lessonDone: { fr: "Leçon terminée. Merci pour ce temps passé.", en: "Lesson complete. Thank you for this time." },
  askMentor: { fr: "Une question pour votre mentor ?", en: "A question for your mentor?" },
  send: { fr: "Envoyer", en: "Send" },
  mentorNotes: { fr: "Échanges avec votre mentor", en: "Conversation with your mentor" },
  noMentor: {
    fr: "Vous n'êtes pas encore accompagné(e). Partagez votre code d'invitation avec un mentor.",
    en: "No mentor yet. Share your invitation code with a mentor.",
  },
  inviteCode: { fr: "Votre code d'invitation", en: "Your invitation code" },
  journalTitle: { fr: "Réflexions, prières, questions", en: "Reflections, prayers, questions" },
  newNote: { fr: "Écrire une note…", en: "Write a note…" },
  addNote: { fr: "Ajouter", en: "Add" },
  freeNote: { fr: "Note libre", en: "Freestanding note" },
  reflection: { fr: "Réflexion", en: "Reflection" },
  prayer: { fr: "Prière", en: "Prayer" },
  question: { fr: "Question", en: "Question" },
  baptismStep: { fr: "L'engagement du baptême", en: "The step of baptism" },
  baptismIntro: {
    fr: "Après avoir étudié le message de Jésus, où en est votre cœur ? Rien n'est décidé ici : cette page ouvre simplement une conversation.",
    en: "After studying the message of Jesus, where is your heart? Nothing is decided here: this page simply opens a conversation.",
  },
  baptismReflect: { fr: "Ce que je ressens aujourd'hui…", en: "What I feel today…" },
  baptismTalk: { fr: "Je souhaite parler du baptême", en: "I'd like to talk about baptism" },
  baptismLater: { fr: "J'ai encore des questions", en: "I still have questions" },
  baptismSent: {
    fr: "Votre demande a été transmise à votre mentor. Un être humain vous répondra — jamais une application.",
    en: "Your request was passed to your mentor. A human will reply — never an app.",
  },
  milestone: { fr: "Étape du baptême", en: "Baptism milestone" },
  milestoneLocked: {
    fr: "Cette étape s'ouvre après les leçons 1 à 22.",
    en: "This step opens after lessons 1 to 22.",
  },
  followUp: { fr: "Leçons 23 à 25 : consolidation", en: "Lessons 23 to 25: consolidation" },
  signIn: { fr: "Se connecter", en: "Sign in" },
  signUp: { fr: "Créer un compte", en: "Create an account" },
  signOut: { fr: "Se déconnecter", en: "Sign out" },
  email: { fr: "Adresse e-mail", en: "Email address" },
  password: { fr: "Mot de passe", en: "Password" },
  name: { fr: "Votre prénom", en: "Your first name" },
  withGoogle: { fr: "Continuer avec Google", en: "Continue with Google" },
  seekerRole: { fr: "Je suis en recherche", en: "I am a seeker" },
  mentorRole: { fr: "Je suis mentor", en: "I am a mentor" },
  seekers: { fr: "Personnes accompagnées", en: "People you accompany" },
  linkSeeker: { fr: "Lier un(e) étudiant(e) par code", en: "Link a student by code" },
  link: { fr: "Lier", en: "Link" },
  scheduleSession: { fr: "Prochaine rencontre", en: "Next session" },
  save: { fr: "Enregistrer", en: "Save" },
  reminders: { fr: "Rappel hebdomadaire", en: "Weekly reminder" },
  remindersHelp: {
    fr: "Un rappel doux dans l'application pour reprendre la leçon suivante.",
    en: "A gentle in-app reminder to pick up the next lesson.",
  },
  reminderDue: { fr: "Quand vous voulez : la leçon suivante vous attend.", en: "Whenever you're ready: the next lesson awaits." },
  admin: { fr: "Contenu", en: "Content" },
  adminHelp: {
    fr: "Modifiez les textes des leçons et des questions, en français et en anglais.",
    en: "Edit lesson and question texts, in French and English.",
  },
  loading: { fr: "Un instant…", en: "One moment…" },
  progressOf: { fr: "sur", en: "of" },
} as const;

export type Key = keyof typeof dict;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "fr",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem("bem-lang");
    if (stored === "en" || stored === "fr") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("bem-lang", l);
    document.documentElement.lang = l;
  }, []);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  const t = useCallback((key: Key) => dict[key][lang], [lang]);
  return { lang, setLang, t };
}
