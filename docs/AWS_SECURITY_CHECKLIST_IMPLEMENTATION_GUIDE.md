# Guide d'Implémentation - Checklist de Sécurité AWS
## SCI Solia Invest - Plateforme d'Investissement Immobilier

### Table des Matières
1. [Gestion des Identités et Accès (IAM)](#1-gestion-des-identités-et-accès-iam)
2. [Sécurité des Données](#2-sécurité-des-données)
3. [Sécurité Réseau](#3-sécurité-réseau)
4. [Surveillance et Logging](#4-surveillance-et-logging)
5. [Conformité et Gouvernance](#5-conformité-et-gouvernance)
6. [Sécurité des Applications](#6-sécurité-des-applications)
7. [Sauvegarde et Récupération](#7-sauvegarde-et-récupération)
8. [Scripts d'Automatisation](#8-scripts-dautomatisation)

---

## 1. Gestion des Identités et Accès (IAM)

### 1.1 Configuration MFA Obligatoire

**Objectif**: Activer l'authentification multi-facteurs pour tous les utilisateurs

**Implémentation**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyAllExceptUsersWithMFA",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:GetUser",
        "iam:ListMFADevices",
        "iam:ListVirtualMFADevices",
        "iam:ResyncMFADevice",
        "sts:GetSessionToken"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}
```

**Script de déploiement**:
```bash
#!/bin/bash
# Appliquer la politique MFA
aws iam create-policy \
  --policy-name SCI-Solia-MFA-Required \
  --policy-document file://mfa-policy.json

aws iam attach-group-policy \
  --group-name SCI-Solia-Users \
  --policy-arn arn:aws:iam::ACCOUNT-ID:policy/SCI-Solia-MFA-Required
```

### 1.2 Principe du Moindre Privilège

**Rôles par fonction**:

**Développeur**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "s3:GetObject",
        "s3:PutObject",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": [
        "arn:aws:s3:::sci-solia-dev/*",
        "arn:aws:logs:*:*:log-group:/aws/lambda/sci-solia-*"
      ]
    }
  ]
}
```

**Administrateur Base de Données**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds:Describe*",
        "rds:CreateDBSnapshot",
        "rds:RestoreDBInstanceFromDBSnapshot",
        "rds:ModifyDBInstance"
      ],
      "Resource": "arn:aws:rds:*:*:db:sci-solia-*"
    }
  ]
}
```

### 1.3 Rotation Automatique des Clés

**Configuration AWS Secrets Manager**:
```json
{
  "SecretId": "sci-solia/database/credentials",
  "RotationRules": {
    "AutomaticallyAfterDays": 30
  },
  "RotationLambdaARN": "arn:aws:lambda:region:account:function:sci-solia-rotate-secrets"
}
```

---

## 2. Sécurité des Données

### 2.1 Chiffrement au Repos

**Configuration RDS**:
```yaml
# CloudFormation Template
Resources:
  SCISoliaDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: sci-solia-prod
      StorageEncrypted: true
      KmsKeyId: !Ref SCISoliaKMSKey
      BackupRetentionPeriod: 30
      DeletionProtection: true
```

**Configuration S3**:
```json
{
  "Rules": [
    {
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms",
        "KMSMasterKeyID": "arn:aws:kms:region:account:key/key-id"
      },
      "BucketKeyEnabled": true
    }
  ]
}
```

### 2.2 Chiffrement en Transit

**Configuration ALB avec SSL/TLS**:
```yaml
LoadBalancer:
  Type: AWS::ElasticLoadBalancingV2::LoadBalancer
  Properties:
    SecurityGroups:
      - !Ref ALBSecurityGroup
    
Listener:
  Type: AWS::ElasticLoadBalancingV2::Listener
  Properties:
    Protocol: HTTPS
    Port: 443
    Certificates:
      - CertificateArn: !Ref SSLCertificate
    SslPolicy: ELBSecurityPolicy-TLS-1-2-2017-01
```

### 2.3 Classification des Données

**Politique de tagging**:
```json
{
  "DataClassification": {
    "Public": "sci-solia:data-class:public",
    "Internal": "sci-solia:data-class:internal", 
    "Confidential": "sci-solia:data-class:confidential",
    "Restricted": "sci-solia:data-class:restricted"
  }
}
```

---

## 3. Sécurité Réseau

### 3.1 Configuration VPC Sécurisé

**Architecture réseau**:
```yaml
VPC:
  Type: AWS::EC2::VPC
  Properties:
    CidrBlock: 10.0.0.0/16
    EnableDnsHostnames: true
    EnableDnsSupport: true

PublicSubnet:
  Type: AWS::EC2::Subnet
  Properties:
    VpcId: !Ref VPC
    CidrBlock: 10.0.1.0/24
    AvailabilityZone: !Select [0, !GetAZs '']

PrivateSubnet:
  Type: AWS::EC2::Subnet
  Properties:
    VpcId: !Ref VPC
    CidrBlock: 10.0.2.0/24
    AvailabilityZone: !Select [1, !GetAZs '']
```

### 3.2 Groupes de Sécurité

**Web Tier**:
```json
{
  "GroupDescription": "SCI Solia Web Tier Security Group",
  "SecurityGroupIngress": [
    {
      "IpProtocol": "tcp",
      "FromPort": 443,
      "ToPort": 443,
      "CidrIp": "0.0.0.0/0"
    },
    {
      "IpProtocol": "tcp", 
      "FromPort": 80,
      "ToPort": 80,
      "CidrIp": "0.0.0.0/0"
    }
  ]
}
```

**Application Tier**:
```json
{
  "GroupDescription": "SCI Solia App Tier Security Group",
  "SecurityGroupIngress": [
    {
      "IpProtocol": "tcp",
      "FromPort": 8080,
      "ToPort": 8080,
      "SourceSecurityGroupId": "sg-web-tier"
    }
  ]
}
```

**Database Tier**:
```json
{
  "GroupDescription": "SCI Solia DB Tier Security Group", 
  "SecurityGroupIngress": [
    {
      "IpProtocol": "tcp",
      "FromPort": 5432,
      "ToPort": 5432,
      "SourceSecurityGroupId": "sg-app-tier"
    }
  ]
}
```

### 3.3 WAF Configuration

**Règles WAF**:
```json
{
  "Name": "SCI-Solia-WAF-Rules",
  "Rules": [
    {
      "Name": "AWSManagedRulesCommonRuleSet",
      "Priority": 1,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCommonRuleSet"
        }
      }
    },
    {
      "Name": "AWSManagedRulesKnownBadInputsRuleSet",
      "Priority": 2,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS", 
          "Name": "AWSManagedRulesKnownBadInputsRuleSet"
        }
      }
    }
  ]
}
```

---

## 4. Surveillance et Logging

### 4.1 Configuration CloudTrail

**CloudTrail pour audit**:
```yaml
CloudTrail:
  Type: AWS::CloudTrail::Trail
  Properties:
    TrailName: sci-solia-audit-trail
    S3BucketName: !Ref AuditLogsBucket
    IncludeGlobalServiceEvents: true
    IsMultiRegionTrail: true
    EnableLogFileValidation: true
    EventSelectors:
      - ReadWriteType: All
        IncludeManagementEvents: true
        DataResources:
          - Type: "AWS::S3::Object"
            Values: ["arn:aws:s3:::sci-solia-*/*"]
