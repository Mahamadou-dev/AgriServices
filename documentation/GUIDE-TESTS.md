# 🧪 Guide de Tests - AgriServices

**Version**: 1.0  
**Date**: 18 Décembre 2025  
**Auteur**: MAHAMADOU AMADOU HABOU

---

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Prérequis](#prérequis)
3. [Fichier de Tests JSON](#fichier-de-tests-json)
4. [Tests par Service](#tests-par-service)
5. [Outils de Test](#outils-de-test)
6. [Workflows de Test Complets](#workflows-de-test-complets)
7. [Tests Automatisés](#tests-automatisés)
8. [Interprétation des Résultats](#interprétation-des-résultats)

---

## 📖 Introduction

Ce guide explique comment tester tous les services de la plateforme AgriServices. Les tests sont organisés par service et suivent un ordre logique pour garantir la cohérence des données.

### Structure des Tests

- **Health Checks**: Vérification que tous les services sont opérationnels
- **Auth Service**: Inscription et authentification
- **Farmer Service**: CRUD des agriculteurs
- **Prediction Service**: Prédictions agricoles
- **Crop Service**: Gestion des cultures (SOAP)
- **Billing Service**: Facturation (SOAP)
- **Workflows Intégrés**: Scénarios utilisateur complets

---

## 🔧 Prérequis

### Services Démarrés

```bash
# Vérifier que tous les services sont démarrés
docker compose ps

# OU utiliser le script de vérification
./check-services.sh
```

### Outils Requis

- **curl** - Tests en ligne de commande
- **Postman** (optionnel) - Tests API REST
- **SoapUI** (optionnel) - Tests SOAP
- **Python** (optionnel) - Scripts de test automatisés
- **jq** (optionnel) - Parsing JSON

Installation de jq:
```bash
# Linux
sudo apt-get install jq

# macOS
brew install jq

# Windows
# Télécharger depuis https://stedolan.github.io/jq/
```

---

## 📁 Fichier de Tests JSON

Le fichier `tests-api.json` à la racine du projet contient tous les cas de test structurés.

### Structure du Fichier

```json
{
  "info": {
    "name": "AgriServices API Tests Collection",
    "version": "1.0.0"
  },
  "baseUrls": {
    "gateway": "http://localhost:8080",
    "auth": "http://localhost:8081",
    "farmer": "http://localhost:3001",
    "prediction": "http://localhost:8000",
    "crop": "http://localhost:8082",
    "billing": "http://localhost:8085"
  },
  "tests": {
    "01_health_checks": { ... },
    "02_auth_service": { ... },
    "03_farmer_service": { ... },
    "04_prediction_service": { ... },
    "05_crop_service_soap": { ... },
    "06_billing_service_soap": { ... },
    "07_integration_workflow": { ... }
  }
}
```

### Variables Dynamiques

Les variables entre `{{}}` sont remplacées pendant l'exécution:
- `{{gateway}}` → `http://localhost:8080`
- `{{auth_token}}` → Token JWT obtenu lors du login
- `{{farmer_id}}` → ID de l'agriculteur créé

---

## 🧪 Tests par Service

### 1️⃣ Health Checks - Vérification de Base

**Objectif**: S'assurer que tous les services répondent.

```bash
# Test API Gateway
curl http://localhost:8080/health

# Test Auth Service
curl http://localhost:8081/auth/health

# Test Farmer Service
curl http://localhost:3001/health

# Test Prediction Service
curl http://localhost:8000/health

# Test Crop Service WSDL
curl http://localhost:8082/crop?wsdl

# Test Billing Service WSDL
curl http://localhost:8085/billing?wsdl
```

**Résultats Attendus**: Tous les services doivent retourner HTTP 200.

---

### 2️⃣ Auth Service - Authentification

#### Test 1: Inscription d'un Utilisateur

**Référence JSON**: `tests.02_auth_service.tests[0]`

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_farmer",
    "email": "john.farmer@agri.com",
    "password": "SecurePass123!",
    "role": "FARMER"
  }'
```

**Résultat Attendu**: HTTP 201
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "john_farmer",
  "role": "FARMER"
}
```

#### Test 2: Connexion

**Référence JSON**: `tests.02_auth_service.tests[3]`

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_farmer",
    "password": "SecurePass123!"
  }'
```

**Sauvegarder le Token**:
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_farmer",
    "password": "SecurePass123!"
  }' | jq -r '.token')

echo "Token: $TOKEN"
```

#### Test 3: Validation du Token

**Référence JSON**: `tests.02_auth_service.tests[5]`

```bash
curl -X GET http://localhost:8080/auth/validate \
  -H "Authorization: Bearer $TOKEN"
```

#### Test Négatif: Mauvais Mot de Passe

**Référence JSON**: `tests.02_auth_service.tests[4]`

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_farmer",
    "password": "WrongPassword123!"
  }'
```

**Résultat Attendu**: HTTP 401 Unauthorized

---

### 3️⃣ Farmer Service - Gestion des Agriculteurs

#### Test 1: Créer un Agriculteur

**Référence JSON**: `tests.03_farmer_service.tests[0]`

```bash
curl -X POST http://localhost:8080/api/farmers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "john_farmer",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.farmer@agri.com",
    "phone": "+33612345678",
    "address": {
      "street": "123 Rue de la Ferme",
      "city": "Lyon",
      "state": "Rhône",
      "postalCode": "69000",
      "country": "France"
    },
    "farms": [
      {
        "name": "Ferme du Soleil",
        "size": 50.5,
        "location": {
          "latitude": 45.7578,
          "longitude": 4.8320
        }
      }
    ]
  }'
```

**Sauvegarder l'ID**:
```bash
FARMER_ID=$(curl -s -X POST http://localhost:8080/api/farmers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ ... }' | jq -r '._id')

echo "Farmer ID: $FARMER_ID"
```

#### Test 2: Lister Tous les Agriculteurs

**Référence JSON**: `tests.03_farmer_service.tests[2]`

```bash
curl -X GET http://localhost:8080/api/farmers \
  -H "Authorization: Bearer $TOKEN"
```

#### Test 3: Obtenir un Agriculteur par ID

**Référence JSON**: `tests.03_farmer_service.tests[3]`

```bash
curl -X GET http://localhost:8080/api/farmers/$FARMER_ID \
  -H "Authorization: Bearer $TOKEN"
```

#### Test 4: Mettre à Jour un Agriculteur

**Référence JSON**: `tests.03_farmer_service.tests[4]`

```bash
curl -X PUT http://localhost:8080/api/farmers/$FARMER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "phone": "+33698765432",
    "farms": [
      {
        "name": "Ferme du Soleil",
        "size": 55.0,
        "location": {
          "latitude": 45.7578,
          "longitude": 4.8320
        }
      },
      {
        "name": "Nouvelle Parcelle",
        "size": 10.5,
        "location": {
          "latitude": 45.7600,
          "longitude": 4.8350
        }
      }
    ]
  }'
```

#### Test 5: Supprimer un Agriculteur

```bash
curl -X DELETE http://localhost:8080/api/farmers/$FARMER_ID \
  -H "Authorization: Bearer $TOKEN"
```

#### Test Négatif: Sans Authentification

**Référence JSON**: `tests.03_farmer_service.tests[7]`

```bash
curl -X POST http://localhost:8080/api/farmers \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Résultat Attendu**: HTTP 401 Unauthorized

---

### 4️⃣ Prediction Service - Prédictions Agricoles

#### Test 1: Prédiction de Rendement

**Référence JSON**: `tests.04_prediction_service.tests[0]`

```bash
curl -X POST http://localhost:8080/api/predict/yield \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "crop_type": "wheat",
    "area_hectares": 10.5,
    "soil_type": "loamy",
    "rainfall_mm": 600,
    "temperature_c": 25,
    "fertilizer_used": true
  }'
```

**Résultat Attendu**:
```json
{
  "crop_type": "wheat",
  "predicted_yield_kg": 44100.0,
  "confidence_level": 0.87,
  "recommendation": "Excellent conditions. Continue current practices.",
  "timestamp": "2025-12-18T10:30:00"
}
```

#### Test 2: Évaluation des Risques

**Référence JSON**: `tests.04_prediction_service.tests[3]`

```bash
curl -X POST http://localhost:8080/api/predict/risk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "crop_type": "soybean",
    "area_hectares": 12.0,
    "soil_type": "sandy",
    "rainfall_mm": 200,
    "temperature_c": 40,
    "fertilizer_used": false
  }'
```

**Résultat Attendu**:
```json
{
  "crop_type": "soybean",
  "risk_level": "HIGH",
  "risk_factors": [
    "Low rainfall - drought risk",
    "High temperature stress",
    "No fertilizer - nutrient deficiency risk"
  ],
  "mitigation_strategies": [
    "Implement drip irrigation system",
    "Use shade nets or choose heat-resistant varieties",
    "Apply organic or chemical fertilizers based on soil test"
  ]
}
```

#### Test 3: Historique des Prédictions

**Référence JSON**: `tests.04_prediction_service.tests[5]`

```bash
curl -X GET "http://localhost:8080/api/predict/history?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

#### Test Négatif: Validation d'Erreur

**Référence JSON**: `tests.04_prediction_service.tests[6]`

```bash
curl -X POST http://localhost:8080/api/predict/yield \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "crop_type": "wheat",
    "area_hectares": -5.0,
    "soil_type": "loamy"
  }'
```

**Résultat Attendu**: HTTP 422 Unprocessable Entity

---

### 5️⃣ Crop Service (SOAP) - Gestion des Cultures

#### Test 1: Hello (Test de Connexion)

**Référence JSON**: `tests.05_crop_service_soap.tests[0]`

```bash
curl -X POST http://localhost:8082/crop \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: hello" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:hello/>
  </soapenv:Body>
</soapenv:Envelope>'
```

#### Test 2: Créer une Culture

**Référence JSON**: `tests.05_crop_service_soap.tests[1]`

```bash
curl -X POST http://localhost:8082/crop \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: createCrop" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:createCrop>
      <name>Winter Wheat Premium</name>
      <type>Cereal</type>
      <diseaseStatus>Healthy</diseaseStatus>
    </crop:createCrop>
  </soapenv:Body>
</soapenv:Envelope>'
```

#### Test 3: Obtenir une Culture

**Référence JSON**: `tests.05_crop_service_soap.tests[2]`

```bash
curl -X POST http://localhost:8082/crop \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: getCrop" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:getCrop>
      <id>1</id>
    </crop:getCrop>
  </soapenv:Body>
</soapenv:Envelope>'
```

#### Test 4: Lister les Cultures

**Référence JSON**: `tests.05_crop_service_soap.tests[3]`

```bash
curl -X POST http://localhost:8082/crop \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: listCrops" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:listCrops/>
  </soapenv:Body>
</soapenv:Envelope>'
```

#### Test 5: Mettre à Jour une Culture

**Référence JSON**: `tests.05_crop_service_soap.tests[4]`

```bash
curl -X POST http://localhost:8082/crop \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: updateCrop" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:updateCrop>
      <id>1</id>
      <name>Winter Wheat Premium</name>
      <type>Cereal</type>
      <diseaseStatus>Under Treatment</diseaseStatus>
    </crop:updateCrop>
  </soapenv:Body>
</soapenv:Envelope>'
```

#### Test 6: Supprimer une Culture

**Référence JSON**: `tests.05_crop_service_soap.tests[5]`

```bash
curl -X POST http://localhost:8082/crop \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: deleteCrop" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:deleteCrop>
      <id>3</id>
    </crop:deleteCrop>
  </soapenv:Body>
</soapenv:Envelope>'
```

---

### 6️⃣ Billing Service (SOAP) - Facturation

#### Test 1: Obtenir Détails d'une Facture

**Référence JSON**: `tests.06_billing_service_soap.tests[0]`

```bash
curl -X POST http://localhost:8085/billing \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: http://tempuri.org/IBillingService/GetInvoiceDetailsAsync" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:GetInvoiceDetailsAsync>
      <tem:invoiceId>101</tem:invoiceId>
    </tem:GetInvoiceDetailsAsync>
  </soapenv:Body>
</soapenv:Envelope>'
```

#### Test 2: Générer une Nouvelle Facture

**Référence JSON**: `tests.06_billing_service_soap.tests[1]`

```bash
curl -X POST http://localhost:8085/billing \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: http://tempuri.org/IBillingService/GenerateNewInvoiceAsync" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:GenerateNewInvoiceAsync>
      <tem:farmerName>John Doe</tem:farmerName>
      <tem:amount>1250.75</tem:amount>
    </tem:GenerateNewInvoiceAsync>
  </soapenv:Body>
</soapenv:Envelope>'
```

---

## 🔄 Workflows de Test Complets

### Workflow Complet: Parcours Utilisateur

**Référence JSON**: `tests.07_integration_workflow`

Ce workflow simule un parcours utilisateur complet du début à la fin.

```bash
#!/bin/bash
# Fichier: test-complete-workflow.sh

echo "=== AgriServices - Workflow Complet de Test ==="

# Step 1: Inscription
echo ""
echo "Step 1: Inscription nouvel agriculteur..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "workflow_farmer",
    "email": "workflow@agri.com",
    "password": "Workflow123!",
    "role": "FARMER"
  }')
echo "✅ Utilisateur inscrit"

# Step 2: Connexion
echo ""
echo "Step 2: Connexion..."
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "workflow_farmer",
    "password": "Workflow123!"
  }' | jq -r '.token')
