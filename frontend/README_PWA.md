# Progressive Web App (PWA) - SCI Solia Invest

## Vue d'ensemble

L'application SCI Solia Invest est maintenant une Progressive Web App (PWA) qui peut être installée directement sur les appareils mobiles et de bureau sans passer par les stores d'applications traditionnels.

## Fonctionnalités PWA

✅ **Installation Native** - Peut être installée sur l'écran d'accueil  
✅ **Mode Hors Ligne** - Fonctionne même sans connexion Internet  
✅ **Icônes Optimisées** - Icônes adaptatives pour tous les appareils  
✅ **Service Worker** - Mise en cache intelligente des ressources  
✅ **Responsive** - Interface adaptée à tous les écrans  
✅ **Manifeste Web** - Configuration complète pour l'installation  

## Configuration Technique

### Structure des Fichiers

```
frontend/
├── next.config.js              # Configuration PWA avec next-pwa
├── public/
│   ├── manifest.json           # Manifeste de l'application web
│   ├── sw.js                   # Service Worker (généré automatiquement)
│   ├── robots.txt              # Configuration SEO
│   ├── icons/
│   │   ├── icon.svg            # Icône source
│   │   ├── icon-72x72.png      # Icônes de différentes tailles
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   ├── icon-512x512.png
│   │   └── browserconfig.xml   # Configuration Windows
├── pages/
│   ├── _app.tsx                # Configuration globale avec service worker
│   ├── _document.tsx           # Métadonnées PWA et SEO
│   └── index.tsx               # Page d'accueil avec instructions d'installation
└── styles/
    └── globals.css             # Styles globaux avec Tailwind CSS
```

### Dépendances

```json
{
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "next-pwa": "^5.6.0",
    "tailwindcss": "^3.x",
    "@tailwindcss/postcss": "^4.x",
    "autoprefixer": "^10.x",
    "sharp": "^0.x"
  }
}
```

## Développement

### Installation des Dépendances

```bash
cd frontend
npm install
```

### Démarrage en Mode Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

**Note:** En mode développement, le service worker est désactivé pour faciliter les tests.

### Build de Production

```bash
npm run build
```

Cela génère:
- Les fichiers optimisés dans `.next/`
- Le service worker dans `public/sw.js`
- Les fichiers de cache Workbox

### Lancement en Production

```bash
npm start
```

## Personnalisation

### Changer l'Icône de l'Application

1. Modifiez le fichier SVG source: `public/icons/icon.svg`
2. Exécutez le script de génération:
```bash
node generate-icons.js
```
3. Les icônes PNG seront regénérées automatiquement

### Modifier le Manifeste

Éditez `public/manifest.json` pour personnaliser:
- `name`: Nom complet de l'application
- `short_name`: Nom court (12 caractères max recommandé)
- `description`: Description de l'application
- `theme_color`: Couleur principale
- `background_color`: Couleur de fond au lancement

### Configuration du Service Worker

Le service worker est configuré dans `next.config.js`. Vous pouvez ajuster:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // Stratégies de cache personnalisées
  ]
});
```

#### Stratégies de Cache Disponibles

- **CacheFirst**: Utilise le cache en premier, réseau en secours
- **NetworkFirst**: Utilise le réseau en premier, cache en secours
- **StaleWhileRevalidate**: Retourne le cache immédiatement et met à jour en arrière-plan

## Tests d'Installation

### Chrome DevTools

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet "Application"
3. Vérifiez:
   - **Manifest**: Toutes les propriétés sont correctes
   - **Service Workers**: Le SW est enregistré et actif
   - **Storage**: Les ressources sont mises en cache

### Lighthouse

Exécutez un audit Lighthouse pour vérifier la qualité PWA:

```bash
lighthouse https://votre-domaine.com --view
```

Score cible: **>90** pour la catégorie PWA

### Test d'Installation Manuelle

#### Android (Chrome)
1. Ouvrez l'application
2. Le bouton "Installer l'app" devrait apparaître
3. Vérifiez l'icône et le splash screen

#### iOS (Safari)
1. Menu Partager > "Sur l'écran d'accueil"
2. Vérifiez que l'icône s'affiche correctement
3. Lancez l'app depuis l'écran d'accueil

## Déploiement

### Prérequis

- ✅ HTTPS activé (obligatoire pour les PWA)
- ✅ Certificat SSL valide
- ✅ Headers de sécurité appropriés

### Variables d'Environnement

Créez un fichier `.env.production`:

```env
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
NODE_ENV=production
```

### Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Déploiement Docker

```bash
# Build l'image
docker build -t sci-solia-invest-frontend .

# Lancer le conteneur
docker run -p 3000:3000 sci-solia-invest-frontend
```

## Maintenance

### Mise à Jour du Service Worker

Le service worker se met à jour automatiquement quand:
1. Vous déployez une nouvelle version
2. L'utilisateur revisite l'application
3. Après 24 heures maximum

### Vider le Cache

Pour forcer le vidage du cache:

```javascript
// Dans la console du navigateur
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}
```

### Monitoring

Surveillez ces métriques:
- Taux d'installation PWA
- Utilisation hors ligne
- Temps de chargement
- Erreurs du service worker

## Compatibilité des Navigateurs

| Navigateur | Version Minimale | Installation | Service Worker |
|-----------|------------------|--------------|----------------|
| Chrome | 67+ | ✅ | ✅ |
| Firefox | 79+ | ✅ | ✅ |
| Safari | 11.3+ | ⚠️ Manuel | ✅ |
| Edge | 79+ | ✅ | ✅ |
| Samsung Internet | 8.0+ | ✅ | ✅ |

⚠️ **Safari iOS**: Installation manuelle uniquement via "Ajouter à l'écran d'accueil"

## Dépannage

### Le Service Worker ne s'enregistre pas

1. Vérifiez que vous êtes en HTTPS
2. Vérifiez les erreurs dans la console
3. Assurez-vous que `skipWaiting` est activé

### L'icône ne s'affiche pas

1. Vérifiez les chemins dans `manifest.json`
2. Assurez-vous que toutes les tailles d'icônes existent
3. Videz le cache et réinstallez

### L'application ne fonctionne pas hors ligne

1. Ouvrez l'application au moins une fois en ligne
2. Vérifiez la configuration du cache dans `next.config.js`
3. Inspectez le cache dans DevTools > Application > Cache Storage

## Ressources

- [Next-PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [PWA Builder](https://www.pwabuilder.com/)

## Support

Pour toute question ou problème technique:
- Email: dev@scisoliainvest.com
- Documentation: `/GUIDE_INSTALLATION_MOBILE.md`

---

**Version**: 1.0.0  
**Dernière mise à jour**: Novembre 2024  
**Maintenu par**: Équipe SCI Solia Invest
