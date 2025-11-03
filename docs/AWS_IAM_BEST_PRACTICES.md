# Bonnes Pratiques IAM pour SCI Soliai Invest

## Vue d'ensemble
Ce document définit les bonnes pratiques de gestion des permissions AWS IAM pour la plateforme SCI Soliai Invest, en suivant le principe de gestion par groupes plutôt que par utilisateurs individuels.

## Architecture des Groupes IAM

### Groupes par Environnement et Rôle

#### 1. Groupes de Développement
- **SCI-Developers-Dev** : Accès complet environnement de développement
- **SCI-Developers-Staging** : Accès lecture/écriture staging
- **SCI-Frontend-Devs** : Accès spécifique aux ressources frontend (S3, CloudFront)
- **SCI-Backend-Devs** : Accès aux services backend (RDS, Lambda, API Gateway)

#### 2. Groupes d'Exploitation
- **SCI-DevOps-Prod** : Gestion infrastructure production
- **SCI-Monitoring** : Accès CloudWatch, X-Ray pour surveillance
- **SCI-Database-Admins** : Gestion RDS PostgreSQL et backups

#### 3. Groupes Métier
- **SCI-Business-Analysts** : Accès lecture aux données analytics
- **SCI-Finance-Team** : Accès aux rapports financiers et billing
- **SCI-Support-Team** : Accès limité pour support client

## Politiques Gérées Recommandées

### Politiques AWS Gérées
```json
{
  "SCI-Developers-Dev": [
    "PowerUserAccess",
    "IAMReadOnlyAccess"
  ],
  "SCI-DevOps-Prod": [
    "EC2FullAccess",
    "RDSFullAccess",
    "S3FullAccess",
    "CloudWatchFullAccess"
  ],
  "SCI-Frontend-Devs": [
    "AmazonS3FullAccess",
    "CloudFrontFullAccess"
  ]
}
```

### Politiques Personnalisées SCI

#### Politique IoT pour Capteurs Immobiliers
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iot:Publish",
        "iot:Subscribe",
        "iot:Connect"
      ],
      "Resource": "arn:aws:iot:*:*:topic/sci/properties/*/sensors/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "timestream:WriteRecords",
        "timestream:DescribeTable"
      ],
      "Resource": "arn:aws:timestream:*:*:database/SCI-SensorData/*"
    }
  ]
}
```

#### Politique Données Propriétés SCI
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds:Connect"
      ],
      "Resource": "arn:aws:rds:*:*:db:sci-properties-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::sci-property-documents/*"
    }
  ]
}
```

## Structure Organisationnelle

### Mapping Rôles → Groupes

| Rôle Équipe | Groupe IAM Principal | Groupes Secondaires |
|-------------|---------------------|-------------------|
| Lead Developer | SCI-Developers-Dev | SCI-DevOps-Prod |
| Frontend Dev | SCI-Frontend-Devs | SCI-Developers-Dev |
| Backend Dev | SCI-Backend-Devs | SCI-Developers-Dev |
| DevOps Engineer | SCI-DevOps-Prod | SCI-Monitoring |
| Data Analyst | SCI-Business-Analysts | - |
| Support | SCI-Support-Team | - |

## Procédure de Gestion

### 1. Création des Groupes
```bash
# Exemple avec AWS CLI
aws iam create-group --group-name SCI-Developers-Dev
aws iam create-group --group-name SCI-Frontend-Devs
aws iam create-group --group-name SCI-DevOps-Prod
```

### 2. Attachement des Politiques
```bash
# Attacher politique gérée AWS
aws iam attach-group-policy \
  --group-name SCI-Developers-Dev \
  --policy-arn arn:aws:iam::aws:policy/PowerUserAccess

# Attacher politique personnalisée
aws iam attach-group-policy \
  --group-name SCI-Backend-Devs \
  --policy-arn arn:aws:iam::ACCOUNT:policy/SCI-IoT-Sensors-Policy
```

### 3. Ajout d'Utilisateurs
```bash
# Ajouter utilisateur au groupe
aws iam add-user-to-group \
  --group-name SCI-Developers-Dev \
  --user-name john.doe
```

## Politiques Spécifiques au Projet

### Accès Environnements par Tags
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": ["eu-west-1", "eu-central-1"],
          "ec2:ResourceTag/Environment": ["dev", "staging"]
        }
      }
    }
  ]
}
```

### Accès Données Tenant SCI
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/SCI-*",
      "Condition": {
        "ForAllValues:StringEquals": {
          "dynamodb:Attributes": ["tenantId", "propertyId", "investorId"]
        }
      }
    }
  ]
}
```

## Audit et Monitoring

### CloudTrail pour Traçabilité
- Activer CloudTrail sur tous les environnements
- Logs centralisés dans S3 bucket `sci-audit-logs`
- Alertes CloudWatch pour actions sensibles

### Révision Périodique
- **Mensuelle** : Révision des membres de groupes
- **Trimestrielle** : Audit des politiques attachées
- **Semestrielle** : Révision complète de l'architecture IAM

## Cas d'Exception

### Permissions Temporaires
Pour des besoins ponctuels, utiliser des rôles IAM assumables plutôt que des politiques directes :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT:user/emergency.user"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "SCI-EMERGENCY-2024"
        }
      }
    }
  ]
}
```

## Checklist de Mise en Œuvre

- [ ] Créer tous les groupes IAM selon la structure définie
- [ ] Créer les politiques personnalisées SCI
- [ ] Attacher les politiques aux groupes appropriés
- [ ] Migrer les utilisateurs existants vers les groupes
- [ ] Supprimer les politiques directement attachées aux utilisateurs
- [ ] Configurer CloudTrail pour l'audit
- [ ] Mettre en place les alertes de monitoring
- [ ] Documenter les procédures d'ajout/suppression d'utilisateurs
- [ ] Former l'équipe sur les nouvelles procédures

## Ressources

- [Documentation AWS IAM](https://docs.aws.amazon.com/iam/)
- [Bonnes Pratiques Sécurité AWS](https://aws.amazon.com/security/security-learning/)
- [Principe du Moindre Privilège](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/permissions-management.html)