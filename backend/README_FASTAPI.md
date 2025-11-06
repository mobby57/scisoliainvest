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

- `GET /annonces` - Get all annonces

## Testing in Swagger UI

1. Go to `http://localhost:8000/docs`
2. Test authentication:
   - Click on `/token` endpoint
   - Click "Try it out"
   - Enter username: `alice` and password: `supersecret`
   - Execute and copy the `access_token`
3. Click "Authorize" button at the top
4. Enter `Bearer <your_token>` (paste the token)
5. Now you can access `/secure-data` endpoint

## Frontend Integration

The frontend can connect to this API at `http://localhost:8000`. Make sure CORS is properly configured for your frontend origin in production.
