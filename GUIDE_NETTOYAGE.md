# Guide d'Utilisation des Outils de Nettoyage

Ce guide explique comment utiliser les outils de nettoyage pour supprimer en toute sécurité les fichiers inutiles du projet.

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Étape 1: Analyse](#étape-1-analyse)
4. [Étape 2: Validation Manuelle](#étape-2-validation-manuelle)
5. [Étape 3: Suppression Sécurisée](#étape-3-suppression-sécurisée)
6. [Étape 4: Vérification](#étape-4-vérification)
7. [Bonnes Pratiques](#bonnes-pratiques)
8. [FAQ](#faq)

---

## Vue d'ensemble

Le processus de nettoyage se déroule en 4 étapes:

```
1. Analyse          → cleanup-analysis.cjs
2. Validation       → CLEANUP_ANALYSIS_REPORT.md (vous!)
3. Suppression      → safe-cleanup.cjs
4. Vérification     → Tests manuels
```

**🔒 Principe de sécurité**: Aucun fichier n'est jamais supprimé automatiquement. Vous validez toujours manuellement.

---

## Prérequis

- Node.js installé
- Git installé et configuré
- Branche de travail à jour (`git pull`)
- Aucune modification non commitée (`git status` propre)

---

## Étape 1: Analyse

Lancez l'outil d'analyse pour scanner le projet:

```bash
node cleanup-analysis.cjs
```

### Que fait cet outil?

1. **Scanne tous les fichiers** du projet (sauf `.git`, `node_modules`, etc.)
2. **Identifie les fichiers essentiels**:
   - Fichiers de configuration (package.json, docker-compose.yml, etc.)
   - Code source (backend/, frontend/, packages/)
   - Documentation principale (README.md, guides, etc.)
3. **Détecte les références**:
   - Fichiers mentionnés dans la documentation
   - Fichiers référencés dans Makefile, scripts, configs
4. **Liste les candidats** à la suppression:
   - Anciens fichiers TODO
   - Fichiers HTML statiques non utilisés
   - Scripts batch/PowerShell legacy
   - Fichiers de test anciens

### Résultat

Deux fichiers sont générés:

- **`CLEANUP_ANALYSIS_REPORT.md`**: Rapport détaillé pour humains
- **`cleanup-analysis-data.json`**: Données structurées pour scripts

---

## Étape 2: Validation Manuelle

**⚠️ Cette étape est CRUCIALE!**

Ouvrez et lisez attentivement `CLEANUP_ANALYSIS_REPORT.md`.

### Questions à se poser pour chaque fichier

| Fichier | Questions de validation |
|---------|------------------------|
| **TODO*.md** | - Les tâches sont-elles terminées?<br>- Y a-t-il des informations encore pertinentes?<br>- Peut-on archiver au lieu de supprimer? |
| **HTML (website/)** | - Le site HTML est-il encore utilisé?<br>- Est-ce remplacé par le frontend React/Next.js?<br>- Y a-t-il du contenu unique à migrer? |
| **Scripts .bat/.ps1** | - Le script est-il documenté dans README?<br>- Y a-t-il un équivalent cross-platform (.sh)?<br>- Est-il utilisé en CI/CD? |
| **Postman collections** | - Y a-t-il plusieurs versions?<br>- Laquelle est la plus récente?<br>- Est-elle référencée dans la doc? |

### Catégories de fichiers détectés

1. **TODO files (14 fichiers)**
   - Recommandation: Archiver ou fusionner en un seul TODO.md si encore pertinent
   
2. **HTML statiques (14 fichiers)**
   - Recommandation: Supprimer si remplacé par frontend/ moderne
   
3. **Scripts Windows (3 fichiers)**
   - Recommandation: Garder si documentés, sinon privilégier .sh cross-platform

### Exemple de validation

```markdown
✅ TODO_DOCKER_FIX.md → SUPPRIMER (tâche terminée, docker fonctionne)
❌ TODO_PRIORITAIRE.md → GARDER (contient roadmap 2025)
✅ website/index.html → SUPPRIMER (remplacé par frontend Next.js)
⚠️ start-backend.bat → ARCHIVER (créer start-backend.sh équivalent d'abord)
```

---

## Étape 3: Suppression Sécurisée

Une fois validé, éditez `safe-cleanup.cjs`:

### 1. Ouvrir safe-cleanup.cjs

```bash
code safe-cleanup.cjs  # ou vim, nano, etc.
```

### 2. Décommenter les fichiers validés

Trouvez la section `filesToDelete` et décommentez les fichiers à supprimer:

```javascript
const filesToDelete = [
  // Décommentez uniquement les fichiers validés:
  
  'TODO.md',                          // ✅ Validé
  'TODO_DOCKER_FIX.md',               // ✅ Validé
  // 'TODO_PRIORITAIRE.md',           // ❌ À GARDER
  
  'website/index.html',               // ✅ Validé
  // 'website/dashboard/kyc.html',    // ⚠️ Pas encore validé
];
```

### 3. Lancer le script

```bash
node safe-cleanup.cjs
```

### Que fait le script?

1. **Crée une branche de sauvegarde** automatiquement
2. **Push la sauvegarde** sur origin
3. **Supprime les fichiers** avec `git rm`
4. **Affiche un résumé** (espace libéré, fichiers supprimés)

**⚠️ Les fichiers ne sont PAS encore commitées!**

---

## Étape 4: Vérification

### 1. Vérifier les changements

```bash
git status
git diff --cached
```

### 2. Tester le projet

```bash
# Backend
cd backend
npm install
npm run test
npm start

# Frontend
cd ../frontend
npm install
npm run build
npm run dev

# Docker
docker-compose up --build
```

### 3. Vérifier la documentation

- Tous les README sont-ils toujours cohérents?
- Les guides référencent-ils des fichiers supprimés?
- Les scripts fonctionnent-ils toujours?

### 4. Si tout va bien, commiter

```bash
git commit -m "chore: clean up unnecessary files

- Removed 14 old TODO files (tasks completed)
- Removed 14 static HTML files (replaced by Next.js frontend)
- Removed 3 Windows-only scripts (cross-platform alternatives exist)

Space saved: 474 KB
"

git push origin <votre-branche>
```

### 5. Si problème, annuler

```bash
# Annuler les suppressions
git reset HEAD

# Ou restaurer un fichier spécifique
git checkout HEAD -- chemin/vers/fichier.md
```

---

## Bonnes Pratiques

### ✅ À FAIRE

1. **Toujours créer une branche de sauvegarde** (le script le fait automatiquement)
2. **Valider en plusieurs passes**: 
   - 1ère passe: fichiers évidents (TODO terminés)
   - 2ème passe: fichiers plus sensibles (HTML, scripts)
3. **Tester après chaque suppression importante**
4. **Documenter les suppressions** dans le message de commit
5. **Archiver plutôt que supprimer** si le contenu peut être utile à l'avenir

### ❌ À ÉVITER

1. ❌ Supprimer des fichiers en masse sans validation
2. ❌ Supprimer sans créer de branche de sauvegarde
3. ❌ Supprimer sans tester après
4. ❌ Modifier `cleanup-analysis.cjs` directement (créer un nouveau script à la place)
5. ❌ Supprimer des fichiers référencés dans la documentation

### 📦 Archivage

Si vous hésitez à supprimer, archivez:

```bash
# Créer un dossier archive
mkdir -p .archive/removed-$(date +%Y%m%d)

# Déplacer au lieu de supprimer
git mv TODO_ANCIEN.md .archive/removed-20251106/
git mv website/ .archive/removed-20251106/

# Ajouter .archive/ au .gitignore si souhaité
echo ".archive/" >> .gitignore
```

---

## FAQ

### Q: L'analyse a identifié 31 fichiers, dois-je tous les supprimer?

**R**: Non! C'est une liste de **candidats**. Vous devez valider chacun individuellement. Certains peuvent être encore utiles.

### Q: Puis-je modifier cleanup-analysis.cjs pour ajuster la détection?

**R**: Oui! Modifiez les patterns dans `POTENTIALLY_REDUNDANT_PATTERNS` pour adapter à vos besoins:

```javascript
const POTENTIALLY_REDUNDANT_PATTERNS = [
  { pattern: /^FIXME.*\.md$/i, reason: 'FIXME file' },  // Ajouter vos patterns
  // ...
];
```

### Q: Comment savoir si un fichier HTML est encore utilisé?

**R**: 
1. Cherchez des références: `grep -r "nom-fichier.html" .`
2. Vérifiez les liens internes dans le HTML
3. Testez l'application: le HTML charge-t-il en production?

### Q: J'ai supprimé un fichier par erreur, comment le récupérer?

**R**:
```bash
# Si pas encore commité
git checkout HEAD -- chemin/fichier.md

# Si déjà commité mais pas pushé
git reset --soft HEAD~1

# Si déjà pushé, utiliser la branche de sauvegarde
git checkout backup-before-cleanup-XXX -- chemin/fichier.md
```

### Q: Que faire des fichiers Postman en double?

**R**:
1. Comparez les dates de modification
2. Ouvrez chaque collection dans Postman
3. Gardez la plus complète/récente
4. Vérifiez si référencée dans POSTMAN_WORKFLOW_GUIDE.md

### Q: Les fichiers TODO contiennent des infos utiles, les supprimer?

**R**: 
- **Si tâches terminées**: Supprimer
- **Si infos pertinentes**: Migrer dans README.md ou projet management tool
- **Si roadmap future**: Garder ou fusionner en un seul TODO.md

### Q: Puis-je automatiser entièrement le nettoyage?

**R**: **Non recommandé**. La validation manuelle est essentielle pour éviter de supprimer des fichiers importants. Les outils aident à identifier, mais la décision finale vous revient.

### Q: À quelle fréquence lancer l'analyse?

**R**: 
- **Mensuel**: Pour un projet actif
- **Avant release majeure**: Pour assainir avant livraison
- **Après migration**: Quand vous passez d'une techno à une autre (ex: HTML → React)

---

## Résumé en Une Page

```bash
# 1. ANALYSER
node cleanup-analysis.cjs

# 2. VALIDER
# Lire CLEANUP_ANALYSIS_REPORT.md
# Décider pour chaque fichier: SUPPRIMER, GARDER, ou ARCHIVER

# 3. ÉDITER
# Ouvrir safe-cleanup.cjs
# Décommenter les fichiers validés

# 4. NETTOYER
node safe-cleanup.cjs

# 5. VÉRIFIER
git status
npm test  # ou vos tests
docker-compose up  # si applicable

# 6. COMMITER
git commit -m "chore: clean up unnecessary files"
git push origin <branche>
```

**🔒 Sécurité maximale**: Branche de sauvegarde créée automatiquement, validation manuelle requise, tests avant commit.

---

## Support

Si vous avez des questions ou rencontrez des problèmes:

1. Consultez `CLEANUP_ANALYSIS_REPORT.md` pour plus de détails
2. Vérifiez `cleanup-analysis-data.json` pour les données brutes
3. Examinez les patterns dans `cleanup-analysis.cjs`
4. En cas de doute, **ne supprimez pas**!

**Principe de précaution**: Mieux vaut garder un fichier inutile que supprimer un fichier important.
