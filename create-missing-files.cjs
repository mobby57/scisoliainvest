#!/usr/bin/env node

/**
 * Create Missing Files Script for SCI Solia Invest
 * This script creates the critical missing files identified by the project audit
 */

const fs = require('fs');
const path = require('path');

class MissingFilesCreator {
  constructor(projectRoot, dryRun = false) {
    this.projectRoot = projectRoot;
    this.dryRun = dryRun;
    this.createdFiles = [];
    this.createdDirs = [];
    this.errors = [];
  }

  /**
   * Create a file with content
   */
  createFile(filePath, content) {
    try {
      const fullPath = path.join(this.projectRoot, filePath);
      const dir = path.dirname(fullPath);

      if (this.dryRun) {
        console.log(`[DRY RUN] Would create: ${filePath}`);
        return true;
      }

      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.createdDirs.push(dir);
      }

      // Don't overwrite existing files
      if (fs.existsSync(fullPath)) {
        console.log(`⏭️  Skipping (exists): ${filePath}`);
        return false;
      }

      fs.writeFileSync(fullPath, content, 'utf8');
      this.createdFiles.push(filePath);
      console.log(`✅ Created: ${filePath}`);
      return true;
    } catch (error) {
      this.errors.push({ file: filePath, error: error.message });
      console.error(`❌ Error creating ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * Create all missing critical files
   */
  createAllMissingFiles() {
    console.log('🔨 Creating missing critical files...\n');

    // packages/api files
    this.createApiPackageFiles();
    
    // backend files
    this.createBackendFiles();
    
    // frontend files
    this.createFrontendFiles();
    
    // root files
    this.createRootFiles();

    console.log('\n📊 Summary:');
    console.log(`  ✅ Files created: ${this.createdFiles.length}`);
    console.log(`  📁 Directories created: ${this.createdDirs.length}`);
    console.log(`  ❌ Errors: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(err => {
        console.log(`  - ${err.file}: ${err.error}`);
      });
    }
  }

  /**
   * Create packages/api files
   */
  createApiPackageFiles() {
    console.log('\n📦 Creating packages/api files...');

    // package.json
    this.createFile('packages/api/package.json', `{
  "name": "@scisoliainvest/api",
  "version": "1.0.0",
  "description": "API backend for SCI Solia Invest platform",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.3",
    "winston": "^3.11.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.10.5",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "eslint": "^8.56.0",
    "jest": "^29.7.0",
    "prisma": "^5.7.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
`);

    // tsconfig.json
    this.createFile('packages/api/tsconfig.json', `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["node", "jest"],
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
`);

    // README.md
    this.createFile('packages/api/README.md', `# SCI Solia Invest - API

Backend API for the SCI Solia Invest platform.

## Features

- RESTful API with Express.js
- TypeScript for type safety
- JWT authentication
- Role-based authorization
- PostgreSQL with Prisma ORM
- MongoDB for documents and logs
- Input validation with Zod
- Security best practices (OWASP ASVS Level 2)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- MongoDB 5+ (optional)
- pnpm

### Installation

\`\`\`bash
pnpm install
\`\`\`

### Configuration

Create a \`.env\` file based on \`.env.example\`:

\`\`\`bash
cp .env.example .env
\`\`\`

### Database Setup

\`\`\`bash
pnpm prisma:migrate
pnpm prisma:generate
\`\`\`

### Development

\`\`\`bash
pnpm dev
\`\`\`

### Production Build

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## API Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Testing

\`\`\`bash
pnpm test
\`\`\`

## License

MIT
`);

    // src/index.ts
    this.createFile('packages/api/src/index.ts', `import { app } from './server.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(\`🚀 Server running on port \${PORT}\`);
  logger.info(\`📝 Environment: \${config.nodeEnv}\`);
});
`);

    // src/server.ts
    this.createFile('packages/api/src/server.ts', `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import { securityMiddleware } from './middleware/security.js';
import routes from './routes/index.js';

export const app = express();

// Security middleware
app.use(helmet());
app.use(securityMiddleware);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;
`);

    // src/config/env.ts
    this.createFile('packages/api/src/config/env.ts', `import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  BCRYPT_ROUNDS: z.string().default('12'),
  CORS_ORIGIN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parseInt(parsed.data.PORT, 10),
  databaseUrl: parsed.data.DATABASE_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
  bcryptRounds: parseInt(parsed.data.BCRYPT_ROUNDS, 10),
  corsOrigin: parsed.data.CORS_ORIGIN,
};
`);

    // src/config/logger.ts
    this.createFile('packages/api/src/config/logger.ts', `import winston from 'winston';
import { config } from './env.js';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
`);

    // src/config/database.ts
    this.createFile('packages/api/src/config/database.ts', `import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

prisma.$on('query', (e) => {
  logger.debug(\`Query: \${e.query}\`);
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}
`);

    // Middleware files
    this.createFile('packages/api/src/middleware/auth.middleware.ts', `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
`);

    this.createFile('packages/api/src/middleware/errorHandler.ts', `import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
    },
  });
};
`);

    this.createFile('packages/api/src/middleware/validation.middleware.ts', `import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          details: error.errors,
        },
      });
    }
  };
};
`);

    this.createFile('packages/api/src/middleware/security.ts', `import { Request, Response, NextFunction } from 'express';

export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Remove powered by header
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  next();
};
`);

    this.createFile('packages/api/src/middleware/rateLimiter.ts', `import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit auth attempts
  message: 'Too many authentication attempts, please try again later.',
});
`);

    this.createFile('packages/api/src/middleware/csrf.ts', `import { Request, Response, NextFunction } from 'express';

export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement CSRF protection
  // For now, just pass through
  next();
};
`);

    this.createFile('packages/api/src/middleware/audit.middleware.ts', `import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: \`\${duration}ms\`,
      ip: req.ip,
    });
  });

  next();
};
`);

    // Models
    this.createFile('packages/api/src/models/User.ts', `export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'INVESTOR' | 'ADMIN' | 'PORTFOLIO_MANAGER';
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  tenantId: string;
}
`);

    // Routes
    this.createFile('packages/api/src/routes/index.ts', `import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './users.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
`);

    this.createFile('packages/api/src/routes/auth.routes.ts', `import express from 'express';

const router = express.Router();

// TODO: Implement authentication endpoints
router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/refresh', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
`);

    this.createFile('packages/api/src/routes/users.routes.ts', `import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all user routes
router.use(authMiddleware);

// TODO: Implement user endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
`);

    // Utils
    this.createFile('packages/api/src/utils/validators.ts', `import { z } from 'zod';

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8).max(100);

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
  }),
});
`);

    this.createFile('packages/api/src/utils/encryption.ts', `import bcrypt from 'bcrypt';
import { config } from '../config/env.js';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.bcryptRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
`);

    // Types
    this.createFile('packages/api/src/types/index.ts', `export * from './express.js';
`);

    this.createFile('packages/api/src/types/express.d.ts', `import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}
`);

    // Tests
    this.createFile('packages/api/tests/setup.ts', `// Test setup file
beforeAll(() => {
  // Setup test environment
});

afterAll(() => {
  // Cleanup test environment
});
`);

    this.createFile('packages/api/tests/utils/testHelpers.ts', `import jwt from 'jsonwebtoken';

export function generateTestToken(payload: any): string {
  return jwt.sign(payload, 'test-secret', { expiresIn: '1h' });
}

export function mockUser() {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'INVESTOR',
  };
}
`);

    // Prisma schema
    this.createFile('packages/api/prisma/schema.prisma', `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  role      Role     @default(INVESTOR)
  tenantId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  INVESTOR
  ADMIN
  PORTFOLIO_MANAGER
}
`);

    // .gitkeep files
    this.createFile('packages/api/src/controllers/.gitkeep', '');
    this.createFile('packages/api/src/services/.gitkeep', '');
  }