```

### 4.2 Monitoring avec CloudWatch

**Métriques personnalisées**:
```javascript
// Monitoring des connexions utilisateurs
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

async function logUserLogin(userId, success) {
  const params = {
    Namespace: 'SCI-Solia/Authentication',
    MetricData: [
      {
        MetricName: 'UserLogins',
        Dimensions: [
          {
            Name: 'Success',
            Value: success.toString()
          }
        ],
        Value: 1,
        Unit: 'Count',
        Timestamp: new Date()
      }
    ]
  };
  
  await cloudwatch.putMetricData(params).promise();
}
```

### 4.3 Alertes de Sécurité

**Alarmes CloudWatch**:
```yaml
FailedLoginAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: SCI-Solia-Failed-Logins
    MetricName: UserLogins
    Namespace: SCI-Solia/Authentication
    Statistic: Sum
    Period: 300
    EvaluationPeriods: 2
    Threshold: 10
    ComparisonOperator: GreaterThanThreshold
    AlarmActions:
      - !Ref SecurityNotificationTopic
```

---

## 5. Conformité et Gouvernance

### 5.1 AWS Config Rules

**Règles de conformité**:
```json
{
  "ConfigRuleName": "sci-solia-s3-bucket-public-access-prohibited",
  "Source": {
    "Owner": "AWS",
    "SourceIdentifier": "S3_BUCKET_PUBLIC_ACCESS_PROHIBITED"
  },
  "Scope": {
    "ComplianceResourceTypes": ["AWS::S3::Bucket"]
  }
}
```

### 5.2 Politique de Sauvegarde

**AWS Backup Plan**:
```yaml
BackupPlan:
  Type: AWS::Backup::BackupPlan
  Properties:
    BackupPlan:
      BackupPlanName: SCI-Solia-Backup-Plan
      BackupPlanRule:
        - RuleName: DailyBackups
          TargetBackupVault: !Ref BackupVault
          ScheduleExpression: "cron(0 2 ? * * *)"
          Lifecycle:
            DeleteAfterDays: 30
            MoveToColdStorageAfterDays: 7
