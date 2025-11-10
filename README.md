# SCI Solia Invest Platform

Welcome to the SCI Solia Invest Platform repository! This project aims to provide a comprehensive SaaS solution for managing investments and properties.

## 📱 Installation Mobile (PWA)

L'application SCI Solia Invest est disponible en tant que **Progressive Web App (PWA)** et peut être installée directement sur votre téléphone ou tablette !

### Installation Rapide

**Sur Android (Chrome):**
1. Ouvrez le site dans Chrome
2. Cliquez sur "Installer l'app" ou menu ⋮ > "Ajouter à l'écran d'accueil"
3. Confirmez l'installation

**Sur iPhone/iPad (Safari):**
1. Ouvrez le site dans Safari
2. Appuyez sur le bouton Partager (carré avec flèche ↑)
3. Sélectionnez "Sur l'écran d'accueil"
4. Appuyez sur "Ajouter"

📖 **Guide complet:** Consultez [GUIDE_INSTALLATION_MOBILE.md](GUIDE_INSTALLATION_MOBILE.md) pour des instructions détaillées.

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

4. **Run the frontend PWA:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Project Structure

- `frontend/`: Next.js PWA application with mobile support
- `backend/`: Backend API server
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