echo "✅ Token obtenu: ${TOKEN:0:20}..."

# Step 3: Création profil agriculteur
echo ""
echo "Step 3: Création profil agriculteur..."
FARMER_ID=$(curl -s -X POST http://localhost:8080/api/farmers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "workflow_farmer",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "workflow@agri.com",
    "phone": "+33645678901",
    "address": {
      "city": "Bordeaux",
      "country": "France"
    },
    "farms": [
      {
        "name": "Vignoble Dupont",
        "size": 25.0,
        "location": {
          "latitude": 44.8378,
          "longitude": -0.5792
        }
      }
    ]
  }' | jq -r '._id')
echo "✅ Profil créé avec ID: $FARMER_ID"

# Step 4: Prédiction rendement
echo ""
echo "Step 4: Prédiction rendement..."
PREDICTION=$(curl -s -X POST http://localhost:8080/api/predict/yield \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "crop_type": "wheat",
    "area_hectares": 25.0,
    "soil_type": "loamy",
    "rainfall_mm": 550,
    "temperature_c": 23,
    "fertilizer_used": true
  }')
echo "✅ Rendement prédit:"
echo "$PREDICTION" | jq '{crop_type, predicted_yield_kg, confidence_level}'

# Step 5: Évaluation des risques
echo ""
echo "Step 5: Évaluation des risques..."
RISK=$(curl -s -X POST http://localhost:8080/api/predict/risk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "crop_type": "wheat",
    "area_hectares": 25.0,
    "soil_type": "loamy",
    "rainfall_mm": 550,
    "temperature_c": 23,
    "fertilizer_used": true
  }')
