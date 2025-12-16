# 👥 Guide de l'Équipe de Développement

**Projet:** AgriServices - Architecture SOA  
**Date:** 16 décembre 2025  
**Organisation:** Développement coordonné par service

---

## 🎯 Organisation de l'Équipe

### Attribution des Services

| Développeur | Service | Technologie | Port | Complexité |
|-------------|---------|-------------|------|------------|
| **Dev 1** | auth-service | Java Spring Boot | 8081 | ⭐⭐⭐ Moyenne |
| **Dev 2** | farmer-service | Node.js Express | 3001 | ⭐⭐ Facile |
| **Dev 3** | crop-service | Java JAX-WS SOAP | 8082 | ⭐⭐⭐⭐ Difficile |
| **Dev 4** | prediction-service | Python FastAPI | 8000 | ⭐⭐ Facile |
| **Dev 5** | billing-service | .NET Core SOAP | 8085 | ⭐⭐⭐ Moyenne |
| **Dev 6** | api-gateway | Spring Cloud Gateway | 8080 | ⭐⭐⭐⭐⭐ Complexe |

---

## 📋 Prérequis pour Tous

### Outils Requis

```bash
✅ Git installé (version 2.30+)
✅ Compte GitHub avec accès au dépôt
✅ Docker & Docker Compose installés
✅ Un éditeur de code (VS Code recommandé)
✅ Compte MongoDB Atlas configuré (voir SETUP-MONGODB-ATLAS.md)
```

### IDEs Recommandés par Service

- **Dev 1 (auth-service)** : IntelliJ IDEA Ultimate
- **Dev 2 (farmer-service)** : VS Code avec extensions Node.js
- **Dev 3 (crop-service)** : IntelliJ IDEA Ultimate
- **Dev 4 (prediction-service)** : PyCharm Professional ou VS Code
- **Dev 5 (billing-service)** : Visual Studio 2022 ou Rider
- **Dev 6 (api-gateway)** : IntelliJ IDEA Ultimate

---

## 🚀 Workflow de Développement

### Règles d'Or

1. **UN développeur = UN service = UNE branche**
2. **TOUJOURS** travailler sur sa branche personnelle
3. **JAMAIS** modifier directement `main` ou les branches des autres
4. **TESTER** localement avant de push
5. **COMMUNIQUER** avec l'équipe sur le canal Discord/Slack

---

## 📝 Instructions par Développeur

---

## 👨‍💻 DEV 1 - Auth Service (Spring Boot)

### 🎯 Votre Mission

Développer le service d'authentification avec JWT et PostgreSQL.

### 🔧 Configuration Initiale

#### 1. Cloner le Dépôt

```bash
# Cloner le projet
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices

# Vérifier la branche actuelle
git branch
```

#### 2. Créer Votre Branche

```bash
# Créer et basculer sur votre branche
git checkout -b dev1/auth-service

# Vérifier que vous êtes sur la bonne branche
git branch
# * dev1/auth-service
```

#### 3. Configuration du Service

```bash
cd services/auth-service

# Ouvrir avec IntelliJ IDEA
idea .
# OU simplement ouvrir le dossier services/auth-service dans IntelliJ
```

#### 4. Configuration Base de Données

Créer `src/main/resources/application.yml` :

```yaml
spring:
  application:
    name: auth-service
  datasource:
    url: jdbc:postgresql://localhost:5432/auth_db
    username: authuser
    password: authpassword
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

server:
  port: 8081

jwt:
  secret: ${JWT_SECRET:dGhpcy1pcy1hLWxvbmctYW5kLXNlY3VyZS1zZWNyZXQta2V5}
  expiration: 86400000
```

### 📝 Tâches à Réaliser

#### Phase 1 : Modèle de Données
- [ ] Créer l'entité `User` avec champs : id, username, email, password, role
- [ ] Créer le repository `UserRepository`
- [ ] Tester la connexion à PostgreSQL

#### Phase 2 : Services
- [ ] Implémenter `AuthService` (register, login)
- [ ] Implémenter `JwtService` (generateToken, validateToken)
- [ ] Hasher les mots de passe avec BCrypt

#### Phase 3 : Controllers
- [ ] Créer `AuthController` avec endpoints :
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/validate`
- [ ] Créer `HealthController` : `GET /health`

#### Phase 4 : Tests
- [ ] Tester avec Postman/Insomnia
- [ ] Écrire tests unitaires (optionnel)

### 🧪 Tester Localement

```bash
# Démarrer PostgreSQL avec Docker
docker run -d \
  --name postgres-auth \
  -e POSTGRES_DB=auth_db \
  -e POSTGRES_USER=authuser \
  -e POSTGRES_PASSWORD=authpassword \
  -p 5432:5432 \
  postgres:16-alpine