```

---

## 6. Sécurité des Applications

### 6.1 Secrets Management

**Intégration Secrets Manager**:
```javascript
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

async function getDatabaseCredentials() {
  try {
    const secret = await secretsManager.getSecretValue({
      SecretId: 'sci-solia/database/credentials'
    }).promise();
    
    return JSON.parse(secret.SecretString);
  } catch (error) {
    console.error('Error retrieving database credentials:', error);
    throw error;
  }
}
```

### 6.2 Validation des Entrées

**Middleware de validation**:
```javascript
const validator = require('validator');

function validateInvestmentData(req, res, next) {
  const { amount, propertyId, investorId } = req.body;
  
  // Validation du montant
  if (!validator.isNumeric(amount.toString()) || amount <= 0) {
    return res.status(400).json({ error: 'Montant invalide' });
  }
  
  // Validation de l'ID propriété
  if (!validator.isUUID(propertyId)) {
    return res.status(400).json({ error: 'ID propriété invalide' });
  }
  
  // Validation de l'ID investisseur
  if (!validator.isUUID(investorId)) {
    return res.status(400).json({ error: 'ID investisseur invalide' });
  }
  
  next();
}
```

### 6.3 Rate Limiting

**Configuration API Gateway**:
```yaml
ApiGatewayThrottling:
  Type: AWS::ApiGateway::UsagePlan
  Properties:
    UsagePlanName: SCI-Solia-Rate-Limiting
    Throttle:
      RateLimit: 1000
      BurstLimit: 2000
    Quota:
      Limit: 10000
      Period: DAY
```

---

## 7. Sauvegarde et Récupération

### 7.1 Stratégie de Sauvegarde

**Script de sauvegarde automatisé**:
```bash
#!/bin/bash
# Sauvegarde automatique de la base de données

DB_INSTANCE="sci-solia-prod"
BACKUP_BUCKET="sci-solia-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Créer un snapshot RDS
aws rds create-db-snapshot \
  --db-instance-identifier $DB_INSTANCE \
  --db-snapshot-identifier "${DB_INSTANCE}-${DATE}"

# Sauvegarder les fichiers S3
aws s3 sync s3://sci-solia-documents s3://$BACKUP_BUCKET/documents/$DATE/

