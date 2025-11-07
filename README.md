# SCI Solia Invest Platform

Welcome to the SCI Solia Invest Platform repository! This project provides a comprehensive SaaS solution for managing investments and properties.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm
- PostgreSQL (for backend database)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mobby57/scisoliainvest.git
   cd scisoliainvest
   ```

2. **Install root dependencies:**

   ```bash
   npm install
   ```

3. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install frontend dependencies:**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

#### Backend (Port 5000)

```bash
cd backend
npm run dev
```

#### Frontend (Port 5173 with Next.js)

```bash
cd frontend
npm run dev
```

## 📁 Project Structure

- `backend/`: Express.js backend API
  - `server.js`: Main server file
  - `package.json`: Backend dependencies
- `frontend/`: Next.js frontend application
  - `package.json`: Frontend dependencies (Next.js 14.2.33+, React 18)
- `packages/`: Monorepo packages (in progress)
  - `api/`: API package configuration
- `scripts/`: Utility scripts for development and deployment
- `infrastructure/`: Infrastructure-related files (Docker, K8s)
- `docs/`: Project documentation

## 🔧 Technology Stack

### Backend
- Express.js 4.21+
- PostgreSQL
- CORS
- dotenv

### Frontend
- Next.js 14.2.33+ (with security patches)
- React 18
- TypeScript 5

### DevOps
- Docker & Docker Compose
- Kubernetes configurations
- Azure Pipelines

## 📝 Available Scripts

### Root Level
- `npm run audit`: Run audit CLI
- `npm run test`: Run all tests
- `npm run build`: Build all packages
- `npm run dev`: Run all packages in development mode
- `npm run lint`: Lint all packages

### Backend
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

### Frontend
- `npm run dev`: Start Next.js development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## 🔒 Security

This project follows security best practices:
- All dependencies are regularly updated
- Security vulnerabilities are addressed promptly
- Latest security patches are applied

## 📚 Documentation

For more detailed documentation, see:
- [Setup Guide](README-SETUP.md)
- [Docker Guide](README-DOCKER.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Testing Guide](TESTING_GUIDE.md)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## 📄 License

This project is licensed under the MIT License.

## 🆕 Recent Updates (November 2025)

- ✅ Updated Next.js from 14.0.0 to 14.2.33+ (security patches)
- ✅ Updated Express.js to 4.21+
- ✅ Updated all AWS SDK packages to 3.926.0
- ✅ Fixed all critical security vulnerabilities
- ✅ Refreshed project documentation
