"""
Simple tests for FastAPI backend
Run with: pytest test_main.py
"""

import pytest
from fastapi.testclient import TestClient


def get_client():
    """Get test client for the app"""
    from app.main import app
    return TestClient(app)


def test_health_check():
    """Test the health check endpoint"""
    client = get_client()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK", "message": "Backend is running"}


def test_login_success():
    """Test successful login"""
    client = get_client()
    response = client.post(
        "/token",
        data={"username": "alice", "password": "supersecret"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_failure():
    """Test login with wrong credentials"""
    client = get_client()
    response = client.post(
        "/token",
        data={"username": "alice", "password": "wrongpassword"}
    )
    assert response.status_code == 400
    assert "Identifiants incorrects" in response.json()["detail"]


def test_secure_data_without_token():
    """Test accessing secure endpoint without token"""
    client = get_client()
    response = client.get("/secure-data")
    assert response.status_code == 401


def test_secure_data_with_token():
    """Test accessing secure endpoint with valid token"""
    client = get_client()
    # First, login to get token
    login_response = client.post(
        "/token",
        data={"username": "alice", "password": "supersecret"}
    )
    token = login_response.json()["access_token"]
    
    # Then access secure endpoint
    response = client.get(
        "/secure-data",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "alice" in data["message"]


def test_secure_data_with_invalid_token():
    """Test accessing secure endpoint with invalid token"""
    client = get_client()
    response = client.get(
        "/secure-data",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401