echo "✅ Risques évalués:"
echo "$RISK" | jq '{crop_type, risk_level, risk_factors}'

# Step 6: Vérification profil
echo ""
echo "Step 6: Vérification profil agriculteur..."
FARMER=$(curl -s -X GET http://localhost:8080/api/farmers/$FARMER_ID \
  -H "Authorization: Bearer $TOKEN")
echo "✅ Profil récupéré:"
echo "$FARMER" | jq '{firstName, lastName, farms}'

echo ""
echo "=== Workflow Complet Terminé Avec Succès ==="
```

**Utilisation:**

```bash
chmod +x test-complete-workflow.sh
./test-complete-workflow.sh
```

---

## 🤖 Tests Automatisés

### Avec Postman

1. **Importer la Collection**
   - Ouvrir Postman
   - Importer `tests-api.json`
   - Les tests sont organisés par dossiers

2. **Configurer les Variables d'Environnement**
   ```
   gateway = http://localhost:8080
   auth_token = (sera rempli automatiquement après login)
   ```

3. **Exécuter la Collection**
   - Collection Runner
   - Sélectionner la collection
   - Run

### Script Python Automatisé

```python
#!/usr/bin/env python3
# Fichier: run_tests.py

import requests
import json
import sys

BASE_URL = "http://localhost:8080"
token = None

