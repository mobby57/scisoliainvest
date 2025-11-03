# Scripts de Configuration des Ports

Scripts automatisés pour appliquer la configuration des ports documentée dans `PORTS_DOCUMENTATION.md`.

## Scripts Disponibles

### Windows (PowerShell)
```powershell
.\scripts\apply-ports-config.ps1
```

### Unix/Linux/macOS (Bash)
```bash
./scripts/apply-ports-config.sh
```

## Utilisation

### Options Communes

| Option | Description |
|--------|-------------|
| `-e, --env` | Environnement (dev/prod/k8s) |
| `-c, --check` | Vérifier l'état des ports |
| `-k, --kill` | Arrêter les processus en conflit |
| `-s, --start` | Démarrer les services |

### Exemples d'Utilisation

#### Vérification des ports
```bash
# Vérifier les ports de développement
./scripts/apply-ports-config.sh -e dev -c

# Vérifier et nettoyer les conflits
./scripts/apply-ports-config.sh -e dev -c -k
```

#### Démarrage complet
```bash
# Nettoyer, configurer et démarrer les services
./scripts/apply-ports-config.sh -e dev -c -k -s
```

#### Production
```bash
# Configuration production
./scripts/apply-ports-config.sh -e prod -c
```

## Fonctionnalités

### ✅ Vérification des Ports
- Détecte les ports occupés
- Identifie les processus en conflit
- Affichage coloré du statut

### ✅ Résolution des Conflits
- Arrêt automatique des processus
- Vérification post-nettoyage
- Gestion des erreurs

### ✅ Génération de Configuration
- Fichiers `.env` automatiques
- Variables d'environnement par contexte
- Mise à jour Docker Compose

### ✅ Démarrage des Services
- Lancement Docker Compose
- Test de connectivité
- Validation des services

## Configuration Générée

Le script génère automatiquement :

### `.env.dev`
```env
PORT=8001
REDIS_URL=redis://127.0.0.1:6379
VITE_API_URL=http://localhost:8001
GATEWAY_PORT=3000
# ...
```

### `.env.prod`
```env
PORT=8001
POSTGRES_PORT=5433
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443
```

## Ports par Environnement

### Développement
- API: 8001
- Client: 5174
- Gateway: 3000
- PostgreSQL: 5432
- Redis: 6379
- RabbitMQ: 5672, 15672
- Kafka: 9092
- Prometheus: 9090
- Grafana: 3001

### Production
- API: 8001
- Client: 5174
- PostgreSQL: 5433
- Nginx: 80, 443

## Prérequis

### Windows
- PowerShell 5.1+
- Docker Desktop (optionnel)

### Unix/Linux/macOS
- Bash 4.0+
- `lsof` ou `netstat`
- `curl` pour les tests
- Docker (optionnel)

## Dépannage

### Erreurs Communes

#### Port déjà utilisé
```bash
# Le script détecte et peut arrêter automatiquement
./scripts/apply-ports-config.sh -e dev -c -k
```

#### Permissions insuffisantes
```bash
# Exécuter avec sudo si nécessaire
sudo ./scripts/apply-ports-config.sh -e dev -k
```

#### Docker non disponible
Le script fonctionne sans Docker, seule la partie services sera ignorée.

### Commandes de Vérification Manuelle

```bash
# Vérifier les ports ouverts
netstat -tulpn | grep LISTEN

# Tester la connectivité
curl http://localhost:8001/health
curl http://localhost:5174
curl http://localhost:3000/api/health
```

## Intégration CI/CD

### GitHub Actions
```yaml
- name: Configure Ports
  run: ./scripts/apply-ports-config.sh -e dev -c -k
```

### Docker
```dockerfile
COPY scripts/apply-ports-config.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/apply-ports-config.sh
```

## Personnalisation

Pour modifier les ports, éditez les variables dans le script :

```bash
# Dans apply-ports-config.sh
declare -A DEV_PORTS=(
    ["api"]=8001        # Modifier ici
    ["client"]=5174     # Modifier ici
    # ...
)
```

## Support

Pour toute question ou problème :
1. Vérifiez la documentation dans `PORTS_DOCUMENTATION.md`
2. Consultez les logs du script
3. Utilisez l'option `--help` pour l'aide