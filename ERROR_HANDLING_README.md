# Error Handling System - Guide Expert

Guide rapide pour l'utilisation du système de gestion d'erreurs de SCI Solia Invest PWA.

## Installation et Configuration

### 1. Initialisation du Logger

```javascript
import { ErrorLogger } from './lib/error-logger.js';

// Configuration par défaut
const logger = new ErrorLogger();
await logger.initialize();

// Configuration personnalisée
const logger = new ErrorLogger({
  logDirectory: './logs',
  logFileName: 'app-errors.log',
  consoleEnabled: true,
  fileEnabled: true
});
await logger.initialize();
```

### 2. Utilisation Basique

```javascript
import { defaultLogger } from './lib/error-logger.js';

// Initialiser au démarrage de l'application
await defaultLogger.initialize();

// Logger une erreur
await defaultLogger.logError('ER_SERVER_CONFIG', {
  detail: 'Port 3000 already in use',
  stack: error.stack
});
```

## Utilisation Avancée

### Méthodes de Logging Spécifiques

```javascript
// Erreur de configuration serveur
await logger.logServerConfigError({
  envVar: 'DATABASE_URL',
  reason: 'Variable not defined'
});

// Échec de build
await logger.logBuildFailure({
  file: 'pages/index.tsx',
  error: 'Type error on line 42'
});

// Problème réseau
await logger.logNetworkIssue({
  url: 'https://api.example.com',
  status: 503,
  retries: 3
});

// Échec Service Worker
await logger.logServiceWorkerFailure({
  reason: 'HTTPS not enabled',
  browser: 'Chrome 120'
});

// Erreur manifest
await logger.logManifestError({
  field: 'icons',
  reason: 'Missing 512x512 icon'
});

// Problème de cache
await logger.logCacheStrategyError({
  strategy: 'cache-first',
  quota: '95% used'
});
```

### Handlers Personnalisés

```javascript
// Envoyer les erreurs critiques à un service de monitoring
logger.registerHandler(async (logEntry) => {
  if (logEntry.severity === 'critical') {
    await sendToMonitoring(logEntry);
  }
});

// Logger les erreurs dans une base de données
logger.registerHandler(async (logEntry) => {
  await db.errors.insert(logEntry);
});

// Envoyer des alertes par email
logger.registerHandler(async (logEntry) => {
  if (logEntry.severity === 'critical') {
    await sendEmailAlert(logEntry);
  }
});
```

### Intégration Next.js

#### Dans _app.js/tsx

```javascript
// pages/_app.js
import { defaultLogger } from '../lib/error-logger';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialiser le logger au démarrage
    defaultLogger.initialize();
    
    // Capturer les erreurs globales
    window.addEventListener('error', async (event) => {
      await defaultLogger.logError('ER_BUILD_FAIL', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });
    
    // Capturer les promesses rejetées
    window.addEventListener('unhandledrejection', async (event) => {
      await defaultLogger.logError('ER_NETWORK_ISSUE', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }, []);
  
  return <Component {...pageProps} />;
}

export default MyApp;
```

#### Dans les API Routes

```javascript
// pages/api/users.js
import { defaultLogger } from '../../lib/error-logger';

export default async function handler(req, res) {
  try {
    // Votre logique API
    const users = await fetchUsers();
    res.status(200).json(users);
  } catch (error) {
    await defaultLogger.logServerConfigError({
      endpoint: '/api/users',
      method: req.method,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      code: 'ER_SERVER_CONFIG'
    });
  }
}
```

#### Dans les Composants

```javascript
// components/DataFetcher.jsx
import { defaultLogger } from '../lib/error-logger';
import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Network error');
        const json = await response.json();
        setData(json);
      } catch (error) {
        await defaultLogger.logNetworkIssue({
          component: 'DataFetcher',
          error: error.message
        });
      }
    }
    
    fetchData();
  }, []);
  
  return <div>{/* Your UI */}</div>;
}
```

### Enregistrement du Service Worker

