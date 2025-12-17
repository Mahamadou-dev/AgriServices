# 📐 Conception du Système SOA Agricole

**Date:** 16 décembre 2025  
**Version:** 1.0  
**Projet:** AgriServices - Architecture SOA Multi-technologies

---

## 🎯 Vue d'Ensemble

Ce document présente la conception simplifiée du système SOA agricole avec 6 microservices interconnectés via une API Gateway.

---

## 🗄️ Architecture de Base de Données

### Stratégie Multi-Base de Données

Le projet utilise une approche **polyglotte** avec différentes bases de données selon les besoins:

| Service | Base de Données | Justification |
|---------|-----------------|---------------|
| **auth-service** | PostgreSQL | Relations strictes, transactions ACID pour l'authentification |
| **farmer-service** | MongoDB Atlas | Flexibilité des schémas, données document-oriented |
| **crop-service** | Aucune (SOAP stateless) | Service de calcul sans persistance |
| **prediction-service** | Aucune (calculs temps réel) | Service de prédiction stateless |
| **billing-service** | MongoDB Atlas | Flexibilité pour les factures et items |
| **api-gateway** | Aucune | Routage et agrégation uniquement |

### Pourquoi MongoDB Atlas?

✅ **Avantages pour ce projet:**
- Déploiement cloud gratuit (Free Tier)
- Pas de gestion d'infrastructure
- Haute disponibilité automatique
- Backups automatiques
- Interface web intuitive
- Connexion sécurisée par défaut

---

## 📊 Diagramme de Classes Simplifié

### 1. Auth-Service (PostgreSQL)

```
┌─────────────────────────┐
│       User              │
├─────────────────────────┤
│ - id: Long              │
│ - username: String      │
│ - email: String         │
│ - password: String      │
│ - role: String          │
│ - createdAt: DateTime   │
├─────────────────────────┤
│ + login()               │
│ + register()            │
│ + generateToken()       │
└─────────────────────────┘
```

### 2. Farmer-Service (MongoDB)

```
┌─────────────────────────┐
│       Farmer            │
├─────────────────────────┤
│ - _id: ObjectId         │
│ - userId: String        │
│ - firstName: String     │
│ - lastName: String      │
│ - phone: String         │
│ - address: Object       │
│   - street: String      │
│   - city: String        │
│   - region: String      │
│ - farms: Array          │
│   - name: String        │
│   - size: Number        │
│   - location: Object    │
│ - createdAt: Date       │
│ - updatedAt: Date       │
├─────────────────────────┤
│ + create()              │
│ + update()              │
│ + findById()            │
│ + listAll()             │
└─────────────────────────┘
```

### 3. Crop-Service (SOAP - Stateless)

```
┌─────────────────────────┐
│       Crop              │
├─────────────────────────┤
│ - id: String            │
│ - name: String          │
│ - type: String          │
│ - season: String        │
│ - yieldPerHectare: int  │
├─────────────────────────┤
│ + getCropInfo()         │
│ + calculateYield()      │
│ + listCrops()           │
└─────────────────────────┘
```

### 4. Billing-Service (MongoDB)

```
┌─────────────────────────┐
│       Invoice           │
├─────────────────────────┤
│ - _id: ObjectId         │
│ - invoiceNumber: String │
│ - farmerId: String      │
│ - items: Array          │
│   - name: String        │
│   - quantity: Number    │
│   - unitPrice: Number   │
│   - total: Number       │
│ - totalAmount: Number   │
│ - status: String        │
│ - createdAt: Date       │
│ - paidAt: Date          │
├─────────────────────────┤
│ + create()              │
│ + calculate()           │
│ + getByFarmer()         │
└─────────────────────────┘
```

### 5. Prediction-Service (Stateless)

```
┌─────────────────────────┐
│     Prediction          │
├─────────────────────────┤
│ - cropType: String      │
│ - weather: Object       │
│ - soil: Object          │
│ - result: Object        │
├─────────────────────────┤
│ + predictYield()        │
│ + predictRisk()         │
│ + getRecommendations()  │
└─────────────────────────┘
```

---

## 🔄 Diagramme de Cas d'Utilisation

