# 📋 Conception du Système AgriServices

## Table des Matières
- [Architecture Générale](#architecture-générale)
- [Services](#services)
- [Technologies](#technologies)
- [Base de Données](#base-de-données)
- [Communication](#communication)
- [Sécurité](#sécurité)
- [Gestion des Rôles (RBAC)](#-gestion-des-rôles-rbac)
- [Endpoints](#endpoints)

---

## Architecture Générale

Le système AgriServices suit une **architecture microservices** avec les composants suivants :

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                               │
│                    Next.js (TypeScript)                         │
│                    Port: 3000                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY                               │
│                    Spring Cloud Gateway                         │
│                    Port: 8080                                   │
└───────┬──────────────┬──────────────┬──────────────┬───────────┘
        │              │              │              │
        │ HTTP         │ HTTP         │ SOAP         │ HTTP
        ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ AUTH SERVICE │ │FARMER SERVICE│ │ CROP SERVICE │ │PREDICT SERVICE│
│ Spring Boot  │ │  Node.js     │ │  Python      │ │  Flask       │
│ Port: 8081   │ │  Port: 8082  │ │  Port: 8083  │ │  Port: 8084  │
│              │ │              │ │              │ │              │
│  PostgreSQL  │ │  PostgreSQL  │ │  PostgreSQL  │ │  PostgreSQL  │
│  Port: 5432  │ │  Port: 5433  │ │  Port: 5434  │ │  Port: 5435  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

---

## Services

### 1. **Auth Service** (Spring Boot - Java)
- **Port**: 8081
- **Base de données**: PostgreSQL (port 5432)
- **Responsabilités**:
  - Authentification des utilisateurs
  - Génération et validation des tokens JWT
  - Gestion des comptes utilisateurs
  - Gestion des rôles (RBAC)

### 2. **Farmer Service** (Node.js - Express)
- **Port**: 8082
- **Base de données**: PostgreSQL (port 5433)
- **Responsabilités**:
  - Gestion des fermes
  - Gestion des factures
  - CRUD des agriculteurs

### 3. **Crop Service** (Python - Flask/SOAP)
- **Port**: 8083
- **Base de données**: PostgreSQL (port 5434)
- **Responsabilités**:
  - Gestion des cultures via SOAP
  - Suivi des cultures par ferme

### 4. **Predict Service** (Python - Flask)
- **Port**: 8084
- **Base de données**: PostgreSQL (port 5435)
- **Responsabilités**:
  - Prédictions agricoles
  - Analyse des données

### 5. **API Gateway** (Spring Cloud Gateway)
- **Port**: 8080
- **Responsabilités**:
  - Routage des requêtes
  - Validation JWT
  - CORS

### 6. **Frontend** (Next.js - TypeScript)
- **Port**: 3000
- **Responsabilités**:
  - Interface utilisateur
  - Gestion des états
  - Affichage conditionnel basé sur les rôles

---

## Technologies

| Service | Framework | Langage | Base de Données |
|---------|-----------|---------|-----------------|
| Auth Service | Spring Boot | Java | PostgreSQL |
| Farmer Service | Express | Node.js/TypeScript | PostgreSQL |
| Crop Service | Flask + Spyne | Python | PostgreSQL |
| Predict Service | Flask | Python | PostgreSQL |
| API Gateway | Spring Cloud Gateway | Java | - |
| Frontend | Next.js | TypeScript | - |

---

## Base de Données

Chaque service a sa **propre base de données PostgreSQL** (principe de séparation des microservices).

### Auth Service DB (port 5432)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Farmer Service DB (port 5433)
```sql
CREATE TABLE farmers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    size DECIMAL(10, 2),
    farmer_id INTEGER REFERENCES farmers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    amount DECIMAL(10, 2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Crop Service DB (port 5434)
```sql
CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    planting_date DATE,
    harvest_date DATE,
    farm_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Predict Service DB (port 5435)
```sql
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    crop_type VARCHAR(255),
    region VARCHAR(255),
    predicted_yield DECIMAL(10, 2),
    confidence_score DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Communication

### REST (HTTP/JSON)
- **Auth Service** ↔ API Gateway
- **Farmer Service** ↔ API Gateway
- **Predict Service** ↔ API Gateway

### SOAP (XML)
- **Crop Service** ↔ API Gateway

### Flux de Communication
```
Frontend → API Gateway → [Auth/Farmer/Crop/Predict] Service → PostgreSQL
```

---

## Sécurité

### JWT (JSON Web Token)
- Généré par **Auth Service**
- Validé par **API Gateway**
- Inclut le rôle de l'utilisateur
- Durée de vie: 1 heure

### Flux d'Authentification
```
1. User → Frontend : Saisit login/password
2. Frontend → Auth Service : POST /auth/login
3. Auth Service → PostgreSQL : Vérifie credentials
4. Auth Service → Frontend : Retourne JWT token
5. Frontend → API Gateway : Requête avec Authorization: Bearer {token}
6. API Gateway : Valide JWT
7. API Gateway → Service : Transmet requête
8. Service → API Gateway → Frontend : Retourne réponse
```

---

## 👥 Gestion des Rôles (RBAC)

### Vue d'Ensemble

Le système AgriServices implémente un modèle **RBAC (Role-Based Access Control)** avec 4 rôles distincts gérés par le **Auth Service**. Tous les utilisateurs (Farmers, Experts, Admins, Coopératives) sont stockés dans la même table PostgreSQL avec leur rôle respectif.

### Rôles Disponibles

| Rôle | Description | Utilisateurs Typiques | Objectif Principal |
|------|-------------|----------------------|-------------------|
| **FARMER** | Agriculteur | Exploitants agricoles | Gérer ses propres fermes, cultures et factures |
| **EXPERT** | Expert agricole | Agronomes, Conseillers | Consulter données et créer des prédictions |
| **COOPERATIVE** | Coopérative | Gestionnaires de groupe | Gérer un groupe d'agriculteurs |
| **ADMIN** | Administrateur | Équipe technique | Gérer le système et tous les utilisateurs |

### Matrice de Permissions

| Capacité | FARMER | EXPERT | COOPERATIVE | ADMIN |
|----------|--------|--------|-------------|-------|
| **S'authentifier** | ✅ | ✅ | ✅ | ✅ |
| **Gérer son propre profil** | ✅ | ✅ | ✅ | ✅ |
| **Voir ses propres données** | ✅ | ✅ | ✅ | ✅ |
| **Voir toutes les données agriculteurs** | ❌ | ✅ | ✅ (groupe) | ✅ |
| **Créer des prédictions** | ❌ | ✅ | ✅ | ✅ |
| **Gérer les cultures (SOAP)** | ✅ | ✅ | ✅ | ✅ |
| **Créer des factures** | ✅ | ❌ | ✅ | ✅ |
| **Modifier d'autres utilisateurs** | ❌ | ❌ | ❌ | ✅ |
| **Gérer la configuration système** | ❌ | ❌ | ❌ | ✅ |
| **Accéder aux logs système** | ❌ | ❌ | ❌ | ✅ |

### Flux de Validation des Rôles

```
┌─────────────────────────────────────────────────────────────┐
│                    1. INSCRIPTION                           │
│  User → Frontend : Choisit son rôle                         │
│  Frontend → Auth-Service : POST /auth/register              │
│  {                                                           │
│    "username": "john_doe",                                   │
│    "email": "john@example.com",                             │
│    "password": "SecurePass123!",                            │
│    "role": "EXPERT"  ← Rôle sélectionné                     │
│  }                                                           │
│  Auth-Service → PostgreSQL : INSERT INTO users(...)         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    2. CONNEXION                             │
│  User → Auth-Service : POST /auth/login                     │
│  Auth-Service → PostgreSQL : SELECT * FROM users WHERE...   │
│  Auth-Service : Génère JWT avec rôle encodé                 │
│  JWT Payload = {                                            │
│    "sub": "john_doe",                                       │
│    "username": "john_doe",                                  │
│    "role": "EXPERT",  ← Rôle dans le token                  │
│    "iat": 1702800000,                                       │
│    "exp": 1702803600                                        │
│  }                                                           │
│  Auth-Service → User : Retourne JWT token                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                3. UTILISATION DU TOKEN                      │
│  User → API Gateway : GET /api/farmers                      │
│  Header: Authorization: Bearer eyJhbGc...                   │
│                                                              │
│  API Gateway : Décode JWT et extrait le rôle               │
│  API Gateway → Farmer-Service : Transmet requête + token   │
│                                                              │
│  Farmer-Service : Vérifie JWT et vérifie le rôle           │
│  if (decoded.role === 'EXPERT' || decoded.role === 'ADMIN') │
│    → Autorise l'accès à toutes les données                 │
│  else if (decoded.role === 'FARMER')                        │
│    → Autorise uniquement ses propres données               │
│  else                                                        │
│    → Refuse l'accès (403 Forbidden)                        │
└─────────────────────────────────────────────────────────────┘
```

### Structure JWT avec Rôle

**Token JWT décodé:**
```json
{
  "sub": "user123",
  "username": "farmer_john",
  "role": "FARMER",
  "iat": 1702800000,
  "exp": 1702803600
}
```

**Token JWT encodé:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJ1c2VyMTIzIiwidXNlcm5hbWUiOiJmYXJtZXJfam9obiIsInJvbGUiOiJGQVJNRVIiLCJpYXQiOjE3MDI4MDAwMDAsImV4cCI6MTcwMjgwMzYwMH0.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Intégration Frontend

Le frontend Next.js gère les rôles de manière complète:

**1. Page d'inscription (`/register`):**
```tsx
<select name="role">
  <option value="FARMER">Agriculteur</option>
  <option value="EXPERT">Expert</option>
  <option value="COOPERATIVE">Coopérative</option>
  <option value="ADMIN">Administrateur</option>
</select>
```

**2. Stockage après login:**
```typescript
// frontend/lib/api.ts
const response = await authAPI.login(credentials);
localStorage.setItem('authToken', response.token);
localStorage.setItem('user', JSON.stringify({
  username: response.username,
  role: response.role  // ← Stocké localement
}));
```

**3. Affichage conditionnel:**
```tsx
const user = getUser();

{user?.role === 'ADMIN' && (
  <Link href="/admin">Panneau Admin</Link>
)}

{user?.role === 'EXPERT' && (
  <Link href="/predictions">Créer Prédictions</Link>
)}

{user?.role === 'FARMER' && (
  <Link href="/my-farms">Mes Fermes</Link>
)}
```

### Implémentation Backend

**Auth Service (Spring Boot):**
```java
// Model User
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String role; // FARMER, EXPERT, COOPERATIVE, ADMIN
}

// Service
public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByUsername(request.getUsername());
    // ... vérification password ...
    
    String token = jwtService.generateToken(
        user.getUsername(), 
        user.getRole()  // ← Rôle encodé dans JWT
    );
    
    return new AuthResponse(token, expirationTime, user.getUsername(), user.getRole());
}
```

**Farmer Service (Node.js):**
```javascript
// Middleware d'authentification
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded; // { username, role }
    next();
};

// Middleware de vérification de rôle
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
};

// Route protégée
router.get('/api/farmers', 
    authMiddleware, 
    requireRole('EXPERT', 'ADMIN', 'COOPERATIVE'),
    getAllFarmers
);
```

### Contrôle du Nombre d'Administrateurs

**⚠️ Problématique:**  
Dans la version MVP actuelle, tout utilisateur peut s'inscrire comme ADMIN, ce qui n'est pas souhaitable en production.

**✅ Solutions Recommandées:**

#### Solution 1: Validation Manuelle (Simple)
```java
public User register(RegisterRequest request) {
    if ("ADMIN".equals(request.getRole())) {
        throw new RuntimeException("Les inscriptions ADMIN sont désactivées. Contactez un administrateur.");
    }
    // ... reste du code
}
```

#### Solution 2: Code d'Invitation (Recommandé)
```java
public User register(RegisterRequest request) {
    if ("ADMIN".equals(request.getRole())) {
        // Vérifier le code d'invitation
        if (!isValidAdminInviteCode(request.getAdminCode())) {
            throw new RuntimeException("Code d'invitation admin invalide");
        }
        
        // Limiter le nombre d'admins
        long adminCount = userRepository.countByRole("ADMIN");
        if (adminCount >= MAX_ADMINS) { // MAX_ADMINS = 5
            throw new RuntimeException("Nombre maximum d'administrateurs atteint");
        }
    }
    // ... reste du code
}
```

**Frontend associé:**
```tsx
{formData.role === 'ADMIN' && (
  <div>
    <label>Code d'invitation Admin</label>
    <input 
      type="text" 
      name="adminCode"
      placeholder="Code à 6 chiffres"
      required
    />
  </div>
)}
```

#### Solution 3: Workflow d'Approbation (Production)
```
1. User s'inscrit avec rôle ADMIN
   → Crée un enregistrement avec status = 'PENDING'
   
2. Admin existant reçoit une notification
   → Email: "Nouvelle demande d'accès admin"
   
3. Admin approuve ou rejette
   → Si approuvé: status = 'APPROVED', rôle activé
   → Si rejeté: compte supprimé
   
4. Candidat reçoit email de confirmation
```

### Justification Architecturale

**Pourquoi 4 rôles distincts?**

1. **Séparation des Responsabilités**  
   Chaque type d'utilisateur a des besoins et permissions différents

2. **Scalabilité**  
   Le système peut avoir des milliers de FARMERS, des centaines d'EXPERTS, sans impact sur les performances

3. **Sécurité**  
   Un EXPERT compromis ne peut pas modifier la configuration système

4. **Traçabilité**  
   Les logs peuvent identifier précisément qui a fait quelle action

5. **Extensibilité**  
   Facile d'ajouter de nouveaux rôles (ex: SUPPLIER, TRANSPORTER)

**Pourquoi Auth Service centralise les rôles?**

✅ **Single Source of Truth** - Un seul endroit gère l'authentification  
✅ **Cohérence** - Tous les services utilisent la même définition de rôle  
✅ **Performance** - Le rôle est encodé dans JWT, pas besoin de requêtes supplémentaires  
✅ **Sécurité** - Token signé cryptographiquement, non modifiable

### Recommandations de Production

1. **Limiter les admins** à 3-5 maximum avec code d'invitation
2. **Auditer les actions** des ADMIN dans des logs séparés
3. **Implémenter 2FA** (authentification à 2 facteurs) pour ADMIN
4. **Ajouter permissions granulaires** (ex: EXPERT_READ_ONLY vs EXPERT_FULL)
5. **Session timeout** plus court pour ADMIN (15 min vs 1h)
6. **Notification email** à chaque connexion ADMIN
7. **Changelog** des modifications de rôles (qui a promu qui)

---

## Endpoints

### Auth Service (8081)
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/validate` - Validation JWT

### Farmer Service (8082)
- `GET /api/farmers` - Liste des agriculteurs
- `POST /api/farmers` - Créer un agriculteur
- `GET /api/farmers/{id}` - Détails d'un agriculteur
- `PUT /api/farmers/{id}` - Modifier un agriculteur
- `DELETE /api/farmers/{id}` - Supprimer un agriculteur

### Crop Service (8083)
- `POST /soap` - Endpoint SOAP pour gérer les cultures

### Predict Service (8084)
- `POST /api/predictions` - Créer une prédiction
- `GET /api/predictions` - Liste des prédictions

---

## Déploiement

### Développement
```bash
docker-compose up -d
```

### Production
- Utiliser Kubernetes pour orchestrer les microservices
- Mettre en place un Load Balancer devant l'API Gateway
- Utiliser des secrets pour les credentials de base de données

---

## Contact
Pour toute question, contactez l'équipe de développement AgriServices.
