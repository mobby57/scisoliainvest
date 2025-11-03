#!/bin/bash

# Backup script for SCI Solia Invest
# Usage: ./backup.sh [environment]

set -e

ENVIRONMENT=${1:-dev}
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    export $(cat .env.${ENVIRONMENT} | grep -v '^#' | xargs)
fi

# Create backup directory
mkdir -p ${BACKUP_DIR}

echo "Starting backup for environment: ${ENVIRONMENT}"

# PostgreSQL backup
if [ ! -z "$DATABASE_URL" ]; then
    echo "Backing up PostgreSQL..."
    pg_dump "$DATABASE_URL" --format=custom --compress=9 > "${BACKUP_DIR}/postgres_${ENVIRONMENT}_${DATE}.dump"
    echo "PostgreSQL backup completed: postgres_${ENVIRONMENT}_${DATE}.dump"
fi

# MongoDB backup
if [ ! -z "$MONGO_URI" ]; then
    echo "Backing up MongoDB..."
    mongodump --uri="$MONGO_URI" --archive="${BACKUP_DIR}/mongo_${ENVIRONMENT}_${DATE}.archive" --gzip
    echo "MongoDB backup completed: mongo_${ENVIRONMENT}_${DATE}.archive"
fi

# Redis backup (if needed)
if [ ! -z "$REDIS_URL" ] && [ "$ENVIRONMENT" = "prod" ]; then
    echo "Backing up Redis..."
    redis-cli --rdb "${BACKUP_DIR}/redis_${ENVIRONMENT}_${DATE}.rdb"
    echo "Redis backup completed: redis_${ENVIRONMENT}_${DATE}.rdb"
fi

# Upload to cloud storage (Azure Blob)
if [ ! -z "$AZURE_STORAGE_CONNECTION_STRING" ]; then
    echo "Uploading backups to Azure Blob Storage..."
    az storage blob upload-batch \
        --destination "backups/${ENVIRONMENT}" \
        --source "${BACKUP_DIR}" \
        --pattern "*_${DATE}.*" \
        --connection-string "$AZURE_STORAGE_CONNECTION_STRING"
    echo "Upload completed"
fi

# Cleanup old local backups
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
find ${BACKUP_DIR} -name "*_${ENVIRONMENT}_*" -type f -mtime +${RETENTION_DAYS} -delete

# Test restore (weekly on Sundays)
if [ "$(date +%u)" = "7" ] && [ "$ENVIRONMENT" = "prod" ]; then
    echo "Running weekly restore test..."
    ./scripts/test-restore.sh "${BACKUP_DIR}/postgres_${ENVIRONMENT}_${DATE}.dump"
fi

echo "Backup completed successfully at $(date)"