# 🎨 Guide Frontend AgriServices

Guide complet pour utiliser le frontend Next.js avec les microservices AgriServices.

---

## 🚀 Démarrage Rapide

### Prérequis

1. **Backend démarré** - Tous les services backend doivent être opérationnels
2. **Node.js 18+** installé
3. **npm** ou **yarn**

### Étapes d'installation

```bash
# 1. Aller dans le dossier frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur de développement
npm run dev

# 4. Ouvrir dans le navigateur
# http://localhost:3000
```

---

## 📋 Workflow Complet de Test

### 1. Démarrer le Backend

```bash
# Terminal 1 - Démarrer tous les services avec Docker
cd docker
docker compose up -d

# Vérifier que tous les services sont UP
docker compose ps

# Attendre ~30 secondes que tout démarre
```

### 2. Démarrer le Frontend

```bash
# Terminal 2 - Démarrer le frontend
cd frontend
npm run dev
```

### 3. Tester l'Application

#### A. Authentification

1. **Ouvrir** http://localhost:3000
2. **Cliquer sur "Register"** (en haut à droite)
3. **Créer un compte**:
   - Nom d'utilisateur: `demo_user`
   - Email: `demo@agri.com`
   - Mot de passe: `Demo1234!`
   - Rôle: `Agriculteur`
4. **Cliquer sur "S'inscrire"**
5. **Redirection automatique** vers la page de connexion
6. **Se connecter** avec les identifiants créés
7. **Redirection** vers le dashboard

#### B. Gestion des Agriculteurs

1. **Depuis le dashboard**, cliquer sur "Agriculteurs"
2. **Cliquer sur "Ajouter un agriculteur"**
3. **Remplir le formulaire**:
   - User ID: `demo_user`
   - Prénom: `Jean`
   - Nom: `Dupont`
   - Téléphone: `+33612345678`
   - Ville: `Paris`
   - Pays: `France`
4. **Cliquer sur "Créer"**
5. **Voir l'agriculteur** dans la liste
6. **Tester la suppression** (optionnel)

#### C. Prédictions Agricoles

1. **Depuis le dashboard**, cliquer sur "Predictions"
2. **Onglet "Prédiction de Rendement"** (actif par défaut)
3. **Remplir les données**:
   - Type de culture: `Blé`
   - Surface: `10` hectares
   - Type de sol: `Limoneux`
   - Pluviométrie: `600` mm
   - Température: `25` °C
   - Engrais utilisé: ✓ (coché)
4. **Cliquer sur "Prédire le rendement"**
5. **Voir les résultats**:
   - Rendement prédit en kg
   - Niveau de confiance
   - Recommandations
6. **Tester l'évaluation des risques**:
   - Cliquer sur "Évaluation des Risques"
   - Remplir les mêmes données
   - Cliquer sur "Évaluer les risques"
   - Voir le niveau de risque et les stratégies d'atténuation

---

## 🎯 Fonctionnalités Démontrées

### ✅ Services Backend Utilisés

| Service | Port | Fonctionnalité Frontend | Endpoint |
|---------|------|------------------------|----------|
| **Auth Service** | 8081 | Login, Register | `POST /auth/login`, `POST /auth/register` |
| **Farmer Service** | 3001 | CRUD Agriculteurs | `GET/POST/PUT/DELETE /api/farmers` |
| **Prediction Service** | 8000 | Prédictions | `POST /api/predict/yield`, `POST /api/predict/risk` |
| **API Gateway** | 8080 | Point d'entrée unique | Toutes les routes |

### 🔐 Authentification JWT

- **Token stocké** dans localStorage
- **Ajout automatique** du header Authorization
- **Redirection** vers login si token expiré
- **Gestion des rôles** (FARMER, EXPERT, COOPERATIVE, ADMIN)

### 👨‍🌾 Gestion des Agriculteurs

- **Liste complète** avec pagination visuelle
- **Création** avec formulaire validé
- **Suppression** avec confirmation
- **Modification** (UI prête, à implémenter)
- **Affichage** des informations de contact et localisation

### 📊 Prédictions Agricoles

- **Prédiction de rendement** basée sur:
  - Type de culture (blé, maïs, riz, soja, coton)
  - Surface en hectares
  - Conditions météo et sol
  - Utilisation d'engrais
- **Évaluation des risques** avec:
  - Niveau de risque (LOW, MEDIUM, HIGH)
  - Facteurs de risque identifiés
  - Stratégies d'atténuation recommandées

---

## 🎨 Design et UX

### Palette de Couleurs

- **Primary**: Vert (`#059669`, `#047857`)
- **Secondary**: Gris clair
- **Danger**: Rouge
- **Background**: Gris très clair (`#F9FAFB`)

