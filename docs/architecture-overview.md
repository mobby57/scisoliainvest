# Architecture SciSolia Invest - Plateforme Immobilière

## Vue d'ensemble
Architecture serverless multi-tenant pour investissement immobilier avec haute disponibilité et sécurité.

## Composants principaux

### Frontend (React/Next.js)
- **CloudFront** + **S3** : Distribution globale
- **Route 53** : DNS avec failover
- **Certificate Manager** : SSL/TLS

### API Gateway & Lambda
- **API Gateway** : Point d'entrée sécurisé
- **Lambda Functions** : Logique métier serverless
- **Cognito** : Authentification utilisateurs

### Base de données
- **RDS Aurora** : Données transactionnelles (Multi-AZ)
- **DynamoDB** : Sessions et cache
- **ElastiCache** : Performance queries

### Stockage & Documents
- **S3** : Documents propriétés (versioning, lifecycle)
- **EFS** : Fichiers partagés temporaires

### Monitoring & Sécurité
- **CloudWatch** : Logs et métriques
- **WAF** : Protection web
- **GuardDuty** : Détection menaces
- **Config** : Conformité

## Flux de données
1. Utilisateur → CloudFront → S3/API Gateway
2. API Gateway → Lambda → RDS/DynamoDB
3. Lambda → S3 pour documents
4. CloudWatch pour monitoring