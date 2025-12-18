# 🚀 Guide de Démarrage Local - AgriServices

**Version**: 1.0  
**Date**: 18 Décembre 2025  
**Auteur**: MAHAMADOU AMADOU HABOU

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration Initiale](#configuration-initiale)
3. [Démarrage avec Docker Compose](#démarrage-avec-docker-compose)
4. [Démarrage Manuel des Services](#démarrage-manuel-des-services)
5. [Vérification du Démarrage](#vérification-du-démarrage)
6. [Dépannage](#dépannage)
7. [Arrêt des Services](#arrêt-des-services)

---

## 🔧 Prérequis

### Logiciels Requis

| Outil | Version Minimale | Vérification |
|-------|------------------|--------------|
| **Docker Desktop** | 20.10+ | `docker --version` |
| **Docker Compose** | 2.0+ | `docker compose version` |
| **Git** | 2.30+ | `git --version` |
| **Java JDK** (pour build local) | 17+ | `java -version` |
| **Node.js** (pour build local) | 22+ | `node --version` |
| **Python** (pour build local) | 3.12+ | `python --version` |
| **.NET SDK** (pour build local) | 9.0+ | `dotnet --version` |

### Ressources Système

- **RAM**: 4 GB minimum (8 GB recommandé)
- **Espace disque**: 10 GB minimum
- **CPU**: 2 cœurs minimum (4 cœurs recommandé)

### Comptes Requis

- **MongoDB Atlas**: Compte gratuit (M0 Sandbox) - [Créer un compte](https://www.mongodb.com/cloud/atlas/register)
  - Voir [SETUP-MONGODB-ATLAS.md](./SETUP-MONGODB-ATLAS.md) pour la configuration

---

## ⚙️ Configuration Initiale

### 1. Cloner le Repository

```bash
# Cloner le projet
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices
```

### 2. Configurer les Variables d'Environnement

```bash
# Aller dans le dossier docker
cd docker

# Copier le fichier d'exemple
cp .env.example .env

# Éditer le fichier .env
nano .env  # ou vim .env ou code .env
```

### 3. Configurer MongoDB Atlas

**Fichier: `docker/.env`**

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
MONGODB_DATABASE_FARMER=agriservices_farmers
MONGODB_DATABASE_BILLING=agriservices_billing

# JWT Configuration
JWT_SECRET=votre_secret_jwt_tres_securise_minimum_256_bits
JWT_EXPIRATION=3600000

# PostgreSQL Configuration (Auth Service)
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=authdb
POSTGRES_USER=authuser
POSTGRES_PASSWORD=authpass123

# Service Ports (Default)
API_GATEWAY_PORT=8080
AUTH_SERVICE_PORT=8081
FARMER_SERVICE_PORT=3001
CROP_SERVICE_PORT=8082
PREDICTION_SERVICE_PORT=8000
BILLING_SERVICE_PORT=8085
```

**⚠️ Important**: 
- Remplacer `<username>`, `<password>` et `<cluster>` avec vos identifiants MongoDB Atlas
- Générer un `JWT_SECRET` fort (256 bits minimum)

---

## 🐳 Démarrage avec Docker Compose (Recommandé)

### Méthode 1: Démarrage Simple

```bash
# Se placer dans le dossier docker
cd docker

# Démarrer tous les services
docker compose up -d

# Voir les logs en temps réel
docker compose logs -f
```

### Méthode 2: Rebuild et Démarrage

```bash
# Rebuild les images et démarrer
docker compose up -d --build

# Utile après modification du code
```

### Méthode 3: Démarrage Progressif

```bash
# 1. Démarrer PostgreSQL d'abord
docker compose up -d postgres

# 2. Attendre 10 secondes
sleep 10

# 3. Démarrer Auth Service
docker compose up -d auth-service

# 4. Démarrer les autres services
docker compose up -d farmer-service api-gateway prediction-service crop-service billing-service
```

### Vérification du Statut

```bash
# Voir l'état de tous les services
docker compose ps

# Résultat attendu:
# NAME                STATUS              PORTS
# api-gateway         Up 2 minutes        0.0.0.0:8080->8080/tcp
# auth-service        Up 3 minutes        0.0.0.0:8081->8081/tcp
# farmer-service      Up 2 minutes        0.0.0.0:3001->3001/tcp
# postgres            Up 4 minutes        5432/tcp
# prediction-service  Up 2 minutes        0.0.0.0:8000->8000/tcp
# crop-service        Up 2 minutes        0.0.0.0:8082->8082/tcp
# billing-service     Up 2 minutes        0.0.0.0:8085->8085/tcp
```

---

## 🔨 Démarrage Manuel des Services

Si vous souhaitez développer sans Docker, suivez ces instructions pour chaque service.

### 1️⃣ PostgreSQL (Base de données Auth)

```bash
# Avec Docker
docker run -d \
  --name postgres-auth \
  -e POSTGRES_DB=authdb \
  -e POSTGRES_USER=authuser \
  -e POSTGRES_PASSWORD=authpass123 \
  -p 5432:5432 \
  postgres:16-alpine

# OU installer PostgreSQL localement
# https://www.postgresql.org/download/
```

### 2️⃣ Auth Service (Spring Boot - Port 8081)

```bash
cd services/auth-service

# Configuration
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/authdb
export SPRING_DATASOURCE_USERNAME=authuser
export SPRING_DATASOURCE_PASSWORD=authpass123
export JWT_SECRET=votre_secret_jwt_tres_securise_minimum_256_bits

# Option 1: Avec Maven
./mvnw spring-boot:run

# Option 2: Build puis Run
./mvnw clean package
java -jar target/auth-service-0.0.1-SNAPSHOT.jar

# Le service démarre sur http://localhost:8081
```

### 3️⃣ Farmer Service (Node.js - Port 3001)

```bash
cd services/farmer-service

# Installer les dépendances
npm install

# Configuration (créer .env)
cat > .env << EOF
PORT=3001
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
JWT_SECRET=votre_secret_jwt_tres_securise_minimum_256_bits
NODE_ENV=development
EOF

# Démarrer le service
npm start

# Ou en mode développement avec hot reload
npm run dev

# Le service démarre sur http://localhost:3001
```

### 4️⃣ API Gateway (Spring Cloud Gateway - Port 8080)

```bash
cd services/api-gateway

# Configuration
export AUTH_SERVICE_URL=http://localhost:8081
export FARMER_SERVICE_URL=http://localhost:3001
export PREDICTION_SERVICE_URL=http://localhost:8000
export CROP_SERVICE_URL=http://localhost:8082
export BILLING_SERVICE_URL=http://localhost:8085

# Option 1: Avec Maven
./mvnw spring-boot:run

# Option 2: Build puis Run
./mvnw clean package
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar

# Le service démarre sur http://localhost:8080
```

### 5️⃣ Prediction Service (Python FastAPI - Port 8000)

```bash
cd services/prediction-service

# Créer un environnement virtuel
python3 -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate  # Linux/Mac
# OU
venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Configuration (créer .env)
cat > .env << EOF
PORT=8000
JWT_SECRET=votre_secret_jwt_tres_securise_minimum_256_bits
ENVIRONMENT=development
EOF

# Démarrer le service
python main.py

# Ou avec uvicorn directement
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Le service démarre sur http://localhost:8000
# Documentation Swagger: http://localhost:8000/docs
```

### 6️⃣ Crop Service (Java SOAP - Port 8082)

```bash
cd services/crop-service

# Build
./mvnw clean package

# Run
java -jar target/crop-service-1.0.0.jar

# Le service démarre sur http://localhost:8082
# WSDL disponible sur: http://localhost:8082/crop?wsdl
```

### 7️⃣ Billing Service (.NET SOAP - Port 8085)

```bash
cd services/billing-service/BillingService

# Restaurer les dépendances
dotnet restore

# Build
dotnet build

# Run
dotnet run

# Le service démarre sur http://localhost:8085
# WSDL disponible sur: http://localhost:8085/billing?wsdl
```

---

## ✅ Vérification du Démarrage

### Tests de Health Check

```bash
# Test 1: API Gateway
curl http://localhost:8080/health
# Attendu: {"status":"ok"}

# Test 2: Auth Service
curl http://localhost:8081/auth/health
# Attendu: {"status":"UP"}

# Test 3: Farmer Service
curl http://localhost:3001/health
# Attendu: {"status":"ok"}

# Test 4: Prediction Service
curl http://localhost:8000/health
# Attendu: {"status":"ok","service":"prediction-service"}

# Test 5: Crop Service WSDL
curl http://localhost:8082/crop?wsdl
# Attendu: XML WSDL

# Test 6: Billing Service WSDL
curl http://localhost:8085/billing?wsdl
# Attendu: XML WSDL
```

### Script de Vérification Automatique

```bash
#!/bin/bash
# Fichier: check-services.sh

echo "=== Vérification des Services AgriServices ==="

services=(
  "API Gateway:8080:/health"
  "Auth Service:8081:/auth/health"
  "Farmer Service:3001:/health"
  "Prediction Service:8000:/health"
)

for service in "${services[@]}"; do
  IFS=':' read -r name port path <<< "$service"
  echo -n "Checking $name... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port$path)
  
  if [ "$response" = "200" ]; then
    echo "✅ OK"
  else
    echo "❌ FAILED (HTTP $response)"
  fi
done

echo ""
echo "SOAP Services (WSDL Check):"

soap_services=(
  "Crop Service:8082:/crop?wsdl"
  "Billing Service:8085:/billing?wsdl"
)

for service in "${soap_services[@]}"; do
  IFS=':' read -r name port path <<< "$service"
  echo -n "Checking $name WSDL... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port$path)
  
  if [ "$response" = "200" ]; then
    echo "✅ OK"
  else
    echo "❌ FAILED (HTTP $response)"
  fi
done

echo ""
echo "=== Vérification terminée ==="
```

**Utilisation:**

```bash
chmod +x check-services.sh
./check-services.sh
```

---

## 🔧 Dépannage

### Problème: Service ne démarre pas

#### PostgreSQL Connection Failed

```bash
# Vérifier que PostgreSQL est démarré
docker ps | grep postgres

# Voir les logs
docker logs postgres-auth

# Tester la connexion
psql -h localhost -U authuser -d authdb
```

#### MongoDB Connection Failed

```bash
# Vérifier l'URI MongoDB dans .env
cat docker/.env | grep MONGODB_URI

# Tester la connexion
mongosh "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/"

# Vérifier l'IP autorisée dans MongoDB Atlas
# Atlas > Network Access > Add IP Address > Add Current IP
```

#### Port Already in Use

```bash
# Trouver le processus utilisant le port (ex: 8080)
lsof -i :8080  # Linux/Mac
netstat -ano | findstr :8080  # Windows

# Tuer le processus
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows

# Ou changer le port dans docker-compose.yml
```

### Problème: Service démarre mais ne répond pas

```bash
# Voir les logs du service
docker compose logs -f <service-name>

# Exemples:
docker compose logs -f auth-service
docker compose logs -f farmer-service

# Vérifier les variables d'environnement
docker compose exec auth-service env | grep JWT_SECRET
```

### Problème: Erreur de build

```bash
# Nettoyer et rebuild
docker compose down -v
docker compose build --no-cache
docker compose up -d

# Pour un service spécifique
docker compose build --no-cache auth-service
```

### Problème: Out of Memory

```bash
# Augmenter la mémoire Docker (Docker Desktop)
# Settings > Resources > Memory > 8 GB

# Vérifier l'utilisation mémoire
docker stats
```

---

## 🛑 Arrêt des Services

### Avec Docker Compose

```bash
# Arrêter tous les services (conteneurs persistent)
docker compose stop

# Arrêter et supprimer les conteneurs
docker compose down

# Arrêter, supprimer conteneurs ET volumes (⚠️ SUPPRIME LES DONNÉES)
docker compose down -v

# Arrêter un service spécifique
docker compose stop auth-service
```

### Démarrage Manuel

```bash
# Trouver le PID du processus
ps aux | grep java  # Pour Java services
ps aux | grep node  # Pour Node.js
ps aux | grep python  # Pour Python

# Tuer le processus
kill -9 <PID>

# Ou utiliser Ctrl+C dans le terminal où le service tourne
```

---

## 📊 Monitoring et Logs

### Voir les Logs en Temps Réel

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f auth-service

# Avec filtrage
docker compose logs -f auth-service | grep ERROR
```

### Inspecter un Conteneur

```bash
# Entrer dans le conteneur
docker compose exec auth-service sh

# Voir les variables d'environnement
docker compose exec auth-service env

# Vérifier les fichiers
docker compose exec auth-service ls -la
```

---

## 🎯 Prochaines Étapes

Une fois tous les services démarrés avec succès:

1. **Tester les services** - Voir [GUIDE-TESTS.md](./GUIDE-TESTS.md)
2. **Utiliser l'API** - Voir [manuel-utilisation.md](./manuel-utilisation.md)
3. **Développer** - Voir [GUIDE-EQUIPE-DEVELOPPEMENT.md](./GUIDE-EQUIPE-DEVELOPPEMENT.md)

---

## 📞 Support

Pour toute question ou problème:

1. Vérifier la documentation dans `/documentation`
2. Consulter les logs des services
3. Ouvrir une issue sur GitHub

---

**Dernière mise à jour**: 18 Décembre 2025  
**Auteur**: MAHAMADOU AMADOU HABOU
