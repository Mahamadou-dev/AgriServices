# 📖 Manuel d'Utilisation - AgriServices

**Projet:** AgriServices - Plateforme SOA de Gestion Agricole  
**Version:** 1.0  
**Date:** 17 décembre 2025

---

## 🎯 Introduction

AgriServices est une plateforme de gestion agricole basée sur une architecture SOA (Service-Oriented Architecture) qui permet aux agriculteurs et aux experts agricoles de gérer leurs exploitations, cultures, prédictions et factures de manière centralisée et sécurisée.

---

## 👥 Public Cible

- 🧑‍🌾 **Agriculteurs** : Gestion de profils et exploitations
- 🤝 **Coopératives** : Suivi des membres et activités
- 🔬 **Experts agricoles** : Conseils et support
- 📦 **Gestionnaires d'intrants** : Facturation et suivi des paiements

---

## 🚀 Installation et Démarrage

### Prérequis

- Docker Desktop installé (version 20.10+)
- Docker Compose installé (version 2.0+)
- Compte MongoDB Atlas configuré (voir SETUP-MONGODB-ATLAS.md)
- 4 GB RAM minimum disponible
- Ports disponibles : 8080, 8081, 3001, 8082, 8000, 8085

### Démarrage Rapide

#### 1. Cloner le Projet

```bash
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices
```

#### 2. Configuration des Variables d'Environnement

Créer un fichier `.env` dans le dossier `docker/` :

```bash
# docker/.env

# JWT Configuration
JWT_SECRET=dGhpcy1pcy1hLWxvbmctYW5kLXNlY3VyZS1zZWNyZXQta2V5LWZvci10aGUtanctdC1hdXRoLXNlcnZpY2UtdG8tc2lnbi1hbmQtdmFsaWRhdGUtam9zLTM4

# MongoDB Atlas URIs
FARMER_MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/farmerdb
BILLING_MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/billingdb

# PostgreSQL (Auth Service)
POSTGRES_DB=auth_db
POSTGRES_USER=authuser
POSTGRES_PASSWORD=authpassword
```

#### 3. Démarrer les Services

```bash
cd docker
docker compose up -d
```

#### 4. Vérifier le Démarrage

```bash
# Vérifier que tous les services sont en cours d'exécution
docker compose ps

# Vérifier les logs
docker compose logs -f
```

#### 5. Tester l'API Gateway

```bash
curl http://localhost:8080/health
```

Réponse attendue :
```json
{
  "status": "ok"
}
```

---

## 📡 Utilisation des Services

### 1. Service d'Authentification

L'authentification est requise pour accéder à tous les autres services.

#### A. Créer un Compte

**Endpoint:** `POST /auth/register`  
**URL:** `http://localhost:8080/auth/register`

**Corps de la Requête:**
```json
{
  "username": "jean.dupont",
  "email": "jean.dupont@email.com",
  "password": "MotDePasse123!",
  "role": "FARMER"
}
```

**Exemple avec curl:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jean.dupont",
    "email": "jean.dupont@email.com",
    "password": "MotDePasse123!",
    "role": "FARMER"
  }'
```

#### B. Se Connecter

**Endpoint:** `POST /auth/login`  
**URL:** `http://localhost:8080/auth/login`

**Corps de la Requête:**
```json
{
  "username": "jean.dupont",
  "password": "MotDePasse123!"
}
```

**Exemple avec curl:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jean.dupont",
    "password": "MotDePasse123!"
  }'
```

💡 **Important:** Copiez le token JWT, il sera nécessaire pour toutes les requêtes suivantes.

---

### 2. Service Farmer (Gestion des Agriculteurs)

Tous les endpoints nécessitent un token JWT valide.

#### A. Créer un Profil Agriculteur

**Endpoint:** `POST /api/farmers`  
**URL:** `http://localhost:8080/api/farmers`

**Headers:**
```
Authorization: Bearer {votre_token_jwt}
Content-Type: application/json
```

