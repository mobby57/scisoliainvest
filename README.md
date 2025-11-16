# SCI Solia Invest Platform

Welcome to the SCI Solia Invest Platform repository! This project aims to provide a comprehensive SaaS solution for managing investments and properties.

## 📊 Project Status

**Choose your preferred view:**

- 📋 **[TABLEAU_DE_BORD.md](TABLEAU_DE_BORD.md)** - Visual dashboard with metrics and progress bars (Recommended for quick overview)
- 📄 **[ETAT_PROJET_RESUME.md](ETAT_PROJET_RESUME.md)** - Executive summary in French (Quick 1-minute read)
- 📚 **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Comprehensive detailed status (Complete reference)

These documents include:
- Current architecture and technology stack
- Completed features and work in progress  
- Detailed TODO tracking across all project areas
- Next steps and priorities
- Metrics and health indicators

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/sci-solia-invest.git
   cd sci-solia-invest
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

## Project Structure

- `packages/api`: Contains the backend API code.
- `packages/client`: Contains the frontend application code.
- `packages/shared`: Shared code between the client and server.
- `infrastructure`: Infrastructure-related files (e.g., Docker, Terraform).
- `scripts`: Utility scripts for development and deployment.

## Security

This project includes comprehensive security scanning:

- **Dependabot**: Automated dependency updates and vulnerability alerts
- **Trivy**: Container and filesystem vulnerability scanning
- **OWASP ZAP**: Dynamic application security testing (DAST)

For detailed information about security scanning setup and configuration, see the [Security Scanning Guide](docs/SECURITY_SCANNING_GUIDE.md).

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License.
