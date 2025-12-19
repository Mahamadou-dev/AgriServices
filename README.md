# 🌾 AgriServices - Plateforme SOA de Gestion Agricole

Système de gestion agricole distribué basé sur une architecture orientée services (SOA) avec microservices REST et SOAP.

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/)
[![Node.js](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## 🎯 Description

AgriServices est une plateforme complète de gestion agricole permettant aux agriculteurs, coopératives et experts de gérer leurs exploitations, cultures, prédictions et factures de manière centralisée et sécurisée.

### Fonctionnalités principales

- 🔐 **Authentification JWT** : Sécurisation des accès avec tokens JWT
- 👨‍🌾 **Gestion des agriculteurs** : CRUD complet avec MongoDB
- 🌱 **Gestion des cultures** : Service SOAP pour les cultures et parcelles
- 📊 **Prédictions agricoles** : Estimations de rendement et risques
- 💰 **Facturation** : Service SOAP pour la gestion des factures
- 🔗 **API Gateway** : Point d'entrée unique avec routage intelligent

---

## 🏗️ Architecture

Le système est composé de 6 microservices indépendants :

```
                          ┌─────────────────┐
                          │   API Gateway   │
                          │   (Port 8080)   │
                          └────────┬────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │              │           │           │              │
        ▼              ▼           ▼           ▼              ▼
  ┌──────────┐  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │   Auth   │  │  Farmer  │ │   Crop   │ │Prediction│ │ Billing  │
  │ Service  │  │ Service  │ │ Service  │ │ Service  │ │ Service  │
  │  :8081   │  │  :3001   │ │  :8082   │ │  :8000   │ │  :8085   │
  └────┬─────┘  └────┬─────┘ └──────────┘ └──────────┘ └────┬─────┘
       │             │                                        │
       ▼             ▼                                        ▼
  ┌──────────┐ ┌────────────┐                         ┌────────────┐
  │PostgreSQL│ │MongoDB     │                         │MongoDB     │
  │ Auth DB  │ │ Farmer DB  │                         │ Billing DB │
  └──────────┘ └────────────┘                         └────────────┘
```

### Technologies par service

| Service | Technologie | Port | Base de données |
|---------|-------------|------|-----------------|
| **API Gateway** | Spring Cloud Gateway | 8080 | - |
| **Auth Service** | Spring Boot 3.4 | 8081 | PostgreSQL 16 |
| **Farmer Service** | Node.js 22 + Express | 3001 | MongoDB Atlas |
| **Crop Service** | Java JAX-WS (SOAP) | 8082 | - |
| **Prediction Service** | Python FastAPI | 8000 | - |
| **Billing Service** | .NET 9 (SOAP) | 8085 | MongoDB Atlas |

---

## 🚀 Démarrage Rapide

### Prérequis

- Docker Desktop (v20.10+)
- Docker Compose (v2.0+)
- Compte MongoDB Atlas (gratuit) - [Voir SETUP-MONGODB-ATLAS.md](documentation/SETUP-MONGODB-ATLAS.md)
- 4 GB RAM minimum

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices
```

2. **Configurer les variables d'environnement**
```bash
cd docker
cp .env.example .env
# Éditer .env avec vos configurations MongoDB Atlas
```

3. **Démarrer tous les services**
```bash
docker compose up -d
```

4. **Vérifier le démarrage**
```bash
# Vérifier les services
docker compose ps

# Vérifier les logs
docker compose logs -f

# Tester l'API Gateway
curl http://localhost:8080/health
```

---

## 📖 Documentation

Documentation complète disponible dans le dossier `/documentation` :

### 🚀 Guides de Démarrage
- **[Démarrage Local](documentation/DEMARRAGE-LOCAL.md)** - Guide complet pour démarrer tous les services
- **[Guide de Tests](documentation/GUIDE-TESTS.md)** - Instructions détaillées pour tester chaque service

### 🖥️ Documentation Frontend
- **[Guide Frontend](documentation/guide-frontend.md)** - Guide d'utilisation du frontend Next.js
- **[README Frontend](frontend/README.md)** - Documentation technique du frontend

### 📚 Documentation Technique
- **[Cahier des charges](documentation/cahier-des-charges.md)** - Spécifications du projet
- **[Architecture](documentation/architecture.md)** - Architecture du système
- **[Spécifications techniques](documentation/specs-techniques.md)** - Détails techniques
- **[Manuel d'utilisation](documentation/manuel-utilisation.md)** - Guide utilisateur complet
- **[Conception système](documentation/CONCEPTION-SYSTEME.md)** - Architecture et design détaillé

### ⚙️ Configuration & Déploiement
- **[Setup MongoDB Atlas](documentation/SETUP-MONGODB-ATLAS.md)** - Configuration MongoDB
- **[Guide équipe développement](documentation/GUIDE-EQUIPE-DEVELOPPEMENT.md)** - Guide pour les développeurs
- **[Guide de déploiement](documentation/guide-deploiement.md)** - Déploiement en production
- **[Production Readiness](documentation/production-readiness.md)** - Préparation pour la production

---

## 🔧 Développement

### Structure du projet

```
AgriServices/
├── documentation/          # Documentation complète
├── docker/                # Docker Compose et Dockerfiles
│   ├── Dockerfiles/
│   ├── docker-compose.yml
│   └── .env.example
├── services/
│   ├── auth-service/      # Service d'authentification (Spring Boot)
│   ├── farmer-service/    # Service agriculteurs (Node.js)
│   ├── crop-service/      # Service cultures (JAX-WS SOAP)
│   ├── prediction-service/# Service prédictions (FastAPI)
│   ├── billing-service/   # Service facturation (.NET SOAP)
│   └── api-gateway/       # Passerelle API (Spring Cloud)
└── README.md
```

### Compilation locale

**Auth Service & API Gateway (Java)**
```bash
cd services/auth-service
./mvnw clean compile
```

**Farmer Service (Node.js)**
```bash
cd services/farmer-service
npm install
npm start
```

---

## 📡 API Endpoints

### Via API Gateway (http://localhost:8080)

**Authentification**
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter
- `GET /auth/validate` - Valider un token

**Farmers**
- `POST /api/farmers` - Créer un agriculteur
- `GET /api/farmers` - Lister les agriculteurs
- `GET /api/farmers/:id` - Obtenir un agriculteur
- `PUT /api/farmers/:id` - Modifier un agriculteur
- `DELETE /api/farmers/:id` - Supprimer un agriculteur

**Prédictions**
- `POST /api/predict/yield` - Prédire le rendement
- `POST /api/predict/risk` - Évaluer les risques

**Services SOAP**
- `/crop/**` - Service cultures (WSDL disponible)
- `/billing/**` - Service facturation (WSDL disponible)

Voir le [Manuel d'utilisation](documentation/manuel-utilisation.md) pour des exemples détaillés.

---

## 🧪 Tests

Le projet inclut un fichier de tests complet `tests-api.json` avec des exemples pour tous les services.

```bash
# Vérifier la santé de tous les services
curl http://localhost:8080/health  # Gateway
curl http://localhost:8081/auth/health  # Auth
curl http://localhost:3001/health  # Farmer
curl http://localhost:8000/health  # Prediction
curl http://localhost:8082/crop?wsdl  # Crop WSDL
curl http://localhost:8085/billing?wsdl  # Billing WSDL
```

**Voir les guides détaillés:**
- **[Guide de Tests Complet](documentation/GUIDE-TESTS.md)** - Instructions détaillées pour tester chaque service
- **[Fichier de Tests JSON](tests-api.json)** - Collection complète de tests API

---

## 🛠️ Technologies

- **Backend**: Spring Boot, Node.js, FastAPI, .NET Core
- **Base de données**: PostgreSQL, MongoDB Atlas
- **Sécurité**: JWT (HS256), Spring Security, BCrypt
- **Communication**: REST, SOAP (JAX-WS, CoreWCF)
- **Conteneurisation**: Docker, Docker Compose
- **Gateway**: Spring Cloud Gateway

---

## 👥 Contributeurs

- **MAHAMADOU AMADOU HABOU** - Développeur principal

---

## 📄 Licence

Projet académique — Usage pédagogique uniquement.

---

## 🆘 Support

Pour toute question ou problème :
1. Consulter la [documentation](documentation/)
2. Ouvrir une [issue GitHub](https://github.com/Mahamadou-dev/AgriServices/issues)
3. Consulter le [guide de dépannage](documentation/manuel-utilisation.md#️-dépannage)

---

**Version**: 1.0  
**Dernière mise à jour**: 17 décembre 2025