# Notification de succès
aws sns publish \
  --topic-arn arn:aws:sns:region:account:sci-solia-notifications \
  --message "Sauvegarde complétée avec succès: $DATE"
```

### 7.2 Plan de Récupération

**Procédure de restauration**:
```bash
#!/bin/bash
# Script de restauration d'urgence

SNAPSHOT_ID=$1
NEW_INSTANCE_ID="sci-solia-recovery-$(date +%s)"

if [ -z "$SNAPSHOT_ID" ]; then
  echo "Usage: $0 <snapshot-id>"
  exit 1
fi

# Restaurer depuis le snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier $NEW_INSTANCE_ID \
  --db-snapshot-identifier $SNAPSHOT_ID \
  --db-instance-class db.t3.medium

echo "Restauration initiée. Instance ID: $NEW_INSTANCE_ID"
```

---

## 8. Scripts d'Automatisation

### 8.1 Déploiement Sécurisé

**Script de déploiement avec vérifications**:
```bash
#!/bin/bash
# Déploiement sécurisé SCI Solia

set -e

# Vérifications pré-déploiement
echo "🔍 Vérifications de sécurité..."

# Vérifier les secrets
aws secretsmanager describe-secret --secret-id sci-solia/database/credentials > /dev/null
aws secretsmanager describe-secret --secret-id sci-solia/api/keys > /dev/null

# Vérifier les certificats SSL
aws acm describe-certificate --certificate-arn $SSL_CERT_ARN > /dev/null

# Vérifier les groupes de sécurité
aws ec2 describe-security-groups --group-ids $WEB_SG_ID $APP_SG_ID $DB_SG_ID > /dev/null

echo "✅ Vérifications réussies"

# Déploiement
echo "🚀 Déploiement en cours..."
aws cloudformation deploy \
  --template-file infrastructure/cloudformation-template.yaml \
  --stack-name sci-solia-prod \
  --parameter-overrides \
    Environment=production \
    SSLCertificateArn=$SSL_CERT_ARN \
  --capabilities CAPABILITY_IAM

echo "✅ Déploiement terminé"
```

### 8.2 Audit de Sécurité Automatisé

**Script d'audit quotidien**:
```bash
#!/bin/bash
# Audit de sécurité automatisé

REPORT_FILE="security-audit-$(date +%Y%m%d).json"

echo "🔍 Audit de sécurité SCI Solia - $(date)"

# Vérifier les accès root
ROOT_USAGE=$(aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=root \
  --start-time $(date -d '24 hours ago' --iso-8601) \
  --query 'Events[].EventTime' --output text)

# Vérifier les connexions MFA
MFA_EVENTS=$(aws logs filter-log-events \
  --log-group-name /aws/lambda/sci-solia-auth \
  --start-time $(date -d '24 hours ago' +%s)000 \
  --filter-pattern "MFA" \
  --query 'events[].message')

# Vérifier les tentatives de connexion échouées
FAILED_LOGINS=$(aws logs filter-log-events \
  --log-group-name /aws/lambda/sci-solia-auth \
  --start-time $(date -d '24 hours ago' +%s)000 \
  --filter-pattern "FAILED_LOGIN" \
  --query 'length(events)')

# Générer le rapport
cat > $REPORT_FILE << EOF
{
  "audit_date": "$(date --iso-8601)",
  "root_usage": "$ROOT_USAGE",
  "mfa_events_count": $(echo "$MFA_EVENTS" | jq length),
  "failed_logins_count": $FAILED_LOGINS,
  "status": "$([ $FAILED_LOGINS -lt 10 ] && echo 'OK' || echo 'ALERT')"
}
EOF

# Envoyer le rapport
aws s3 cp $REPORT_FILE s3://sci-solia-security-reports/

echo "✅ Audit terminé. Rapport: $REPORT_FILE"
```

### 8.3 Monitoring Continu

**Script de surveillance des métriques**:
```javascript
// monitoring-daemon.js
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

class SecurityMonitor {
  constructor() {
    this.metrics = [];
  }