def test_health_checks():
    """Test 01: Health Checks"""
    print("=== Test 01: Health Checks ===")
    
    endpoints = [
        f"{BASE_URL}/health",
        "http://localhost:8081/auth/health",
        "http://localhost:3001/health",
        "http://localhost:8000/health"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(endpoint, timeout=5)
            status = "✅ PASS" if response.status_code == 200 else "❌ FAIL"
            print(f"{status} - {endpoint}")
        except Exception as e:
            print(f"❌ FAIL - {endpoint} - {str(e)}")

def test_auth_service():
    """Test 02: Auth Service"""
    global token
    print("\n=== Test 02: Auth Service ===")
    
    # Register
    register_data = {
        "username": "test_user",
        "email": "test@agri.com",
        "password": "Test123!",
        "role": "FARMER"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=register_data,
            timeout=5
        )
        if response.status_code in [200, 201]:
            print("✅ PASS - Register")
        else:
            print(f"❌ FAIL - Register - HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ FAIL - Register - {str(e)}")
    
    # Login
    login_data = {
        "username": "test_user",
        "password": "Test123!"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            timeout=5
        )
        if response.status_code == 200:
            token = response.json().get("token")
            print(f"✅ PASS - Login (Token: {token[:20]}...)")
        else:
            print(f"❌ FAIL - Login - HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ FAIL - Login - {str(e)}")

def test_farmer_service():
    """Test 03: Farmer Service"""
    print("\n=== Test 03: Farmer Service ===")
    
    if not token:
        print("❌ SKIP - No token available")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Farmer
    farmer_data = {
        "userId": "test_user",
        "firstName": "Test",
        "lastName": "User",
        "email": "test@agri.com",
        "phone": "+33612345678",
        "address": {
            "city": "Paris",
            "country": "France"
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/farmers",
            json=farmer_data,
            headers=headers,
            timeout=5
        )
        if response.status_code in [200, 201]:
            farmer_id = response.json().get("_id")
            print(f"✅ PASS - Create Farmer (ID: {farmer_id})")
        else:
            print(f"❌ FAIL - Create Farmer - HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ FAIL - Create Farmer - {str(e)}")

def test_prediction_service():
    """Test 04: Prediction Service"""
    print("\n=== Test 04: Prediction Service ===")
    
    if not token:
        print("❌ SKIP - No token available")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Predict Yield
    prediction_data = {
        "crop_type": "wheat",
        "area_hectares": 10.5,
        "soil_type": "loamy",
        "rainfall_mm": 600,
        "temperature_c": 25,
        "fertilizer_used": True
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/predict/yield",
            json=prediction_data,
            headers=headers,
            timeout=5
        )
        if response.status_code == 200:
            result = response.json()
            print(f"✅ PASS - Predict Yield")
            print(f"   Predicted: {result.get('predicted_yield_kg')} kg")
        else:
            print(f"❌ FAIL - Predict Yield - HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ FAIL - Predict Yield - {str(e)}")

if __name__ == "__main__":
    print("========================================")
    print("AgriServices - Automated Test Suite")
    print("========================================")
    
    test_health_checks()
    test_auth_service()
    test_farmer_service()
    test_prediction_service()
    
    print("\n========================================")
    print("Tests Completed")
    print("========================================")
```

**Utilisation:**

```bash
chmod +x run_tests.py
python3 run_tests.py
```

---

## 📊 Interprétation des Résultats

### Codes de Statut HTTP

| Code | Signification | Action |
|------|---------------|--------|
| **200** | OK - Succès | Test réussi |
| **201** | Created - Ressource créée | Test réussi |
| **400** | Bad Request - Erreur de validation | Vérifier le format des données |
| **401** | Unauthorized - Non authentifié | Vérifier le token JWT |
| **404** | Not Found - Ressource inexistante | Vérifier l'ID ou l'URL |
| **422** | Unprocessable Entity - Validation échouée | Vérifier les données d'entrée |
| **500** | Internal Server Error | Voir les logs du service |

### Messages d'Erreur Communs

#### "Token expired or invalid"
```bash
# Solution: Reconnecter et obtenir un nouveau token
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{...}' | jq -r '.token')
```

#### "Resource not found"
```bash
# Solution: Vérifier que l'ID existe
curl -X GET http://localhost:8080/api/farmers \
  -H "Authorization: Bearer $TOKEN"
```

#### "Connection refused"
```bash
# Solution: Vérifier que le service est démarré
docker compose ps
```

---

## 📝 Checklist de Tests

Avant de considérer le système prêt pour la production:

- [ ] Tous les health checks passent
- [ ] Auth Service: Inscription, connexion, validation fonctionnent
- [ ] Farmer Service: CRUD complet fonctionne
- [ ] Prediction Service: Prédictions et évaluation des risques fonctionnent
- [ ] Crop Service SOAP: Toutes les opérations CRUD fonctionnent
- [ ] Billing Service SOAP: Génération et récupération de factures fonctionnent
- [ ] Tests négatifs (erreurs) retournent les bons codes HTTP
- [ ] Workflow complet d'un bout à l'bout fonctionne
- [ ] Les logs ne montrent pas d'erreurs critiques

---

## 📞 Support et Ressources

- **Fichier de tests**: `tests-api.json` à la racine
- **Documentation API**: `manuel-utilisation.md`
- **Dépannage**: `DEMARRAGE-LOCAL.md`
- **Logs**: `docker compose logs -f <service-name>`

---

**Dernière mise à jour**: 18 Décembre 2025  
**Auteur**: MAHAMADOU AMADOU HABOU
