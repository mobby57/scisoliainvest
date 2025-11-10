# Quick Start Guide - PWA Installation

## Pour les Utilisateurs

### 📱 Installer l'App sur Votre Téléphone

#### Android (Chrome)
1. Ouvrez https://votre-site.com dans Chrome
2. Cliquez sur "Installer l'app" OU Menu (⋮) > "Ajouter à l'écran d'accueil"
3. Confirmez

#### iPhone/iPad (Safari)  
1. Ouvrez https://votre-site.com dans Safari
2. Bouton Partager (↑) > "Sur l'écran d'accueil"
3. "Ajouter"

📖 **Guide détaillé:** Voir [GUIDE_INSTALLATION_MOBILE.md](../GUIDE_INSTALLATION_MOBILE.md)

---

## Pour les Développeurs

### 🚀 Démarrage Rapide

```bash
# Installation
cd frontend
npm install

# Développement (service worker désactivé)
npm run dev
# Ouvrir http://localhost:3000

# Production (avec service worker)
npm run build
npm start
```

### 🎨 Personnaliser l'Icône

```bash
# 1. Modifier frontend/public/icons/icon.svg
# 2. Régénérer les icônes
npm run generate-icons
```

### 📦 Structure des Fichiers PWA

```
frontend/
├── next.config.js              # Config PWA
├── public/
│   ├── manifest.json           # Manifeste app
│   ├── icons/                  # Icônes (auto-générées)
│   │   ├── icon.svg           # Source SVG
│   │   └── icon-*.png         # PNG (72-512px)
│   └── sw.js                  # Service Worker (auto)
├── pages/
│   ├── _app.tsx               # App globale + SW
│   ├── _document.tsx          # Meta tags PWA
│   └── index.tsx              # Page accueil
└── styles/
    └── globals.css            # Styles Tailwind
```

### ⚙️ Configuration

**Manifeste** (`public/manifest.json`):
```json
{
  "name": "SCI Solia Invest",
  "short_name": "Solia",
  "theme_color": "#2563eb"
}
```

**Service Worker** (`next.config.js`):
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});
```

### 🧪 Tester PWA Localement

```bash
# 1. Build production
npm run build
npm start

# 2. Ouvrir DevTools (F12) > Application
# 3. Vérifier:
#    - Manifest ✓
#    - Service Workers ✓
#    - Lighthouse PWA Score > 90
```

### 🔄 Mettre à Jour

L'app se met à jour automatiquement au prochain chargement.

Pour forcer une mise à jour:
```javascript
// Console navigateur
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));
```

### 📊 Vérifications Essentielles

✅ HTTPS activé (requis)  
✅ `manifest.json` accessible  
✅ Service worker enregistré  
✅ Icônes toutes tailles présentes  
✅ Build production sans erreurs

### 🐛 Dépannage Rapide

**Service worker ne s'enregistre pas:**
```bash
# Vérifier HTTPS et console erreurs
# En dev, le SW est désactivé (normal)
```

**Icône ne s'affiche pas:**
```bash
npm run generate-icons
# Vider cache navigateur
```

**App ne fonctionne pas hors ligne:**
```bash
# 1. Ouvrir une fois en ligne
# 2. Vérifier DevTools > Application > Cache Storage
```

### 📚 Documentation Complète

- **Utilisateurs:** [GUIDE_INSTALLATION_MOBILE.md](../GUIDE_INSTALLATION_MOBILE.md)
- **Développeurs:** [README_PWA.md](README_PWA.md)
- **Next-PWA:** https://github.com/shadowwalker/next-pwa

### 🔗 Liens Utiles

- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Besoin d'aide ?** Consultez [README_PWA.md](README_PWA.md) pour plus de détails.
