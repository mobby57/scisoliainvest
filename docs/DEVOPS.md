# DevOps Documentation

## Overview

This document provides comprehensive DevOps guidelines for the SCI Solia Invest platform. It covers deployment procedures, monitoring, security practices, and operational best practices.

## Table of Contents

1. [Architecture](#architecture)
2. [CI/CD Pipeline](#cicd-pipeline)
3. [Environment Management](#environment-management)
4. [Deployment Procedures](#deployment-procedures)
5. [Monitoring & Observability](#monitoring--observability)
6. [Security](#security)
7. [Disaster Recovery](#disaster-recovery)
8. [Troubleshooting](#troubleshooting)

## Architecture

### Infrastructure Components

- **Kubernetes Cluster**: EKS on AWS
- **Database**: PostgreSQL (RDS)
- **Cache**: Redis (ElastiCache)
- **Container Registry**: GitHub Container Registry (GHCR)
- **Monitoring**: Prometheus + Grafana
- **Logging**: CloudWatch Logs
- **CDN**: CloudFront

### Network Architecture

```
Internet
    │
    ├─► CloudFront (CDN)
    │
    ├─► ALB (Application Load Balancer)
    │       │
    │       ├─► Frontend (Next.js)
    │       └─► Backend API (Node.js)
    │
    ├─► RDS PostgreSQL (Multi-AZ)
    └─► ElastiCache Redis
```

## CI/CD Pipeline

### GitHub Actions Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Triggered on: Push to main/develop, Pull Requests
   - Steps: Lint → Type Check → Test → Build
   - Artifacts: Build outputs, test coverage

2. **Security Scanning** (`.github/workflows/security.yml`)
   - Triggered on: Push, PR, Weekly schedule
   - Scans: Dependencies, Code (CodeQL), Secrets, Docker images

3. **CD Pipeline** (`.github/workflows/cd.yml`)
   - Triggered on: Push to main, Tag creation
   - Steps: Build → Push images → Deploy → Health checks

4. **Code Quality** (`.github/workflows/code-quality.yml`)
   - Triggered on: Push, PR
   - Tools: SonarCloud, ESLint, Complexity analysis

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `hotfix/*`: Emergency fixes

### Release Process

1. Create release branch from `develop`
2. Bump version in `package.json`
3. Update `CHANGELOG.md`
4. Create PR to `main`
5. After merge, create Git tag: `v1.2.3`
6. Automated deployment to production

## Environment Management

### Environments

| Environment | Purpose | URL | Auto-deploy |
|------------|---------|-----|-------------|
| Development | Local dev & testing | localhost | No |
| Staging | Pre-production testing | staging.solia-invest.com | Yes (main branch) |
| Production | Live system | solia-invest.com | Yes (tags only) |

### Environment Variables

Managed through:
- **Development**: `.env` files (local)
- **Staging/Production**: AWS Secrets Manager

### Configuration Files

```
infrastructure/environments/
├── dev/
│   ├── .env.example
│   └── docker-compose.yml
├── staging/
│   └── .env.example
└── prod/
    └── .env.example
```

## Deployment Procedures

### Automated Deployment

Deployments are automated through GitHub Actions:

```bash
# Staging: Push to main branch
git push origin main

# Production: Create and push tag
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
```

### Manual Deployment

Use the deployment script:

```bash
# Deploy to staging
./infrastructure/scripts/deploy.sh staging --tag v1.2.3

# Deploy to production
./infrastructure/scripts/deploy.sh prod --tag v1.2.3

# Rollback
./infrastructure/scripts/deploy.sh prod --rollback

# Dry run
./infrastructure/scripts/deploy.sh staging --dry-run
```

### Health Checks

Health check endpoints:
- Backend: `GET /health`
- Frontend: `GET /api/health`

Expected response: HTTP 200 with JSON payload

### Rollback Procedure

1. **Automated rollback** (in CD pipeline on failure)
2. **Manual rollback**:
   ```bash
   kubectl rollout undo deployment/backend-deployment
   kubectl rollout undo deployment/frontend-deployment
   ```
3. **Emergency rollback**:
   ```bash
   ./infrastructure/scripts/deploy.sh prod --rollback
   ```

## Monitoring & Observability

### Prometheus Metrics

Key metrics monitored:
- HTTP request rate and latency
- Error rates (4xx, 5xx)
- CPU and memory usage
- Database connection pool
- Cache hit/miss ratio

### Grafana Dashboards

Access: `https://grafana.solia-invest.com`

Available dashboards:
1. Application Overview
2. Infrastructure Health
3. Database Performance
4. API Performance
5. Business Metrics

### Alerts

Configured in `infrastructure/monitoring/prometheus/alerts.yml`

Alert channels:
- Email
- Slack (#alerts channel)
- PagerDuty (critical only)

### Logging

Centralized logging via CloudWatch Logs

Log levels by environment:
- Development: `debug`
- Staging: `info`
- Production: `warn`

### Tracing

Distributed tracing with AWS X-Ray

## Security

### Security Scanning

Automated scans in CI/CD:
- **Dependency vulnerabilities**: npm audit
- **Code vulnerabilities**: CodeQL
- **Secrets**: TruffleHog
- **Docker images**: Trivy

### Secrets Management

- **Never commit secrets** to repository
- Use AWS Secrets Manager for staging/production
- Rotate secrets quarterly
- Use IAM roles for service authentication

### Access Control

- **GitHub**: Branch protection, required reviews
- **AWS**: IAM roles with least privilege
- **Kubernetes**: RBAC policies
- **Database**: Connection encryption (TLS)

### Compliance

- GDPR compliant data handling
- Regular security audits
- Automated compliance checks

## Disaster Recovery

### Backup Strategy

- **Database**: Automated daily backups, 30-day retention
- **Files**: S3 with versioning enabled
- **Configuration**: Infrastructure as Code in Git

### Recovery Procedures

1. **Database restore**:
   ```bash
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier solia-prod-restored \
     --db-snapshot-identifier solia-prod-snapshot-20241108
   ```

2. **Application recovery**:
   - Deploy previous stable version
   - Restore database from backup
   - Verify data integrity

### RTO & RPO

- **RTO** (Recovery Time Objective): 1 hour
- **RPO** (Recovery Point Objective): 6 hours

## Troubleshooting

### Common Issues

#### Pod CrashLoopBackOff

```bash
# Check logs
kubectl logs -f <pod-name>

# Describe pod
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

#### High Memory Usage

```bash
# Check resource usage
kubectl top pods

# Scale up if needed
kubectl scale deployment backend-deployment --replicas=5
```

#### Database Connection Issues

```bash
# Check database connectivity
kubectl exec -it <backend-pod> -- pg_isready -h <db-host>

# Check connection pool
kubectl logs <backend-pod> | grep "connection pool"
```

### Support Contacts

- **DevOps Team**: devops@solia-invest.com
- **On-call**: +33 X XX XX XX XX
- **Emergency**: Create P1 incident in PagerDuty

### Useful Commands

```bash
# View all pods
kubectl get pods -A

# View deployments
kubectl get deployments

# View services
kubectl get services

# View ingress
kubectl get ingress

# Stream logs
kubectl logs -f deployment/backend-deployment

# Execute command in pod
kubectl exec -it <pod-name> -- /bin/sh

# Port forward for debugging
kubectl port-forward service/backend 4000:4000
```

## Best Practices

1. **Always test in staging before production**
2. **Use feature flags for gradual rollouts**
3. **Monitor metrics after each deployment**
4. **Document all infrastructure changes**
5. **Regular security updates**
6. **Automated testing before deployment**
7. **Keep deployment scripts idempotent**
8. **Use semantic versioning**
9. **Maintain runbooks for common issues**
10. **Regular DR drills**

## Additional Resources

- [Infrastructure README](../infrastructure/README.md)
- [Kubernetes README](../k8s/README.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Security Policy](../SECURITY.md)
