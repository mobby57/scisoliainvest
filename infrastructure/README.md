# Infrastructure

This directory contains all infrastructure as code (IaC) and deployment configurations for the SCI Solia Invest platform.

## Directory Structure

```
infrastructure/
├── terraform/           # Terraform configurations for cloud resources
│   ├── modules/        # Reusable Terraform modules
│   ├── environments/   # Environment-specific configurations
│   └── backend.tf      # Terraform backend configuration
├── ansible/            # Ansible playbooks for configuration management
│   ├── playbooks/      # Deployment and configuration playbooks
│   ├── roles/          # Ansible roles
│   └── inventory/      # Inventory files for different environments
├── helm/               # Helm charts for Kubernetes deployments
│   ├── charts/         # Custom Helm charts
│   └── values/         # Environment-specific values
├── environments/       # Environment-specific configurations
│   ├── dev/           # Development environment
│   ├── staging/       # Staging environment
│   └── prod/          # Production environment
├── monitoring/         # Monitoring and observability configurations
│   ├── prometheus/    # Prometheus configurations
│   ├── grafana/       # Grafana dashboards
│   └── alerts/        # Alert rules
└── scripts/           # Deployment and maintenance scripts
```

## Prerequisites

- **Terraform**: v1.5+
- **Ansible**: v2.15+
- **Helm**: v3.12+
- **kubectl**: v1.27+
- **Docker**: v24.0+

## Getting Started

### 1. Terraform Setup

```bash
cd terraform/environments/dev
terraform init
terraform plan
terraform apply
```

### 2. Ansible Configuration

```bash
cd ansible
ansible-playbook -i inventory/dev playbooks/deploy.yml
```

### 3. Helm Deployment

```bash
cd helm
helm install solia-invest ./charts/solia-invest -f values/dev.yaml
```

## Environment Management

Each environment (dev, staging, prod) has its own:
- Configuration files
- Secrets (managed via external secret managers)
- Resource scaling parameters
- Monitoring rules

## Security

- Secrets are managed using AWS Secrets Manager / Azure Key Vault
- Access is controlled via IAM roles and RBAC
- All traffic is encrypted (TLS 1.3)
- Regular security scanning via automated workflows

## Monitoring

- Prometheus for metrics collection
- Grafana for visualization
- AlertManager for incident management
- ELK Stack for centralized logging

## Disaster Recovery

- Automated backups every 6 hours
- Point-in-time recovery enabled
- Multi-region replication for production
- Regular DR drills scheduled

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on infrastructure changes.

## Support

For infrastructure issues, contact the DevOps team or create an issue with the `infrastructure` label.
