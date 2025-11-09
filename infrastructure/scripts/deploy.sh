#!/bin/bash
set -euo pipefail

# Deployment script for Solia Invest platform
# Usage: ./deploy.sh <environment> [options]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
REGISTRY="ghcr.io/mobby57/scisoliainvest"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_usage() {
    cat << EOF
Usage: $0 <environment> [options]

Environments:
    dev         Deploy to development environment
    staging     Deploy to staging environment
    prod        Deploy to production environment

Options:
    --skip-tests        Skip running tests before deployment
    --skip-build        Skip building Docker images
    --tag TAG          Use specific tag (default: latest)
    --rollback         Rollback to previous deployment
    --dry-run          Show what would be deployed without actually deploying
    -h, --help         Show this help message

Examples:
    $0 dev
    $0 staging --tag v1.2.3
    $0 prod --skip-tests --tag v1.2.3
    $0 staging --rollback

EOF
    exit 0
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local missing_tools=()
    
    command -v kubectl >/dev/null 2>&1 || missing_tools+=("kubectl")
    command -v docker >/dev/null 2>&1 || missing_tools+=("docker")
    command -v helm >/dev/null 2>&1 || missing_tools+=("helm")
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        log_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    log_info "All prerequisites satisfied"
}

run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        log_warn "Skipping tests"
        return 0
    fi
    
    log_info "Running tests..."
    cd "$PROJECT_ROOT"
    
    if pnpm run test; then
        log_info "Tests passed"
    else
        log_error "Tests failed"
        exit 1
    fi
}

build_images() {
    if [ "$SKIP_BUILD" = true ]; then
        log_warn "Skipping build"
        return 0
    fi
    
    log_info "Building Docker images..."
    cd "$PROJECT_ROOT"
    
    docker build -f Dockerfile.backend -t "${REGISTRY}-backend:${TAG}" .
    docker build -f Dockerfile.frontend -t "${REGISTRY}-frontend:${TAG}" .
    
    if [ "$DRY_RUN" = false ]; then
        log_info "Pushing images to registry..."
        docker push "${REGISTRY}-backend:${TAG}"
        docker push "${REGISTRY}-frontend:${TAG}"
    fi
    
    log_info "Images built and pushed successfully"
}

deploy_to_k8s() {
    local env=$1
    
    log_info "Deploying to ${env} environment..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "Dry run - would deploy with tag: ${TAG}"
        kubectl diff -f "${PROJECT_ROOT}/k8s/" || true
        return 0
    fi
    
    # Apply Kubernetes manifests
    kubectl apply -f "${PROJECT_ROOT}/k8s/"
    
    # Update image tags
    kubectl set image deployment/backend-deployment backend="${REGISTRY}-backend:${TAG}"
    kubectl set image deployment/frontend-deployment frontend="${REGISTRY}-frontend:${TAG}"
    
    # Wait for rollout
    log_info "Waiting for rollout to complete..."
    kubectl rollout status deployment/backend-deployment --timeout=300s
    kubectl rollout status deployment/frontend-deployment --timeout=300s
    
    log_info "Deployment completed successfully"
}

rollback_deployment() {
    local env=$1
    
    log_warn "Rolling back deployment in ${env} environment..."
    
    kubectl rollout undo deployment/backend-deployment
    kubectl rollout undo deployment/frontend-deployment
    
    kubectl rollout status deployment/backend-deployment --timeout=300s
    kubectl rollout status deployment/frontend-deployment --timeout=300s
    
    log_info "Rollback completed"
}

run_health_checks() {
    log_info "Running health checks..."
    
    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app=backend --timeout=300s
    kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s
    
    log_info "Health checks passed"
}

# Parse arguments
ENVIRONMENT=""
SKIP_TESTS=false
SKIP_BUILD=false
TAG="latest"
ROLLBACK=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        dev|staging|prod)
            ENVIRONMENT=$1
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        --rollback)
            ROLLBACK=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            show_usage
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            ;;
    esac
done

# Validate environment
if [ -z "$ENVIRONMENT" ]; then
    log_error "Environment not specified"
    show_usage
fi

if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    log_error "Invalid environment: $ENVIRONMENT"
    show_usage
fi

# Main execution
log_info "Starting deployment to ${ENVIRONMENT} environment"
log_info "Tag: ${TAG}"

check_prerequisites

if [ "$ROLLBACK" = true ]; then
    rollback_deployment "$ENVIRONMENT"
    exit 0
fi

run_tests
build_images
deploy_to_k8s "$ENVIRONMENT"
run_health_checks

log_info "Deployment completed successfully!"