### Acteurs
- 👨‍🌾 **Agriculteur (Farmer)** : Utilisateur principal
- 👨‍💼 **Expert Agricole** : Consultant/Conseiller
- 🤖 **Système** : Processus automatisés

### Cas d'Utilisation Principaux

```
┌─────────────────────────────────────────────────────────────┐
│                    Système AgriServices                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Agriculteur]                                                │
│       │                                                       │
│       ├──> (S'authentifier)                                  │
│       │         │                                             │
│       │         └──> (Générer JWT)                           │
│       │                                                       │
│       ├──> (Gérer son profil)                                │
│       │         │                                             │
│       │         ├──> (Créer profil)                          │
│       │         ├──> (Modifier informations)                 │
│       │         └──> (Ajouter fermes)                        │
│       │                                                       │
│       ├──> (Consulter informations cultures)                 │
│       │         │                                             │
│       │         ├──> (Lister cultures disponibles)           │
│       │         └──> (Calculer rendement)                    │
│       │                                                       │
│       ├──> (Obtenir prédictions)                             │
│       │         │                                             │
│       │         ├──> (Prédire rendement)                     │
│       │         └──> (Évaluer risques)                       │
│       │                                                       │
│       └──> (Gérer factures)                                  │
│               │                                               │
│               ├──> (Créer facture)                           │
│               ├──> (Consulter factures)                      │
│               └──> (Marquer comme payée)                     │
│                                                               │
│  [Expert Agricole]                                            │
│       │                                                       │
│       ├──> (S'authentifier)                                  │
│       ├──> (Consulter données agriculteurs)                  │
│       └──> (Fournir recommandations)                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Technique

```
┌──────────────────────────────────────────────────────────┐
│                    Client (Web/Mobile)                    │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ HTTP/REST
                     ▼
┌──────────────────────────────────────────────────────────┐
│              API Gateway (Spring Cloud)                   │
│              Port: 8080                                   │
│              - Routage                                    │
│              - Load Balancing                             │
│              - JWT Validation                             │
└──────┬──────┬──────┬──────┬──────┬────────────────────────┘
       │      │      │      │      │
       │      │      │      │      │
       ▼      ▼      ▼      ▼      ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Auth    │ │  Farmer  │ │   Crop   │ │Prediction│ │ Billing  │
│ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │
│          │ │          │ │          │ │          │ │          │
│ Spring   │ │ Node.js  │ │   JAX-WS │ │  FastAPI │ │  .NET    │
│ Boot     │ │ Express  │ │   SOAP   │ │  Python  │ │  SOAP    │
│:8081     │ │:3001     │ │:8082     │ │:8000     │ │:8085     │
└────┬─────┘ └────┬─────┘ └──────────┘ └──────────┘ └────┬─────┘
     │            │                                        │
     │            │                                        │
     ▼            ▼                                        ▼
┌─────────┐ ┌─────────────┐                        ┌─────────────┐
│PostgreSQL│ │MongoDB Atlas│                        │MongoDB Atlas│
│  Auth DB │ │  Farmer DB  │                        │ Billing DB  │
└──────────┘ └─────────────┘                        └─────────────┘
```

---

## 📋 Collections MongoDB Atlas

### Database: `farmerdb`

#### Collection: `farmers`
```javascript
{
  _id: ObjectId("..."),
  userId: "auth-user-id-123",
  firstName: "Jean",
  lastName: "Dupont",
  phone: "+221771234567",
  address: {
    street: "Avenue Cheikh Anta Diop",
    city: "Dakar",
    region: "Dakar",
    country: "Sénégal"
  },
  farms: [
    {
      name: "Ferme de Thiès",
      size: 50.5,
      unit: "hectares",
      location: {
        latitude: 14.7886,
        longitude: -16.9402
      },
      crops: ["mil", "arachide", "maïs"]
    }
  ],
  createdAt: ISODate("2025-12-16T10:00:00Z"),
  updatedAt: ISODate("2025-12-16T10:00:00Z")
}
```

### Database: `billingdb`

#### Collection: `invoices`
```javascript
{
  _id: ObjectId("..."),
  invoiceNumber: "INV-2025-001",
  farmerId: ObjectId("..."),
  items: [
    {
      name: "Engrais NPK",
      quantity: 10,
      unit: "sacs",
      unitPrice: 15000,
      total: 150000
    },
    {
      name: "Semences de mil",
      quantity: 5,
      unit: "kg",
      unitPrice: 2000,
      total: 10000
    }
  ],
  totalAmount: 160000,
  currency: "XOF",
  status: "pending", // pending, paid, cancelled
  createdAt: ISODate("2025-12-16T10:00:00Z"),
  paidAt: null,
  notes: "Livraison prévue le 20 décembre"
}
```

---

## 🔐 Sécurité

### Flux d'Authentification

```
1. Client → Auth-Service : POST /auth/login
   {
     "username": "farmer1",
     "password": "password123"
   }

