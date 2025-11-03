#!/bin/bash
# Script de réparation des permissions et installation des gems Ruby pour api_ruby
set -e

cd "$(dirname "$0")/../packages/api_ruby"
echo "[1/4] Correction des droits sur tout le projet..."
sudo chown -R "$(whoami):$(whoami)" .

if [ -d vendor/bundle ]; then
  echo "[2/4] Suppression du dossier vendor/bundle bloqué..."
  rm -rf vendor/bundle
fi

echo "[3/4] Création du dossier vendor/bundle avec les bons droits..."
mkdir -p vendor/bundle
chmod -R u+rwx vendor/bundle

echo "[4/4] Installation des gems Ruby..."
bundle install

echo "✅ Réparation terminée."
