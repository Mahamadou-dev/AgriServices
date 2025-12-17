# 🌾 Agri-Platform - Spécifications Techniques

## 🎯 Contexte du Projet
**Agri-Platform** est une solution SaaS pour la gestion agricole moderne, offrant :
- Gestion des agriculteurs et de leurs exploitations
- Suivi des cultures et prédictions de rendement
- Facturation et paiements
- Authentification centralisée
- API Gateway unifiée

## 🏗️ Architecture Technique

### Stack Technologique
| Service | Langage | Framework | Port | Base de données |
|---------|---------|-----------|------|-----------------|
| **API Gateway** | Java 25 | Spring Cloud Gateway | 8080 | - |
| **Auth Service** | Java 25 | Spring Boot 3.3 | 8081 | (Optionnel) PostgreSQL |
| **Farmer Service** | Node.js 22 | Express 5.2 | 3001 | MongoDB |
| **Prediction Service** | Python 3.12 | FastAPI | 8000 | (ML Models) |
| **Billing Service** | .NET 9 | CoreWCF | 8085 | SQL Server/PostgreSQL |
| **Crop Service** | Java 25 | JAX-WS (SOAP) | 8082 | (Optionnel) PostgreSQL |

### 🔐 Authentification & Sécurité
- **JWT (JSON Web Tokens)** pour l'authentification
- **Clé secrète** : 256 bits minimum
- **Token Bearer** dans les headers Authorization
- **Validation centralisée** au niveau du Gateway
- **Rôles** : FARMER, ADMIN (extensibles)

### 📡 Communication Inter-Services
1. **REST APIs** (services modernes)
2. **SOAP Web Services** (services legacy)
3. **HTTP avec Circuit Breaker**
4. **Service Discovery** simplifié via Docker Compose

### 🐳 Infrastructure
- **Monorepo** avec structure claire
- **Docker** avec images officielles
- **Docker Compose** pour l'orchestration
- **Multi-stage builds** pour les services Java/.NET
- **Utilisateurs non-root** dans les conteneurs

### 📊 Logging & Monitoring
- **Logs structurés** par service
- **Endpoints /health** pour chaque service
- **Circuit Breaker** avec Resilience4j/Spring Cloud
- **Fallbacks** pour la résilience

## 🔧 Configuration d'Environnement

### Variables d'Environnement Communes
```bash
# JWT Configuration
JWT_SECRET=mySuperSecretKeyThatIsAtLeast256BitsLongForSecurity123456
JWT_EXPIRATION=3600000

# Service Ports
AUTH_SERVICE_PORT=8081
FARMER_SERVICE_PORT=3001
PREDICTION_SERVICE_PORT=8000
BILLING_SERVICE_PORT=8085
CROP_SERVICE_PORT=8082
GATEWAY_PORT=8080

# Database Connections (exemples)
MONGODB_URI=mongodb://mongodb:27017/agri-platform
POSTGRES_URL=jdbc:postgresql://postgres:5432/agri_auth


---

**📅 Dernière mise à jour** : `05/12/2025`  
**👤 Auteur** : `MAHAMADOU AMADOU HABOU`  
**🏷️ Version** : `1.1`

---
