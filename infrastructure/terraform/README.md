# Terraform Infrastructure

This directory contains Terraform configurations for provisioning AWS infrastructure for the SCI Solia Invest platform.

## Structure

```
terraform/
├── main.tf              # Main Terraform configuration
├── variables.tf         # Input variables
├── outputs.tf          # Output values
├── backend.tf          # Terraform backend configuration (S3)
├── modules/            # Reusable Terraform modules
│   ├── vpc/           # VPC with public/private subnets
│   ├── eks/           # EKS cluster configuration
│   ├── rds/           # PostgreSQL RDS instance
│   ├── elasticache/   # Redis ElastiCache cluster
│   ├── ecr/           # ECR repositories
│   └── iam/           # IAM roles and policies
└── environments/       # Environment-specific configurations
    ├── dev/
    ├── staging/
    └── prod/
```

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform v1.5.0 or later
- AWS account with appropriate permissions

## Quick Start

### 1. Initialize Terraform

```bash
cd infrastructure/terraform
terraform init
```

### 2. Configure Variables

Create a `terraform.tfvars` file:

```hcl
aws_region     = "eu-west-1"
environment    = "dev"
project_name   = "solia-invest"
vpc_cidr       = "10.0.0.0/16"

# Database
database_username = "solia_admin"
database_password = "CHANGE_ME_SECURE_PASSWORD"  # Use AWS Secrets Manager
```

**Important**: Never commit `terraform.tfvars` to version control!

### 3. Plan Infrastructure

```bash
terraform plan
```

### 4. Apply Infrastructure

```bash
terraform apply
```

## Modules

### VPC Module

Creates a VPC with public and private subnets across multiple availability zones.

**Features:**
- Public subnets with Internet Gateway
- Private subnets with NAT Gateways
- Route tables and associations
- Tags for Kubernetes integration

**Usage:**
```hcl
module "vpc" {
  source = "./modules/vpc"
  
  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr          = var.vpc_cidr
  availability_zones = var.availability_zones
  tags              = var.tags
}
```

### RDS Module

Creates a PostgreSQL RDS instance with best practices.

**Features:**
- Multi-AZ deployment for high availability
- Automated backups
- Enhanced monitoring
- Encryption at rest
- CloudWatch logs
- Performance Insights

**Usage:**
```hcl
module "rds" {
  source = "./modules/rds"
  
  project_name        = var.project_name
  environment         = var.environment
  vpc_id             = module.vpc.vpc_id
  vpc_cidr           = module.vpc.vpc_cidr
  subnet_ids         = module.vpc.private_subnet_ids
  instance_class     = var.rds_instance_class
  allocated_storage  = var.rds_allocated_storage
  database_name      = "solia_${var.environment}"
  database_username  = var.database_username
  database_password  = var.database_password
  multi_az          = var.environment == "prod"
  tags              = var.tags
}
```

## Environment-Specific Configurations

### Development

```bash
terraform workspace new dev
terraform workspace select dev
terraform apply -var-file="environments/dev/terraform.tfvars"
```

### Staging

```bash
terraform workspace new staging
terraform workspace select staging
terraform apply -var-file="environments/staging/terraform.tfvars"
```

### Production

```bash
terraform workspace new prod
terraform workspace select prod
terraform apply -var-file="environments/prod/terraform.tfvars"
```

## State Management

Terraform state is stored in S3 with DynamoDB for locking:

```hcl
terraform {
  backend "s3" {
    bucket         = "solia-invest-terraform-state"
    key            = "terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "solia-invest-terraform-locks"
  }
}
```

### Setup State Backend

```bash
# Create S3 bucket
aws s3 mb s3://solia-invest-terraform-state --region eu-west-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket solia-invest-terraform-state \
  --versioning-configuration Status=Enabled

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name solia-invest-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region eu-west-1
```

## Best Practices

1. **Use Workspaces** for environment separation
2. **Store state remotely** in S3
3. **Enable state locking** with DynamoDB
4. **Use modules** for reusability
5. **Version pin providers** in production
6. **Never commit secrets** to version control
7. **Use AWS Secrets Manager** for sensitive data
8. **Run `terraform plan`** before apply
9. **Review changes carefully** in production
10. **Tag all resources** for cost tracking

## Common Commands

```bash
# Initialize Terraform
terraform init

# Format code
terraform fmt -recursive

# Validate configuration
terraform validate

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy infrastructure
terraform destroy

# Show current state
terraform show

# List resources
terraform state list

# Import existing resource
terraform import aws_instance.example i-1234567890abcdef0

# Refresh state
terraform refresh

# View outputs
terraform output
```

## Outputs

After applying, you can view outputs:

```bash
terraform output

# Specific output
terraform output vpc_id
terraform output rds_endpoint
```

## Troubleshooting

### State Lock Issues

If state is locked:

```bash
# Force unlock (use with caution!)
terraform force-unlock <LOCK_ID>
```

### Module Not Found

```bash
# Get modules
terraform get

# Update modules
terraform get -update
```

### Import Existing Resources

```bash
# Import VPC
terraform import module.vpc.aws_vpc.main vpc-12345678

# Import RDS
terraform import module.rds.aws_db_instance.main solia-prod-postgres
```

## Security Considerations

1. **Encryption**: All data encrypted at rest and in transit
2. **IAM**: Use least privilege principle
3. **Secrets**: Use AWS Secrets Manager
4. **Network**: Private subnets for databases
5. **Monitoring**: Enable CloudWatch logs
6. **Backups**: Automated daily backups
7. **MFA**: Require MFA for sensitive operations
8. **Audit**: Enable CloudTrail for all API calls

## Cost Optimization

1. Use appropriate instance sizes
2. Enable auto-scaling for EKS
3. Use Reserved Instances for production
4. Set up budget alerts
5. Regular review of unused resources
6. Use Spot Instances where appropriate
7. Right-size RDS instances
8. Delete old snapshots

## Maintenance

### Regular Tasks

- Update Terraform version
- Update provider versions
- Review security groups
- Check for unused resources
- Verify backup procedures
- Test disaster recovery
- Review and update tags
- Check cost reports

### Updating Infrastructure

```bash
# Review planned changes
terraform plan

# Apply with auto-approval (use carefully)
terraform apply -auto-approve

# Apply specific resource
terraform apply -target=module.vpc
```

## Support

For infrastructure issues:
- DevOps Team: devops@solia-invest.com
- Create issue with `infrastructure` label
- Check runbook: `docs/DEVOPS.md`

## Additional Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [DevOps Guide](../../docs/DEVOPS.md)
- [Infrastructure README](../README.md)
