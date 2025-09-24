#!/bin/bash
# MongoDB Dump and Restore Script
# Corrected container name: solia-mongo

echo "=== MongoDB Database Management Script ==="
echo "Using container: solia-mongo"
echo ""

# Function to create dump
create_dump() {
    echo "Creating database dump..."
    mkdir -p db-dump
    docker exec solia-mongo mongodump --db sciinvest_dev --out /dump
    docker cp solia-mongo:/dump ./db-dump
    echo "✅ Dump created successfully in ./db-dump/"
}

# Function to restore dump
restore_dump() {
    echo "Restoring database from dump..."
    if [ -d "./db-dump/sciinvest_dev" ]; then
        docker exec -i solia-mongo mongorestore --drop --db sciinvest_dev /dump/sciinvest_dev
        echo "✅ Database restored successfully"
    else
        echo "❌ Dump directory not found: ./db-dump/sciinvest_dev"
    fi
}

# Function to check database
check_db() {
    echo "Checking databases..."
    docker exec solia-mongo mongo --eval "show dbs"
}

# Function to check container
check_container() {
    echo "Checking container status..."
    docker ps | grep solia-mongo
}

# Main menu
case "$1" in
    "dump")
        create_dump
        ;;
    "restore")
        restore_dump
        ;;
    "check")
        check_db
        ;;
    "status")
        check_container
        ;;
    *)
        echo "Usage: $0 {dump|restore|check|status}"
        echo ""
        echo "Commands:"
        echo "  dump    - Create database dump"
        echo "  restore - Restore database from dump"
        echo "  check   - List databases"
        echo "  status  - Check container status"
        ;;
esac
