#!/usr/bin/env python3
"""
Database initialization script for FastAPI backend

This script creates all database tables defined in the models.

Usage:
    python init_db.py
"""

from app.db import Base, engine
from app.models.annonce import Annonce

def init_database():
    """Initialize database tables"""
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables created successfully!")
        print("\nCreated tables:")
        print("  - annonces")
    except Exception as e:
        print(f"✗ Error creating database tables: {e}")
        print("\nMake sure PostgreSQL is running and the database exists.")
        print("Update the connection string in app/db.py if needed.")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(init_database())
