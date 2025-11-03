# Documentation des Ports - SCI Solia Invest

## Vue d'ensemble

Cette documentation présente tous les ports utilisés dans le projet SCI Solia Invest, organisés par service et environnement.

## Services Principaux

### 🚀 API Backend (Node.js/TypeScript)
- **Port par défaut**: `8001`
- **Service**: `packages/api`
- **Configuration**: `packages/api/src/server.ts`
- **Variable d'environnement**: `PORT=8001`
- **Description**: API REST principale avec authentification JWT, gestion des utilisateurs, propriétés et transactions

### 🌐 Frontend Client (React/Vite)
- **Port par défaut**: `5174`
- **Service**: `packages/client`
- **Configuration**: `packages/client/vite.config.js`
- **Description**: Interface utilisateur React avec Vite dev server
- **Proxy API**: Redirige `/api` vers `http://localhost:8001`

### 🔗 Gateway NestJS
- **Port par défaut**: `3000`
- **Service**: `gateway-nestjs`
- **Configuration**: `gateway-nestjs/src/main.ts`
- **Variable d'environnement**: `PORT=3000`
- **Description**: Passerelle API avec authentification, RBAC, et intégration microservices

## Bases de Données

### 🐘 PostgreSQL
- **Port de développement**: `5432`
- **Port de production**: `5433`
- **Service**: Base de données principale
- **Configuration Docker**: 
  - Dev: `infrastructure/docker-compose.dev.yml`
  - Prod: `docker-compose.yml`

### 🍃 MongoDB
- **Port par défaut**: `27017`
- **Service**: Base de données NoSQL pour certaines collections
- **Configuration**: `k8s/mongo-service.yaml`

## Services d'Infrastructure

### 🔴 Redis
- **Port par défaut**: `6379`
- **Service**: Cache en mémoire et sessions
- **Configuration**: 
  - Dev: `infrastructure/docker-compose.dev.yml`
  - Prod: `infrastructure/docker-compose.yml`

### 🐰 RabbitMQ
- **Port AMQP**: `5672`
- **Port Management UI**: `15672`
- **Service**: Message broker pour les événements
- **Configuration**: `infrastructure/docker-compose.yml`
- **Interface Web**: `http://localhost:15672` (guest/guest)

### 📊 Apache Kafka
- **Port par défaut**: `9092`
- **Service**: Streaming de données et événements
- **Configuration**: `infrastructure/docker-compose.yml`
- **Dépendance**: Zookeeper (port interne `2181`)

## Monitoring et Observabilité

### 📈 Prometheus
- **Port par défaut**: `9090`
- **Service**: Collecte de métriques
- **Configuration**: `infrastructure/docker-compose.yml`
- **Interface Web**: `http://localhost:9090`

### 📊 Grafana
- **Port par défaut**: `3001`
- **Service**: Visualisation des métriques
- **Configuration**: `infrastructure/docker-compose.yml`
- **Interface Web**: `http://localhost:3001` (admin/admin)

## Services IoT et Communication

### 🦟 Mosquitto MQTT
- **Port MQTT**: `1883`
- **Port WebSocket**: `9001`
- **Service**: Broker MQTT pour IoT
- **Configuration**: `mosquitto-config/mosquitto.conf`

## Reverse Proxy

### 🌐 Nginx
- **Port par défaut**: `80`
- **Service**: Reverse proxy et load balancer
- **Configuration**: `nginx/nginx.conf`
- **Routes**:
  - `/api/*` → Backend API (`api:3000`)
  - `/*` → Frontend Client (`client:80`)

## Configuration par Environnement

### Développement Local
```yaml
Services actifs:
- API Backend: 8001
- Frontend: 5174
- PostgreSQL: 5432
- Redis: 6379
```

### Docker Compose (Développement)
```yaml
Services actifs:
- PostgreSQL: 5432
- Redis: 6379
- RabbitMQ: 5672, 15672
- Kafka: 9092
- Gateway: 3000
- Prometheus: 9090
- Grafana: 3001
```

### Docker Compose (Production)
```yaml
Services actifs:
- PostgreSQL: 5433
- Backend API: 8001
- Frontend: 5174
```

## Kubernetes (K8s)

### Services ClusterIP
- **API Service**: Port 80 → Target 8001
- **Client Service**: Port 80 → Target 5174
- **Mongo Service**: Port 27017 → Target 27017

## Variables d'Environnement des Ports

### API Backend
```env
PORT=8001
REDIS_URL=redis://127.0.0.1:6379
```

### Frontend Client
```env
VITE_API_URL=http://localhost:8001
```

### Gateway NestJS
```env
PORT=3000
RMQ_URL=amqp://rabbitmq:5672
KAFKA_BROKER=kafka:9092
```

## Sécurité des Ports

### Ports Exposés Publiquement
- `80` - Nginx (HTTP)
- `443` - Nginx (HTTPS avec certificats SSL)

### Ports Internes (Docker/K8s)
- `8001` - API Backend
- `5174` - Frontend
- `3000` - Gateway
- `5432/5433` - PostgreSQL
- `27017` - MongoDB
- `6379` - Redis

### Ports de Monitoring (Accès Restreint)
- `9090` - Prometheus
- `3001` - Grafana
- `15672` - RabbitMQ Management

## Rate Limiting (Nginx)

### Configuration des Limites
```nginx
# API générale: 10 req/s, burst 20
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Authentification: 1 req/s, burst 5
limit_req_zone $binary_remote_addr zone=auth:10m rate=1r/s;
```

## Commandes de Vérification

### Vérifier les ports ouverts
```bash
# Linux/macOS
netstat -tulpn | grep LISTEN

# Windows
netstat -an | findstr LISTENING
```

### Tester la connectivité
```bash
# Test API
curl http://localhost:8001/health

# Test Frontend
curl http://localhost:5174

# Test Gateway
curl http://localhost:3000/api/health
```

## Dépannage des Ports

### Conflits de Ports Courants
1. **Port 8001 occupé**: Modifier `PORT` dans `.env`
2. **Port 5174 occupé**: Vite utilisera automatiquement le port suivant
3. **Port 5432 occupé**: PostgreSQL local déjà installé

### Résolution
```bash
# Trouver le processus utilisant un port
lsof -i :8001  # Linux/macOS
netstat -ano | findstr :8001  # Windows

# Arrêter le processus
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows
```

## Architecture des Ports

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Gateway       │    │   Backend API   │
│   Port: 5174    │◄──►│   Port: 3000    │◄──►│   Port: 8001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   RabbitMQ      │    │   PostgreSQL    │
│   Port: 80      │    │   Port: 5672    │    │   Port: 5432    │
└─────────────────┘    │   UI: 15672     │    └─────────────────┘
                       └─────────────────┘
```

## Notes Importantes

1. **Ports par défaut**: Peuvent être modifiés via variables d'environnement
2. **Docker**: Les ports internes peuvent différer des ports exposés
3. **Production**: Utiliser HTTPS (443) avec certificats SSL
4. **Monitoring**: Restreindre l'accès aux ports de monitoring
5. **Firewall**: Configurer les règles appropriées pour chaque environnement

---

*Dernière mise à jour: $(date)*
*Version du projet: 1.0.0*