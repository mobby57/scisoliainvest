# Solia Invest Helm Charts

This directory contains Helm charts for deploying the SCI Solia Invest platform to Kubernetes.

## Prerequisites

- Kubernetes 1.27+
- Helm 3.12+
- kubectl configured to communicate with your cluster

## Installation

### Quick Start

```bash
# Add required Helm repositories
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install for development
helm install solia-invest ./solia-invest -f values-dev.yaml

# Install for staging
helm install solia-invest ./solia-invest -f values-staging.yaml

# Install for production
helm install solia-invest ./solia-invest -f values-prod.yaml
```

### Custom Installation

1. **Copy and customize values file**:
   ```bash
   cp solia-invest/values.yaml my-values.yaml
   # Edit my-values.yaml with your settings
   ```

2. **Create secrets** (before installation):
   ```bash
   kubectl create secret generic solia-invest-secrets \
     --from-literal=database-url="postgresql://user:pass@host:5432/db" \
     --from-literal=redis-url="redis://host:6379" \
     --from-literal=jwt-secret="your-secret-key"
   ```

3. **Install the chart**:
   ```bash
   helm install solia-invest ./solia-invest -f my-values.yaml
   ```

## Configuration

### Key Configuration Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `global.environment` | Environment name | `production` |
| `global.domain` | Base domain | `solia-invest.com` |
| `image.registry` | Container registry | `ghcr.io` |
| `image.tag` | Image tag | `latest` |
| `backend.replicaCount` | Number of backend replicas | `2` |
| `frontend.replicaCount` | Number of frontend replicas | `2` |
| `backend.resources.limits.cpu` | Backend CPU limit | `1000m` |
| `backend.resources.limits.memory` | Backend memory limit | `1Gi` |
| `postgresql.enabled` | Enable PostgreSQL | `true` |
| `redis.enabled` | Enable Redis | `true` |
| `ingress.enabled` | Enable ingress | `true` |
| `monitoring.enabled` | Enable monitoring | `true` |

### Environment-Specific Values

- **Development**: `values-dev.yaml` - Minimal resources, no autoscaling
- **Staging**: `values-staging.yaml` - Moderate resources, basic autoscaling
- **Production**: `values-prod.yaml` - Full resources, advanced autoscaling

## Upgrading

```bash
# Upgrade with new values
helm upgrade solia-invest ./solia-invest -f values-prod.yaml

# Upgrade with specific version
helm upgrade solia-invest ./solia-invest -f values-prod.yaml --version 1.1.0

# Dry run to see changes
helm upgrade solia-invest ./solia-invest -f values-prod.yaml --dry-run --debug
```

## Rollback

```bash
# List release history
helm history solia-invest

# Rollback to previous revision
helm rollback solia-invest

# Rollback to specific revision
helm rollback solia-invest 2
```

## Uninstallation

```bash
# Uninstall release
helm uninstall solia-invest

# Keep release history
helm uninstall solia-invest --keep-history
```

## Chart Structure

```
solia-invest/
├── Chart.yaml              # Chart metadata
├── values.yaml            # Default values
├── templates/             # Kubernetes manifests templates
│   ├── _helpers.tpl       # Template helpers
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── ...
└── charts/                # Dependent charts
```

## Advanced Usage

### Custom Secrets Management

Using external secrets operator:

```yaml
# values.yaml
externalSecrets:
  enabled: true
  backend: aws-secrets-manager
  region: eu-west-1
```

### Resource Requests and Limits

Customize for your workload:

```yaml
backend:
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 2000m
      memory: 2Gi
```

### Autoscaling Configuration

```yaml
backend:
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
    targetMemoryUtilizationPercentage: 80
```

### Ingress Configuration

```yaml
ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: solia-invest.com
      paths:
        - path: /api
          pathType: Prefix
          backend:
            service:
              name: backend
              port: 4000
```

## Monitoring

The chart includes ServiceMonitor resources for Prometheus:

```yaml
monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
    interval: 30s
```

## Troubleshooting

### Check Release Status

```bash
helm status solia-invest
helm list
```

### Debug Template Rendering

```bash
helm template solia-invest ./solia-invest -f values-prod.yaml
```

### Check Pod Logs

```bash
kubectl logs -l app.kubernetes.io/name=solia-invest -c backend
kubectl logs -l app.kubernetes.io/name=solia-invest -c frontend
```

### Verify Resources

```bash
kubectl get all -l app.kubernetes.io/name=solia-invest
kubectl describe deployment solia-invest-backend
```

## Best Practices

1. **Always use version pinning** in production
2. **Test upgrades in staging** before production
3. **Use external secrets management** for sensitive data
4. **Enable monitoring and logging** in all environments
5. **Set appropriate resource limits** to prevent OOM kills
6. **Use pod disruption budgets** for high availability
7. **Regular backups** of persistent data
8. **Document custom values** for your deployment

## Support

For issues with the Helm chart:
- Create an issue in the repository
- Contact the DevOps team: devops@solia-invest.com

## Contributing

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for guidelines on contributing to the Helm charts.

## License

This Helm chart is licensed under the MIT License.
