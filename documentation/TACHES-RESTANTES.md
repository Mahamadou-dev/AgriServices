# 📝 Tâches Restantes - AgriServices

**Date**: 19 Décembre 2025  
**Statut du Projet**: ✅ Tous les services compilent et fonctionnent  

Ce document liste les petites tâches à accomplir manuellement après avoir cloné le projet localement pour le tester en production.

---

## 🔐 1. Configuration et Sécurité

### 1.1. Variables d'Environnement
- [ ] **MongoDB Atlas**: Configurer vos propres credentials MongoDB Atlas
  - Créer un compte MongoDB Atlas (gratuit)
  - Créer un cluster
  - Obtenir la connection string
  - Mettre à jour `docker/.env` avec vos credentials
  - Voir `documentation/SETUP-MONGODB-ATLAS.md` pour le guide complet

- [ ] **JWT Secret**: Changer le secret JWT pour la production
  - Générer un nouveau secret sécurisé (minimum 256 bits)
  - Mettre à jour `JWT_SECRET` dans `docker/.env`
  - S'assurer que c'est le même secret pour tous les services

- [ ] **PostgreSQL**: Configurer les credentials PostgreSQL pour la production
  - Changer `POSTGRES_PASSWORD` dans `docker/.env`
  - Utiliser un mot de passe fort et sécurisé

### 1.2. Sécurité
- [ ] **Secrets**: Ne jamais committer le fichier `.env` avec les vrais credentials
  - Vérifier que `.env` est dans `.gitignore`
  - Utiliser des variables d'environnement ou un vault pour la production

- [ ] **CORS**: Configurer les origines autorisées dans l'API Gateway
  - Éditer `services/api-gateway/src/main/resources/application.yml`
  - Remplacer `*` par les domaines autorisés en production

- [ ] **Ports**: Vérifier que les ports sont disponibles sur votre machine
  - Port 8080: API Gateway
  - Port 8081: Auth Service
  - Port 3001: Farmer Service
  - Port 8082: Crop Service
  - Port 8000: Prediction Service
  - Port 8085: Billing Service
  - Port 5432: PostgreSQL
  - Port 3000: Frontend Next.js

---

## 🧪 2. Tests Locaux

### 2.1. Tests Backend
- [ ] **Démarrer tous les services** avec Docker Compose
  ```bash
  cd docker
  docker compose up -d
  ```

- [ ] **Vérifier la santé de chaque service**
  ```bash
  curl http://localhost:8080/health  # API Gateway
  curl http://localhost:8081/auth/health  # Auth Service
  curl http://localhost:3001/health  # Farmer Service
  curl http://localhost:8000/health  # Prediction Service
  curl http://localhost:8082/crop?wsdl  # Crop Service WSDL
  curl http://localhost:8085/billing?wsdl  # Billing Service WSDL
  ```

- [ ] **Tester l'authentification**
  - Créer un compte utilisateur via `/auth/register`
  - Se connecter via `/auth/login`
  - Vérifier que le token JWT est généré

- [ ] **Tester chaque service CRUD**
  - Farmers: Créer, lire, modifier, supprimer un agriculteur
  - Crops: Tester les opérations SOAP
  - Predictions: Tester les prédictions de rendement et de risques
  - Billing: Tester les factures SOAP

- [ ] **Utiliser le fichier de tests** `tests-api.json` avec un client REST (Postman, Insomnia)

### 2.2. Tests Frontend
- [ ] **Démarrer le frontend Next.js**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

- [ ] **Tester toutes les pages**
  - Page d'accueil: http://localhost:3000
  - Login: http://localhost:3000/login
  - Register: http://localhost:3000/register
  - Dashboard: http://localhost:3000/dashboard
  - Farmers: http://localhost:3000/farmers
  - Crops: http://localhost:3000/crops
  - Predictions: http://localhost:3000/predictions
  - Billing: http://localhost:3000/billing

- [ ] **Tester le workflow complet**
  1. S'inscrire avec un nouveau compte
  2. Se connecter
  3. Accéder au dashboard
  4. Créer un agriculteur
  5. Faire une prédiction de rendement
  6. Créer une facture

---

## 🐛 3. Vérifications et Résolution de Problèmes

### 3.1. Logs et Monitoring
- [ ] **Vérifier les logs de chaque service**
  ```bash
  docker compose logs -f auth-service
  docker compose logs -f farmer-service
  docker compose logs -f crop-service
  docker compose logs -f prediction-service
  docker compose logs -f billing-service
  docker compose logs -f api-gateway
  ```

- [ ] **Vérifier les logs du frontend**
  - Console du navigateur (F12) pour les erreurs JavaScript
  - Terminal où `npm run dev` s'exécute

### 3.2. Problèmes Courants
- [ ] **Si un service ne démarre pas**: Vérifier les logs Docker
- [ ] **Si MongoDB ne se connecte pas**: Vérifier les credentials et la whitelist IP sur MongoDB Atlas
- [ ] **Si PostgreSQL ne démarre pas**: Vérifier que le port 5432 est disponible
- [ ] **Si le frontend ne se connecte pas au backend**: Vérifier `NEXT_PUBLIC_API_GATEWAY_URL` dans `frontend/.env.local`

### 3.3. Dépendances et Vulnerabilités
- [ ] **Farmer Service**: Résoudre la vulnérabilité npm détectée
  ```bash
  cd services/farmer-service
  npm audit
  npm audit fix
  ```

