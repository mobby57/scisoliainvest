.PHONY: help certs up down build logs clean

help: ## Afficher l'aide
	@echo "Commandes disponibles:"
	@echo "  make certs  - Générer les certificats SSL"
	@echo "  make up     - Lancer la stack Docker"
	@echo "  make down   - Arrêter la stack Docker"
	@echo "  make build  - Rebuilder les images"
	@echo "  make logs   - Voir les logs"
	@echo "  make clean  - Nettoyer les volumes"

certs: ## Générer les certificats SSL
	@echo "Génération des certificats SSL..."
	@mkdir -p nginx/certs
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout nginx/certs/server.key \
		-out nginx/certs/server.crt \
		-subj "/C=FR/ST=IDF/L=Paris/O=SCI Solia Invest/CN=localhost"
	@echo "✅ Certificats générés"

up: certs ## Lancer la stack Docker
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Stack lancée sur https://localhost"

down: ## Arrêter la stack Docker
	docker-compose -f docker-compose.prod.yml down

build: ## Rebuilder les images
	docker-compose -f docker-compose.prod.yml build --no-cache

logs: ## Voir les logs
	docker-compose -f docker-compose.prod.yml logs -f

clean: down ## Nettoyer les volumes
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f