```javascript
// pages/_app.js
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(async (error) => {
        await defaultLogger.logServiceWorkerFailure({
          error: error.message,
          userAgent: navigator.userAgent,
          protocol: window.location.protocol
        });
      });
  }
}, []);
```

## Gestion des Logs

### Consulter les Logs

```javascript
// Récupérer tous les logs
const logs = await logger.getLogs();
console.log(logs);

// Filtrer par sévérité
const criticalLogs = logs.filter(log => log.severity === 'critical');

// Filtrer par date
const today = new Date().toISOString().split('T')[0];
const todayLogs = logs.filter(log => log.timestamp.startsWith(today));

// Filtrer par code d'erreur
const networkErrors = logs.filter(log => log.code === 'ER_NETWORK_ISSUE');
```

### Nettoyer les Logs

```javascript
// Nettoyer tous les logs
await logger.clearLogs();

// Archiver avant de nettoyer
const logs = await logger.getLogs();
await archiveLogs(logs); // Votre fonction d'archivage
await logger.clearLogs();
```

### Rotation des Logs

```javascript
import { ErrorLogger } from './lib/error-logger.js';
import { rename } from 'fs/promises';

async function rotateLogs() {
  const logger = new ErrorLogger();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const oldPath = './logs/error.log';
  const newPath = `./logs/error-${timestamp}.log`;
  
  try {
    await rename(oldPath, newPath);
    console.log(`Logs rotated to ${newPath}`);
  } catch (error) {
    console.error('Log rotation failed:', error);
  }
}

// Exécuter la rotation quotidiennement
setInterval(rotateLogs, 24 * 60 * 60 * 1000);
```

## Utilisation des Codes d'Erreur

### Import et Utilisation

```javascript
import { ERROR_CODES, getErrorByCode, isValidErrorCode } from './lib/errors.js';

// Vérifier qu'un code existe
if (isValidErrorCode('ER_SERVER_CONFIG')) {
  console.log('Code valide');
}

// Obtenir les détails d'une erreur
const error = getErrorByCode('ER_NETWORK_ISSUE');
console.log(error.message);
console.log(error.description);

// Accès direct
console.log(ERROR_CODES.ER_BUILD_FAIL.severity); // 'critical'
```

### Filtrage par Catégorie ou Sévérité

```javascript
import { getErrorsByCategory, getErrorsBySeverity } from './lib/errors.js';

// Toutes les erreurs PWA
const pwaErrors = getErrorsByCategory('pwa');

// Toutes les erreurs critiques
const criticalErrors = getErrorsBySeverity('critical');
```

## Intégration avec Services Externes

### Sentry

```javascript
import * as Sentry from '@sentry/nextjs';

logger.registerHandler(async (logEntry) => {
  Sentry.captureException(new Error(logEntry.message), {
    level: logEntry.severity,
    tags: {
      errorCode: logEntry.code,
      category: logEntry.category
    },
    extra: logEntry.context
  });
});
```

### Datadog

```javascript
import { datadogLogs } from '@datadog/browser-logs';

logger.registerHandler(async (logEntry) => {
  datadogLogs.logger.error(logEntry.message, {
    error_code: logEntry.code,
    severity: logEntry.severity,
    category: logEntry.category,
    context: logEntry.context
  });
});
```

### Custom Analytics

```javascript
logger.registerHandler(async (logEntry) => {
  await fetch('https://analytics.example.com/error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logEntry)
  });
});
```

## Tests Unitaires

Voir `lib/__tests__/error-logger.test.js` pour des exemples complets.

### Exemple de Test

```javascript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ErrorLogger } from '../error-logger.js';

describe('ErrorLogger', () => {
  let logger;
  
  beforeEach(async () => {
    logger = new ErrorLogger({
      logDirectory: '/tmp/test-logs',
      logFileName: 'test.log'
    });
    await logger.initialize();
  });
  
  afterEach(async () => {
    await logger.clearLogs();
  });
  
  it('should log errors correctly', async () => {
    const logEntry = await logger.logError('ER_SERVER_CONFIG', {
      test: true
    });
    
    expect(logEntry).toBeDefined();
    expect(logEntry.code).toBe('ER_SERVER_CONFIG');
    expect(logEntry.context.test).toBe(true);
  });
});
```

