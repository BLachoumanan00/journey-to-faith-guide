import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/android")({
  head: () => pageMeta("Android — Bible en Main", "Instructions Android Studio pour créer le fichier APK de Bible en Main et limites du mode hors ligne."),
  component: AndroidInstructions,
});

function AndroidInstructions() {
  const { lang } = useLang();
  const fr = lang === "fr";
  return <main className="mx-auto max-w-xl px-6 py-10 text-ink">
    <Link to="/" className="font-serif text-2xl text-ribbon">Bible en Main</Link>
    <h1 className="mt-8 font-serif text-3xl">{fr ? "Créer l’application Android" : "Build the Android app"}</h1>
    <ol className="mt-8 space-y-8 text-sm leading-7">
      <li><h2 className="font-serif text-xl">1. {fr ? "Préparer l’ordinateur" : "Prepare your computer"}</h2><p>{fr ? "Installez Node.js LTS, Git et Android Studio sur Windows, Mac ou Linux." : "Install Node.js LTS, Git and Android Studio on Windows, Mac or Linux."}</p><div className="flex flex-wrap gap-5 text-ribbon underline"><a href="https://nodejs.org">Node.js</a><a href="https://git-scm.com">Git</a><a href="https://developer.android.com/studio">Android Studio</a></div></li>
      <li><h2 className="font-serif text-xl">2. {fr ? "Récupérer le projet" : "Get the project"}</h2><p>{fr ? "Dans Lovable, connectez GitHub et récupérez le dépôt sur votre ordinateur. Dans le dossier du projet, ouvrez un terminal et exécutez :" : "In Lovable, connect GitHub and download the repository to your computer. Open a terminal in the project folder and run:"}</p><pre className="overflow-x-auto rounded-md bg-card p-4 text-foreground">npm install</pre></li>
      <li><h2 className="font-serif text-xl">3. {fr ? "Ouvrir le projet Android" : "Open the Android project"}</h2><pre className="overflow-x-auto rounded-md bg-card p-4 text-foreground">{"npx cap add android\nnpx cap sync android\nnpx cap open android"}</pre><p>{fr ? "Si le dossier android existe déjà, passez la première commande." : "If the android folder already exists, skip the first command."}</p></li>
      <li><h2 className="font-serif text-xl">4. {fr ? "Créer le fichier APK" : "Create the APK"}</h2><p>{fr ? "Dans Android Studio, ouvrez Build → Build Bundle(s) / APK(s) → Build APK(s). Cliquez sur locate et copiez app-debug.apk sur votre téléphone. Autorisez l’installation depuis cette source lorsque le téléphone le demande." : "In Android Studio, open Build → Build Bundle(s) / APK(s) → Build APK(s). Click locate and copy app-debug.apk to your phone. Allow installation from this source when prompted."}</p></li>
    </ol>
    <section className="mt-10 border-t border-border pt-6 text-sm leading-7"><h2 className="font-serif text-xl">{fr ? "Connexion et mode hors ligne" : "Connection and offline mode"}</h2><p className="mt-3">{fr ? "L’application Android ouvre la version publiée. La première ouverture et la connexion au compte nécessitent internet. Les contenus publics et les versets déjà consultés peuvent être conservés sur l’appareil ; les nouveaux versets, l’IA, les réponses, les notes et les pages privées nécessitent une connexion." : "The Android app opens the published version. First launch and account sign-in require internet. Public material and previously viewed verses may be saved on the device; new verses, AI, answers, notes and private pages require a connection."}</p><p className="mt-3">{fr ? "Le fonctionnement hors ligne complet des leçons après connexion doit encore être vérifié sur le téléphone. Ce fichier APK ne contient pas une Bible complète ni toutes les leçons préchargées." : "Offline lesson access after sign-in still needs testing on your phone. This APK does not bundle a complete Bible or preload all lessons."}</p><p className="mt-3">{fr ? "Les mises à jour publiées sont accessibles avec internet sans recréer l’APK. Pour l’icône Android : res → New → Image Asset dans Android Studio." : "Published updates are available online without rebuilding the APK. For the Android icon: res → New → Image Asset in Android Studio."}</p></section>
    <Button asChild variant="outline" className="mt-6"><a href="/android-instructions.md" download><Download />{fr ? "Télécharger les instructions" : "Download instructions"}</a></Button>
  </main>;
}