  async checkDatabaseConnections() {
    // Vérifier les connexions à la base de données
    const params = {
      MetricName: 'DatabaseConnections',
      Namespace: 'SCI-Solia/Database',
      StartTime: new Date(Date.now() - 300000), // 5 minutes
      EndTime: new Date(),
      Period: 300,
      Statistics: ['Average']
    };

    const data = await cloudwatch.getMetricStatistics(params).promise();
    return data.Datapoints;
  }

  async checkAPILatency() {
    // Vérifier la latence des API
    const params = {
      MetricName: 'Duration',
      Namespace: 'AWS/Lambda',
      Dimensions: [
        {
          Name: 'FunctionName',
          Value: 'sci-solia-api'
        }
      ],
      StartTime: new Date(Date.now() - 300000),
      EndTime: new Date(),
      Period: 300,
      Statistics: ['Average']
    };

    const data = await cloudwatch.getMetricStatistics(params).promise();
    return data.Datapoints;
  }

  async sendAlert(message) {
    const sns = new AWS.SNS();
    await sns.publish({
      TopicArn: 'arn:aws:sns:region:account:sci-solia-alerts',
      Message: message,
      Subject: 'SCI Solia - Alerte de Sécurité'
    }).promise();
  }

  async run() {
    try {
      const dbConnections = await this.checkDatabaseConnections();
      const apiLatency = await this.checkAPILatency();

      // Vérifier les seuils
      if (dbConnections.length > 0 && dbConnections[0].Average > 100) {
        await this.sendAlert('Nombre élevé de connexions à la base de données');
      }

      if (apiLatency.length > 0 && apiLatency[0].Average > 5000) {
        await this.sendAlert('Latence API élevée détectée');
      }

      console.log('✅ Surveillance terminée');
    } catch (error) {
      console.error('❌ Erreur de surveillance:', error);
      await this.sendAlert(`Erreur de surveillance: ${error.message}`);
    }
  }
}

// Exécuter toutes les 5 minutes
const monitor = new SecurityMonitor();
setInterval(() => monitor.run(), 300000);
```

---

## Checklist de Vérification

### ✅ Identités et Accès
- [ ] MFA activé pour tous les utilisateurs
- [ ] Politiques IAM avec principe du moindre privilège
- [ ] Rotation automatique des clés activée
- [ ] Audit des permissions trimestriel planifié

### ✅ Chiffrement
- [ ] Chiffrement au repos configuré (RDS, S3)
- [ ] Chiffrement en transit (HTTPS/TLS)
- [ ] Gestion des clés KMS
- [ ] Certificats SSL valides

### ✅ Réseau
- [ ] VPC avec sous-réseaux privés/publics
- [ ] Groupes de sécurité restrictifs
- [ ] WAF configuré
- [ ] NACLs configurées

### ✅ Surveillance
- [ ] CloudTrail activé
- [ ] CloudWatch métriques et alarmes
- [ ] Logs centralisés
- [ ] Notifications d'alertes

### ✅ Conformité
- [ ] AWS Config rules activées
- [ ] Politique de sauvegarde
- [ ] Plan de récupération testé
- [ ] Documentation à jour

### ✅ Applications
- [ ] Secrets Manager intégré
- [ ] Validation des entrées
- [ ] Rate limiting configuré
- [ ] Tests de sécurité automatisés

---

## Contacts et Support

**Équipe Sécurité SCI Solia**:
- Email: security@scisoliainvest.com
- Slack: #security-team
- Escalade: security-escalation@scisoliainvest.com

**Documentation Complémentaire**:
- [AWS Security Best Practices](https://docs.aws.amazon.com/security/)
- [Guide de Conformité RGPD](./RGPD_COMPLIANCE_GUIDE.md)
- [Procédures d'Incident](./INCIDENT_RESPONSE_PROCEDURES.md)

---

*Dernière mise à jour: $(date)*
*Version: 1.0*
*Responsable: Équipe DevSecOps SCI Solia*