# Lancer le service
./mvnw spring-boot:run

# Tester
curl http://localhost:8081/health
```

### 📤 Pousser Votre Travail

```bash
# Ajouter vos modifications
git add .

# Committer avec un message clair
git commit -m "feat(auth): Add user registration and JWT authentication"

# Pousser sur VOTRE branche
git push origin dev1/auth-service
```

### 🔄 Créer une Pull Request

1. Aller sur GitHub : https://github.com/Mahamadou-dev/AgriServices
2. Cliquer sur **"Compare & pull request"**
3. **Base** : `main` ← **Compare** : `dev1/auth-service`
4. Titre : `[Auth-Service] Implémentation authentification JWT`
5. Description détaillée de ce que vous avez fait
6. Assigner un reviewer (chef d'équipe)
7. Créer la PR

---

## 👨‍💻 DEV 2 - Farmer Service (Node.js)

### 🎯 Votre Mission

Développer le service de gestion des agriculteurs avec MongoDB Atlas.

### 🔧 Configuration Initiale

#### 1. Cloner et Brancher

```bash
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices
git checkout -b dev2/farmer-service
```

#### 2. Configuration MongoDB Atlas

Suivre **SETUP-MONGODB-ATLAS.md** pour créer votre base `farmerdb`.

#### 3. Configuration du Service

```bash
cd services/farmer-service
npm install

# Créer .env
cat > .env << EOF
PORT=3001
MONGO_URI=mongodb+srv://agriservices_user:PASSWORD@cluster.mongodb.net/farmerdb
JWT_SECRET=your-secret-key
NODE_ENV=development
EOF
```

### 📝 Tâches à Réaliser

#### Phase 1 : Modèle Mongoose
- [ ] Créer le schéma `Farmer` dans `models/Farmer.js`
- [ ] Champs : userId, firstName, lastName, phone, address, farms
- [ ] Ajouter timestamps automatiques

#### Phase 2 : Routes & Controllers
- [ ] Créer routes dans `routes/farmers.js` :
  - `POST /api/farmers` - Créer
  - `GET /api/farmers/:id` - Lire un
  - `GET /api/farmers` - Lire tous
  - `PUT /api/farmers/:id` - Mettre à jour
  - `DELETE /api/farmers/:id` - Supprimer
- [ ] Implémenter la logique dans `controllers/farmerController.js`

#### Phase 3 : Middleware
- [ ] Middleware de validation JWT (vérifier token)
- [ ] Middleware de validation des données (express-validator)
- [ ] Gestion des erreurs

#### Phase 4 : Tests
- [ ] Tester avec Postman
- [ ] Vérifier les données dans MongoDB Atlas

### 🧪 Tester Localement

```bash
# Lancer le service
npm start

# Tester
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/farmers \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Amadou","lastName":"Diallo","phone":"+221771234567"}'
```

### 📤 Pousser Votre Travail

```bash
git add .
git commit -m "feat(farmer): Add CRUD operations for farmers"
git push origin dev2/farmer-service
```

Puis créer la PR sur GitHub.

---

## 👨‍💻 DEV 3 - Crop Service (JAX-WS SOAP)

### 🎯 Votre Mission

Développer le service SOAP de gestion des cultures.

### 🔧 Configuration Initiale

```bash
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices
git checkout -b dev3/crop-service
cd services/crop-service
```

### 📝 Tâches à Réaliser

#### Phase 1 : Interfaces SOAP
- [ ] Créer l'interface `CropService` (JAX-WS)
- [ ] Définir les méthodes :
  - `getCropInfo(String cropName)`
  - `calculateYield(String cropName, double area)`
  - `listAllCrops()`

#### Phase 2 : Implémentation
- [ ] Implémenter `CropServiceImpl`
- [ ] Créer les DTOs/POJOs pour Crop
- [ ] Logique de calcul de rendement

#### Phase 3 : Publisher
- [ ] Créer `CropServicePublisher` pour exposer le WSDL
- [ ] Port : 8082
- [ ] URL : `http://localhost:8082/CropService`

#### Phase 4 : Tests
- [ ] Tester avec SoapUI
- [ ] Générer et vérifier le WSDL

### 🧪 Tester Localement

```bash
# Compiler et lancer
mvn clean package
java -jar target/crop-service-1.0.0.jar

# Vérifier le WSDL
curl http://localhost:8082/CropService?wsdl
```

