.PHONY: help install dev build test lint clean certs up down logs restart health deploy security audit

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

help: ## Show this help message
	@echo "$(BLUE)SCI Solia Invest - DevOps Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

# Development Commands
install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	pnpm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

dev: ## Start development environment
	@echo "$(BLUE)Starting development environment...$(NC)"
	cd infrastructure/environments/dev && docker-compose up -d
	@echo "$(GREEN)✓ Development environment started$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:4000"
	@echo "PgAdmin: http://localhost:5050"
	@echo "Mailhog: http://localhost:8025"

dev-stop: ## Stop development environment
	@echo "$(BLUE)Stopping development environment...$(NC)"
	cd infrastructure/environments/dev && docker-compose down
	@echo "$(GREEN)✓ Development environment stopped$(NC)"

# Build Commands
build: ## Build application
	@echo "$(BLUE)Building application...$(NC)"
	pnpm run build
	@echo "$(GREEN)✓ Build completed$(NC)"

build-docker: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker build -f Dockerfile.backend -t solia-backend:latest .
	docker build -f Dockerfile.frontend -t solia-frontend:latest .
	@echo "$(GREEN)✓ Docker images built$(NC)"

# Testing Commands
test: ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	pnpm run test
	@echo "$(GREEN)✓ Tests completed$(NC)"

test-watch: ## Run tests in watch mode
	pnpm run test:watch

test-coverage: ## Run tests with coverage
	@echo "$(BLUE)Running tests with coverage...$(NC)"
	pnpm run test --coverage
	@echo "$(GREEN)✓ Coverage report generated$(NC)"

# Code Quality Commands
lint: ## Run linters
	@echo "$(BLUE)Running linters...$(NC)"
	pnpm run lint
	@echo "$(GREEN)✓ Linting completed$(NC)"

lint-fix: ## Run linters with auto-fix
	@echo "$(BLUE)Running linters with auto-fix...$(NC)"
	pnpm run lint --fix
	@echo "$(GREEN)✓ Linting completed$(NC)"

type-check: ## Run TypeScript type checking
	@echo "$(BLUE)Running type check...$(NC)"
	pnpm run type-check
	@echo "$(GREEN)✓ Type check completed$(NC)"

# Security Commands
security: ## Run security scans
	@echo "$(BLUE)Running security scans...$(NC)"
	pnpm audit
	@echo "$(GREEN)✓ Security scan completed$(NC)"

audit: ## Run dependency audit
	@echo "$(BLUE)Running dependency audit...$(NC)"
	pnpm audit --audit-level=moderate
	@echo "$(GREEN)✓ Audit completed$(NC)"

# Docker Commands
certs: ## Generate SSL certificates
	@echo "$(BLUE)Generating SSL certificates...$(NC)"
	@mkdir -p nginx/certs
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout nginx/certs/server.key \
		-out nginx/certs/server.crt \
		-subj "/C=FR/ST=IDF/L=Paris/O=SCI Solia Invest/CN=localhost"
	@echo "$(GREEN)✓ Certificates generated$(NC)"

up: ## Start production stack
	@echo "$(BLUE)Starting production stack...$(NC)"
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ Stack started on https://localhost$(NC)"

down: ## Stop production stack
	@echo "$(BLUE)Stopping production stack...$(NC)"
	docker-compose -f docker-compose.prod.yml down
	@echo "$(GREEN)✓ Stack stopped$(NC)"

restart: down up ## Restart production stack

logs: ## Show logs
	docker-compose -f docker-compose.prod.yml logs -f

logs-backend: ## Show backend logs
	docker-compose -f docker-compose.prod.yml logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose -f docker-compose.prod.yml logs -f frontend

ps: ## Show running containers
	docker-compose -f docker-compose.prod.yml ps

# Health and Status
health: ## Check health status
	@echo "$(BLUE)Checking health status...$(NC)"
	@curl -f http://localhost:4000/health || echo "$(YELLOW)Backend not responding$(NC)"
	@curl -f http://localhost:3000/api/health || echo "$(YELLOW)Frontend not responding$(NC)"
	@echo "$(GREEN)✓ Health check completed$(NC)"

status: ## Show system status
	@echo "$(BLUE)System Status$(NC)"
	@echo ""
	@echo "Docker Containers:"
	@docker-compose -f docker-compose.prod.yml ps
	@echo ""
	@echo "Kubernetes Pods (if available):"
	@kubectl get pods 2>/dev/null || echo "Kubernetes not configured"

# Deployment Commands
deploy-dev: ## Deploy to development
	./infrastructure/scripts/deploy.sh dev

deploy-staging: ## Deploy to staging
	./infrastructure/scripts/deploy.sh staging

deploy-prod: ## Deploy to production
	./infrastructure/scripts/deploy.sh prod

rollback-staging: ## Rollback staging deployment
	./infrastructure/scripts/deploy.sh staging --rollback

rollback-prod: ## Rollback production deployment
	./infrastructure/scripts/deploy.sh prod --rollback

# Cleanup Commands
clean: down ## Clean volumes and containers
	@echo "$(BLUE)Cleaning up...$(NC)"
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f
	@echo "$(GREEN)✓ Cleanup completed$(NC)"

clean-all: clean ## Clean everything including node_modules
	@echo "$(BLUE)Cleaning all...$(NC)"
	rm -rf node_modules
	rm -rf packages/*/node_modules
	rm -rf packages/*/dist
	rm -rf .next
	@echo "$(GREEN)✓ All cleaned$(NC)"

# Utility Commands
shell-backend: ## Open shell in backend container
	docker-compose -f docker-compose.prod.yml exec backend /bin/sh

shell-frontend: ## Open shell in frontend container
	docker-compose -f docker-compose.prod.yml exec frontend /bin/sh

db-migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	pnpm run migrate
	@echo "$(GREEN)✓ Migrations completed$(NC)"

db-seed: ## Seed database
	@echo "$(BLUE)Seeding database...$(NC)"
	pnpm run seed
	@echo "$(GREEN)✓ Database seeded$(NC)"

# Documentation
docs: ## Generate documentation
	@echo "$(BLUE)Generating documentation...$(NC)"
	@echo "Documentation available in docs/"
	@echo "$(GREEN)✓ Documentation generated$(NC)"