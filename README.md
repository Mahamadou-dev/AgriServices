# 🌾 AgriServices - Plateforme SOA de Gestion Agricole

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-Academic-blue)]()
[![Java](https://img.shields.io/badge/Java-17-orange)]()
[![Node.js](https://img.shields.io/badge/Node.js-20-green)]()
[![Python](https://img.shields.io/badge/Python-3.12-blue)]()
[![.NET](https://img.shields.io/badge/.NET-9-purple)]()

Une plateforme SOA (Service-Oriented Architecture) distribuée et moderne pour la gestion complète des exploitations agricoles, intégrant services REST et SOAP.

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation Rapide](#installation-rapide)
- [Utilisation](#utilisation)
- [Documentation](#documentation)
- [État du Projet](#état-du-projet)

---

## 🎯 Vue d'Ensemble

AgriServices est une solution complète de gestion agricole moderne basée sur une architecture orientée services (SOA). Elle permet aux agriculteurs, coopératives et experts agricoles de :

- 🔐 Gérer l'authentification sécurisée avec JWT
- 👨‍🌾 Administrer les profils d'agriculteurs et leurs exploitations
- �� Suivre les cultures et les parcelles (SOAP)
- 🔮 Obtenir des prédictions de rendement basées sur l'IA
- 💰 Gérer la facturation des intrants agricoles (SOAP)
- 🌐 Accéder à tous les services via une API Gateway unifiée

---

## 🏗️ Architecture

### Services

| Service | Technologie | Port | Type | Statut |
|---------|-------------|------|------|--------|
| **API Gateway** | Spring Cloud | 8080 | REST | ✅ Implémenté |
| **Auth Service** | Spring Boot | 8081 | REST | ✅ Implémenté |
| **Farmer Service** | Node.js/Express | 3001 | REST | ✅ Implémenté |
| **Crop Service** | JAX-WS | 8082 | SOAP | ⚠️ À compléter |
| **Prediction Service** | FastAPI | 8000 | REST | ✅ Implémenté |
| **Billing Service** | .NET CoreWCF | 8085 | SOAP | ⚠️ À compléter |

### Bases de Données

- **PostgreSQL** : Auth Service, Billing Service
- **MongoDB** : Farmer Service

---

## ✨ Fonctionnalités

### 🔐 Auth Service (Authentification)
- Inscription et connexion sécurisées
- Génération et validation de tokens JWT
- Gestion des rôles (FARMER, ADMIN, EXPERT)

### 👨‍🌾 Farmer Service (Gestion Agriculteurs)
- CRUD complet des profils d'agriculteurs
- Recherche et filtrage avancés
- Gestion des exploitations

### 🔮 Prediction Service (Prédictions IA)
- Prédiction de rendement agricole
- Évaluation des risques
- Recommandations personnalisées

---

## 🛠️ Technologies

- **Java 17** - Spring Boot 3.2, Spring Cloud Gateway
- **Node.js 20** - Express 5, Mongoose
- **Python 3.12** - FastAPI, Pydantic
- **.NET 9** - CoreWCF
- **PostgreSQL 16** & **MongoDB 7**
- **Docker** & **Docker Compose**

---

## 🚀 Installation Rapide

```bash
# 1. Cloner le dépôt
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices

# 2. Démarrer avec Docker Compose
cd docker
docker-compose up -d

# 3. Vérifier l'état
curl http://localhost:8080/health
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture](documentation/architecture.md) | Diagrammes et architecture SOA |
| [Guide de Déploiement](documentation/guide-deploiement.md) | Installation production |
| [Production Readiness](documentation/production-readiness.md) | Checklist pré-production |
| [Farmer Service](services/farmer-service/README.md) | Documentation Farmer Service |
| [Prediction Service](services/prediction-service/README.md) | Documentation Prediction Service |

---

## 📊 État du Projet

### ✅ Complété (80%)

- ✅ Auth Service, Farmer Service, Prediction Service fonctionnels
- ✅ API Gateway configuré
- ✅ Docker Compose avec bases de données
- ✅ Documentation technique complète

### ⚠️ À Compléter (20%)

- ⚠️ Crop Service (SOAP/JAX-WS) à implémenter
- ⚠️ Billing Service (.NET SOAP) à compléter
- ⚠️ Tests automatisés
- ⚠️ CI/CD Pipeline

**Voir** : [Production Readiness Checklist](documentation/production-readiness.md)

---

## 📄 Licence

Projet académique - Usage pédagogique uniquement.

## 👤 Auteur

**MAHAMADOU AMADOU HABOU**

**Dernière mise à jour** : 17 Décembre 2025  
**Version** : 1.0.0
