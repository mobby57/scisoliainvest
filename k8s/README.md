# Kubernetes Manifests for Solia Invest Project

This directory contains Kubernetes manifests to deploy the backend API, frontend client, MongoDB database, secrets, and ingress.

## Files

- `mongo-secret.yaml`: Secrets for MongoDB credentials and JWT secret.
- `mongo-deployment.yaml`: Deployment, persistent volume claim, and service for MongoDB.
- `backend-deployment.yaml`: Deployment and service for the backend API.
- `frontend-deployment.yaml`: Deployment and service for the frontend client.
- `ingress.yaml`: Ingress for routing /api to backend and / to frontend.

## Prerequisites

- Kubernetes cluster (minikube, Docker Desktop, or cloud provider).
- Ingress controller (e.g., NGINX Ingress Controller) installed.
- Docker images built and pushed to a registry (e.g., Docker Hub).

## Build and Push Images

Build the images:

```bash
docker build -f Dockerfile.backend -t moros/solia-api:latest .
docker build -f Dockerfile.frontend -t moros/solia-client:latest .
```

Push to Docker Hub (replace 'moros' with your username if different):

```bash
docker push moros/solia-api:latest
docker push moros/solia-client:latest
```

## Deployment

1. Apply MongoDB first:

```bash
kubectl apply -f k8s/mongo-secret.yaml
kubectl apply -f k8s/mongo-deployment.yaml
```

2. Apply API:

```bash
kubectl apply -f k8s/backend-deployment.yaml
```

3. Apply frontend:

```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

4. Apply ingress:

```bash
kubectl apply -f k8s/ingress.yaml
```

5. Check pods:

```bash
kubectl get pods
kubectl logs -f <pod-name>
```

## Access the Application

Add to your hosts file: `127.0.0.1 solia.local`

Access at: http://solia.local

## Notes

- Secrets are base64 encoded; update as needed.
- For production, use proper secrets management and external databases.
- Adjust resource requests/limits as needed.
