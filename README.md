# SCI Solia Invest Platform

Welcome to the SCI Solia Invest Platform repository! This project aims to provide a comprehensive SaaS solution for managing investments and properties.

## Project Structure

- `backend/`: FastAPI Python backend with JWT authentication
  - `app/`: Main application code
    - `main.py`: FastAPI application entry point
    - `auth.py`: JWT authentication
    - `db.py`: Database configuration
    - `models/`: SQLAlchemy database models
    - `routes/`: API endpoints
  - `README_FASTAPI.md`: Detailed backend documentation
- `frontend/`: Next.js frontend application
  - `src/`: Frontend source code
- `packages/api`: Node.js backend API code
- `packages/client`: Frontend application code
- `packages/shared`: Shared code between client and server
- `infrastructure`: Infrastructure-related files (Docker, Terraform)
- `scripts`: Utility scripts for development and deployment

## Getting Started

### FastAPI Backend (Python)

The new Python FastAPI backend provides secure authentication with JWT tokens and database integration.

1. **Install Python dependencies:**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure database (optional for basic features):**

   Update the database URL in `backend/app/db.py` if using PostgreSQL.

3. **Start the backend server:**

   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

   Or use the provided script:
   ```bash
   cd backend
   ./start_fastapi.sh
   ```

4. **Access API documentation:**

   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

For detailed backend setup and usage, see [backend/README_FASTAPI.md](backend/README_FASTAPI.md)

### Frontend

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Run the development server:**

   ```bash
   pnpm dev
   ```

## Features

### Authentication & Security
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected API endpoints
- OAuth2 password flow

### Real Estate Management
- CRUD operations for property listings (annonces)
- Database integration with PostgreSQL
- RESTful API design

### API Documentation
- Interactive Swagger UI
- ReDoc documentation
- Comprehensive endpoint testing

## Testing

### Backend Tests

```bash
cd backend
pytest test_main.py -v
```

Or test manually with cURL:

```bash
# Health check
curl http://localhost:8000/health

# Login
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice&password=supersecret"
```

### CI/CD

The project includes GitHub Actions workflows for automated testing and linting.

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
