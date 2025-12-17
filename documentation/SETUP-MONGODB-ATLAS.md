# 🗄️ Configuration MongoDB Atlas

**Pour:** AgriServices - Services Farmer & Billing  
**Date:** 16 décembre 2025

---

## 🎯 Objectif

Configurer **MongoDB Atlas** (cloud gratuit) pour les services **farmer-service** et **billing-service**.

---

## 📋 Prérequis

- Un compte Google, GitHub ou email
- Connexion Internet
- 10 minutes

---

## 🚀 Étape 1 : Créer un Compte MongoDB Atlas

### 1.1 S'inscrire

1. Aller sur : https://www.mongodb.com/cloud/atlas/register
2. Choisir une méthode d'inscription :
   - Google Account
   - GitHub Account
   - Email & Password
3. Cliquer sur **"Sign Up"**
4. Vérifier votre email si nécessaire

### 1.2 Première Connexion

1. Connectez-vous sur : https://cloud.mongodb.com/
2. Vous serez accueilli par l'assistant de configuration

---

## 🏗️ Étape 2 : Créer un Cluster Gratuit

### 2.1 Création du Cluster

1. Cliquer sur **"Build a Database"** ou **"Create"**
2. Choisir **"FREE"** (M0 Sandbox - 512 MB)
3. Configuration :
   - **Provider** : AWS (recommandé) ou Google Cloud
   - **Region** : Choisir la plus proche (ex: Frankfurt, Paris, ou Londres pour l'Europe)
   - **Cluster Name** : `AgriServicesCluster`
4. Cliquer sur **"Create Cluster"**
5. ⏱️ Attendre 1-3 minutes (création du cluster)

---

## 🔐 Étape 3 : Configurer la Sécurité

### 3.1 Créer un Utilisateur de Base de Données

1. Dans la popup "Security Quickstart" ou aller dans **"Database Access"**
2. Cliquer sur **"Add New Database User"**
3. Configurer :
   - **Authentication Method** : Password
   - **Username** : `agriservices_user`
   - **Password** : Générer un mot de passe fort (noter le précieusement!)
   - **Database User Privileges** : `Read and write to any database`
4. Cliquer sur **"Add User"**

💡 **IMPORTANT** : Notez le mot de passe immédiatement ! Exemple :
```
Username: agriservices_user
Password: Ag@ri2025$ecure!Pass
```

### 3.2 Autoriser les Connexions (Network Access)

1. Aller dans **"Network Access"** (menu latéral)
2. Cliquer sur **"Add IP Address"**
3. Pour le développement, choisir :
   - **"ALLOW ACCESS FROM ANYWHERE"** : `0.0.0.0/0`
   - Cliquer sur **"Confirm"**

⚠️ **Note de Sécurité** : Pour la production, restreindre aux IPs spécifiques de vos serveurs.

---

## 📊 Étape 4 : Créer les Bases de Données

### 4.1 Accéder au Cluster

1. Retourner dans **"Database"** (menu latéral)
2. Cliquer sur **"Browse Collections"** sur votre cluster
3. Cliquer sur **"Add My Own Data"**

### 4.2 Créer la Base `farmerdb`

1. **Database Name** : `farmerdb`
2. **Collection Name** : `farmers`
3. Cliquer sur **"Create"**

### 4.3 Créer la Base `billingdb`

1. Cliquer à nouveau sur **"Create Database"** (symbole +)
2. **Database Name** : `billingdb`
3. **Collection Name** : `invoices`
4. Cliquer sur **"Create"**

---

## 🔗 Étape 5 : Obtenir la Connection String

### 5.1 Récupérer l'URI de Connexion

1. Retourner dans **"Database"**
2. Cliquer sur **"Connect"** sur votre cluster
3. Choisir **"Connect your application"**
4. Configuration :
   - **Driver** : Node.js (pour farmer-service) ou C#/.NET (pour billing-service)
   - **Version** : Latest
5. Copier la **Connection String** :

```
mongodb+srv://agriservices_user:<password>@agriservicescluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 5.2 Préparer les URIs pour Chaque Service

#### Pour Farmer-Service (Node.js)
```
mongodb+srv://agriservices_user:Ag@ri2025$ecure!Pass@agriservicescluster.xxxxx.mongodb.net/farmerdb?retryWrites=true&w=majority
```

#### Pour Billing-Service (.NET)
```
mongodb+srv://agriservices_user:Ag@ri2025$ecure!Pass@agriservicescluster.xxxxx.mongodb.net/billingdb?retryWrites=true&w=majority
```

⚠️ **Remplacer** :
- `<password>` par votre vrai mot de passe
- `xxxxx` par votre cluster ID (donné par Atlas)
- Ajouter le nom de la base (`/farmerdb` ou `/billingdb`) après `.net`

---

## 🔧 Étape 6 : Configurer les Services

### 6.1 Farmer-Service

Créer/modifier le fichier `.env` dans `services/farmer-service/` :

```bash
# services/farmer-service/.env

PORT=3001
MONGO_URI=mongodb+srv://agriservices_user:Ag@ri2025$ecure!Pass@agriservicescluster.xxxxx.mongodb.net/farmerdb?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 6.2 Billing-Service

Créer/modifier le fichier `appsettings.json` dans `services/billing-service/BillingService/` :

```json
{
  "ConnectionStrings": {
    "MongoDb": "mongodb+srv://agriservices_user:Ag@ri2025$ecure!Pass@agriservicescluster.xxxxx.mongodb.net/billingdb?retryWrites=true&w=majority"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## ✅ Étape 7 : Tester la Connexion

### 7.1 Test Farmer-Service

```bash
cd services/farmer-service
npm install
node index.js
```

Vous devriez voir :
```
✅ Connected to MongoDB
🚀 Farmer Service running on port 3001
```

### 7.2 Test avec MongoDB Compass (Optionnel)

1. Télécharger MongoDB Compass : https://www.mongodb.com/products/compass
2. Installer et ouvrir Compass
3. Coller votre Connection String
4. Cliquer sur **"Connect"**
5. Naviguer dans vos bases `farmerdb` et `billingdb`

---

## 📝 Étape 8 : Peupler avec des Données de Test

### 8.1 Créer des Données Farmers

Dans MongoDB Atlas (Browse Collections > farmerdb > farmers) :

Cliquer sur **"Insert Document"** et ajouter :

```json
{
  "userId": "auth-user-123",
  "firstName": "Amadou",
  "lastName": "Diallo",
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
  ],
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

### 8.2 Créer des Données Invoices

Dans MongoDB Atlas (Browse Collections > billingdb > invoices) :

```json
{
  "invoiceNumber": "INV-2025-001",
  "farmerId": "ObjectId-du-farmer-ci-dessus",
  "items": [
    {
      "name": "Engrais NPK",
      "quantity": 10,
      "unit": "sacs",
      "unitPrice": 15000,
      "total": 150000
    }
  ],
  "totalAmount": 150000,
  "currency": "XOF",
  "status": "pending",
  "createdAt": new Date(),
  "paidAt": null,
  "notes": "Livraison prévue"
}
```

---

## 🔒 Sécurité - Bonnes Pratiques

### ⚠️ NE JAMAIS :
- ❌ Committer les fichiers `.env` dans Git
- ❌ Partager vos mots de passe MongoDB dans des messages publics
- ❌ Utiliser `0.0.0.0/0` en production

### ✅ TOUJOURS :
- ✅ Utiliser des variables d'environnement
- ✅ Changer les mots de passe par défaut
- ✅ Restreindre les accès réseau en production
- ✅ Utiliser des mots de passe forts (20+ caractères)
- ✅ Activer l'authentification 2FA sur MongoDB Atlas

---

## 🛠️ Mise à Jour du Docker Compose

Ajouter MongoDB Atlas dans `docker/docker-compose.yml` :

```yaml
  farmer-service:
    build:
      context: ../services/farmer-service
      dockerfile: ../../docker/Dockerfiles/farmer-service.Dockerfile
    environment:
      - PORT=3001
      - MONGO_URI=${FARMER_MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
    networks:
      - agri-network

  billing-service:
    build:
      context: ../services/billing-service
      dockerfile: ../../docker/Dockerfiles/billing-service.Dockerfile
    environment:
      - ASPNETCORE_URLS=http://+:8085
      - ConnectionStrings__MongoDb=${BILLING_MONGO_URI}
    networks:
      - agri-network
```

Créer un fichier `.env` dans `docker/` :

```bash
# docker/.env

FARMER_MONGO_URI=mongodb+srv://agriservices_user:PASSWORD@agriservicescluster.xxxxx.mongodb.net/farmerdb?retryWrites=true&w=majority
BILLING_MONGO_URI=mongodb+srv://agriservices_user:PASSWORD@agriservicescluster.xxxxx.mongodb.net/billingdb?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
```

---

## 📊 Monitoring et Maintenance

### Vérifier les Métriques

1. Dans MongoDB Atlas, aller dans **"Metrics"**
2. Surveiller :
   - Connexions actives
   - Opérations par seconde
   - Utilisation du stockage
   - Temps de réponse des requêtes

### Alertes (Optionnel)

1. Aller dans **"Alerts"**
2. Configurer des alertes email pour :
   - Utilisation > 80% de l'espace
   - Nombre de connexions élevé
   - Temps de réponse lent

---

## 🆘 Dépannage

### Problème : "Authentication failed"
**Solution** : Vérifier username/password dans la connection string

### Problème : "Connection timeout"
**Solution** : Vérifier Network Access (IP Whitelist)

### Problème : "Database not found"
**Solution** : Vérifier le nom de la base dans l'URI (`/farmerdb` ou `/billingdb`)

### Problème : ".env file not loaded"
**Solution** :
```bash
npm install dotenv
# Dans index.js :
require('dotenv').config();
```

---

## 📚 Ressources

- Documentation MongoDB Atlas : https://docs.atlas.mongodb.com/
- MongoDB Node.js Driver : https://docs.mongodb.com/drivers/node/
- MongoDB C# Driver : https://docs.mongodb.com/drivers/csharp/
- Mongoose (ODM Node.js) : https://mongoosejs.com/

---

## ✅ Checklist Finale

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster gratuit créé
- [ ] Utilisateur database créé (noter le password!)
- [ ] Network Access configuré (0.0.0.0/0 pour dev)
- [ ] Base `farmerdb` créée avec collection `farmers`
- [ ] Base `billingdb` créée avec collection `invoices`
- [ ] Connection String récupérée et testée
- [ ] Fichiers `.env` configurés (et ajoutés au .gitignore)
- [ ] Services testés et connectés avec succès
- [ ] Données de test insérées

---

 
**Cluster Name:** AgriServicesCluster
---

**📅 Dernière mise à jour** : `05/12/2025`  
**👤 Auteur** : `MAHAMADOU AMADOU HABOU`  
**🏷️ Version** : `1.1`

--- 
