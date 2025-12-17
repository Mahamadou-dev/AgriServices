# 🚀 Guide de Déploiement - AgriServices Platform

Ce document décrit les étapes complètes pour déployer la plateforme AgriServices en production.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration de l'Environnement](#configuration-de-lenvironnement)
3. [Déploiement avec Docker Compose](#déploiement-avec-docker-compose)
4. [Déploiement des Services Individuels](#déploiement-des-services-individuels)
5. [Configuration de Production](#configuration-de-production)
6. [Monitoring et Logs](#monitoring-et-logs)
7. [Sauvegardes](#sauvegardes)
8. [Dépannage](#dépannage)

---

## Prérequis

### Logiciels Requis

- **Docker** 24.0+ et **Docker Compose** 2.20+
- **Java JDK** 17 (pour builds locaux)
- **Node.js** 20+ et **npm** (pour farmer-service)
- **Python** 3.12+ (pour prediction-service)
- **.NET SDK** 9+ (pour billing-service)
- **Git** pour le versioning

### Ressources Matérielles Minimales

**Pour développement/test :**
- CPU: 4 cœurs
- RAM: 8 GB
- Stockage: 20 GB

**Pour production :**
- CPU: 8 cœurs ou plus
- RAM: 16 GB minimum (recommandé: 32 GB)
- Stockage: 100 GB SSD
- Réseau: Bande passante stable

---

## Configuration de l'Environnement

### 1. Cloner le Répertoire

```bash
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices
```

### 2. Créer les Fichiers d'Environnement

Chaque service nécessite un fichier `.env` :

#### Auth Service
```bash
cd services/auth-service/src/main/resources
cat > application.properties << EOF
spring.application.name=auth-service
server.port=8081
jwt.secret=VOTRE_SECRET_JWT_256_BITS
spring.datasource.url=jdbc:postgresql://postgres:5432/auth_db
spring.datasource.username=authuser
spring.datasource.password=CHANGE_ME_IN_PRODUCTION
spring.jpa.hibernate.ddl-auto=update
EOF
```

#### Farmer Service
```bash
cd services/farmer-service
cat > .env << EOF
PORT=3001
MONGODB_URI=mongodb://mongodb:27017/farmers_db
JWT_SECRET=VOTRE_SECRET_JWT_256_BITS
NODE_ENV=production
EOF
```

#### Prediction Service
```bash
cd services/prediction-service
cat > .env << EOF
PORT=8000
JWT_SECRET=VOTRE_SECRET_JWT_256_BITS
ENVIRONMENT=production
EOF
```

### 3. Générer un Secret JWT Sécurisé

```bash
# Générer un secret Base64 de 256 bits
openssl rand -base64 64

# Utiliser ce secret dans TOUS les services (JWT_SECRET)
```

⚠️ **IMPORTANT** : Le même secret JWT doit être utilisé par tous les services pour la validation des tokens.

---

## Déploiement avec Docker Compose

### 1. Construction des Images

```bash
cd docker
docker-compose build
```

### 2. Démarrage des Services

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Vérifier l'état
docker-compose ps
```

### 3. Vérification des Services

Attendez que tous les services soient en état "UP" :

```bash
# Health checks
curl http://localhost:8080/health          # API Gateway
curl http://localhost:8081/health          # Auth Service (via gateway)
curl http://localhost:3001/health          # Farmer Service
curl http://localhost:8000/health          # Prediction Service
```

### 4. Arrêt et Nettoyage

```bash
# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

---

## Déploiement des Services Individuels

### Auth Service (Spring Boot)

```bash
cd services/auth-service

# Build
./mvnw clean package -DskipTests

# Run
java -jar target/auth-service-0.0.1-SNAPSHOT.jar
```

### Farmer Service (Node.js)

```bash
cd services/farmer-service

# Installation
npm install

# Production
NODE_ENV=production npm start
```

### Prediction Service (Python)

```bash
cd services/prediction-service

# Créer un virtual environment
python3 -m venv venv
source venv/bin/activate

# Installation
pip install -r requirements.txt

# Production
python main.py
```

### API Gateway (Spring Cloud)

```bash
cd services/api-gateway

# Build
./mvnw clean package -DskipTests

# Run
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
```

---

## Configuration de Production

### 1. Sécurité

#### SSL/TLS
```nginx
# Nginx reverse proxy
server {
    listen 443 ssl http2;
    server_name agriservices.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Firewall
```bash
# Autoriser uniquement le port du gateway
sudo ufw allow 8080/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Variables d'Environnement Sécurisées

⚠️ **NE JAMAIS** committer les secrets dans Git !

Utilisez des gestionnaires de secrets :
- **Vault** (HashiCorp)
- **AWS Secrets Manager**
- **Azure Key Vault**
- Variables d'environnement système

### 3. Bases de Données

#### PostgreSQL (Auth Service)
```bash
# Backup
docker exec agri-postgres-auth pg_dump -U authuser auth_db > backup_auth.sql

# Restore
docker exec -i agri-postgres-auth psql -U authuser auth_db < backup_auth.sql
```

#### MongoDB (Farmer Service)
```bash
# Backup
docker exec agri-mongodb mongodump --db farmers_db --out /backup

# Restore
docker exec agri-mongodb mongorestore --db farmers_db /backup/farmers_db
```

### 4. Logs Centralisés

**Option 1 : ELK Stack (Elasticsearch, Logstash, Kibana)**

```yaml
# docker-compose.yml
services:
  elasticsearch:
    image: elasticsearch:8.11.0
    ...
  
  logstash:
    image: logstash:8.11.0
    ...
  
  kibana:
    image: kibana:8.11.0
    ...
```

**Option 2 : Fichiers logs avec rotation**

```bash
# Configurer logrotate
cat > /etc/logrotate.d/agriservices << EOF
/var/log/agriservices/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
EOF
```

---

## Monitoring et Logs

### 1. Health Checks

Script de monitoring :

```bash
#!/bin/bash
# health-check.sh

services=(
    "http://localhost:8080/health:API Gateway"
    "http://localhost:3001/health:Farmer Service"
    "http://localhost:8000/health:Prediction Service"
)

for service in "${services[@]}"; do
    IFS=':' read -r url name <<< "$service"
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" == "200" ]; then
        echo "✅ $name: UP"
    else
        echo "❌ $name: DOWN (HTTP $status)"
    fi
done
```

### 2. Prometheus + Grafana

Ajouter au docker-compose.yml :

```yaml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3000:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
```

---

## Sauvegardes

### Script de Sauvegarde Automatique

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/agriservices"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# PostgreSQL
docker exec agri-postgres-auth pg_dump -U authuser auth_db > \
    "$BACKUP_DIR/auth_db_$DATE.sql"

# MongoDB
docker exec agri-mongodb mongodump --db farmers_db \
    --archive="$BACKUP_DIR/farmers_db_$DATE.archive"

# Nettoyer les anciennes sauvegardes (> 30 jours)
find "$BACKUP_DIR" -type f -mtime +30 -delete

echo "✅ Backup completed: $DATE"
```

Ajouter au cron :
```bash
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
```

---

## Dépannage

### Problèmes Courants

#### 1. Service ne démarre pas

```bash
# Vérifier les logs
docker-compose logs service-name

# Vérifier la configuration
docker-compose config

# Rebuild l'image
docker-compose build --no-cache service-name
```

#### 2. Connexion DB échouée

```bash
# Vérifier que la DB est accessible
docker exec -it agri-postgres-auth psql -U authuser -d auth_db

# Vérifier les variables d'environnement
docker-compose exec service-name env | grep DATABASE
```

#### 3. Erreur JWT

- Vérifier que JWT_SECRET est identique dans tous les services
- Vérifier le format du token (Bearer <token>)
- Vérifier l'expiration du token

#### 4. Mémoire insuffisante

```bash
# Augmenter la mémoire Docker
# Docker Desktop > Settings > Resources > Memory

# Limiter la mémoire par service
services:
  auth-service:
    deploy:
      resources:
        limits:
          memory: 1G
```

---

## Checklist de Déploiement

- [ ] Secrets JWT générés et configurés
- [ ] Certificats SSL/TLS obtenus
- [ ] Bases de données configurées et sécurisées
- [ ] Pare-feu configuré
- [ ] Sauvegardes automatiques configurées
- [ ] Monitoring et alertes activés
- [ ] Tests de charge effectués
- [ ] Documentation accessible
- [ ] Procédures de rollback définies
- [ ] Équipe formée sur les procédures

---

## Support

Pour toute question ou problème :
- Consulter la documentation dans `/documentation`
- Créer une issue sur GitHub
- Contacter l'équipe de développement

---

**Dernière mise à jour** : 17/12/2025  
**Auteur** : MAHAMADOU AMADOU HABOU
