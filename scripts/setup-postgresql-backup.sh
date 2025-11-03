#!/bin/bash

# Script de configuration des backups PostgreSQL automatiques
# Usage: ./setup-postgresql-backup.sh

set -e

echo "🗄️ Configuration des backups PostgreSQL pour SCI Solia Invest..."

# Variables de configuration
DB_NAME="scisoliainvest_production"
DB_USER="postgres"
BACKUP_DIR="/var/backups/postgresql"
S3_BUCKET="sci-solia-backups"
RETENTION_DAYS=30

# Créer le répertoire de backup
sudo mkdir -p $BACKUP_DIR
sudo chown postgres:postgres $BACKUP_DIR

# Script de backup quotidien
cat > /tmp/postgresql-backup.sh << 'EOF'
#!/bin/bash

# Configuration
DB_NAME="scisoliainvest_production"
DB_USER="postgres"
BACKUP_DIR="/var/backups/postgresql"
S3_BUCKET="sci-solia-backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/sci_solia_backup_$DATE.sql.gz"

# Créer le backup
echo "$(date): Début du backup de $DB_NAME"
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "$(date): Backup créé avec succès: $BACKUP_FILE"
    
    # Upload vers S3
    aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/postgresql/$(basename $BACKUP_FILE)
    
    if [ $? -eq 0 ]; then
        echo "$(date): Backup uploadé vers S3"
        # Supprimer le fichier local après upload réussi
        rm $BACKUP_FILE
    else
        echo "$(date): ERREUR - Échec de l'upload S3"
    fi
    
    # Nettoyer les anciens backups S3 (garder 30 jours)
    aws s3 ls s3://$S3_BUCKET/postgresql/ | while read -r line; do
        createDate=$(echo $line | awk '{print $1" "$2}')
        createDate=$(date -d "$createDate" +%s)
        olderThan=$(date -d "30 days ago" +%s)
        if [[ $createDate -lt $olderThan ]]; then
            fileName=$(echo $line | awk '{print $4}')
            if [[ $fileName != "" ]]; then
                aws s3 rm s3://$S3_BUCKET/postgresql/$fileName
                echo "$(date): Ancien backup supprimé: $fileName"
            fi
        fi
    done
else
    echo "$(date): ERREUR - Échec du backup"
    exit 1
fi
EOF

# Rendre le script exécutable
sudo mv /tmp/postgresql-backup.sh /usr/local/bin/postgresql-backup.sh
sudo chmod +x /usr/local/bin/postgresql-backup.sh
sudo chown postgres:postgres /usr/local/bin/postgresql-backup.sh

# Configurer la crontab pour postgres
sudo -u postgres crontab -l > /tmp/postgres_cron 2>/dev/null || true
echo "0 2 * * * /usr/local/bin/postgresql-backup.sh >> /var/log/postgresql-backup.log 2>&1" >> /tmp/postgres_cron
sudo -u postgres crontab /tmp/postgres_cron
rm /tmp/postgres_cron

# Créer le bucket S3 s'il n'existe pas
aws s3 mb s3://$S3_BUCKET --region eu-west-1 2>/dev/null || echo "Bucket S3 existe déjà"

# Configurer la politique de cycle de vie S3
cat > /tmp/lifecycle-policy.json << EOF
{
    "Rules": [
        {
            "ID": "PostgreSQLBackupRetention",
            "Status": "Enabled",
            "Filter": {
                "Prefix": "postgresql/"
            },
            "Expiration": {
                "Days": 30
            },
            "Transitions": [
                {
                    "Days": 7,
                    "StorageClass": "STANDARD_IA"
                },
                {
                    "Days": 30,
                    "StorageClass": "GLACIER"
                }
            ]
        }
    ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
    --bucket $S3_BUCKET \
    --lifecycle-configuration file:///tmp/lifecycle-policy.json

rm /tmp/lifecycle-policy.json

# Test du backup
echo "🧪 Test du système de backup..."
sudo -u postgres /usr/local/bin/postgresql-backup.sh

echo "✅ Configuration des backups PostgreSQL terminée!"
echo "📋 Résumé:"
echo "  - Backups quotidiens à 2h00"
echo "  - Stockage S3: s3://$S3_BUCKET/postgresql/"
echo "  - Rétention: 30 jours"
echo "  - Logs: /var/log/postgresql-backup.log"