### Responsive Design

- **Mobile**: Navigation optimisée, formulaires adaptés
- **Tablette**: Grilles à 2 colonnes
- **Desktop**: Grilles à 3 colonnes, navigation complète

### Composants Réutilisables

- **Navbar**: Navigation avec état de connexion
- **Card**: Conteneur de contenu avec titre optionnel
- **Button**: Bouton avec variantes (primary, secondary, danger)

---

## 🔧 Architecture Frontend

### Structure des Dossiers

```
frontend/
├── app/                      # Pages (App Router Next.js)
│   ├── dashboard/           # Tableau de bord
│   ├── farmers/             # Gestion agriculteurs
│   ├── login/               # Connexion
│   ├── predictions/         # Prédictions
│   ├── register/            # Inscription
│   ├── layout.tsx           # Layout global
│   └── page.tsx             # Page d'accueil
├── components/              # Composants réutilisables
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Navbar.tsx
└── lib/                     # Utilitaires
    └── api.ts               # Configuration API
```

### Technologies

- **Next.js 16** avec App Router
- **TypeScript** pour le typage
- **Tailwind CSS 4** pour le styling
- **React 19** pour l'UI

---

## 🧪 Tests Manuels

### Checklist de Vérification

- [ ] Page d'accueil charge correctement
- [ ] Inscription fonctionne et crée un utilisateur
- [ ] Connexion fonctionne et génère un token
- [ ] Dashboard accessible après connexion
- [ ] Liste des agriculteurs se charge
- [ ] Création d'agriculteur fonctionne
- [ ] Suppression d'agriculteur fonctionne
- [ ] Prédiction de rendement retourne des résultats
- [ ] Évaluation des risques retourne des résultats
- [ ] Déconnexion fonctionne et redirige vers home
- [ ] Navigation entre les pages fonctionne
- [ ] Responsive design sur mobile/tablette/desktop

---

## 📝 Scénario de Démonstration

### Présentation Complète (5 minutes)

1. **Introduction** (30s)
   - Montrer la page d'accueil
   - Expliquer l'architecture SOA avec microservices

2. **Authentification** (1 min)
   - Créer un compte (Register)
   - Se connecter (Login)
   - Montrer le token JWT dans localStorage (DevTools)

3. **Dashboard** (30s)
   - Vue d'ensemble des fonctionnalités
   - Navigation vers les différents modules

4. **Gestion des Agriculteurs** (1 min 30s)
   - Voir la liste (vide au début)
   - Créer un agriculteur avec toutes les informations
   - Voir l'agriculteur apparaître dans la liste
   - Expliquer le CRUD complet

5. **Prédictions** (1 min 30s)
   - Prédiction de rendement avec des valeurs réalistes
   - Montrer les résultats et recommandations
   - Évaluation des risques
   - Montrer les stratégies d'atténuation

6. **Conclusion** (30s)
   - Récapituler les services utilisés
   - Montrer l'intégration avec le backend
   - Questions/Réponses

---

## 🐛 Dépannage

### Problème: Frontend ne démarre pas

```bash
# Solution 1: Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Solution 2: Vérifier la version de Node.js
node --version  # Doit être 18+
```

### Problème: Erreur de connexion au backend

```bash
# Vérifier que le backend est démarré
docker compose ps

# Vérifier l'API Gateway
curl http://localhost:8080/health

# Vérifier la configuration
cat frontend/.env.local
# NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080
```

### Problème: Erreur 401 après connexion

```bash
# Vérifier le token dans localStorage (DevTools)
# Vérifier que le service Auth fonctionne
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### Problème: Page blanche

```bash
# Vérifier les logs du navigateur (Console)
# Vérifier les logs du serveur Next.js
# Vérifier la compilation TypeScript
npm run build
```

---

## 🚀 Déploiement

### Production Locale

```bash
# Compiler pour la production
npm run build

# Démarrer le serveur de production
npm start
```

### Variables d'Environnement

Pour la production, créer un fichier `.env.production.local`:

```env
NEXT_PUBLIC_API_GATEWAY_URL=https://api.agriservices.com
```

---

## 📚 Documentation Supplémentaire

- **README Frontend**: `frontend/README.md`
- **Documentation Backend**: `README.md` (racine)
- **Guide de tests**: `documentation/GUIDE-TESTS.md`
- **Tests API**: `tests-api.json`

---

## 👤 Auteur

**MAHAMADOU AMADOU HABOU**

---

## 📄 Licence

Projet académique — Usage pédagogique uniquement.

---

**Version**: 1.0  
**Date**: 18 Décembre 2025
