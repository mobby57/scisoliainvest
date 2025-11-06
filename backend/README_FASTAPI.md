# FastAPI Backend - Hub Immobilier Digital

## Installation

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

## Configuration

### Database Setup

The application uses PostgreSQL. Update the database URL in `app/db.py`:

```python
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/hubimmo"
```

### Create Database Tables

Run Python to create tables:

```python
python
>>> from app.db import Base, engine
>>> from app.models.annonce import Annonce
>>> Base.metadata.create_all(bind=engine)
```

## Running the Server

Start the FastAPI server with uvicorn:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Or use the provided script:

```bash
cd backend
./start_fastapi.sh
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Authentication

- `POST /token` - Login and get JWT token
  - Use username: `alice` and password: `supersecret` for testing
  - Returns: `{"access_token": "...", "token_type": "bearer"}`

- `GET /secure-data` - Protected endpoint (requires authentication)
  - Headers: `Authorization: Bearer <token>`

### Health Check

- `GET /health` - Check if backend is running

### Annonces (Real Estate Listings)

- `POST /annonces` - Create a new annonce
  - Parameters: `titre`, `description`, `prix`, `localisation`
  - Note: Requires PostgreSQL database to be running

- `GET /annonces` - Get all annonces
  - Note: Requires PostgreSQL database to be running

## Testing

### Manual Testing with cURL

1. Test health endpoint:
```bash
curl http://localhost:8000/health
```

2. Login and get token:
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice&password=supersecret"
```

3. Access secure endpoint with token:
```bash
TOKEN="your_token_here"
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/secure-data
```

### Testing in Swagger UI

1. Go to `http://localhost:8000/docs`
2. Test authentication:
   - Click on `/token` endpoint
   - Click "Try it out"
   - Enter username: `alice` and password: `supersecret`
   - Execute and copy the `access_token`
3. Click "Authorize" button at the top
4. Enter the token (no need for "Bearer" prefix in Swagger)
5. Now you can access `/secure-data` endpoint

### Automated Tests

To run automated tests (requires pytest):

```bash
cd backend
pytest test_main.py -v
```

Note: Some tests may require compatible versions of starlette and httpx. If you encounter issues, use manual testing with cURL or Swagger UI.

## Frontend Integration

The frontend can connect to this API at `http://localhost:8000`. Make sure CORS is properly configured for your frontend origin in production.

## Architecture

The backend is organized as follows:

- `app/main.py` - FastAPI application entry point
- `app/auth.py` - JWT authentication logic
- `app/db.py` - Database configuration
- `app/models/` - SQLAlchemy models
- `app/routes/` - API endpoint routes
  - `health.py` - Health check endpoint
  - `annonce.py` - Real estate listing endpoints

## Security Notes

- The SECRET_KEY in `app/auth.py` should be changed in production
- Use environment variables for sensitive configuration
- Configure CORS properly for production use
- Use HTTPS in production
