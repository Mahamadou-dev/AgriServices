# 🌐 API Gateway

Passerelle API centralisée utilisant Spring Cloud Gateway pour le système SOA agricole AgriServices.

## 📋 Description

L'API Gateway est le point d'entrée unique pour tous les services du système AgriServices. Il gère le routage des requêtes, la configuration CORS et fournit une couche d'abstraction entre les clients et les microservices.

## 🛠️ Technologies

- **Spring Boot** 3.4.0
- **Spring Cloud Gateway** 2024.0.0
- **Spring Security** (WebFlux)
- **Java** 17

## 📦 Installation

### Prérequis

- Java 17+ (JDK)
- Maven 3.8+

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
docker compose up -d
```

Le service démarre sur le port **8080** par défaut.

## 🔗 Routes configurées

### Architecture de routage

```
Client Request -> API Gateway (8080) -> Microservices
```

### Routes disponibles

| Route | Service cible | Port | Type |
|-------|--------------|------|------|
| `/auth/**` | Auth Service | 8081 | REST |
| `/api/farmers/**` | Farmer Service | 3001 | REST |
| `/api/predict/**` | Prediction Service | 8000 | REST |
| `/crop/**` | Crop Service | 8082 | SOAP |
| `/billing/**` | Billing Service | 8085 | SOAP |

### Exemples d'utilisation

#### Via API Gateway (Recommandé)

```bash
# Authentification
curl http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "pass123"}'

# Farmers
curl http://localhost:8080/api/farmers \
  -H "Authorization: Bearer <token>"

# Prédictions
curl http://localhost:8080/api/predict/yield \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"crop": "wheat", "area": 100}'
```

#### Accès direct (Non recommandé en production)

```bash
# Auth Service direct
curl http://localhost:8081/auth/health

# Farmer Service direct
curl http://localhost:3001/health
```

## 🔗 Endpoints

### Health Check

```http
GET /health
```

Vérifie l'état de l'API Gateway.

**Réponse:**
```json
{
  "status": "ok",
  "service": "api-gateway"
}
```

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `SERVER_PORT` | Port du gateway | `8080` |
| `SPRING_CLOUD_GATEWAY_ROUTES_0_URI` | URI Auth Service | `http://auth-service:8081` |
| `SPRING_CLOUD_GATEWAY_ROUTES_1_URI` | URI Farmer Service | `http://farmer-service:3001` |
| `SPRING_CLOUD_GATEWAY_ROUTES_2_URI` | URI Crop Service | `http://crop-service:8082` |
| `SPRING_CLOUD_GATEWAY_ROUTES_3_URI` | URI Prediction Service | `http://prediction-service:8000` |
| `SPRING_CLOUD_GATEWAY_ROUTES_4_URI` | URI Billing Service | `http://billing-service:8085` |

### Configuration application.yml

```yaml
server:
  port: 8080

spring:
  application: 
    name: api-gateway
  cloud:
    gateway:
      routes:
        # Auth Service Routes
        - id: auth-service
          uri: http://auth-service:8081
          predicates:
            - Path=/auth/**
        
        # Farmer Service Routes
        - id: farmer-service
          uri: http://farmer-service:3001
          predicates: 
            - Path=/api/farmers/**
        
        # Prediction Service Routes
        - id: prediction-service
          uri: http://prediction-service:8000
          predicates:
            - Path=/api/predict/**
        
        # Crop Service Routes (SOAP)
        - id: crop-service
          uri: http://crop-service:8082
          predicates:
            - Path=/crop/**
        
        # Billing Service Routes (SOAP)
        - id: billing-service
          uri: http://billing-service:8085
          predicates:
            - Path=/billing/**
      
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: false

logging:
  level:
    org.springframework.cloud.gateway: DEBUG
    reactor.netty: INFO
```

## 🔒 Sécurité

### CORS Configuration

- **Origines autorisées**: Toutes (`*`) en développement
- **Méthodes**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Tous autorisés
- **Credentials**: Désactivé

⚠️ **Important**: En production, restreindre `allowedOrigins` aux domaines autorisés uniquement.

### Désactivation CSRF

CSRF est désactivé car l'authentification se fait via JWT (stateless).

```java
http.csrf(csrf -> csrf.disable())
```

### Headers de sécurité recommandés (À implémenter)

```yaml
spring:
  cloud:
    gateway:
      default-filters:
        - AddResponseHeader=X-Frame-Options, DENY
        - AddResponseHeader=X-Content-Type-Options, nosniff
        - AddResponseHeader=X-XSS-Protection, 1; mode=block
```

## 🏗️ Architecture

```
src/main/java/com/agriservices/gateway/
├── ApiGatewayApplication.java        # Point d'entrée Spring Boot
├── config/
│   └── SecurityConfig.java           # Configuration Spring Security
└── controller/
    └── HealthController.java         # Health check endpoint

src/main/resources/
├── application.yml                   # Configuration principale
└── application.properties            # Configuration alternative
```

## 🧪 Tests

```bash
# Exécuter tous les tests
./mvnw test

# Test de build complet
./mvnw clean verify
```

### Tests fonctionnels

```bash
# 1. Vérifier que le gateway est démarré
curl http://localhost:8080/health

# 2. Tester le routage vers Auth Service
curl http://localhost:8080/auth/health

# 3. Tester le routage vers Farmer Service
curl http://localhost:8080/api/farmers/hello

# 4. Tester avec authentification complète
TOKEN=$(curl -s http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}' \
  | jq -r '.token')

curl http://localhost:8080/api/farmers \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Monitoring

### Logs Gateway

Les logs sont configurés en mode DEBUG pour Spring Cloud Gateway:

```
2025-12-17 10:30:00.123 DEBUG [api-gateway] Route matched: auth-service
2025-12-17 10:30:00.234 DEBUG [api-gateway] Mapping [Exchange: GET http://localhost:8080/auth/health]
2025-12-17 10:30:00.345  INFO [api-gateway] Proxying request to: http://auth-service:8081/auth/health
```

### Endpoints de monitoring (À activer)

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,gateway
  endpoint:
    health:
      show-details: always
```

## 🚀 Fonctionnalités avancées

### Load Balancing (Future)

Pour activer le load balancing avec Spring Cloud LoadBalancer:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: farmer-service
          uri: lb://farmer-service  # au lieu de http://
          predicates:
            - Path=/api/farmers/**
```

### Circuit Breaker (Future)

Pour ajouter un circuit breaker avec Resilience4j:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: farmer-service
          uri: http://farmer-service:3001
          predicates:
            - Path=/api/farmers/**
          filters:
            - name: CircuitBreaker
              args:
                name: farmerServiceCB
                fallbackUri: forward:/fallback/farmers
```

### Rate Limiting (Future)

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: http://auth-service:8081
          predicates:
            - Path=/auth/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
```

## 🐛 Dépannage

### Erreur "Connection refused"

```bash
# Vérifier que tous les services sont démarrés
docker compose ps

# Vérifier les logs du service cible
docker compose logs farmer-service
```

### Erreur CORS

Si vous rencontrez des erreurs CORS:

1. Vérifier la configuration `globalcors` dans `application.yml`
2. Vérifier que `allowedOrigins` inclut votre domaine
3. En développement, utiliser `"*"` pour tout autoriser

### Route non trouvée (404)

```bash
# Vérifier les routes configurées
curl http://localhost:8080/actuator/gateway/routes

# Vérifier les logs
docker compose logs api-gateway
```

### Port déjà utilisé

```bash
# Changer le port
SERVER_PORT=8081 ./mvnw spring-boot:run
```

## 🔄 Workflow de déploiement

### Développement local

```bash
# 1. Démarrer tous les services
docker compose up -d

# 2. Vérifier le health check
curl http://localhost:8080/health

# 3. Tester les routes
curl http://localhost:8080/auth/health
```

### Production

```bash
# 1. Build l'image Docker
docker build -t api-gateway:latest -f docker/Dockerfiles/api-gateway.Dockerfile services/api-gateway

# 2. Tag et push
docker tag api-gateway:latest registry.example.com/api-gateway:1.0.0
docker push registry.example.com/api-gateway:1.0.0

# 3. Deploy
kubectl apply -f k8s/api-gateway-deployment.yml
```

## 📚 Documentation supplémentaire

- [Guide de déploiement](../../documentation/guide-deploiement.md)
- [Architecture système](../../documentation/architecture.md)
- [Manuel d'utilisation](../../documentation/manuel-utilisation.md)
- [Spring Cloud Gateway Docs](https://spring.io/projects/spring-cloud-gateway)

## 🎯 Roadmap

- [ ] Authentification JWT au niveau du Gateway
- [ ] Circuit Breaker avec Resilience4j
- [ ] Rate Limiting par utilisateur
- [ ] Logging centralisé
- [ ] Métriques avec Micrometer/Prometheus
- [ ] Distributed Tracing avec Zipkin
- [ ] Service Discovery avec Eureka

## 👥 Auteur

**MAHAMADOU AMADOU HABOU**

## 📄 Licence

Projet académique — Usage pédagogique uniquement.

---

**Version**: 1.0.0  
**Dernière mise à jour**: 17 décembre 2025
