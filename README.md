# SCI Solia Invest Platform

Welcome to the SCI Solia Invest Platform repository! This project aims to provide a comprehensive SaaS solution for managing investments and properties.

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/sci-solia-invest.git
   cd sci-solia-invest
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

## Python Testing Environment

Pour les tests Python, nous fournissons des scripts automatisés pour configurer et utiliser un environnement virtuel Python.

### Configuration rapide

#### Linux/Mac

Exécutez le script de configuration :

```bash
./setup_test_env.sh
```

Ce script va :
1. Créer un environnement virtuel Python (`venv`)
2. Activer l'environnement virtuel
3. Installer les dépendances de test depuis `requirements-test.txt`
4. Vérifier l'installation de pytest
5. Exécuter les tests unitaires (si disponibles)

#### Windows

Exécutez le script batch :

```batch
setup_test_env.bat
```

Ce script effectue les mêmes opérations que la version Linux/Mac.

### Utilisation manuelle

Si vous préférez configurer l'environnement manuellement :

#### Linux/Mac

```bash
# Créer l'environnement virtuel
python3 -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances
pip install -r requirements-test.txt

# Exécuter les tests
pytest
```

#### Windows

```batch
# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements-test.txt

# Exécuter les tests
pytest
```

### Désactiver l'environnement virtuel

```bash
deactivate
```

## Project Structure

- `packages/api`: Contains the backend API code.
- `packages/client`: Contains the frontend application code.
- `packages/shared`: Shared code between the client and server.
- `infrastructure`: Infrastructure-related files (e.g., Docker, Terraform).
- `scripts`: Utility scripts for development and deployment.

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License.
