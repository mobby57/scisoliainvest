-- Script d'initialisation PostgreSQL pour SCI Solia Invest
-- Ce script sera exécuté automatiquement lors du premier démarrage

-- Créer la base de données principale si elle n'existe pas
SELECT 'CREATE DATABASE sci_solia_invest'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sci_solia_invest')\gexec

-- Se connecter à la base de données
\c sci_solia_invest;

-- Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Créer le schéma principal
CREATE SCHEMA IF NOT EXISTS public;

-- Créer un utilisateur pour l'application (optionnel)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'sci_app_user') THEN
        CREATE ROLE sci_app_user WITH LOGIN PASSWORD 'sci_app_password';
    END IF;
END
$$;

-- Accorder les permissions
GRANT CONNECT ON DATABASE sci_solia_invest TO sci_app_user;
GRANT USAGE ON SCHEMA public TO sci_app_user;
GRANT CREATE ON SCHEMA public TO sci_app_user;

-- Créer les tables de base (sera complété par Prisma)
CREATE TABLE IF NOT EXISTS _prisma_migrations (
    id VARCHAR(36) PRIMARY KEY,
    checksum VARCHAR(64) NOT NULL,
    finished_at TIMESTAMPTZ,
    migration_name VARCHAR(255) NOT NULL,
    logs TEXT,
    rolled_back_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    applied_steps_count INTEGER NOT NULL DEFAULT 0
);

-- Insérer des données de test (optionnel)
INSERT INTO _prisma_migrations (id, checksum, migration_name, applied_steps_count)
VALUES ('init', 'init_checksum', '0_init', 0)
ON CONFLICT (id) DO NOTHING;

-- Afficher un message de confirmation
SELECT 'Base de données PostgreSQL initialisée avec succès pour SCI Solia Invest' as message;