**Corps de la Requête:**
```json
{
  "userId": "1",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+221771234567",
  "address": {
    "street": "Avenue Bourguiba",
    "city": "Dakar",
    "region": "Dakar",
    "country": "Sénégal"
  },
  "farms": [
    {
      "name": "Ferme de Thiès",
      "size": 50.5,
      "unit": "hectares",
      "location": {
        "latitude": 14.7886,
        "longitude": -16.9402
      },
      "crops": ["mil", "arachide", "maïs"]
    }
  ]
}
```

#### B. Obtenir un Agriculteur

**Endpoint:** `GET /api/farmers/:id`  
**URL:** `http://localhost:8080/api/farmers/{farmer_id}`

```bash
curl http://localhost:8080/api/farmers/674b5e8f1234567890abcdef \
  -H "Authorization: Bearer $TOKEN"
```

#### C. Lister Tous les Agriculteurs

**Endpoint:** `GET /api/farmers`  
**URL:** `http://localhost:8080/api/farmers`

```bash
curl http://localhost:8080/api/farmers \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3. Service Crop (Gestion des Cultures - SOAP)

Service SOAP pour obtenir des informations sur les cultures.

**WSDL:** `http://localhost:8082/CropService?wsdl`

#### Méthodes Disponibles

1. **getCropInfo** : Obtenir des informations sur une culture
2. **calculateYield** : Calculer le rendement pour une surface donnée
3. **listAllCrops** : Lister toutes les cultures disponibles

---

### 4. Service Prediction (Prédictions Agricoles)

#### A. Prédire le Rendement

**Endpoint:** `POST /api/predict/yield`  
**URL:** `http://localhost:8080/api/predict/yield`

```bash
curl -X POST http://localhost:8080/api/predict/yield \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cropType": "mil",
    "area": 50,
    "rainfall": 800
  }'
```

---

### 5. Service Billing (Facturation - SOAP)

Service SOAP pour la gestion des factures.

**WSDL:** `http://localhost:8085/BillingService?wsdl`

#### Méthodes Disponibles

1. **createInvoice** : Créer une facture
2. **getInvoice** : Obtenir une facture
3. **listInvoices** : Lister les factures d'un agriculteur
4. **markAsPaid** : Marquer une facture comme payée

---

## ⚠️ Dépannage

### Problème : Services ne démarrent pas

**Solution:**
```bash
# Vérifier les logs
docker compose logs

# Redémarrer les services
docker compose down
docker compose up -d
```

### Problème : "Connection to MongoDB failed"

**Solution:**
1. Vérifier la connexion MongoDB Atlas dans `.env`
2. Vérifier Network Access dans MongoDB Atlas (0.0.0.0/0 autorisé)
3. Vérifier username/password dans l'URI

---

## 📊 Monitoring et Health Checks

### Vérifier l'État des Services

```bash
# Gateway
curl http://localhost:8080/health

# Auth Service
curl http://localhost:8081/health

# Farmer Service
curl http://localhost:3001/health

# Prediction Service
curl http://localhost:8000/health
```

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **Ne jamais** partager votre token JWT publiquement
2. **Changer** les mots de passe par défaut en production
3. **Utiliser HTTPS** en production (pas HTTP)
4. **Restreindre** les accès MongoDB Atlas aux IPs spécifiques

---

## 📚 Ressources Complémentaires

- **Cahier des charges:** `cahier-des-charges.md`
- **Spécifications techniques:** `specs-techniques.md`
- **Conception système:** `CONCEPTION-SYSTEME.md`
- **Guide développeur:** `GUIDE-EQUIPE-DEVELOPPEMENT.md`
- **Setup MongoDB Atlas:** `SETUP-MONGODB-ATLAS.md`

---

**Version:** 1.0  
**Date de dernière mise à jour:** 17 décembre 2025  
**Auteur:** MAHAMADOU AMADOU HABOU  

---
