# Créer l'application Android (.apk) de Bible en Main

Durée : environ 15 minutes. Il faut un ordinateur (Windows, Mac ou Linux).

## 1. Préparer l'ordinateur
- Installer **Node.js** (version LTS) : https://nodejs.org
- Installer **Android Studio** (gratuit) : https://developer.android.com/studio
- Installer **Git** : https://git-scm.com

## 2. Récupérer le code
Dans Lovable, cliquer sur **GitHub → Connecter** pour envoyer le projet sur GitHub, puis sur l'ordinateur :

```
git clone <adresse-de-votre-dépôt>
cd <nom-du-dossier>
npm install
```

## 3. Créer le projet Android
```
npx cap add android
npx cap sync android
npx cap open android
```
Android Studio s'ouvre avec le projet.

## 4. Fabriquer le fichier .apk
Dans Android Studio : menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
Quand c'est fini, cliquer sur **locate** : le fichier `app-debug.apk` est prêt.
Copiez-le sur un téléphone Android et ouvrez-le pour l'installer
(autoriser « sources inconnues » si le téléphone le demande).

## 5. Pour Google Play (facultatif)
Menu **Build → Generate Signed Bundle / APK**, choisir **Android App Bundle**,
créer une clé de signature (à conserver précieusement), puis envoyer le fichier
`.aab` sur https://play.google.com/console (compte développeur : 25 $ une fois).

## À savoir
- L'application ouvre la version publiée de Bible en Main : une connexion internet est nécessaire.
- Pensez à **publier** l'application dans Lovable avant : chaque mise à jour publiée apparaît automatiquement dans l'app Android, sans refaire l'.apk.
- Pour changer l'icône : dans Android Studio, clic droit sur `res` → **New → Image Asset**, et choisir l'icône de Bible en Main.

## Mode hors ligne (partiel)

L'application garde en mémoire les pages, leçons et versets déjà ouverts. Sans internet, vous pouvez les relire.
Il faut une connexion pour : la première ouverture, enregistrer des réponses ou des notes, poser une question à l'IA, et chercher un nouveau verset.
Important : publiez l'application avant de créer l'.apk. Ouvrez-la une fois avec internet pour que la mise en mémoire se fasse.
