"""
Configuration management for FastAPI backend
Loads settings from environment variables with fallback defaults
"""
import os
import secrets
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# JWT Configuration
_default_secret = os.getenv("SECRET_KEY")
if not _default_secret:
    import warnings
    warnings.warn(
        "SECRET_KEY not set in environment! Using insecure default. "
        "Set SECRET_KEY in .env file for production.",
        UserWarning
    )
    _default_secret = "changeme-123-INSECURE-DEFAULT"

SECRET_KEY: str = _default_secret
ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Database Configuration
DATABASE_URL: str = os.getenv(
    "DATABASE_URL", 
    "postgresql://user:password@localhost/hubimmo"
)

# CORS Configuration
CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "*").split(",")

# API Configuration
API_TITLE: str = os.getenv("API_TITLE", "Hub Immobilier Digital API")
API_DESCRIPTION: str = os.getenv(
    "API_DESCRIPTION", 
    "API SaaS pour les opérations immobilières digitales."
)
API_VERSION: str = os.getenv("API_VERSION", "0.1.0")
