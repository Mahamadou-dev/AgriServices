# 👨‍🌾 Farmer Service

Service REST Node.js/Express pour la gestion des agriculteurs dans le système SOA agricole.

## 📋 Description

Le Farmer Service est responsable de la gestion complète des informations des agriculteurs : création, lecture, mise à jour et suppression (CRUD). Il s'intègre avec le système d'authentification via JWT.

## 🛠️ Technologies

- **Node.js** 20+
- **Express** 5.2
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **CORS** pour les requêtes cross-origin

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos configurations
```

## 🚀 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le service démarre sur le port **3001** par défaut.

## 🔗 Endpoints API

### Health Check
```
GET /health
```
Vérifie l'état du service.

### Farmers (Agriculteurs)

#### Lister tous les agriculteurs
```
GET /farmers?status=active&location=Niamey&page=1&limit=10
```

#### Obtenir un agriculteur par ID
```
GET /farmers/:id
```

#### Créer un nouvel agriculteur (🔒 Protégé)
```
POST /farmers
Authorization: Bearer <token>

Body:
{
  "firstName": "Ahmed",
  "lastName": "Diallo",
  "email": "ahmed.diallo@example.com",
  "phone": "+22790123456",
  "farmName": "Ferme Ahmed",
  "location": "Niamey",
  "farmSize": 5.5,
  "farmSizeUnit": "hectares",
  "crops": ["mil", "sorgho"],
  "status": "active"
}
```

#### Mettre à jour un agriculteur (🔒 Protégé)
```
PUT /farmers/:id
Authorization: Bearer <token>

Body: { champs à modifier }
```

#### Supprimer un agriculteur (🔒 Protégé)
```
DELETE /farmers/:id
Authorization: Bearer <token>
```

## 🔐 Authentification

Les routes protégées nécessitent un token JWT valide dans le header Authorization :

```
Authorization: Bearer <votre_token_jwt>
```

Le token doit être obtenu via le **Auth Service** (port 8081).

## 📊 Modèle de Données

```javascript
{
  firstName: String (requis, min 2 caractères),
  lastName: String (requis, min 2 caractères),
  email: String (requis, unique, format email),
  phone: String (requis),
  farmName: String (requis),
  location: String (requis),
  farmSize: Number (requis, positif),
  farmSizeUnit: String (hectares/acres/square meters),
  crops: Array<String>,
  status: String (active/inactive/suspended),
  registrationDate: Date,
  timestamps: {createdAt, updatedAt}
}
```

## 🐳 Docker

### Build
```bash
docker build -f ../../docker/Dockerfiles/farmer-service.Dockerfile -t farmer-service .
```

### Run
```bash
docker run -p 3001:3001 \
  -e MONGODB_URI=mongodb://mongodb:27017/farmers_db \
  -e JWT_SECRET=<your_secret> \
  farmer-service
```

## ⚙️ Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| PORT | Port du serveur | 3001 |
| MONGODB_URI | URI de connexion MongoDB | mongodb://mongodb:27017/farmers_db |
| JWT_SECRET | Clé secrète JWT | (voir .env.example) |
| NODE_ENV | Environnement | production |

## 🧪 Tests

```bash
# À implémenter
npm test
```

## 📝 Logs

Le service affiche des logs formatés sur la console :
- ✅ Succès (connexion DB, démarrage)
- ❌ Erreurs (échecs de connexion, erreurs serveur)
- 📊 Informations (requêtes, santé)

## 🔧 Dépannage

### Erreur de connexion MongoDB
- Vérifier que MongoDB est démarré
- Vérifier l'URI de connexion dans .env
- Vérifier la connectivité réseau (Docker network)

### Erreur JWT Invalid
- Vérifier que JWT_SECRET est identique dans tous les services
- Vérifier que le token n'est pas expiré
- Vérifier le format du header Authorization

## 📄 Licence

Projet académique - Usage pédagogique uniquement.

## 👤 Auteur

MAHAMADOU AMADOU HABOU
