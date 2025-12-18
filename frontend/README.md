# 🌾 AgriServices Frontend

Frontend Next.js pour la plateforme AgriServices - Interface utilisateur moderne et responsive pour interagir avec les microservices backend.

## 🚀 Technologies

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS 4** - Styling utilitaire
- **React 19** - Bibliothèque UI

## 📁 Structure du projet

```
frontend/
├── app/                    # Pages et routes (App Router)
│   ├── dashboard/         # Tableau de bord
│   ├── farmers/           # Gestion des agriculteurs
│   ├── login/             # Page de connexion
│   ├── predictions/       # Prédictions agricoles
│   ├── register/          # Page d'inscription
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants réutilisables
│   ├── Button.tsx         # Bouton personnalisé
│   ├── Card.tsx           # Carte de contenu
│   └── Navbar.tsx         # Barre de navigation
├── lib/                   # Utilitaires et API
│   └── api.ts             # Configuration API et appels
├── public/                # Fichiers statiques
└── .env.local            # Variables d'environnement

```

## 🔧 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Backend AgriServices en cours d'exécution

### Étapes

1. **Installer les dépendances**
   ```bash
   cd frontend
   npm install
   ```

2. **Configurer les variables d'environnement**
   ```bash
   # Le fichier .env.local est déjà créé avec les valeurs par défaut
   # Modifier si nécessaire
   NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📡 Fonctionnalités

### 🔐 Authentification
- **Inscription** - Créer un nouveau compte avec rôle (FARMER, EXPERT, COOPERATIVE, ADMIN)
- **Connexion** - Se connecter avec username/password
- **JWT Token** - Gestion automatique des tokens d'authentification
- **Déconnexion** - Supprimer le token et rediriger

### 👨‍🌾 Gestion des Agriculteurs
- **Liste** - Afficher tous les agriculteurs
- **Créer** - Ajouter un nouvel agriculteur avec informations complètes
- **Modifier** - Mettre à jour les informations (à venir)
- **Supprimer** - Retirer un agriculteur de la base de données

### 📊 Prédictions Agricoles
- **Prédiction de rendement** - Estimer la production en kg basée sur:
  - Type de culture
  - Surface en hectares
  - Type de sol
  - Pluviométrie
  - Température
  - Utilisation d'engrais
- **Évaluation des risques** - Identifier les facteurs de risque et recommandations

### 🎨 Interface utilisateur
- Design moderne avec Tailwind CSS
- Responsive (mobile, tablette, desktop)
- Navigation intuitive
- Feedback visuel pour les actions
- Messages d'erreur clairs

## 🛠️ Scripts

```bash
# Développement
npm run dev          # Démarrer en mode développement (port 3000)

# Production
npm run build        # Compiler pour la production
npm start            # Démarrer le serveur de production

# Autre
npm run lint         # Vérifier le code (si ESLint configuré)
```

## 📚 Pages disponibles

| Page | Route | Description |
|------|-------|-------------|
| **Accueil** | `/` | Landing page avec présentation |
| **Connexion** | `/login` | Formulaire de connexion |
| **Inscription** | `/register` | Formulaire d'inscription |
| **Dashboard** | `/dashboard` | Tableau de bord principal |
| **Agriculteurs** | `/farmers` | Gestion CRUD des agriculteurs |
| **Prédictions** | `/predictions` | Prédictions de rendement et risques |

## 🔗 Intégration Backend

Le frontend communique avec le backend via l'API Gateway sur le port 8080.

### Endpoints utilisés

**Authentification**
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion

**Farmers**
- `GET /api/farmers` - Liste des agriculteurs
- `POST /api/farmers` - Créer un agriculteur
- `GET /api/farmers/:id` - Détails d'un agriculteur
- `PUT /api/farmers/:id` - Modifier un agriculteur
- `DELETE /api/farmers/:id` - Supprimer un agriculteur

**Prédictions**
- `POST /api/predict/yield` - Prédire le rendement
- `POST /api/predict/risk` - Évaluer les risques
- `GET /api/predict/history` - Historique des prédictions

## 🎯 Utilisation

### Workflow typique

1. **S'inscrire** sur `/register`
2. **Se connecter** sur `/login` pour obtenir un token JWT
3. **Accéder au dashboard** `/dashboard`
4. **Gérer les agriculteurs** sur `/farmers`
5. **Faire des prédictions** sur `/predictions`

### Exemple: Créer un agriculteur

1. Aller sur `/farmers`
2. Cliquer sur "Ajouter un agriculteur"
3. Remplir le formulaire:
   - User ID
   - Prénom et Nom
   - Téléphone
   - Ville et Pays
4. Soumettre le formulaire
5. L'agriculteur apparaît dans la liste

### Exemple: Prédiction de rendement

1. Aller sur `/predictions`
2. Sélectionner "Prédiction de Rendement"
3. Remplir les données:
   - Type de culture (blé, maïs, riz, etc.)
   - Surface en hectares
   - Type de sol
   - Pluviométrie et température
   - Engrais utilisé (oui/non)
4. Cliquer sur "Prédire le rendement"
5. Voir les résultats avec:
   - Rendement prédit en kg
   - Niveau de confiance
   - Recommandations

## 🔒 Sécurité

- **JWT Token** stocké dans localStorage
- **Redirection automatique** vers login si token invalide ou expiré
- **Authorization header** ajouté à toutes les requêtes authentifiées
- **Validation côté serveur** pour toutes les opérations

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies dans Tailwind:
- **Primary**: Vert (`green-600`, `green-700`, etc.)
- **Secondary**: Gris
- **Danger**: Rouge
- **Background**: Gris clair (`gray-50`)

### Modifier les couleurs

Éditer `tailwind.config.ts` pour personnaliser le thème.

## 📦 Déploiement

### Production locale

```bash
npm run build
npm start
```

### Déploiement Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Variables d'environnement en production

Configurer `NEXT_PUBLIC_API_GATEWAY_URL` avec l'URL de production de l'API Gateway.

## 🐛 Dépannage

### Erreur de connexion à l'API

- Vérifier que le backend est démarré
- Vérifier l'URL dans `.env.local`
- Vérifier que l'API Gateway est accessible sur port 8080

### Erreur 401 Unauthorized

- Le token JWT est peut-être expiré
- Se reconnecter pour obtenir un nouveau token

### Page blanche après login

- Vérifier la console du navigateur pour les erreurs
- Vérifier que le token est bien stocké dans localStorage

## 📝 Notes

- Le frontend est conçu pour être **minimal mais complet**
- Interface **claire et intuitive** pour la démonstration
- **Responsive design** pour tous les écrans
- **Intégration parfaite** avec les services backend existants

## 👤 Auteur

**MAHAMADOU AMADOU HABOU**

## 📄 Licence

Projet académique — Usage pédagogique uniquement.
