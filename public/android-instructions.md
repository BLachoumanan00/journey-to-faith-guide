# Créer l'application Android (.apk) de Bible en Main

Il faut un ordinateur (Windows, Mac ou Linux). La durée dépend de l’installation des outils et du téléchargement des dépendances.

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
- L'application ouvre la version publiée de Bible en Main : une connexion internet est nécessaire pour la première ouverture et la connexion au compte.
- Pensez à **publier** l'application dans Lovable avant : chaque mise à jour publiée apparaît automatiquement dans l'app Android, sans refaire l'.apk.
- Pour changer l'icône : dans Android Studio, clic droit sur `res` → **New → Image Asset**, et choisir l'icône de Bible en Main.

## Mode hors ligne (partiel)

Les contenus publics et les versets déjà consultés peuvent être conservés sur l'appareil. Les pages privées et les données personnelles ne sont pas mises en mémoire hors ligne.
Il faut une connexion pour : la première ouverture, se connecter au compte, enregistrer des réponses ou des notes, poser une question à l'IA, et chercher un nouveau verset.
Le fonctionnement hors ligne complet des leçons après connexion doit encore être vérifié sur le téléphone. L'APK ne contient pas une Bible complète ni toutes les leçons préchargées.
Important : publiez l'application avant de créer l'.apk. Ouvrez-la une fois avec internet pour que la mise en mémoire se fasse.
