# 🖥️ Terminal Profiles - SCI Solia Invest

_Guide de configuration des profils de terminal pour le développement efficace_

---

## 📋 Vue d'ensemble

Ce guide présente les configurations de profils de terminal optimisées pour le développement de la plateforme SCI Solia Invest. Chaque profil est conçu pour un contexte spécifique (frontend, backend, base de données, etc.).

---

## 🚀 Profils recommandés

### 1. **Profil Principal - Développement Full Stack**
```json
{
  "name": "SCI Solia - Dev Principal",
  "commandline": "cmd.exe",
  "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com",
  "icon": "🏢",
  "tabTitle": "Solia Dev",
  "colorScheme": "Campbell Powershell"
}
```

### 2. **Profil Frontend - Next.js/React**
```json
{
  "name": "SCI Solia - Frontend",
  "commandline": "cmd.exe /k cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com\\packages\\client && npm run dev",
  "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com\\packages\\client",
  "icon": "⚛️",
  "tabTitle": "Frontend",
  "colorScheme": "One Half Dark"
}
```

### 3. **Profil Backend - API Node.js**
```json
{
  "name": "SCI Solia - Backend API",
  "commandline": "cmd.exe /k cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com\\packages\\api && npm run dev",
  "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com\\packages\\api",
  "icon": "🔧",
  "tabTitle": "API",
  "colorScheme": "Campbell"
}
```

### 4. **Profil Base de données - PostgreSQL**
```json
{
  "name": "SCI Solia - Database",
  "commandline": "cmd.exe /k cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com && docker-compose up postgres",
  "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com",
  "icon": "🗄️",
  "tabTitle": "Database",
  "colorScheme": "Vintage"
}
```

### 5. **Profil Docker - Services**
```json
{
  "name": "SCI Solia - Docker Services",
  "commandline": "cmd.exe /k cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com && docker-compose up",
  "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com",
  "icon": "🐳",
  "tabTitle": "Docker",
  "colorScheme": "Tango Dark"
}
```

### 6. **Profil Tests - Automatisés**
```json
{
  "name": "SCI Solia - Tests",
  "commandline": "cmd.exe /k cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com && npm test",
  "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com",
  "icon": "🧪",
  "tabTitle": "Tests",
  "colorScheme": "Solarized Dark"
}
```

---

## ⚙️ Configuration Windows Terminal

### Fichier settings.json complet
```json
{
  "profiles": {
    "list": [
      {
        "name": "SCI Solia - Dev Principal",
        "commandline": "cmd.exe",
        "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com",
        "icon": "🏢",
        "tabTitle": "Solia Dev",
        "colorScheme": "Campbell Powershell",
        "fontSize": 12,
        "fontFace": "Cascadia Code"
      },
      {
        "name": "SCI Solia - Frontend",
        "commandline": "cmd.exe /k \"cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com\\packages\\client && npm run dev\"",
        "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com\\packages\\client",
        "icon": "⚛️",
        "tabTitle": "Frontend",
        "colorScheme": "One Half Dark"
      },
      {
        "name": "SCI Solia - Backend API",
        "commandline": "cmd.exe /k \"cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com\\packages\\api && npm run dev\"",
        "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com\\packages\\api",
        "icon": "🔧",
        "tabTitle": "API",
        "colorScheme": "Campbell"
      },
      {
        "name": "SCI Solia - Database",
        "commandline": "cmd.exe /k \"cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com && docker-compose up postgres\"",
        "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com",
        "icon": "🗄️",
        "tabTitle": "Database",
        "colorScheme": "Vintage"
      },
      {
        "name": "SCI Solia - Docker Services",
        "commandline": "cmd.exe /k \"cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com && docker-compose up\"",
        "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com",
        "icon": "🐳",
        "tabTitle": "Docker",
        "colorScheme": "Tango Dark"
      },
      {
        "name": "SCI Solia - Tests",
        "commandline": "cmd.exe /k \"cd /d c:\\Users\\moros\\Desktop\\scisoliainvest.com && npm test\"",
        "startingDirectory": "c:\\Users\\moros\\Desktop\\scisoliainvest.com",
        "icon": "🧪",
        "tabTitle": "Tests",
        "colorScheme": "Solarized Dark"
      }
    ]
  },
  "defaultProfile": "{guid-du-profil-principal}",
  "startOnUserLogin": false,
  "launchMode": "default"
}
```

---

## 🛠️ Scripts de démarrage rapide

