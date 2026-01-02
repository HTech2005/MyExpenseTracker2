# Guide de Déploiement - MyExpenseTracker2

Ce guide explique comment déployer MyExpenseTracker2 en tant que PWA sur Vercel et générer un APK Android.

## 📱 PWA sur Vercel (iPhone & Android)

### Prérequis
- Compte Vercel (gratuit) : https://vercel.com
- Git installé

### Étapes de déploiement

#### 1. Build de la version web
```bash
# Générer le build web (Expo SDK 54+)
npx expo export --platform web

# Le dossier 'dist' sera créé avec tous les fichiers
```

#### 2. Déployer sur Vercel

**Option A : Via l'interface Vercel**
1. Connectez-vous sur https://vercel.com
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub
4. Vercel détectera automatiquement la configuration (`vercel.json`)
5. Cliquez sur "Deploy"

**Option B : Via CLI**
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

#### 3. Installation PWA sur iPhone
1. Ouvrez l'URL Vercel dans Safari
2. Appuyez sur le bouton "Partager" 📤
3. Sélectionnez "Sur l'écran d'accueil"
4. L'app s'installe comme une app native !

#### 4. Installation PWA sur Android
1. Ouvrez l'URL Vercel dans Chrome
2. Chrome affichera "Installer l'application"
3. Cliquez sur "Installer"
4. L'app apparaît sur l'écran d'accueil !

### ⚠️ Limitations PWA iOS
- ❌ Pas de notifications push
- ❌ Stockage limité (peut être effacé par iOS)
- ✅ Fonctionne hors ligne (grâce au Service Worker)
- ✅ Apparence native

---

## 🤖 APK Android

### Prérequis
- Compte Expo (gratuit) : https://expo.dev
- EAS CLI installé

### Étapes de génération

#### 1. Installer EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Se connecter à Expo
```bash
eas login
```

#### 3. Configurer le projet
```bash
# Lier le projet à votre compte Expo
eas build:configure
```

#### 4. Générer l'APK

**Build de production (recommandé)**
```bash
eas build --platform android --profile production
```

**Build de preview (pour tester)**
```bash
eas build --platform android --profile preview
```

Le build prend environ 10-20 minutes. Vous recevrez un lien pour télécharger l'APK.

#### 5. Installer l'APK sur Android

**Méthode 1 : Téléchargement direct**
1. Téléchargez l'APK depuis le lien EAS
2. Ouvrez le fichier APK sur votre téléphone
3. Autorisez l'installation depuis sources inconnues
4. Installez l'application

**Méthode 2 : Via ADB**
```bash
# Connectez votre téléphone en USB
adb install chemin/vers/votre-app.apk
```

### 📦 Distribuer l'APK
- Partagez le lien de téléchargement EAS
- Hébergez l'APK sur votre site web
- Utilisez un service comme Firebase App Distribution

---

## 🔄 Mises à jour

### PWA (Vercel)
```bash
# Faire vos modifications
git add .
git commit -m "Mise à jour"
git push

# Vercel déploie automatiquement !
```

### APK Android
```bash
# 1. Mettez à jour la version dans app.json
# "version": "1.0.1"

# 2. Générez un nouveau build
eas build --platform android --profile production

# 3. Distribuez le nouveau APK
```

---

## 🧪 Tests locaux

### Tester la PWA localement
```bash
# Build web
npx expo export --platform web

# Servir localement
cd dist
npx serve

# Ouvrez http://localhost:3000
```

### Tester l'APK localement
```bash
# Build de développement (plus rapide)
eas build --platform android --profile development

# Installer sur appareil connecté
adb install app.apk
```

---

## 📊 Comparaison

| Fonctionnalité | PWA iOS | PWA Android | APK Android |
|----------------|---------|-------------|-------------|
| Installation | ✅ | ✅ | ✅ |
| Hors ligne | ✅ | ✅ | ✅ |
| Notifications | ❌ | ⚠️ Limitées | ✅ |
| Performance | 🟡 Bonne | 🟢 Excellente | 🟢 Excellente |
| Stockage | ⚠️ Limité | ✅ | ✅ |
| Mise à jour | 🟢 Auto | 🟢 Auto | 🟡 Manuelle |

---

## 🆘 Dépannage

### Erreur lors du build web
```bash
# Nettoyer le cache
npx expo start -c
rm -rf dist
npx expo export --platform web
```

### Erreur EAS Build
```bash
# Vérifier la configuration
eas build:configure

# Voir les logs détaillés
eas build --platform android --profile production --clear-cache
```

### PWA ne s'installe pas
- Vérifiez que HTTPS est activé (Vercel le fait automatiquement)
- Vérifiez que `manifest.json` est accessible
- Testez dans un navigateur en navigation privée

---

## 📞 Support

- Documentation Expo : https://docs.expo.dev
- Documentation Vercel : https://vercel.com/docs
- Issues GitHub : Créez une issue sur votre repository

---

**Bon déploiement ! 🚀**
