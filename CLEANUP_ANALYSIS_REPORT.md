# Rapport d'Analyse de Nettoyage du Projet

**Date de génération**: 2025-11-06T17:29:04.963Z

---

## 📊 Résumé

- **Total fichiers analysés**: 381
- **Fichiers essentiels**: 237
- **Fichiers référencés**: 76
- **Fichiers candidats à la suppression**: 31

- **Espace potentiellement libérable**: 474 KB

---

## 🗑️ Fichiers Candidats à la Suppression

> ⚠️ **ATTENTION**: Cette liste nécessite une validation manuelle avant toute suppression!

| Fichier | Raison | Taille | Dernière modification |
|---------|--------|--------|----------------------|
| `TODO.md` | Old TODO file - verify if still relevant | 311 B | 2025-11-06 |
| `TODO_API_DOCUMENTATION_UPDATE.md` | Old TODO file - verify if still relevant | 3.03 KB | 2025-11-06 |
| `TODO_COMBINED_FRONTEND_BACKEND.md` | Old TODO file - verify if still relevant | 3.62 KB | 2025-11-06 |
| `TODO_DOCKER_FIX.md` | Old TODO file - verify if still relevant | 462 B | 2025-11-06 |
| `TODO_DOCUMENT_UPLOAD_FIXES.md` | Old TODO file - verify if still relevant | 935 B | 2025-11-06 |
| `TODO_ESLINT_FIXES_KYC.md` | Old TODO file - verify if still relevant | 576 B | 2025-11-06 |
| `TODO_PHASE_0.md` | Old TODO file - verify if still relevant | 1.51 KB | 2025-11-06 |
| `TODO_PHASE_1_IMPLEMENTATION.md` | Old TODO file - verify if still relevant | 2.47 KB | 2025-11-06 |
| `TODO_PRIORITAIRE.md` | Old TODO file - verify if still relevant | 1.36 KB | 2025-11-06 |
| `TODO_TENANT_SCHEMA_UPDATES.md` | Old TODO file - verify if still relevant | 1.46 KB | 2025-11-06 |
| `TODO_TENANT_SC极MA_UPDATES.md` | Old TODO file - verify if still relevant | 1.47 KB | 2025-11-06 |
| `TODO_TESTS.md` | Old TODO file - verify if still relevant | 2.2 KB | 2025-11-06 |
| `TODO_TS_CORRECTIONS.md` | Old TODO file - verify if still relevant | 1.31 KB | 2025-11-06 |
| `TODO_TS_FIXES.md` | Old TODO file - verify if still relevant | 1.53 KB | 2025-11-06 |
| `setup-checklist-visual.html` | HTML file (non-component) - verify usage | 14.42 KB | 2025-11-06 |
| `start-backend.bat` | Windows batch script - verify if referenced in documentation | 199 B | 2025-11-06 |
| `start-server.bat` | Windows batch script - verify if referenced in documentation | 85 B | 2025-11-06 |
| `test-backend.ps1` | PowerShell script - verify if referenced in documentation | 3.08 KB | 2025-11-06 |
| `test-results/postman-report.html` | HTML file (non-component) - verify usage | 294.4 KB | 2025-11-06 |
| `website/admin/analytics.html` | HTML file (non-component) - verify usage | 2.96 KB | 2025-11-06 |
| `website/auth/login.html` | HTML file (non-component) - verify usage | 6.2 KB | 2025-11-06 |
| `website/auth/register.html` | HTML file (non-component) - verify usage | 4.39 KB | 2025-11-06 |
| `website/dashboard/index.html` | HTML file (non-component) - verify usage | 18.58 KB | 2025-11-06 |
| `website/dashboard/investments.html` | HTML file (non-component) - verify usage | 16.78 KB | 2025-11-06 |
| `website/dashboard/kyc.html` | HTML file (non-component) - verify usage | 26.66 KB | 2025-11-06 |
| `website/dashboard/transactions.html` | HTML file (non-component) - verify usage | 10.91 KB | 2025-11-06 |
| `website/index.html` | HTML file (non-component) - verify usage | 11.68 KB | 2025-11-06 |
| `website/legal/legal-notice.html` | HTML file (non-component) - verify usage | 7.14 KB | 2025-11-06 |
| `website/legal/mentions.html` | HTML file (non-component) - verify usage | 2.09 KB | 2025-11-06 |
| `website/legal/terms.html` | HTML file (non-component) - verify usage | 19.11 KB | 2025-11-06 |
| `website/properties/index.html` | HTML file (non-component) - verify usage | 13.15 KB | 2025-11-06 |