  /**
   * Create backend files
   */
  createBackendFiles() {
    console.log('\n📦 Creating backend files...');

    this.createFile('backend/.env.example', `# Backend Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/scisoliainvest

# JWT
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters

# Security
BCRYPT_ROUNDS=12
`);

    this.createFile('backend/README.md', `# SCI Solia Invest - Backend

Simple backend server for SCI Solia Invest.

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Configuration

Copy \`.env.example\` to \`.env\` and update the values:

\`\`\`bash
cp .env.example .env
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

### Production

\`\`\`bash
npm start
\`\`\`

## API Endpoints

- \`GET /health\` - Health check endpoint
- \`GET /api/*\` - API routes

## License

MIT
`);
  }

  /**
   * Create frontend files
   */
  createFrontendFiles() {
    console.log('\n📦 Creating frontend files...');

    this.createFile('frontend/next.config.js', `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
`);

    this.createFile('frontend/.env.example', `# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=SCI Solia Invest
`);

    this.createFile('frontend/README.md', `# SCI Solia Invest - Frontend

Next.js frontend application for SCI Solia Invest platform.

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Configuration

Copy \`.env.example\` to \`.env.local\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## Features

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS
- Authentication
- Dashboard
- Investment management

## License

MIT
`);
  }

  /**
   * Create root files
   */
  createRootFiles() {
    console.log('\n📦 Creating root files...');

    // Note: docker-compose.yml already exists as docker_compose.yml
    // We'll create a symlink or note this in the report
    console.log('⏭️  Skipping docker-compose.yml (multiple docker compose files exist)');
  }

  /**
   * Generate summary report
   */
  generateSummaryReport() {
    let report = '\n═══════════════════════════════════════════════════════════════\n';
    report += '          FICHIERS CRÉÉS - RAPPORT RÉCAPITULATIF\n';
    report += '═══════════════════════════════════════════════════════════════\n\n';

    report += `📊 STATISTIQUES:\n`;
    report += `  ✅ Fichiers créés: ${this.createdFiles.length}\n`;
    report += `  📁 Répertoires créés: ${new Set(this.createdDirs).size}\n`;
    report += `  ❌ Erreurs: ${this.errors.length}\n\n`;

    if (this.createdFiles.length > 0) {
      report += '✅ FICHIERS CRÉÉS:\n';
      this.createdFiles.forEach(file => {
        report += `  • ${file}\n`;
      });
      report += '\n';
    }

    report += '📝 PROCHAINES ÉTAPES:\n';
    report += '  1. Installer les dépendances: cd packages/api && pnpm install\n';
    report += '  2. Configurer .env dans packages/api/\n';
    report += '  3. Initialiser la base de données: pnpm prisma:migrate\n';
    report += '  4. Implémenter la logique métier dans les routes et services\n';
    report += '  5. Ajouter les tests unitaires et d\'intégration\n\n';

    report += '═══════════════════════════════════════════════════════════════\n';

    return report;
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');

  const projectRoot = path.resolve(__dirname);
  const creator = new MissingFilesCreator(projectRoot, dryRun);

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be created\n');
  }

  creator.createAllMissingFiles();
  
  const summary = creator.generateSummaryReport();
  console.log(summary);

  // Save summary to file
  if (!dryRun) {
    const summaryPath = path.join(projectRoot, 'MISSING_FILES_CREATED.md');
    fs.writeFileSync(summaryPath, summary, 'utf8');
    console.log(`📄 Rapport sauvegardé: ${summaryPath}\n`);
  }

  console.log('✅ Terminé!');
}

module.exports = { MissingFilesCreator };
