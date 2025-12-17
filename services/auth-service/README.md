# 🔐 Auth Service

Service d'authentification REST Spring Boot pour le système SOA agricole AgriServices.

## 📋 Description

Le Auth Service est responsable de l'authentification centralisée et de la gestion des utilisateurs. Il fournit des endpoints pour l'enregistrement, la connexion et la validation de tokens JWT.

## 🛠️ Technologies

- **Spring Boot** 3.2.0
- **Spring Security** avec BCrypt
- **Spring Data JPA**
- **PostgreSQL** 16
- **JWT (JJWT)** 0.12.5
- **Java** 17

## 📦 Installation

### Prérequis

- Java 17+ (JDK)
- Maven 3.8+
- PostgreSQL 16+ (ou utiliser Docker)

### Compilation

```bash
# Installer les dépendances et compiler
./mvnw clean install

# Compiler seulement
./mvnw clean compile

# Créer le JAR
./mvnw clean package
```

## 🚀 Démarrage

### Mode développement local

```bash
# Démarrer avec Maven
./mvnw spring-boot:run
```

### Avec Docker

```bash
# Depuis la racine du projet
cd docker
docker compose up auth-service postgres -d
```

Le service démarre sur le port **8081** par défaut.

## 🔗 Endpoints API

### Health Check

```http
GET /auth/health
```

Vérifie l'état du service.

**Réponse:**
```json
{
  "status": "ok",
  "service": "auth-service"
}
```

### Inscription

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "FARMER"
}
```

**Réponse (201 Created):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "FARMER",
  "createdAt": "2025-12-17T10:30:00"
}
```

### Connexion

```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePassword123!"
}
```

**Réponse (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600000,
  "username": "john_doe",
  "role": "FARMER"
}
```

### Validation de Token

```http
GET /auth/validate
Authorization: Bearer <token>
```

**Réponse (200 OK):**
```json
{
  "valid": true
}
```

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `SERVER_PORT` | Port du service | `8081` |
| `SPRING_DATASOURCE_URL` | URL PostgreSQL | `jdbc:postgresql://postgres:5432/auth_db` |
| `SPRING_DATASOURCE_USERNAME` | Utilisateur PostgreSQL | `authuser` |
| `SPRING_DATASOURCE_PASSWORD` | Mot de passe PostgreSQL | `authpassword` |
| `JWT_SECRET` | Clé secrète JWT (Base64) | (valeur par défaut configurée) |
| `JWT_EXPIRATION` | Durée de validité du token (ms) | `3600000` (1 heure) |

### Configuration application.properties

```properties
spring.application.name=auth-service
server.port=8081

# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://postgres:5432/auth_db
spring.datasource.username=authuser
spring.datasource.password=authpassword
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=${JWT_SECRET:default-secret-key-base64}
jwt.expiration=3600000
```

## 🔒 Sécurité

### Gestion des mots de passe

- Les mots de passe sont hashés avec **BCrypt**
- Pas de stockage en clair
- Validation forte des mots de passe recommandée

### JWT

- Algorithme: **HS256** (HMAC-SHA256)
- Durée de vie: **1 heure** par défaut
- Clé secrète: **256+ bits** (Base64)
- Claims inclus: `username`, `role`, `iat`, `exp`

### Rôles disponibles

- `FARMER` - Agriculteur (défaut)
- `ADMIN` - Administrateur
- `EXPERT` - Expert agricole

## 🏗️ Architecture

```
src/main/java/com/gremahtech/authservice/
├── AuthServiceApplication.java       # Point d'entrée Spring Boot
├── controller/
│   └── AuthController.java           # Endpoints REST
├── service/
│   ├── AuthService.java              # Logique métier
│   └── JwtService.java               # Gestion JWT
├── model/
│   └── User.java                     # Entité JPA
├── repository/
│   └── UserRepository.java           # Repository Spring Data
├── dto/
│   ├── RegisterRequest.java          # DTO Inscription
│   ├── LoginRequest.java             # DTO Connexion
│   └── AuthResponse.java             # DTO Réponse
└── config/
    └── SecurityConfig.java           # Configuration Spring Security
```

## 🧪 Tests

```bash
# Exécuter tous les tests
./mvnw test

# Avec rapport de couverture
./mvnw test jacoco:report
```

### Tests avec curl

```bash
# Health check
curl http://localhost:8081/auth/health

# Register
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "role": "FARMER"
  }'

# Login
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'

# Validate token (remplacer <TOKEN> par le token reçu)
curl http://localhost:8081/auth/validate \
  -H "Authorization: Bearer <TOKEN>"
```

## 📊 Base de données

### Schéma PostgreSQL

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
```

## 🐛 Dépannage

### Erreur de connexion PostgreSQL

```bash
# Vérifier que PostgreSQL est démarré
docker compose ps postgres

# Vérifier les logs
docker compose logs postgres
```

### Erreur JWT "Invalid token"

- Vérifier que `JWT_SECRET` est identique dans tous les services
- Vérifier que le token n'est pas expiré
- Vérifier le format: `Bearer <token>`

### Port déjà utilisé

```bash
# Changer le port dans application.properties
server.port=8082

# Ou via variable d'environnement
SERVER_PORT=8082 ./mvnw spring-boot:run
```

## 📝 Logs

Les logs sont affichés dans la console avec le format Spring Boot standard:

```
2025-12-17 10:30:00.123  INFO 12345 --- [main] c.g.a.AuthServiceApplication : Starting AuthServiceApplication
2025-12-17 10:30:01.234  INFO 12345 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8081 (http)
2025-12-17 10:30:01.345  INFO 12345 --- [main] c.g.a.AuthServiceApplication : Auth-Service démarré avec succès.
```

## 🔄 Intégration

### Utilisation avec l'API Gateway

L'Auth Service est automatiquement routé via l'API Gateway:

```
API Gateway (8080) -> /auth/** -> Auth Service (8081)
```

### Utilisation par les autres services

Les autres services peuvent valider les tokens via:

1. Appel direct à `/auth/validate`
2. Validation locale avec la même clé JWT

## 📚 Documentation supplémentaire

- [Guide de déploiement](../../documentation/guide-deploiement.md)
- [Spécifications techniques](../../documentation/specs-techniques.md)
- [Manuel d'utilisation](../../documentation/manuel-utilisation.md)

## 👥 Auteur

**MAHAMADOU AMADOU HABOU**

## 📄 Licence

Projet académique — Usage pédagogique uniquement.

---

**Version**: 1.0.0  
**Dernière mise à jour**: 17 décembre 2025