---

## 📁 Catégories de Fichiers Candidats

### Old TODO file - verify if still relevant

- `TODO.md`
- `TODO_API_DOCUMENTATION_UPDATE.md`
- `TODO_COMBINED_FRONTEND_BACKEND.md`
- `TODO_DOCKER_FIX.md`
- `TODO_DOCUMENT_UPLOAD_FIXES.md`
- `TODO_ESLINT_FIXES_KYC.md`
- `TODO_PHASE_0.md`
- `TODO_PHASE_1_IMPLEMENTATION.md`
- `TODO_PRIORITAIRE.md`
- `TODO_TENANT_SCHEMA_UPDATES.md`
- `TODO_TENANT_SC极MA_UPDATES.md`
- `TODO_TESTS.md`
- `TODO_TS_CORRECTIONS.md`
- `TODO_TS_FIXES.md`

### HTML file (non-component) - verify usage

- `setup-checklist-visual.html`
- `test-results/postman-report.html`
- `website/admin/analytics.html`
- `website/auth/login.html`
- `website/auth/register.html`
- `website/dashboard/index.html`
- `website/dashboard/investments.html`
- `website/dashboard/kyc.html`
- `website/dashboard/transactions.html`
- `website/index.html`
- `website/legal/legal-notice.html`
- `website/legal/mentions.html`
- `website/legal/terms.html`
- `website/properties/index.html`

### Windows batch script - verify if referenced in documentation

- `start-backend.bat`
- `start-server.bat`

### PowerShell script - verify if referenced in documentation

- `test-backend.ps1`

---

## 💡 Recommandations

1. **Validation manuelle requise**: Examinez chaque fichier avant suppression
2. **Sauvegarde**: Créez une branche de sauvegarde avant toute suppression
3. **Tests**: Vérifiez que le projet fonctionne après chaque suppression
4. **Documentation**: Mettez à jour la documentation si nécessaire

### Script de suppression (après validation)

```bash
# Créer une branche de sauvegarde
git checkout -b backup-before-cleanup
git push origin backup-before-cleanup

# Retourner à la branche principale
git checkout main

# Supprimer les fichiers validés (exemple)
git rm "TODO.md"
git rm "TODO_API_DOCUMENTATION_UPDATE.md"
git rm "TODO_COMBINED_FRONTEND_BACKEND.md"
# ... continuer avec les autres fichiers validés

# Commit et push
git commit -m "Clean up: remove unnecessary files"
git push origin main
```

---

## ✅ Exemples de Fichiers Essentiels (À GARDER)

- `.gitignore`
- `Dockerfile.backend`
- `Dockerfile.frontend`
- `Makefile`
- `README-DOCKER.md`
- `README-SETUP.md`
- `README.md`
- `backend/.env`
- `backend/.env.example`
- `backend/.env.local`
- `backend/Dockerfile`
- `backend/Gemfile`
- `backend/README.md`
- `backend/docs/KYC_API.md`
- `backend/package.json`
- `backend/scripts/health-check.js`
- `backend/server.js`
- `components/Auth/Login.tsx`
- `components/Layout/LayoutExample.tsx`
- `components/Layout/MainLayout.tsx`
- ... et 217 autres fichiers essentiels
