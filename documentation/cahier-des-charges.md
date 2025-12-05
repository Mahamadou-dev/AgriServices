# Cahier des Charges – Mini-Projet SOA Agricole

## 1. Objectif du projet
Réaliser un prototype fonctionnel basé sur une architecture SOA comprenant :
- 6 services indépendants (REST & SOAP),
- Une API Gateway centralisée,
- Une documentation technique complète.

Le domaine choisi est **le secteur agricole**, en respectant les technologies imposées.

## 2. Description générale
Le système doit faciliter :
- La gestion des agriculteurs.
- La gestion des cultures et parcelles.
- Les prédictions simples liées aux rendements et risques agricoles.
- La facturation d’intrants agricoles.
- L’authentification unique via JWT.
- Le routage centralisé des services.

## 3. Services à développer
### Auth-Service (Spring Boot – REST)
- Inscription / connexion agriculteur ou expert.
- Génération & validation JWT.
- Vérification des rôles.

### Farmer-Service (Node.js/Express – REST)
- CRUD complet des agriculteurs :
  - ajouter un agriculteur
  - modifier
  - supprimer
  - lister
- Vérification du JWT sur chaque requête.

### Crop-Service (Java/JAX-WS – SOAP)
- Gestion basique des cultures :
  - ajouter une culture
  - modifier
  - supprimer
  - lister
- Gestion simplifiée des parcelles et planning.

### Prediction-Service (Python/FastAPI – REST)
- Fournir des prédictions simples :
  - rendement estimé (mock)
  - risque maladie (mock)
- Calcul simulé pour prototype (formules statiques).

### Billing-Service (.NET Core – SOAP)
- Calcul des coûts d’intrants :
  - engrais
  - semences
- État du paiement : en règle / non en règle.

### API Gateway (Spring Cloud)
- Routage des requêtes vers les services.
- Filtre global qui valide le JWT.
- Exposition du point d'entrée unique `/api/**`.

## 4. Contraintes
- Respect des stacks imposées.
- Conteneurisation possible (Docker).
- Documentation obligatoire.

## 5. Livrables
- Code source complet (Git).
- 6 services fonctionnels.
- API Gateway.
- Documentation (3 fichiers).
