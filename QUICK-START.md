# 🚀 Quick Start - AgriServices MVP

Guide rapide pour démarrer et tester le projet en 10 minutes.

---

## ⚡ Démarrage Rapide

### Étape 1: Prérequis (2 minutes)

Vérifiez que vous avez installé:

```bash
docker --version          # Docker 20.10+
docker compose version    # Docker Compose 2.0+
```

Si manquant, installez [Docker Desktop](https://www.docker.com/products/docker-desktop).

### Étape 2: Cloner et Configurer (3 minutes)

```bash
# 1. Cloner le projet
git clone https://github.com/Mahamadou-dev/AgriServices.git
cd AgriServices

# 2. Configurer l'environnement
cd docker
cp .env.example .env

# 3. Éditer .env avec vos informations MongoDB Atlas
nano .env  # ou vim .env ou code .env
```

**Variables minimales à configurer:**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
JWT_SECRET=votre_secret_jwt_tres_securise_minimum_256_bits
```

📖 **Guide MongoDB Atlas**: [documentation/SETUP-MONGODB-ATLAS.md](documentation/SETUP-MONGODB-ATLAS.md)

### Étape 3: Démarrer Tous les Services (2 minutes)

```bash
# Démarrer avec Docker Compose
docker compose up -d

# Attendre ~30 secondes que tous les services démarrent

# Vérifier l'état
docker compose ps
```

**Résultat attendu:**
```
NAME                STATUS              PORTS
api-gateway         Up 30 seconds       0.0.0.0:8080->8080/tcp
auth-service        Up 30 seconds       0.0.0.0:8081->8081/tcp
farmer-service      Up 30 seconds       0.0.0.0:3001->3001/tcp
postgres            Up 35 seconds       5432/tcp
prediction-service  Up 30 seconds       0.0.0.0:8000->8000/tcp
crop-service        Up 30 seconds       0.0.0.0:8082->8082/tcp
billing-service     Up 30 seconds       0.0.0.0:8085->8085/tcp
```

### Étape 4: Tester les Services (3 minutes)

#### Test 1: Health Checks

```bash
# API Gateway
curl http://localhost:8080/health
# Attendu: {"status":"ok"}

# Auth Service
curl http://localhost:8081/auth/health
# Attendu: {"status":"UP"}

# Farmer Service
curl http://localhost:3001/health
# Attendu: {"status":"ok"}

# Prediction Service
curl http://localhost:8000/health
# Attendu: {"status":"ok","service":"prediction-service"}
```

#### Test 2: Workflow Complet (30 secondes)

```bash
# 1. Inscription
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_farmer",
    "email": "test@agri.com",
    "password": "Test123!",
    "role": "FARMER"
  }'

# 2. Connexion et obtenir le token
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_farmer",
    "password": "Test123!"
  }' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 3. Créer un agriculteur
curl -X POST http://localhost:8080/api/farmers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "test_farmer",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "test@agri.com",
    "phone": "+33612345678",
    "address": {
      "city": "Paris",
      "country": "France"
    }
  }'

# 4. Prédiction de rendement
curl -X POST http://localhost:8080/api/predict/yield \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "crop_type": "wheat",
    "area_hectares": 10.5,
    "soil_type": "loamy",
    "rainfall_mm": 600,
    "temperature_c": 25,
    "fertilizer_used": true
  }'
```

---

## 📚 Documentation Complète

Une fois les services démarrés avec succès:

### Guides Essentiels

1. **[DEMARRAGE-LOCAL.md](documentation/DEMARRAGE-LOCAL.md)**
   - Guide détaillé de démarrage
   - Démarrage manuel des services
   - Dépannage complet

2. **[GUIDE-TESTS.md](documentation/GUIDE-TESTS.md)**
   - Instructions de test détaillées
   - Exemples pour chaque service
   - Scripts automatisés

3. **[tests-api.json](tests-api.json)**
   - 50+ cas de test complets
   - Exemples REST et SOAP
   - Importable dans Postman

4. **[MVP-COMPLETE.md](MVP-COMPLETE.md)**
   - Synthèse complète du projet
   - État de chaque service
   - Statistiques et conformité

### Documentation Technique

- **[Cahier des charges](documentation/cahier-des-charges.md)** - Spécifications
- **[Architecture](documentation/architecture.md)** - Design du système
- **[Manuel d'utilisation](documentation/manuel-utilisation.md)** - Guide utilisateur
- **[Guide déploiement](documentation/guide-deploiement.md)** - Production

---

## 🎯 Services Disponibles

| Service | Port | URL | Documentation |
|---------|------|-----|---------------|
| **API Gateway** | 8080 | http://localhost:8080 | Point d'entrée unique |
| **Auth Service** | 8081 | http://localhost:8081 | [README](services/auth-service/README.md) |
| **Farmer Service** | 3001 | http://localhost:3001 | [README](services/farmer-service/README.md) |
| **Prediction Service** | 8000 | http://localhost:8000/docs | [README](services/prediction-service/README.md) |
| **Crop Service (SOAP)** | 8082 | http://localhost:8082/crop?wsdl | [README](services/crop-service/README.md) |
| **Billing Service (SOAP)** | 8085 | http://localhost:8085/billing?wsdl | [README](services/billing-service/README.md) |

---

## 🔧 Commandes Utiles

### Docker

```bash
# Voir les logs en temps réel
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f auth-service