## Configuration Environnement

### Variables d'Environnement

```env
# .env.local
LOG_DIRECTORY=./logs
LOG_FILE_NAME=app-errors.log
LOG_TO_CONSOLE=true
LOG_TO_FILE=true
LOG_LEVEL=debug
```

### Utilisation

```javascript
const logger = new ErrorLogger({
  logDirectory: process.env.LOG_DIRECTORY || './logs',
  logFileName: process.env.LOG_FILE_NAME || 'error.log',
  consoleEnabled: process.env.LOG_TO_CONSOLE !== 'false',
  fileEnabled: process.env.LOG_TO_FILE !== 'false'
});
```

## Performance

### Logging Asynchrone

Le logger utilise des opérations asynchrones pour ne pas bloquer le thread principal :

```javascript
// Non bloquant
logger.logError('ER_NETWORK_ISSUE', context); // Ne pas attendre

// Bloquant (si nécessaire)
await logger.logError('ER_SERVER_CONFIG', context);
```

### Désactivation Sélective

```javascript
// En production, désactiver les logs console
const logger = new ErrorLogger({
  consoleEnabled: process.env.NODE_ENV !== 'production',
  fileEnabled: true
});
```

## Monitoring en Production

### Dashboard de Monitoring

```javascript
// pages/api/admin/error-logs.js
import { defaultLogger } from '../../../lib/error-logger';

export default async function handler(req, res) {
  // Protéger avec authentication
  if (!isAdmin(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  const logs = await defaultLogger.getLogs();
  
  // Statistiques
  const stats = {
    total: logs.length,
    bySeverity: {
      critical: logs.filter(l => l.severity === 'critical').length,
      high: logs.filter(l => l.severity === 'high').length,
      medium: logs.filter(l => l.severity === 'medium').length,
      low: logs.filter(l => l.severity === 'low').length
    },
    byCategory: {
      server: logs.filter(l => l.category === 'server').length,
      build: logs.filter(l => l.category === 'build').length,
      network: logs.filter(l => l.category === 'network').length,
      pwa: logs.filter(l => l.category === 'pwa').length
    },
    recent: logs.slice(-10)
  };
  
  res.status(200).json(stats);
}
```

### Alertes Automatiques

```javascript
logger.registerHandler(async (logEntry) => {
  if (logEntry.severity === 'critical') {
    // Slack notification
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 Critical Error: ${logEntry.code}`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'Message', value: logEntry.message },
            { title: 'Time', value: logEntry.timestamp },
            { title: 'Context', value: JSON.stringify(logEntry.context) }
          ]
        }]
      })
    });
  }
});
```

## Best Practices

1. **Initialiser tôt** : Appeler `initialize()` au démarrage de l'app
2. **Contexte riche** : Toujours fournir un contexte détaillé
3. **Handlers appropriés** : Utiliser des handlers pour les erreurs critiques
4. **Rotation des logs** : Mettre en place une rotation automatique
5. **Monitoring** : Surveiller les patterns d'erreurs en production
6. **Documentation** : Mettre à jour la doc lors de l'ajout de nouveaux codes

## Dépannage Rapide

### Logger ne fonctionne pas

```javascript
// Vérifier l'initialisation
await logger.initialize();

// Vérifier les permissions
console.log('Can write:', await canWriteToDirectory(logger.logDirectory));
```

### Logs non écrits

```javascript
// Vérifier que fileEnabled est true
const logger = new ErrorLogger({ fileEnabled: true });

// Vérifier l'espace disque
const { execSync } = require('child_process');
console.log(execSync('df -h').toString());
```

### Performance dégradée

```javascript
// Désactiver console en production
const logger = new ErrorLogger({
  consoleEnabled: false,
  fileEnabled: true
});

// Ne pas attendre le logging
logger.logError('ER_NETWORK_ISSUE', context); // Non bloquant
```

---

**Note** : Pour la documentation complète, voir [ERROR_DOCUMENTATION.md](./ERROR_DOCUMENTATION.md)
