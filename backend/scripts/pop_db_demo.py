#!/usr/bin/env python3
"""
Script de peuplement de base de données de démonstration pour SCI Solia Invest

Ce script :
1. S'authentifie et récupère un token
2. Crée 2 projets
3. Dépose une lecture IoT sur un device pour chaque projet
4. Lance une prédiction IA pour un projet et affiche la réponse
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3000"
CREDENTIALS = {
    "email": "admin@solia.com",
    "password": "password123"
}

# Couleurs pour l'affichage console
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(message):
    """Affiche un en-tête formaté"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{message}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_success(message):
    """Affiche un message de succès"""
    print(f"{Colors.OKGREEN}✓ {message}{Colors.ENDC}")

def print_error(message):
    """Affiche un message d'erreur"""
    print(f"{Colors.FAIL}✗ {message}{Colors.ENDC}")

def print_info(message):
    """Affiche un message d'information"""
    print(f"{Colors.OKCYAN}ℹ {message}{Colors.ENDC}")

def authenticate():
    """
    Étape 1: Authentification et récupération du token
    """
    print_header("ÉTAPE 1: Authentification")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/token",
            json=CREDENTIALS,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            if token:
                print_success(f"Authentification réussie")
                print_info(f"Token: {token[:20]}...")
                return token
            else:
                print_error("Token non trouvé dans la réponse")
                return None
        else:
            print_error(f"Échec de l'authentification (Status: {response.status_code})")
            print_error(f"Réponse: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print_error(f"Erreur de connexion: {e}")
        return None

def create_projects(token):
    """
    Étape 2: Création de 2 projets
    """
    print_header("ÉTAPE 2: Création de 2 projets")
    
    projects_data = [
        {
            "name": "Rénovation Immeuble Paris 15ème",
            "description": "Rénovation complète d'un immeuble haussmannien de 6 étages",
            "budget": 750000,
            "location": "Paris 15ème, France"
        },
        {
            "name": "Acquisition Appartements Lyon",
            "description": "Acquisition de 4 appartements pour location",
            "budget": 450000,
            "location": "Lyon, France"
        }
    ]
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    created_projects = []
    
    for i, project_data in enumerate(projects_data, 1):
        try:
            response = requests.post(
                f"{BASE_URL}/projects",
                json=project_data,
                headers=headers
            )
            
            if response.status_code == 201:
                project = response.json()
                project_id = project.get('id')
                print_success(f"Projet {i} créé: {project_data['name']}")
                print_info(f"  ID: {project_id}")
                print_info(f"  Budget: {project_data['budget']:,}€")
                created_projects.append(project)
            else:
                print_error(f"Échec création projet {i} (Status: {response.status_code})")
                print_error(f"Réponse: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print_error(f"Erreur lors de la création du projet {i}: {e}")
    
    return created_projects

def create_iot_readings(token, projects):
    """
    Étape 3: Dépose une lecture IoT sur un device pour chaque projet
    """
    print_header("ÉTAPE 3: Création de lectures IoT pour chaque projet")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    # Simuler des device IDs basés sur les projets
    iot_readings_data = [
        {
            "device_id": "device_temp_001",
            "sensorType": "temperature",
            "value": 22.5,
            "unit": "celsius",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "metadata": {
                "room": "living_room",
                "floor": 2,
                "project": projects[0].get('name', 'Projet 1') if len(projects) > 0 else 'Projet 1'
            }
        },
        {
            "device_id": "device_humidity_001",
            "sensorType": "humidity",
            "value": 55.3,
            "unit": "percent",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "metadata": {
                "room": "bedroom",
                "floor": 3,
                "project": projects[1].get('name', 'Projet 2') if len(projects) > 1 else 'Projet 2'
            }
        }
    ]
    
    for i, reading_data in enumerate(iot_readings_data, 1):
        device_id = reading_data.pop('device_id')
        
        try:
            response = requests.post(
                f"{BASE_URL}/iot/devices/{device_id}/readings",
                json=reading_data,
                headers=headers
            )
            
            if response.status_code == 201:
                print_success(f"Lecture IoT {i} créée pour device {device_id}")
                print_info(f"  Type: {reading_data['sensorType']}")
                print_info(f"  Valeur: {reading_data['value']} {reading_data['unit']}")
            else:
                print_error(f"Échec création lecture IoT {i} (Status: {response.status_code})")
                print_error(f"Réponse: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print_error(f"Erreur lors de la création de la lecture IoT {i}: {e}")

def predict_ai(token, projects):
    """
    Étape 4: Lance une prédiction IA pour un projet et affiche la réponse
    """
    print_header("ÉTAPE 4: Prédiction IA pour un projet")
    
    if not projects:
        print_error("Aucun projet disponible pour la prédiction")
        return
    
    project = projects[0]
    project_id = project.get('id')
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    prediction_data = {
        "type": "rental_value",
        "parameters": {
            "surface": 85,
            "location": "Paris 15ème",
            "propertyType": "apartment",
            "year": 2024
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/projects/{project_id}/predict",
            json=prediction_data,
            headers=headers
        )
        
        if response.status_code == 200:
            prediction = response.json()
            print_success(f"Prédiction IA générée pour le projet: {project.get('name', 'N/A')}")
            print_info(f"  Type de prédiction: {prediction_data['type']}")
            print("\n" + Colors.BOLD + "Résultat de la prédiction:" + Colors.ENDC)
            print(json.dumps(prediction, indent=2, ensure_ascii=False))
        else:
            print_error(f"Échec de la prédiction (Status: {response.status_code})")
            print_error(f"Réponse: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print_error(f"Erreur lors de la prédiction IA: {e}")

def main():
    """
    Fonction principale qui orchestre toutes les étapes
    """
    print(f"\n{Colors.BOLD}{Colors.HEADER}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║   Script de Peuplement BD - SCI Solia Invest Demo         ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.ENDC}")
    
    # Étape 1: Authentification
    token = authenticate()
    if not token:
        print_error("\n❌ Impossible de continuer sans authentification")
        sys.exit(1)
    
    # Étape 2: Création de projets
    projects = create_projects(token)
    if not projects:
        print_error("\n⚠️  Aucun projet créé, mais continuation du script")
    
    # Étape 3: Création de lectures IoT
    create_iot_readings(token, projects)
    
    # Étape 4: Prédiction IA
    predict_ai(token, projects)
    
    # Résumé final
    print_header("RÉSUMÉ")
    print_success(f"Script terminé avec succès")
    print_info(f"Projets créés: {len(projects)}")
    print_info(f"Lectures IoT créées: 2")
    print_info(f"Prédictions IA: 1")
    print(f"\n{Colors.BOLD}✨ Base de données de démonstration peuplée !{Colors.ENDC}\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.WARNING}Script interrompu par l'utilisateur{Colors.ENDC}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.FAIL}Erreur inattendue: {e}{Colors.ENDC}")
        sys.exit(1)
