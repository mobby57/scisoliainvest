# Synchronisation des paramètres VS Code

## Vue d'ensemble

La synchronisation des paramètres VS Code permet de synchroniser vos configurations, extensions, raccourcis clavier et autres préférences entre différents appareils via votre compte Microsoft ou GitHub.

## Activation de la synchronisation

### Méthode 1 : Via l'interface utilisateur
1. Ouvrez VS Code
2. Cliquez sur l'icône de compte en bas à gauche de la barre d'état
3. Sélectionnez "Turn on Settings Sync..."
4. Choisissez votre méthode de connexion (Microsoft ou GitHub)
5. Sélectionnez les éléments à synchroniser

### Méthode 2 : Via la palette de commandes
1. Appuyez sur `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (macOS)
2. Tapez "Settings Sync: Turn On"
3. Suivez les instructions à l'écran

## Éléments synchronisés

Par défaut, VS Code synchronise :
- **Paramètres** : Toutes vos préférences utilisateur
- **Extensions** : Liste des extensions installées
- **Raccourcis clavier** : Vos raccourcis personnalisés
- **Snippets** : Vos extraits de code personnalisés
- **Interface utilisateur** : État des panneaux et disposition
- **Profils** : Vos profils de développement personnalisés

## Configuration avancée

### Exclusion d'éléments spécifiques
Pour exclure certains paramètres de la synchronisation, ajoutez-les à `settings.json` :

```json
{
  "settingsSync.ignoredSettings": [
    "terminal.integrated.shell.windows",
    "workbench.colorTheme"
  ],
  "settingsSync.ignoredExtensions": [
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Synchronisation manuelle
- **Synchroniser maintenant** : `Ctrl+Shift+P` → "Settings Sync: Sync Now"
- **Télécharger depuis le cloud** : "Settings Sync: Download Settings"
- **Téléverser vers le cloud** : "Settings Sync: Upload Settings"

## Résolution des conflits

### Conflits de paramètres
Lorsque des conflits surviennent :
1. VS Code affiche une notification
2. Choisissez entre "Local" (garder local) ou "Remote" (utiliser distant)
3. Ou fusionnez manuellement via l'éditeur de conflits

### Réinitialisation complète
Si nécessaire, vous pouvez réinitialiser :
```
Ctrl+Shift+P → "Settings Sync: Reset Local Settings"
```

## Dépannage courant

### Problème : Synchronisation bloquée
**Solution :**
1. Vérifiez votre connexion internet
2. Déconnectez-vous et reconnectez-vous
3. Redémarrez VS Code

### Problème : Extensions non synchronisées
**Solution :**
1. Vérifiez que "Extensions" est coché dans les paramètres de sync
2. Forcez une synchronisation manuelle
3. Réinstallez l'extension problématique

### Problème : Paramètres non appliqués
**Solution :**
1. Vérifiez les paramètres exclus dans `ignoredSettings`
2. Comparez `settings.json` local vs distant
3. Effectuez une synchronisation forcée

## Gestion du trousseau (Linux/macOS)

### Linux - Problèmes de trousseau
Si vous rencontrez des erreurs de trousseau :

```bash
# Installer les dépendances nécessaires
sudo apt-get install gnome-keyring libsecret-1-dev

# Ou pour KDE
sudo apt-get install kwalletmanager

# Redémarrer le service
killall gnome-keyring-daemon
```

### macOS - Problèmes de trousseau
```bash
# Réinitialiser le trousseau si nécessaire
security delete-generic-password -s "vscode.login" -a "account"
```

## Commandes utiles

### Vérification du statut
```bash
# Lancer VS Code avec logs détaillés
code --verbose --log debug
```

### Configuration via fichier
Éditez `~/.config/Code/User/settings.json` (Linux/macOS) ou `%APPDATA%\Code\User\settings.json` (Windows) :

```json
{
  "settingsSync.keybindingsPerPlatform": false,
  "settingsSync.ignoredExtensions": [],
  "settingsSync.ignoredSettings": []
}
```

## Sécurité et confidentialité

- Les données sont chiffrées en transit et au repos
- Seuls les métadonnées des extensions sont synchronisées (pas le code)
- Vous pouvez désactiver la synchronisation à tout moment
- Les données sont stockées sur les serveurs Microsoft/GitHub selon votre choix

## Bonnes pratiques

1. **Sauvegarde régulière** : Exportez vos paramètres localement
2. **Profils séparés** : Utilisez des profils pour différents projets
3. **Révision périodique** : Vérifiez les éléments synchronisés
4. **Test sur nouvel appareil** : Validez la synchronisation sur un nouveau setup

## Support multi-comptes

Pour gérer plusieurs comptes :
1. Déconnectez-vous du compte actuel
2. Connectez-vous avec le nouveau compte
3. Choisissez "Merge" ou "Replace" selon vos besoins

---

**Note :** Cette documentation couvre VS Code version 1.74+. Les fonctionnalités peuvent varier selon la version utilisée.