### 📤 Pousser Votre Travail

```bash
git add .
git commit -m "feat(crop): Implement SOAP service for crop management"
git push origin dev3/crop-service
```

---

## 👨‍💻 DEV 4 - Prediction Service (Python FastAPI)

### 🎯 Votre Mission

Développer le service de prédictions agricoles.

### 🔧 Configuration Initiale

```bash
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices
git checkout -b dev4/prediction-service
cd services/prediction-service

# Créer environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# OU
venv\Scripts\activate  # Windows

# Installer dépendances
pip install -r requirements.txt
```

### 📝 Tâches à Réaliser

#### Phase 1 : Modèles Pydantic
- [ ] Créer `models/PredictionRequest.py`
- [ ] Créer `models/PredictionResponse.py`

#### Phase 2 : Routes API
- [ ] Implémenter `POST /api/predict/yield`
- [ ] Implémenter `POST /api/predict/risk`
- [ ] Implémenter `GET /health`

#### Phase 3 : Logique Métier
- [ ] Algorithme simple de prédiction de rendement
- [ ] Calcul de score de risque (sécheresse, maladies)

#### Phase 4 : Tests
- [ ] Tester avec curl/Postman
- [ ] Vérifier les réponses JSON

### 🧪 Tester Localement

```bash
# Lancer le service
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Tester
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/predict/yield \
  -H "Content-Type: application/json" \
  -d '{"cropType":"mil","area":50,"rainfall":800}'
```

### 📤 Pousser Votre Travail

```bash
git add .
git commit -m "feat(prediction): Add yield and risk prediction endpoints"
git push origin dev4/prediction-service
```

---

## 👨‍💻 DEV 5 - Billing Service (.NET SOAP)

### 🎯 Votre Mission

Développer le service SOAP de facturation avec MongoDB Atlas.

### 🔧 Configuration Initiale

```bash
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices
git checkout -b dev5/billing-service
cd services/billing-service/BillingService
```

Ouvrir avec Visual Studio ou Rider.

### 📝 Tâches à Réaliser

#### Phase 1 : Configuration MongoDB
- [ ] Installer package `MongoDB.Driver`
- [ ] Configurer connection dans `appsettings.json`
- [ ] Créer `MongoDbContext`

#### Phase 2 : Modèles
- [ ] Créer `Models/Invoice.cs`
- [ ] Créer `Models/InvoiceItem.cs`

#### Phase 3 : Services SOAP
- [ ] Interface `IBillingService`
- [ ] Implémentation `BillingService.cs`
- [ ] Méthodes :
  - `CreateInvoice`
  - `GetInvoice`
  - `ListInvoices`
  - `MarkAsPaid`

#### Phase 4 : Tests
- [ ] Tester avec SoapUI
- [ ] Vérifier données dans MongoDB Atlas

### 🧪 Tester Localement

```bash
# Lancer le service
dotnet run

# Tester
curl http://localhost:8085/health
```

### 📤 Pousser Votre Travail

```bash
git add .
git commit -m "feat(billing): Implement SOAP billing service with MongoDB"
git push origin dev5/billing-service
```

---

## 👨‍💻 DEV 6 - API Gateway (Spring Cloud)

### 🎯 Votre Mission

Développer la passerelle API pour router vers tous les services.

### 🔧 Configuration Initiale

```bash
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices
git checkout -b dev6/api-gateway
cd services/api-gateway
```

### 📝 Tâches à Réaliser

#### Phase 1 : Configuration Routes
- [ ] Configurer `application.yml` avec routes vers :
  - `/auth/**` → auth-service:8081
  - `/api/farmers/**` → farmer-service:3001
  - `/crop/**` → crop-service:8082
  - `/api/predict/**` → prediction-service:8000
  - `/billing/**` → billing-service:8085

#### Phase 2 : Filtres
- [ ] Créer filtre de validation JWT
- [ ] Logger les requêtes
- [ ] Gérer CORS

#### Phase 3 : Tests
- [ ] Tester le routage vers chaque service
- [ ] Vérifier la validation JWT

### 🧪 Tester Localement

```bash
# S'assurer que TOUS les autres services tournent d'abord!

# Lancer le gateway
./mvnw spring-boot:run

# Tester
curl http://localhost:8080/health
curl http://localhost:8080/auth/health
curl http://localhost:8080/api/farmers/hello
```

### 📤 Pousser Votre Travail

```bash
git add .
git commit -m "feat(gateway): Configure routing and JWT validation"
git push origin dev6/api-gateway
```

---

## 🔄 Workflow de Merge

