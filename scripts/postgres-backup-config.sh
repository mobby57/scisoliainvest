#!/bin/bash

# Configuration des backups PostgreSQL pour SCI Solia Invest
# Usage: ./postgres-backup-config.sh [setup|backup|restore]

set -e

# Variables de configuration
DB_NAME="${POSTGRES_DB:-scisoliainvest}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
BACKUP_DIR="${BACKUP_DIR:-./backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

# Créer le répertoire de backup
setup_backup_dir() {
    mkdir -p "$BACKUP_DIR"
    echo "✓ Répertoire de backup créé: $BACKUP_DIR"
}

# Backup complet
create_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$BACKUP_DIR/${DB_NAME}_backup_${timestamp}.sql"
    
    echo "🔄 Création du backup: $backup_file"
    
    PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --verbose \
        --no-owner \
        --no-privileges \
        > "$backup_file"
    
    gzip "$backup_file"
    echo "✅ Backup créé: ${backup_file}.gz"
}

# Nettoyage des anciens backups
cleanup_old_backups() {
    echo "🧹 Nettoyage des backups > $RETENTION_DAYS jours"
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "✅ Nettoyage terminé"
}

# Restauration
restore_backup() {
    local backup_file="$1"
    
    if [[ ! -f "$backup_file" ]]; then
        echo "❌ Fichier de backup non trouvé: $backup_file"
        exit 1
    fi
    
    echo "🔄 Restauration depuis: $backup_file"
    
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | PGPASSWORD="$POSTGRES_PASSWORD" psql \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "$DB_NAME"
    else
        PGPASSWORD="$POSTGRES_PASSWORD" psql \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            < "$backup_file"
    fi
    
    echo "✅ Restauration terminée"
}

# Configuration du cron job
setup_cron() {
    local script_path=$(realpath "$0")
    local cron_entry="0 2 * * * $script_path backup"
    
    (crontab -l 2>/dev/null; echo "$cron_entry") | crontab -
    echo "✅ Cron job configuré: backup quotidien à 2h00"
}

# Fonction principale
main() {
    case "${1:-setup}" in
        setup)
            setup_backup_dir
            setup_cron
            ;;
        backup)
            setup_backup_dir
            create_backup
            cleanup_old_backups
            ;;
        restore)
            if [[ -z "$2" ]]; then
                echo "Usage: $0 restore <backup_file>"
                exit 1
            fi
            restore_backup "$2"
            ;;
        *)
            echo "Usage: $0 {setup|backup|restore <file>}"
            exit 1
            ;;
    esac
}

main "$@"