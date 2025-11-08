# SCI Solia Invest - Smart Property Investment Platform

## 🏢 Overview

SCI Solia Invest is a comprehensive smart property investment platform that combines traditional real estate investment with modern IoT technology and AI-powered analytics. The platform enables investors to participate in Société Civile Immobilière (SCI) structures while leveraging smart building technologies for enhanced property management and returns.

## 🚀 Key Features

### Investment Management
- **SCI Creation & Management**: Complete lifecycle management of real estate investment companies
- **Multi-tenant Architecture**: Support for multiple investment groups and properties
- **Financial Analytics**: Real-time ROI calculations, cash flow analysis, and distribution management
- **KYC/AML Compliance**: Automated investor verification and regulatory compliance

### Smart Property Technology
- **IoT Integration**: Environmental sensors, security systems, and smart locks
- **Real-time Monitoring**: Property condition tracking and predictive maintenance
- **Energy Optimization**: Smart energy management and cost reduction
- **Security Systems**: Advanced access control and surveillance integration

### AI-Powered Insights
- **Predictive Analytics**: Market trends and property value forecasting
- **Amazon Q Integration**: AI-powered investment recommendations
- **Risk Assessment**: Automated risk analysis and mitigation strategies
- **Performance Optimization**: Data-driven property management recommendations

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: AWS Cognito + JWT
- **Cloud Infrastructure**: AWS (IoT Core, Timestream, S3, Lambda)
- **Containerization**: Docker + Docker Compose
- **Monitoring**: Grafana + Prometheus

### Project Structure
```
scisoliainvest.com/
├── packages/
│   ├── api/                 # Backend API services
│   ├── client/              # React frontend application
│   ├── shared/              # Shared types and utilities
│   └── tools-comptables-fiscaux-legaux/  # Legal & tax tools
├── infrastructure/          # AWS and deployment configurations
├── docs/                   # Documentation and guides
├── k8s/                    # Kubernetes manifests
├── nginx/                  # Reverse proxy configuration
└── scripts/                # Automation and deployment scripts
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Docker and Docker Compose
- PostgreSQL 14+
- AWS CLI (for cloud features)

### Local Development Setup

1. **Clone and Install Dependencies**
```bash
git clone https://github.com/yourusername/sci-solia-invest.git
cd sci-solia-invest
pnpm install
```

2. **Environment Configuration**
```bash
# Copy environment templates
cp .env.example .env
cp packages/api/.env.example packages/api/.env
cp packages/client/.env.example packages/client/.env

# Configure your environment variables
```

3. **Database Setup**
```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run database migrations
cd packages/api
npx prisma migrate dev
npx prisma generate
```

4. **Start Development Servers**
```bash
# Start all services
pnpm dev

# Or start individually
pnpm dev:api     # Backend API (port 3001)
pnpm dev:client  # Frontend (port 5173)
```

### Docker Development
```bash
# Start all services with Docker
docker-compose -f docker-compose.dev.yml up

# Access the application
# Frontend: http://localhost:5173
# API: http://localhost:3001
# Database: localhost:5432
```

## 📊 AWS IoT Integration

### IoT Core Setup
The platform integrates with AWS IoT Core for smart property management:

- **Device Management**: Automated provisioning and certificate management
- **Real-time Data**: Environmental sensors, security systems, energy monitoring
- **Analytics Pipeline**: Kinesis Data Streams → Timestream → QuickSight
- **OTA Updates**: Firmware management for IoT devices

### Getting Started with IoT
1. Configure AWS credentials with IoT permissions
2. Run the IoT setup script: `./scripts/setup-iot-infrastructure.sh`
3. Deploy device certificates and policies
4. Start data ingestion pipeline

See [AWS IoT Tutorial](docs/AWS_IAM_IDENTITY_CENTER_TUTORIAL_SCI.md) for detailed setup instructions.

## 🔐 Security & Compliance

### Authentication & Authorization
- **AWS Cognito**: Multi-factor authentication and user management
- **JWT Tokens**: Secure API access with refresh token rotation
- **RBAC**: Role-based access control for different user types
- **Session Management**: Secure session handling and timeout policies

### Data Protection
- **Encryption**: End-to-end encryption for sensitive data
- **GDPR Compliance**: Data privacy and user consent management
- **Audit Logging**: Comprehensive audit trails for all operations
- **Secrets Management**: AWS Secrets Manager integration

### Financial Security
- **PCI DSS**: Payment card industry compliance
- **AML/KYC**: Anti-money laundering and know-your-customer processes
- **Transaction Security**: Secure financial transaction processing
- **Regulatory Compliance**: French real estate investment regulations

## 🧪 Testing

### Test Suites
```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:unit        # Unit tests
pnpm test:integration # Integration tests
pnpm test:e2e         # End-to-end tests
pnpm test:security    # Security tests
```

### Test Coverage
- **Unit Tests**: Jest + Vitest for component and service testing
- **Integration Tests**: API endpoint and database integration testing
- **E2E Tests**: Cypress for full user journey testing
- **Security Tests**: Automated security vulnerability scanning

## 📈 Monitoring & Analytics

### Application Monitoring
- **Health Checks**: Automated service health monitoring
- **Performance Metrics**: Response times, throughput, error rates
- **Resource Usage**: CPU, memory, and database performance
- **User Analytics**: User behavior and feature usage tracking

### Business Intelligence
- **Investment Analytics**: Portfolio performance and ROI tracking
- **Property Insights**: Occupancy rates, maintenance costs, energy usage
- **Market Analysis**: Real estate market trends and forecasting
- **Compliance Reporting**: Regulatory and tax reporting automation

## 🚀 Deployment

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to AWS ECS
./scripts/deploy-to-aws.sh

# Deploy to Kubernetes
kubectl apply -f k8s/
```

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **AWS CodePipeline**: Production deployment pipeline
- **Docker Registry**: Container image management
- **Blue-Green Deployment**: Zero-downtime deployments

## 📚 Documentation

### Developer Guides
- [API Documentation](docs/API_DOCUMENTATION_PHASE1_COMPLETE.md)
- [Frontend Development Guide](packages/client/README-FRONTEND.md)
- [Database Schema](packages/api/ARCHITECTURE.md)
- [AWS Setup Guide](docs/AWS_IAM_IDENTITY_CENTER_TUTORIAL_SCI.md)

### Business Documentation
- [Business Requirements](BUSINESS_REQUIREMENTS.md)
- [Legal Compliance](docs/GUIDE_DEVELOPPEMENT_SCI_SOLIA.md)
- [Investment Process](docs/PLANNING_OPERATIONNEL_M1_M18.md)
- [Security Checklist](docs/AWS_SECURITY_CHECKLIST_IMPLEMENTATION_GUIDE.md)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check the [docs/](docs/) directory
- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions
- **Email**: Contact the development team at dev@scisoliainvest.com

### Professional Services
For enterprise support, custom development, or consulting services, contact our professional services team.

---

**SCI Solia Invest** - Revolutionizing real estate investment through smart technology and AI-powered insights.
## Copilot AI agent instructions

We maintain a guidance document for Copilot and automated code agents to follow repository conventions and safety rules. See `docs/copilot-instructions.md` for details.

## Copilot AI agent instructions

We maintain a guidance document for Copilot and automated code agents to follow repository conventions and safety rules. See `docs/copilot-instructions.md` for details.