### Processus de Review

1. **Développeur** crée une PR depuis sa branche
2. **Chef d'équipe** review la PR :
   - Code quality
   - Tests passent
   - Documentation à jour
3. **Chef d'équipe** approuve ou demande des changements
4. **Développeur** corrige si nécessaire
5. **Chef d'équipe** merge dans `main`

### Après le Merge

Chaque développeur doit mettre à jour sa branche :

```bash
# Se mettre sur main
git checkout main

# Récupérer les dernières modifications
git pull origin main

# Retourner sur sa branche
git checkout dev1/auth-service

# Intégrer les changements de main
git rebase main

# Si conflits, les résoudre puis :
git rebase --continue

# Forcer le push (car rebase réécrit l'historique)
git push origin dev1/auth-service --force-with-lease
```

---

## ⚠️ Règles Importantes

### ❌ À NE JAMAIS FAIRE

1. **Modifier la branche `main` directement**
2. **Travailler sur la branche d'un collègue**
3. **Committer des fichiers `.env` ou secrets**
4. **Pusher du code qui ne compile pas**
5. **Ignorer les conflits de merge**

### ✅ À TOUJOURS FAIRE

1. **Tester localement avant de push**
2. **Écrire des messages de commit clairs**
3. **Communiquer avec l'équipe**
4. **Documenter votre code**
5. **Demander de l'aide si bloqué**

---

## 📞 Communication

### Canaux

- **Discord/Slack** : Discussion quotidienne
- **GitHub Issues** : Bugs et features
- **Pull Requests** : Code reviews
- **Réunions** : Daily standup (15min/jour)

### Template Message Daily

```
📅 Date : 16/12/2025
👤 Dev : DEV 1 (Auth-Service)

✅ Hier :
- Implémenté User entity
- Créé UserRepository

🎯 Aujourd'hui :
- Implémenter AuthService
- Tester registration endpoint

🚧 Blocages :
- Besoin aide configuration PostgreSQL
```

---

## 🧪 Tests d'Intégration

### Phase Finale

Une fois TOUS les services développés :

```bash
# Démarrer tous les services avec Docker
cd docker
docker compose build
docker compose up -d

# Vérifier que tout tourne
docker compose ps

# Tester le flux complet
# 1. S'enregistrer
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","email":"test@mail.com"}'

# 2. Se connecter
TOKEN=$(curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}' \
  | jq -r '.token')

# 3. Créer un farmer
curl -X POST http://localhost:8080/api/farmers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jean","lastName":"Dupont"}'

# 4. Obtenir prédiction
curl -X POST http://localhost:8080/api/predict/yield \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cropType":"mil","area":50}'
```

---

## 📅 Planning Suggéré

### Semaine 1 : Setup & Développement Initial
- Jour 1-2 : Setup environnements, clonage, création branches
- Jour 3-5 : Développement Phase 1 (modèles, bases)

### Semaine 2 : Développement Core
- Jour 1-3 : Développement Phase 2 & 3 (services, endpoints)
- Jour 4-5 : Tests locaux individuels

### Semaine 3 : Intégration
- Jour 1-2 : Pull Requests et code reviews
- Jour 3-4 : Tests d'intégration
- Jour 5 : Corrections et ajustements

### Semaine 4 : Finalisation
- Jour 1-3 : Documentation complète
- Jour 4-5 : Préparation démo et présentation

---

## 🆘 Aide et Support

### Problèmes Fréquents

**"Git conflict lors du push"**
```bash
git pull origin dev1/auth-service --rebase
# Résoudre conflits dans les fichiers
git add .
git rebase --continue
git push
```

**"Port déjà utilisé"**
```bash
# Trouver le processus
lsof -i :8081  # Linux/Mac
netstat -ano | findstr :8081  # Windows

# Tuer le processus
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

**"MongoDB connection failed"**
- Vérifier Network Access dans MongoDB Atlas
- Vérifier la connection string dans `.env`
- Vérifier que le password est correct (pas de caractères spéciaux non encodés)

---

## ✅ Checklist Développeur

Avant de créer votre PR :

- [ ] Mon code compile sans erreur
- [ ] J'ai testé localement tous mes endpoints
- [ ] J'ai ajouté/modifié la documentation si nécessaire
- [ ] Pas de fichiers `.env` ou secrets dans le commit
- [ ] Messages de commit sont clairs
- [ ] Code est commenté aux endroits complexes
- [ ] J'ai testé avec Docker si possible

---

**Bon développement à tous ! 🚀**

**Questions ?** → Canal #dev-questions sur Discord/Slack