2. Auth-Service → PostgreSQL : Vérification identifiants

3. Auth-Service → Client : JWT Token
   {
     "token": "eyJhbGc...",
     "expiresIn": 3600
   }

4. Client → API Gateway : GET /api/farmers/me
   Header: Authorization: Bearer eyJhbGc...

5. API Gateway : Valide JWT

6. API Gateway → Farmer-Service : Transmet requête

7. Farmer-Service → MongoDB : Récupère données

8. Farmer-Service → Client : Données agriculteur
```

---

## 📡 Endpoints Principaux

### Auth-Service (Port 8081)
```
POST   /auth/register     - Créer un compte
POST   /auth/login        - Se connecter
GET    /auth/validate     - Valider un token
GET    /health            - Health check
```

### Farmer-Service (Port 3001)
```
POST   /api/farmers       - Créer un agriculteur
GET    /api/farmers/:id   - Obtenir un agriculteur
PUT    /api/farmers/:id   - Modifier un agriculteur
DELETE /api/farmers/:id   - Supprimer un agriculteur
GET    /api/farmers       - Lister tous les agriculteurs
GET    /health            - Health check
```

### Crop-Service (Port 8082 - SOAP)
```
SOAP   getCropInfo        - Informations sur une culture
SOAP   calculateYield     - Calculer rendement
SOAP   listCrops          - Lister les cultures
```

### Prediction-Service (Port 8000)
```
POST   /api/predict/yield - Prédire rendement
POST   /api/predict/risk  - Évaluer risques
GET    /health            - Health check
```

### Billing-Service (Port 8085 - SOAP)
```
SOAP   createInvoice      - Créer une facture
SOAP   getInvoice         - Obtenir une facture
SOAP   listInvoices       - Lister les factures
SOAP   markAsPaid         - Marquer comme payée
```

### API Gateway (Port 8080)
```
/*                         - Route vers les services
/health                    - Health check global
```

---

## 🎨 Principes de Conception

### 1. Microservices
- Chaque service est **autonome** et **indépendant**
- Peut être développé, testé et déployé séparément
- Utilise sa propre base de données (Database per Service)

### 2. API Gateway Pattern
- Point d'entrée unique pour les clients
- Gère le routage vers les services
- Valide les JWT
- Agrège les réponses si nécessaire

### 3. Polyglot Persistence
- PostgreSQL pour auth-service (relations, ACID)
- MongoDB pour farmer/billing (flexibilité, documents)
- Services stateless pour crop/prediction (calculs)

### 4. Communication
- **REST** : Auth, Farmer, Prediction (JSON)
- **SOAP** : Crop, Billing (XML, WSDL)
- **Synchrone** : Toutes les communications

---

## 📝 Notes de Conception

### Évolutions Futures
1. **Messaging** : Ajouter RabbitMQ/Kafka pour communications asynchrones
2. **Caching** : Redis pour améliorer performances
3. **Service Discovery** : Eureka pour découverte automatique
4. **Monitoring** : Prometheus + Grafana
5. **Tracing** : Jaeger pour traçabilité distribuée

### Limitations Actuelles
- Pas de gestion d'événements asynchrones
- Pas de saga pattern pour transactions distribuées
- Pas de circuit breaker (résilience)
- Pas de rate limiting

---

**Document créé le:** 16 décembre 2025  
**Pour questions:** Consulter README.md ou ouvrir une issue GitHub
---

**📅 Dernière mise à jour** : `05/16/2025`  
**👤 Auteur** : `MAHAMADOU AMADOU HABOU`  
**🏷️ Version** : `1.1`

---
