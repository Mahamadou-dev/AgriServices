# 🏗️ Architecture Technique - AgriServices Platform

## Vue d'Ensemble

AgriServices est une plateforme SOA (Service-Oriented Architecture) distribuée pour la gestion agricole, composée de 6 microservices indépendants communiquant via REST et SOAP.

## Diagramme d'Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTS                                  │
│  (Web, Mobile, Desktop, APIs externes)                       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  API GATEWAY                                 │
│               (Spring Cloud Gateway)                         │
│  - Routage intelligent                                       │
│  - Validation JWT                                            │
│  - Load Balancing                                            │
│  - Rate Limiting                                             │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────┘
       │          │          │          │          │
       ▼          ▼          ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Auth    │ │ Farmer   │ │  Crop    │ │Prediction│ │ Billing  │
│ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │
│          │ │          │ │          │ │          │ │          │
│Spring    │ │Node.js   │ │JAX-WS    │ │FastAPI   │ │.NET      │
│Boot      │ │Express   │ │SOAP      │ │Python    │ │CoreWCF   │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └──────────┘ └────┬─────┘
     │            │            │                          │
     ▼            ▼            ▼                          ▼
┌─────────┐ ┌──────────┐ ┌─────────┐              ┌──────────┐
│PostgreSQL│ │ MongoDB  │ │Optional │              │PostgreSQL│
│         │ │          │ │   DB    │              │/SQLServer│
└─────────┘ └──────────┘ └─────────┘              └──────────┘
```

---

## 🎯 Composants Principaux

### 1. API Gateway (Port 8080)

**Technologie** : Spring Cloud Gateway (Java 17, Spring Boot 3.2)

**Responsabilités** :
- Point d'entrée unique du système
- Routage des requêtes vers les services appropriés
- Authentification et autorisation centralisées
- Load balancing
- Circuit breaker
- Monitoring et métriques

**Routes** :
```
/auth/**          → auth-service:8081
/farmers/**       → farmer-service:3001
/crops/**         → crop-service:8082
/predictions/**   → prediction-service:8000
/billing/**       → billing-service:8085
```

**Configuration** :
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://auth-service:8081
          predicates:
            - Path=/auth/**
```

---

### 2. Auth Service (Port 8081)

**Technologie** : Spring Boot 3.2 + Spring Security + JWT

**Responsabilités** :
- Inscription des utilisateurs (FARMER, ADMIN, EXPERT)
- Connexion et génération de tokens JWT
- Gestion des rôles et permissions
- Validation des tokens

**Base de données** : PostgreSQL
```sql
TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Endpoints** :
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter (retourne JWT)
- `GET /auth/validate` - Valider un token
- `GET /health` - Health check

**JWT Structure** :
```json
{
  "sub": "user123",
  "username": "farmer1",
  "roles": ["FARMER"],
  "iat": 1702800000,
  "exp": 1702803600
}
```

---

### 3. Farmer Service (Port 3001)

**Technologie** : Node.js 20 + Express 5 + MongoDB + Mongoose

**Responsabilités** :
- CRUD complet des agriculteurs
- Recherche et filtrage
- Gestion des exploitations agricoles
- Validation JWT

**Base de données** : MongoDB
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  farmName: String,
  location: String,
  farmSize: Number,
  farmSizeUnit: String,
  crops: [String],
  status: String,
  registrationDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Endpoints** :
- `GET /farmers` - Liste paginée
- `GET /farmers/:id` - Détails d'un agriculteur
- `POST /farmers` - Créer (🔒 protégé)
- `PUT /farmers/:id` - Mettre à jour (🔒 protégé)
- `DELETE /farmers/:id` - Supprimer (🔒 protégé)
- `GET /health` - Health check

---

### 4. Crop Service (Port 8082)

**Technologie** : Java 17 + JAX-WS + SOAP

**Responsabilités** :
- Gestion des cultures (CRUD)
- Gestion des parcelles
- Calendrier agricole
- Communication SOAP/XML

**WSDL** : `http://crop-service:8082/CropService?wsdl`

**Opérations SOAP** :
- `addCrop(CropData)` - Ajouter une culture
- `getCrop(cropId)` - Obtenir une culture
- `updateCrop(CropData)` - Mettre à jour
- `deleteCrop(cropId)` - Supprimer
- `listCrops(farmerId)` - Lister par agriculteur

**Structure XML** :
```xml
<crop>
    <cropId>1</cropId>
    <farmerId>123</farmerId>
    <cropType>wheat</cropType>
    <area>10.5</area>
    <plantingDate>2025-01-15</plantingDate>
    <harvestDate>2025-06-20</harvestDate>
    <status>active</status>
</crop>
```

---

### 5. Prediction Service (Port 8000)

**Technologie** : Python 3.12 + FastAPI + Pydantic

**Responsabilités** :
- Prédiction de rendement agricole
- Évaluation des risques (sécheresse, maladie, etc.)
- Recommandations basées sur les conditions
- ML/IA (simplifié pour prototype)

**Endpoints** :
- `POST /predictions/predict` - Prédire le rendement
- `POST /predictions/risk-assessment` - Évaluer les risques
- `GET /predictions/history` - Historique
- `GET /health` - Health check

**Modèle de données** :
```python
class CropData:
    crop_type: str
    area_hectares: float
    soil_type: str
    rainfall_mm: float
    temperature_c: float
    fertilizer_used: bool

class PredictionResponse:
    crop_type: str
    predicted_yield_kg: float
    confidence_level: float
    recommendation: str
```

**Algorithme (simplifié)** :
```
yield = base_yield × yield_factor × area
où yield_factor = f(fertilizer, rainfall, temperature, soil)
```

---

### 6. Billing Service (Port 8085)

**Technologie** : .NET 9 + CoreWCF + SOAP

**Responsabilités** :
- Facturation des intrants agricoles
- Calcul des coûts (engrais, semences, pesticides)
- Suivi des paiements
- Génération de factures

**WSDL** : `http://billing-service:8085/BillingService?wsdl`

**Opérations SOAP** :
- `calculateCost(BillingRequest)` - Calculer coût
- `createInvoice(farmerId, items)` - Créer facture
- `getInvoice(invoiceId)` - Obtenir facture
- `listInvoices(farmerId)` - Lister factures

---

## 🔐 Sécurité

### Architecture de Sécurité

```
Client → Gateway (vérification JWT) → Service
               ↓
          Auth Service (validation token)
```

### JWT Flow

1. **Inscription/Connexion** : Client → Auth Service
2. **Génération token** : Auth Service → Client (JWT)
3. **Requête protégée** : Client → Gateway (header: Bearer <token>)
4. **Validation** : Gateway valide le token
5. **Routage** : Gateway → Service cible
6. **Réponse** : Service → Gateway → Client

### Secrets Management

⚠️ **CRITIQUE** : Tous les services doivent partager le même `JWT_SECRET`

**Recommandations** :
- Utiliser un gestionnaire de secrets (Vault, AWS Secrets Manager)
- Secret minimum 256 bits
- Rotation régulière (tous les 90 jours)
- Ne jamais committer dans Git

---

## 🔄 Communication Inter-Services

### REST (JSON)
- Auth Service ↔ Gateway
- Farmer Service ↔ Gateway
- Prediction Service ↔ Gateway

### SOAP (XML)
- Crop Service ↔ Gateway
- Billing Service ↔ Gateway

### Protocoles
- **Synchrone** : HTTP/HTTPS
- **Asynchrone** : À implémenter (RabbitMQ, Kafka)

---

## 💾 Bases de Données

### PostgreSQL (Auth Service, Billing Service)
- Données relationnelles
- ACID compliance
- Transactions

### MongoDB (Farmer Service)
- Documents JSON flexibles
- Évolutivité horizontale
- Requêtes rapides

### Persistance
```yaml
volumes:
  postgres_data:
    driver: local
  mongodb_data:
    driver: local
```

---

## 🌐 Réseau Docker

```yaml
networks:
  agri-network:
    driver: bridge
```

**Isolation** : Tous les services communiquent via le réseau `agri-network`
**DNS** : Les services se résolvent par nom (ex: `http://auth-service:8081`)

---

## 📊 Monitoring & Observabilité

### Health Checks
Tous les services exposent `/health` :
```json
{
  "status": "UP",
  "service": "Service Name",
  "timestamp": "2025-12-17T10:00:00Z"
}
```

### Métriques (à implémenter)
- **Prometheus** : Collecte des métriques
- **Grafana** : Visualisation
- **ELK Stack** : Logs centralisés

### Logging
- Format JSON structuré
- Corrélation par request-id
- Niveaux : DEBUG, INFO, WARN, ERROR

---

## 🚀 Scalabilité

### Horizontal Scaling
```yaml
services:
  farmer-service:
    deploy:
      replicas: 3
```

### Load Balancing
Gateway distribue automatiquement les requêtes

### Cache (à implémenter)
- Redis pour sessions
- Cache des réponses fréquentes

---

## 🔧 Résilience

### Circuit Breaker
Gateway implémente le circuit breaker :
- Si un service est down, le circuit s'ouvre
- Fallback vers réponses par défaut
- Rétablissement progressif

### Retry Logic
- 3 tentatives avec backoff exponentiel
- Timeout : 30 secondes par défaut

### Health Checks
Docker Compose vérifie la santé :
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8081/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## 📈 Performance

### Temps de Réponse Cibles
- Health checks : < 100ms
- CRUD opérations : < 500ms
- Prédictions : < 2s
- Génération factures : < 3s

### Capacité
- 1000 requêtes/minute par service
- 10000 utilisateurs concurrents

---

## 🔄 CI/CD (à implémenter)

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  build:
    - Build tous les services
    - Exécuter tests
    - Scanner vulnérabilités
    - Déployer si main branch
```

---

## 📚 Technologies Stack Complète

| Couche | Technologies |
|--------|-------------|
| **Gateway** | Spring Cloud Gateway, Java 17 |
| **Services** | Spring Boot, Node.js, Python, .NET |
| **Bases de données** | PostgreSQL 16, MongoDB 7 |
| **Protocoles** | REST (JSON), SOAP (XML) |
| **Sécurité** | JWT (HS256), Spring Security |
| **Conteneurisation** | Docker, Docker Compose |
| **Monitoring** | (À implémenter) Prometheus, Grafana |
| **Logs** | (À implémenter) ELK Stack |

---

## 🎓 Principes Architecturaux

1. **Séparation des responsabilités** : Un service = Une fonction métier
2. **Indépendance** : Services déployables indépendamment
3. **Interopérabilité** : REST + SOAP pour la compatibilité
4. **Évolutivité** : Scaling horizontal facile
5. **Résilience** : Isolation des pannes
6. **Sécurité** : JWT centralisé, validation systématique

---

**Dernière mise à jour** : 17/12/2025  
**Version** : 1.0  
**Auteur** : MAHAMADOU AMADOU HABOU
