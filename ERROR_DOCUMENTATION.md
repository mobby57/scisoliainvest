# Documentation des Codes d'Erreurs - SCI Solia Invest PWA

Cette documentation explique tous les codes d'erreurs utilisés dans l'application SCI Solia Invest, une Progressive Web App (PWA) construite avec Next.js.

## Table des Matières

1. [Introduction](#introduction)
2. [Structure des Codes d'Erreur](#structure-des-codes-derreur)
3. [Codes d'Erreur Détaillés](#codes-derreur-détaillés)
4. [Niveaux de Sévérité](#niveaux-de-sévérité)
5. [Guide de Résolution](#guide-de-résolution)

---

## Introduction

Le système de gestion d'erreurs de SCI Solia Invest utilise des codes d'erreur standardisés pour faciliter le diagnostic et la résolution des problèmes. Chaque erreur est associée à :

- Un **code unique** pour l'identification
- Un **message** clair et concis
- Une **description** détaillée
- Un **niveau de sévérité** (critical, high, medium, low)
- Une **catégorie** (server, build, network, pwa)

---

## Structure des Codes d'Erreur

Chaque code d'erreur suit cette structure :

```javascript
{
  code: 'ER_CODE_NAME',
  message: 'Message court',
  description: 'Description détaillée',
  severity: 'critical|high|medium|low',
  category: 'server|build|network|pwa'
}
```

---

## Codes d'Erreur Détaillés

### 1. ER_SERVER_CONFIG

**Code:** `ER_SERVER_CONFIG`  
**Message:** Problème de configuration du serveur  
**Sévérité:** Critical  
**Catégorie:** Server

#### Description

Une erreur s'est produite lors de la configuration du serveur. Cette erreur survient généralement au démarrage de l'application et empêche le serveur de fonctionner correctement.

#### Causes Possibles

- Variables d'environnement manquantes ou incorrectes
- Fichiers de configuration mal formatés (`.env`, `next.config.js`)
- Ports déjà utilisés par d'autres applications
- Permissions insuffisantes pour accéder aux ressources
- Dépendances manquantes ou incompatibles

#### Vérifications à Effectuer

1. **Vérifier les variables d'environnement :**
   ```bash
   # Vérifier que toutes les variables requises sont définies
   cat .env
   ```

2. **Valider le fichier de configuration Next.js :**
   ```bash
   # Vérifier la syntaxe du fichier
   node -c next.config.js
   ```

3. **Vérifier les ports :**
   ```bash
   # Linux/Mac
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

4. **Vérifier les permissions :**
   ```bash
   ls -la
   ```

#### Solutions

1. **Créer ou corriger le fichier `.env` :**
   ```env
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   DATABASE_URL=postgresql://user:password@localhost:5432/db
   ```

2. **Libérer le port utilisé :**
   ```bash
   # Tuer le processus utilisant le port 3000
   kill -9 $(lsof -t -i:3000)
   ```

3. **Réinstaller les dépendances :**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Corriger les permissions :**
   ```bash
   chmod -R 755 .
   ```

---

### 2. ER_BUILD_FAIL

**Code:** `ER_BUILD_FAIL`  
**Message:** Échec au moment de la compilation ou du build  
**Sévérité:** Critical  
**Catégorie:** Build

#### Description

La compilation ou le build de l'application a échoué. Cette erreur empêche la génération des fichiers nécessaires pour exécuter l'application en production.

#### Causes Possibles

- Erreurs de syntaxe dans le code source
- Dépendances manquantes ou incompatibles
- Problèmes de mémoire lors de la compilation
- Fichiers corrompus ou manquants
- Configuration TypeScript incorrecte

#### Vérifications à Effectuer

1. **Consulter les logs de build :**
   ```bash
   npm run build 2>&1 | tee build.log
   ```

2. **Vérifier la syntaxe TypeScript :**
   ```bash
   npx tsc --noEmit
   ```

3. **Vérifier l'espace disque disponible :**
   ```bash
   df -h
   ```

4. **Vérifier la mémoire disponible :**
   ```bash
   free -h
   ```

#### Solutions

1. **Corriger les erreurs de syntaxe :**
   - Consulter les logs pour identifier les fichiers problématiques
   - Utiliser un linter pour détecter les erreurs : `npm run lint`

2. **Nettoyer le cache et rebuilder :**
   ```bash
   # Nettoyer le cache Next.js
   rm -rf .next
   
   # Nettoyer node_modules
   rm -rf node_modules
   
   # Réinstaller
   npm install
   
   # Rebuilder
   npm run build
   ```

3. **Augmenter la mémoire allouée à Node.js :**
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

4. **Vérifier la configuration TypeScript :**
   ```json
   {
     "compilerOptions": {
       "target": "es5",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": false,
       "forceConsistentCasingInFileNames": true,
       "noEmit": true,
       "incremental": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "node",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve"
     }
   }
   ```

---

### 3. ER_NETWORK_ISSUE

**Code:** `ER_NETWORK_ISSUE`  
**Message:** Indisponibilité réseau  
**Sévérité:** High  
**Catégorie:** Network

#### Description

Une erreur réseau s'est produite lors d'une requête API ou lors de la communication avec le serveur. L'application ne peut pas communiquer avec les services backend.

#### Causes Possibles

- Perte de connexion internet
- Serveur backend indisponible
- Firewall bloquant les requêtes
- CORS mal configuré
- Timeout de requête dépassé
- DNS non résolu

#### Vérifications à Effectuer

1. **Tester la connectivité internet :**
   ```bash
   ping google.com
   ```

2. **Vérifier l'état du serveur backend :**
   ```bash
   curl -I http://localhost:3000/api/health
   ```

3. **Vérifier les logs réseau du navigateur :**
   - Ouvrir DevTools (F12)
   - Onglet Network
   - Observer les requêtes échouées

4. **Vérifier la configuration CORS :**
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             { key: 'Access-Control-Allow-Origin', value: '*' },
             { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' }
           ]
         }
       ]
     }
   }
   ```

#### Solutions

1. **Implémenter un système de retry :**
   ```javascript
   async function fetchWithRetry(url, options = {}, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         const response = await fetch(url, options);
         if (response.ok) return response;
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
       }
     }
   }
   ```

2. **Ajouter un mode offline :**
   ```javascript
   if (!navigator.onLine) {
     // Utiliser les données en cache
     return getCachedData();
   }
   ```

3. **Configurer des timeouts appropriés :**
   ```javascript
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 5000);
   
   fetch(url, { signal: controller.signal })
     .finally(() => clearTimeout(timeoutId));
   ```

---

### 4. ER_SW_REGISTER_FAIL

**Code:** `ER_SW_REGISTER_FAIL`  
**Message:** Échec lors de l'enregistrement du service worker  
**Sévérité:** High  
**Catégorie:** PWA

#### Description

Le service worker n'a pas pu être enregistré. Cette erreur empêche le fonctionnement hors ligne de l'application et la mise en cache des ressources.

#### Causes Possibles

- Application non servie en HTTPS (sauf localhost)
- Navigateur ne supportant pas les service workers
- Service worker bloqué par la politique du navigateur
- Erreur de syntaxe dans le fichier du service worker
- Scope du service worker incorrect

#### Vérifications à Effectuer

1. **Vérifier le support du navigateur :**
   ```javascript
   if ('serviceWorker' in navigator) {
     console.log('Service Worker supporté');
   } else {
     console.log('Service Worker non supporté');
   }
   ```

2. **Vérifier le protocole :**
   ```javascript
   console.log('Protocol:', window.location.protocol);
   // Doit être 'https:' ou 'http:' (uniquement pour localhost)
   ```

3. **Vérifier les erreurs dans la console :**
   - Ouvrir DevTools (F12)
   - Onglet Console
   - Observer les erreurs liées au service worker

4. **Vérifier l'état du service worker :**
   - Chrome : `chrome://serviceworker-internals/`
   - Firefox : `about:debugging#/runtime/this-firefox`

#### Solutions

1. **Enregistrer le service worker correctement :**
   ```javascript
   // pages/_app.js
   import { useEffect } from 'react';
   
   function MyApp({ Component, pageProps }) {
     useEffect(() => {
       if ('serviceWorker' in navigator) {
         navigator.serviceWorker
           .register('/sw.js')
           .then(registration => {
             console.log('SW registered:', registration);
           })
           .catch(error => {
             console.error('SW registration failed:', error);
           });
       }
     }, []);
     
     return <Component {...pageProps} />;
   }
   
   export default MyApp;
   ```

2. **Créer un service worker basique :**
   ```javascript
   // public/sw.js
   self.addEventListener('install', event => {
     console.log('Service Worker installing.');
     self.skipWaiting();
   });
   
   self.addEventListener('activate', event => {
     console.log('Service Worker activating.');
     event.waitUntil(clients.claim());
   });
   
   self.addEventListener('fetch', event => {
     // Stratégie de cache à implémenter
   });
   ```

3. **Activer HTTPS en développement :**
   ```bash
   # next.config.js
   module.exports = {
     devIndicators: {
       buildActivity: true,
     },
     // Pour le développement local avec HTTPS
     experimental: {
       https: true
     }
   }
   ```

4. **Désenregistrer et réenregistrer le service worker :**
   ```javascript
   navigator.serviceWorker.getRegistrations().then(registrations => {
     registrations.forEach(registration => registration.unregister());
   });
   ```

---

### 5. ER_MANIFEST_ERROR

**Code:** `ER_MANIFEST_ERROR`  
**Message:** Fichier manifest.json invalide ou introuvable  
**Sévérité:** Medium  
**Catégorie:** PWA

#### Description

Le fichier manifest.json est manquant, mal formaté ou contient des erreurs. Ce fichier est essentiel pour l'installation de la PWA sur les appareils.

#### Causes Possibles

- Fichier manifest.json manquant
- JSON mal formaté
- Propriétés requises manquantes
- Icônes manquantes ou chemins incorrects
- Type MIME incorrect

#### Vérifications à Effectuer

1. **Vérifier la présence du fichier :**
   ```bash
   ls -la public/manifest.json
   ```

2. **Valider le JSON :**
   ```bash
   cat public/manifest.json | python -m json.tool
   ```

3. **Vérifier le lien dans le HTML :**
   ```html
   <link rel="manifest" href="/manifest.json" />
   ```

4. **Utiliser les outils de développement :**
   - Chrome : DevTools > Application > Manifest
   - Observer les erreurs affichées

#### Solutions

1. **Créer un manifest.json valide :**
   ```json
   {
     "name": "SCI Solia Invest",
     "short_name": "Solia",
     "description": "Application de gestion d'investissements immobiliers",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#000000",
     "orientation": "portrait-primary",
     "icons": [
       {
         "src": "/icons/icon-72x72.png",
         "sizes": "72x72",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/icons/icon-96x96.png",
         "sizes": "96x96",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/icons/icon-128x128.png",
         "sizes": "128x128",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/icons/icon-144x144.png",
         "sizes": "144x144",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/icons/icon-152x152.png",
         "sizes": "152x152",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/icons/icon-192x192.png",
         "sizes": "192x192",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/icons/icon-384x384.png",
         "sizes": "384x384",
         "type": "image/png",
         "purpose": "any maskable"
       },
       {
         "src": "/icons/icon-512x512.png",
         "sizes": "512x512",
         "type": "image/png",
         "purpose": "any maskable"
       }
     ]
   }
   ```

2. **Ajouter le lien dans _document.js :**
   ```javascript
   // pages/_document.js
   import { Html, Head, Main, NextScript } from 'next/document';
   
   export default function Document() {
     return (
       <Html lang="fr">
         <Head>
           <link rel="manifest" href="/manifest.json" />
           <meta name="theme-color" content="#000000" />
         </Head>
         <body>
           <Main />
           <NextScript />
         </body>
       </Html>
     );
   }
   ```

3. **Générer les icônes manquantes :**
   - Utiliser un outil en ligne comme [PWA Image Generator](https://www.pwabuilder.com/imageGenerator)
   - Ou utiliser un script pour générer les différentes tailles

---

### 6. ER_CACHE_STRATEGY

**Code:** `ER_CACHE_STRATEGY`  
**Message:** Problème avec les stratégies de cache  
**Sévérité:** Medium  
**Catégorie:** PWA

#### Description

Une erreur s'est produite lors de l'utilisation des stratégies de cache. Cela peut affecter les performances de l'application et son fonctionnement hors ligne.

#### Causes Possibles

- Quota de stockage dépassé
- Cache API non disponible
- Erreur dans la logique de mise en cache
- Ressources non mises en cache
- Cache corrompu

#### Vérifications à Effectuer

1. **Vérifier le quota de stockage :**
   ```javascript
   if ('storage' in navigator && 'estimate' in navigator.storage) {
     navigator.storage.estimate().then(estimate => {
       console.log(`Usage: ${estimate.usage} / ${estimate.quota}`);
       console.log(`Percentage: ${(estimate.usage / estimate.quota * 100).toFixed(2)}%`);
     });
   }
   ```

2. **Vérifier les caches disponibles :**
   ```javascript
   caches.keys().then(cacheNames => {
     console.log('Caches:', cacheNames);
   });
   ```

3. **Inspecter le contenu d'un cache :**
   ```javascript
   caches.open('my-cache').then(cache => {
     cache.keys().then(requests => {
       console.log('Cached URLs:', requests.map(r => r.url));
     });
   });
   ```

#### Solutions

1. **Implémenter une stratégie Cache-First :**
   ```javascript
   // Service Worker
   self.addEventListener('fetch', event => {
     event.respondWith(
       caches.match(event.request).then(cachedResponse => {
         if (cachedResponse) {
           return cachedResponse;
         }
         
         return fetch(event.request).then(response => {
           if (response.status === 200) {
             const responseToCache = response.clone();
             caches.open('my-cache').then(cache => {
               cache.put(event.request, responseToCache);
             });
           }
           return response;
         });
       })
     );
   });
   ```

2. **Implémenter une stratégie Network-First :**
   ```javascript
   self.addEventListener('fetch', event => {
     event.respondWith(
       fetch(event.request)
         .then(response => {
           const responseToCache = response.clone();
           caches.open('my-cache').then(cache => {
             cache.put(event.request, responseToCache);
           });
           return response;
         })
         .catch(() => caches.match(event.request))
     );
   });
   ```

3. **Nettoyer les anciens caches :**
   ```javascript
   const CACHE_VERSION = 'v1';
   const CACHE_NAME = `my-cache-${CACHE_VERSION}`;
   
   self.addEventListener('activate', event => {
     event.waitUntil(
       caches.keys().then(cacheNames => {
         return Promise.all(
           cacheNames
             .filter(cacheName => cacheName !== CACHE_NAME)
             .map(cacheName => caches.delete(cacheName))
         );
       })
     );
   });
   ```

4. **Gérer le quota dépassé :**
   ```javascript
   async function addToCache(request, response) {
     try {
       const cache = await caches.open('my-cache');
       await cache.put(request, response);
     } catch (error) {
       if (error.name === 'QuotaExceededError') {
         // Nettoyer le cache ou utiliser une stratégie LRU
         await clearOldestCacheEntries();
       }
     }
   }
   ```

---

## Niveaux de Sévérité

### Critical (Critique)
Erreurs qui empêchent l'application de démarrer ou de fonctionner correctement. Nécessitent une attention immédiate.

**Exemples :** `ER_SERVER_CONFIG`, `ER_BUILD_FAIL`

### High (Élevé)
Erreurs qui impactent significativement l'expérience utilisateur mais n'empêchent pas l'application de fonctionner.

**Exemples :** `ER_NETWORK_ISSUE`, `ER_SW_REGISTER_FAIL`

### Medium (Moyen)
Erreurs qui dégradent certaines fonctionnalités mais ne bloquent pas l'utilisation principale.

**Exemples :** `ER_MANIFEST_ERROR`, `ER_CACHE_STRATEGY`

### Low (Faible)
Erreurs mineures qui n'affectent pas significativement l'expérience utilisateur.

---

## Guide de Résolution Général

### 1. Identification

1. **Consulter les logs** pour identifier le code d'erreur
2. **Lire la description** de l'erreur dans cette documentation
3. **Noter le contexte** dans lequel l'erreur s'est produite

### 2. Diagnostic

1. **Suivre les vérifications** listées pour l'erreur spécifique
2. **Reproduire l'erreur** en environnement de développement si possible
3. **Consulter les logs détaillés** (navigateur, serveur, build)

### 3. Résolution

1. **Appliquer les solutions** suggérées dans l'ordre
2. **Tester chaque solution** individuellement
3. **Vérifier que l'erreur ne se reproduit plus**

### 4. Prévention

1. **Documenter la solution** appliquée
2. **Mettre en place des tests** pour éviter la régression
3. **Ajouter des validations** si nécessaire

---

## Ressources Utiles

### Documentation Officielle

- [Next.js Documentation](https://nextjs.org/docs)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)

### Outils de Diagnostic

- **Chrome DevTools** : F12 > Application > Service Workers / Manifest
- **Lighthouse** : Audit PWA
- **Chrome DevTools** : Network tab pour les problèmes réseau
- **Node.js Debug** : `NODE_ENV=development DEBUG=* npm run dev`

### Commandes Utiles

```bash
# Vérifier les logs en temps réel
tail -f logs/error.log

# Rechercher une erreur spécifique
grep "ER_SERVER_CONFIG" logs/error.log

# Vérifier l'état du service worker
chrome://serviceworker-internals/

# Nettoyer le cache du navigateur
# Chrome : Ctrl+Shift+Delete
```

---

## Support

Pour toute question ou problème non couvert dans cette documentation :

1. Consulter les issues GitHub du projet
2. Créer une nouvelle issue avec :
   - Le code d'erreur
   - Le contexte complet
   - Les logs pertinents
   - Les étapes pour reproduire

---

*Dernière mise à jour : 2024-11-07*