- [ ] **Mettre à jour les dépendances** si nécessaire (mais tester après !)
  ```bash
  # Maven (Java)
  ./mvnw versions:display-dependency-updates
  
  # npm (Node.js)
  npm outdated
  
  # pip (Python)
  pip list --outdated
  
  # dotnet (.NET)
  dotnet list package --outdated
  ```

---

## 📦 4. Build et Packaging

### 4.1. Build Local (sans Docker)
- [ ] **Auth Service**
  ```bash
  cd services/auth-service
  ./mvnw clean package -DskipTests
  ```

- [ ] **API Gateway**
  ```bash
  cd services/api-gateway
  ./mvnw clean package -DskipTests
  ```

- [ ] **Crop Service**
  ```bash
  cd services/crop-service
  ./mvnw clean package -DskipTests
  ```

- [ ] **Farmer Service**
  ```bash
  cd services/farmer-service
  npm install
  npm run build  # Si un script build existe
  ```

- [ ] **Prediction Service**
  ```bash
  cd services/prediction-service
  pip install -r requirements.txt
  ```

- [ ] **Billing Service**
  ```bash
  cd services/billing-service/BillingService
  dotnet build
  ```

- [ ] **Frontend**
  ```bash
  cd frontend
  npm run build
  ```

### 4.2. Images Docker
- [ ] **Vérifier que toutes les images Docker se construisent**
  ```bash
  cd docker
  docker compose build
  ```

- [ ] **Tester les services individuellement**
  ```bash
  docker compose up -d auth-service
  docker compose up -d farmer-service
  # etc.
  ```

---

## 🚀 5. Déploiement Production (Optionnel)

### 5.1. Préparation
- [ ] **Lire** `documentation/guide-deploiement.md` pour le guide complet
- [ ] **Lire** `documentation/production-readiness.md` pour la checklist de production

### 5.2. Environnement Production
- [ ] **Configurer un serveur de production** (AWS, Azure, GCP, VPS, etc.)
- [ ] **Installer Docker et Docker Compose** sur le serveur
- [ ] **Configurer un reverse proxy** (Nginx, Traefik) pour HTTPS
- [ ] **Obtenir un certificat SSL** (Let's Encrypt)
- [ ] **Configurer un nom de domaine**
- [ ] **Mettre en place des sauvegardes** pour les bases de données

### 5.3. Monitoring et Maintenance
- [ ] **Configurer des alertes** pour les services down
- [ ] **Mettre en place un monitoring** (Prometheus, Grafana)
- [ ] **Planifier des sauvegardes régulières** (MongoDB, PostgreSQL)
- [ ] **Documenter les procédures de rollback**

---

## 📚 6. Documentation

### 6.1. Documentation à Lire
- [ ] **Démarrage**: `documentation/DEMARRAGE-LOCAL.md`
- [ ] **Tests**: `documentation/GUIDE-TESTS.md`
- [ ] **Architecture**: `documentation/architecture.md`
- [ ] **Guide Frontend**: `documentation/guide-frontend.md`
- [ ] **MongoDB Setup**: `documentation/SETUP-MONGODB-ATLAS.md`

### 6.2. Documentation à Compléter (si besoin)
- [ ] Ajouter des captures d'écran du frontend en action
- [ ] Documenter des cas d'usage supplémentaires
- [ ] Ajouter des exemples d'intégration avec d'autres systèmes
- [ ] Documenter les APIs SOAP avec plus de détails

---

## ✅ 7. Checklist Finale

Avant de considérer le projet comme "prêt pour la démo":

- [ ] ✅ Tous les services démarrent sans erreur
- [ ] ✅ Tous les services répondent aux health checks
- [ ] ✅ L'authentification fonctionne (register, login, validate)
- [ ] ✅ Les opérations CRUD sur farmers fonctionnent
- [ ] ✅ Les services SOAP (Crop, Billing) sont accessibles
- [ ] ✅ Les prédictions retournent des résultats
- [ ] ✅ Le frontend se connecte au backend
- [ ] ✅ Le frontend affiche les données correctement
- [ ] ✅ Aucune erreur dans les logs
- [ ] ✅ Aucune erreur dans la console du navigateur
- [ ] ✅ Les credentials de production sont configurés
- [ ] ✅ La documentation est à jour

---

## 💡 Notes Importantes

### Performance
- Les temps de démarrage peuvent varier selon la machine (30-60 secondes normalement)
- MongoDB Atlas (cluster gratuit) peut avoir une latence plus élevée
- Le frontend en mode dev (`npm run dev`) est plus lent qu'en production

### Limitations du MVP
- Pas d'interface d'administration complète
- Pas de gestion avancée des rôles et permissions
- Pas de système de notifications
- Pas de reporting avancé
- Pas de tests automatisés (unitaires, intégration, E2E)

### Améliorations Futures Possibles
- Ajouter des tests automatisés (JUnit, Jest, Pytest)
- Implémenter un système de caching (Redis)
- Ajouter un système de queue (RabbitMQ, Kafka)
- Implémenter des webhooks pour les événements
- Ajouter une interface d'administration
- Améliorer la gestion des erreurs
- Ajouter des métriques et monitoring avancés
- Implémenter le versioning des APIs

---

## 🆘 Support

Si vous rencontrez des problèmes lors des tests locaux:

1. **Consulter la documentation** dans `/documentation`
2. **Vérifier les logs** avec `docker compose logs -f [service-name]`
3. **Vérifier les issues GitHub** du projet
4. **Contacter l'équipe de développement**

---

**Dernière mise à jour**: 19 Décembre 2025  
**Version**: 1.0  
**Auteur**: MAHAMADOU AMADOU HABOU