### Démarrage complet (start-dev-complete.bat)
```batch
@echo off
echo 🚀 Démarrage environnement SCI Solia Invest...

REM Démarrage des services Docker
start "Docker Services" cmd /k "cd /d c:\Users\moros\Desktop\scisoliainvest.com && docker-compose up"

REM Attendre 10 secondes pour que les services démarrent
timeout /t 10 /nobreak

REM Démarrage du backend
start "Backend API" cmd /k "cd /d c:\Users\moros\Desktop\scisoliainvest.com\packages\api && npm run dev"

REM Démarrage du frontend
start "Frontend" cmd /k "cd /d c:\Users\moros\Desktop\scisoliainvest.com\packages\client && npm run dev"

echo ✅ Environnement de développement démarré !
pause
```

### Arrêt complet (stop-dev-complete.bat)
```batch
@echo off
echo 🛑 Arrêt environnement SCI Solia Invest...

REM Arrêt des processus Node.js
taskkill /f /im node.exe 2>nul

REM Arrêt des services Docker
cd /d c:\Users\moros\Desktop\scisoliainvest.com
docker-compose down

echo ✅ Environnement arrêté !
pause
```

---

## 📱 Raccourcis clavier recommandés

| Raccourci | Action |
|-----------|--------|
| `Ctrl + Shift + T` | Nouveau terminal |
| `Ctrl + Shift + D` | Dupliquer l'onglet |
| `Ctrl + Shift + W` | Fermer l'onglet |
| `Ctrl + Tab` | Basculer entre onglets |
| `Ctrl + Shift + P` | Palette de commandes |

---

## 🎨 Thèmes de couleurs personnalisés

### Thème SCI Solia (solia-theme.json)
```json
{
  "name": "SCI Solia Theme",
  "background": "#1e1e2e",
  "foreground": "#cdd6f4",
  "cursorColor": "#f38ba8",
  "selectionBackground": "#585b70",
  "black": "#45475a",
  "red": "#f38ba8",
  "green": "#a6e3a1",
  "yellow": "#f9e2af",
  "blue": "#89b4fa",
  "purple": "#cba6f7",
  "cyan": "#94e2d5",
  "white": "#bac2de",
  "brightBlack": "#585b70",
  "brightRed": "#f38ba8",
  "brightGreen": "#a6e3a1",
  "brightYellow": "#f9e2af",
  "brightBlue": "#89b4fa",
  "brightPurple": "#cba6f7",
  "brightCyan": "#94e2d5",
  "brightWhite": "#a6adc8"
}
```

---

## 🔧 Commandes utiles par contexte

### Frontend (React/Next.js)
```bash
# Démarrage développement
npm run dev

# Build production
npm run build

# Tests
npm test

# Linting
npm run lint

# Storybook
npm run storybook
```

### Backend (Node.js/Express)
```bash
# Démarrage développement
npm run dev

# Démarrage production
npm start

# Tests
npm test

# Migration base de données
npm run migrate

# Seed données
npm run seed
```

### Docker
```bash
# Démarrage tous services
docker-compose up

# Démarrage en arrière-plan
docker-compose up -d

# Arrêt services
docker-compose down

# Rebuild images
docker-compose build

# Logs services
docker-compose logs -f
```

---

## 📚 Variables d'environnement par profil

### Développement local
```env
NODE_ENV=development
PORT=3000
API_PORT=3001
DB_HOST=localhost
DB_PORT=5432
REDIS_PORT=6379
```

### Tests
```env
NODE_ENV=test
PORT=3002
API_PORT=3003
DB_HOST=localhost
DB_PORT=5433
REDIS_PORT=6380
```

### Production
```env
NODE_ENV=production
PORT=80
API_PORT=8080
DB_HOST=prod-db-host
DB_PORT=5432
REDIS_PORT=6379
```

---

## 🚨 Dépannage courant

### Problème : Port déjà utilisé
```bash
# Trouver le processus utilisant le port
netstat -ano | findstr :3000

# Tuer le processus
taskkill /PID <PID> /F
```

### Problème : Docker ne démarre pas
```bash
# Vérifier l'état Docker
docker --version

# Redémarrer Docker Desktop
# Via l'interface ou :
net stop com.docker.service
net start com.docker.service
```

### Problème : Modules npm manquants
```bash
# Réinstaller les dépendances
npm ci

# Ou forcer la réinstallation
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Références

- [Documentation Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/)
- [Guide Docker Compose](https://docs.docker.com/compose/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Node.js](https://nodejs.org/docs/)

---

**💡 Conseil :** Personnalise ces profils selon tes préférences et ton workflow de développement. N'hésite pas à ajouter des alias et des scripts personnalisés pour optimiser ta productivité !