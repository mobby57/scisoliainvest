# Guide Visuel Étape par Étape : Reconfiguration du MCP Server Azure DevOps

Ce guide vous aide à résoudre l'erreur "Tool limit exceeded (329/128)" en reconfigurant votre serveur MCP Azure DevOps avec seulement les domaines nécessaires.

## Étape 1: Vérifier la Configuration Actuelle

1. Ouvrez VS Code.
2. Allez dans le fichier `.vscode/mcp.json` (déjà visible dans vos onglets).
3. Vérifiez que le contenu est le suivant :

```json
{
  "inputs": [
    {
      "id": "ado_org",
      "type": "promptString",
      "description": "Azure DevOps organization name (ex: 'scisolia')"
    }
  ],
  "servers": {
    "ado_solia": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@azure-devops/mcp@next",
        "${input:ado_org}",
        "-d",
        "core",
        "work",
        "work-items",
        "pipelines"
      ]
    }
  }
}
```

- **Ce que vous devriez voir** : Le fichier contient seulement 4 domaines (core, work, work-items, pipelines).
- **Si ce n'est pas le cas** : Modifiez-le avec ce contenu exact.

## Étape 2: Redémarrer le Serveur MCP

1. Dans VS Code, ouvrez la palette de commandes (Ctrl+Shift+P ou Cmd+Shift+P sur Mac).
2. Tapez "MCP: Restart Server" et sélectionnez l'option.
3. Choisissez le serveur "ado_solia" dans la liste.
4. Cliquez sur "Restart".

- **Ce que vous devriez voir** : Un message de confirmation dans le terminal VS Code indiquant que le serveur redémarre.
- **Attendez** : Le processus peut prendre quelques secondes.

## Étape 3: Reconnecter à Azure DevOps

1. Après le redémarrage, ouvrez GitHub Copilot Chat (icône dans la barre latérale ou Ctrl+Shift+I).
2. Tapez une commande simple comme "List ADO projects" et envoyez.
3. Si c'est la première fois ou après redémarrage, un navigateur s'ouvrira automatiquement.
4. Connectez-vous avec votre compte Microsoft (celui lié à votre organisation Azure DevOps 'scisolia').
5. Autorisez les permissions demandées.

- **Ce que vous devriez voir** :
  - Fenêtre de navigateur : Page de connexion Microsoft.
  - Après connexion : Message de succès dans Copilot Chat.
- **Si erreur** : Vérifiez que votre organisation 'scisolia' existe et que vous avez les droits d'accès.

## Étape 4: Tester la Configuration

1. Dans Copilot Chat, tapez : "List all projects in ADO org scisolia".
2. Envoyez la commande.
3. Vérifiez que vous obtenez une liste de projets sans erreur de limite d'outils.

- **Ce que vous devriez voir** : Une réponse avec la liste des projets Azure DevOps.
- **Si toujours erreur** : Redémarrez VS Code complètement et répétez les étapes 2-3.

## Étape 5: Utiliser les Outils Optimisés

Maintenant, vous pouvez utiliser des commandes comme :
- "Get all pipelines for project Solia"
- "Create a new work item: type=Task, title='Intégrer MongoDB', project='Solia'"
- "Run the pipeline 'Build and Deploy Solia'"

- **Conseil** : Utilisez toujours le préfixe "ADO org scisolia" pour spécifier votre organisation.

## Dépannage Supplémentaire

- **Erreur persistante** : Vérifiez les logs dans le terminal VS Code (View > Terminal).
- **Pas de navigateur** : Assurez-vous que VS Code peut ouvrir des liens externes (désactivez les bloqueurs de pop-up).
- **Limite toujours dépassée** : Confirmez que seuls les 4 domaines sont activés dans `.vscode/mcp.json`.

Si vous rencontrez encore des problèmes, partagez les messages d'erreur exacts.