# Redémarrer un service
docker compose restart auth-service

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker compose down -v

# Rebuild et redémarrer
docker compose up -d --build
```

### Tests

```bash
# Script de vérification rapide
cat > check-all.sh << 'EOF'
#!/bin/bash
echo "=== Vérification des Services ==="
for port in 8080 8081 3001 8000; do
  echo -n "Port $port: "
  curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/health || echo "FAIL"
  echo ""
done
EOF
chmod +x check-all.sh
./check-all.sh
```

---

## 🐛 Dépannage Rapide

### Problème: Service ne démarre pas

```bash
# Vérifier les logs
docker compose logs <service-name>

# Exemples
docker compose logs auth-service
docker compose logs farmer-service
```

### Problème: Port déjà utilisé

```bash
# Trouver et tuer le processus (exemple port 8080)
lsof -i :8080  # Linux/Mac
netstat -ano | findstr :8080  # Windows

# Tuer le processus
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

### Problème: MongoDB connection failed

```bash
# Vérifier l'URI dans .env
cat docker/.env | grep MONGODB_URI

# Tester la connexion
mongosh "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/"

# Vérifier l'IP dans MongoDB Atlas
# Atlas > Network Access > Add IP Address
```

### Problème: Services redémarrent en boucle

```bash
# Voir pourquoi
docker compose ps
docker compose logs --tail=50 <service-name>

# Solutions communes:
# 1. Vérifier les variables d'environnement
# 2. Vérifier MongoDB URI
# 3. Vérifier que PostgreSQL est démarré
docker compose ps postgres
```

---

## 📊 Vérification Finale

### Checklist de Démarrage Réussi

- [ ] Docker Compose démarre tous les services
- [ ] `docker compose ps` montre tous les services "Up"
- [ ] Health check Gateway (8080) retourne 200
- [ ] Health check Auth (8081) retourne 200
- [ ] Health check Farmer (3001) retourne 200
- [ ] Health check Prediction (8000) retourne 200
- [ ] WSDL Crop accessible (8082/crop?wsdl)
- [ ] WSDL Billing accessible (8085/billing?wsdl)
- [ ] Inscription utilisateur fonctionne
- [ ] Connexion et obtention token fonctionnent
- [ ] Création agriculteur fonctionne avec token

### Si Tous les Tests Passent ✅

**Félicitations!** Le système AgriServices MVP est opérationnel.

**Prochaines étapes:**
1. Explorer les autres endpoints dans [GUIDE-TESTS.md](documentation/GUIDE-TESTS.md)
2. Importer [tests-api.json](tests-api.json) dans Postman
3. Consulter la documentation de chaque service
4. Tester les services SOAP

---

## 💡 Ressources Rapides

### URLs Importantes

- **Swagger Prediction**: http://localhost:8000/docs
- **WSDL Crop**: http://localhost:8082/crop?wsdl
- **WSDL Billing**: http://localhost:8085/billing?wsdl

### Fichiers Importants

- **Configuration**: `docker/.env`
- **Tests**: `tests-api.json`
- **Docker**: `docker/docker-compose.yml`

### Commandes Essentielles

```bash
# Tout démarrer
cd docker && docker compose up -d

# Tout arrêter
docker compose down

# Voir l'état
docker compose ps

# Voir les logs
docker compose logs -f
```

---

## 🆘 Support

En cas de problème:

1. **Consulter la documentation**:
   - [DEMARRAGE-LOCAL.md](documentation/DEMARRAGE-LOCAL.md) - Section Dépannage
   - [GUIDE-TESTS.md](documentation/GUIDE-TESTS.md)

2. **Vérifier les logs**:
   ```bash
   docker compose logs -f <service-name>
   ```

3. **Redémarrer proprement**:
   ```bash
   docker compose down
   docker compose up -d
   ```

4. **Rebuild complet** (si nécessaire):
   ```bash
   docker compose down -v
   docker compose build --no-cache
   docker compose up -d
   ```

---

**Version**: 1.0.0  
**Dernière mise à jour**: 18 Décembre 2025  
**Auteur**: MAHAMADOU AMADOU HABOU

🎉 **Bon test du MVP AgriServices!**
