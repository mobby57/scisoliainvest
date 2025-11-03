-- Script d'initialisation PostgreSQL pour SCI Solia Invest
-- Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Créer un utilisateur pour l'application si nécessaire
-- (optionnel, postgres par défaut suffit pour le dev)