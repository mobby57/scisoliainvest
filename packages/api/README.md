# SCI Solia Invest - API

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

```bash
pnpm install
```

### Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

### Database Setup

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

### Development

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

## API Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Testing

```bash
pnpm test
```

## License

MIT
