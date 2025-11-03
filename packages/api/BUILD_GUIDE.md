# Build automatique avant start

Pour garantir que tous les fichiers `.js` nécessaires existent avant de lancer le backend :

- Utilisez :
  ```bash
  pnpm build && pnpm start
  ```
- Ou pour le dev :
  ```bash
  pnpm dev
  ```

Le script `build` compile tout le TypeScript (`src/` → `dist/`).

Si vous développez en TypeScript, assurez-vous de toujours builder avant de lancer en production.
