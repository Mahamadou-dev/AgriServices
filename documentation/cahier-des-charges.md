# 🌱 Cahier des Charges – Système SOA de Gestion Agricole Distribuée

## 1. Introduction

L'agriculture moderne fait face à de multiples défis :

- **Fragmentation des informations**
- **Absence de systèmes centralisés**
- **Manque de traçabilité**
- **Faible digitalisation des exploitations**
- **Difficultés d'accès aux conseils techniques**
- **Gestion complexe des intrants et des coûts**

Dans plusieurs pays agricoles, les exploitants — souvent dispersés géographiquement — ne disposent pas d'outils leur permettant de gérer efficacement leurs données, leurs parcelles, leurs productions et leurs dépenses.

Dans ce contexte, la mise en place d'un **système distribué basé sur une Architecture Orientée Services (SOA)** constitue une approche robuste et évolutive, permettant d'intégrer plusieurs services indépendants, interopérables et accessibles à distance.

Ce document présente le cahier des charges d'un **écosystème SOA agricole complet**, conçu pour répondre aux besoins opérationnels des acteurs du secteur :

- 🧑‍🌾 **Agriculteurs**
- 🤝 **Coopératives**
- 🔬 **Experts agricoles**
- 📦 **Gestionnaires d'intrants**

---

## 2. Problématique

L'absence d'un système centralisé entraîne plusieurs limites opérationnelles majeures :

### 2.1. Gestion des exploitants difficile
Les informations sur les agriculteurs sont souvent dispersées et non synchronisées, ce qui complique le suivi administratif et technique (fiches, historique, contact).

### 2.2. Manque de traçabilité des cultures
Les données sur les parcelles, les cultures, les saisons agricoles et les interventions sont rarement structurées de manière numérique et ne permettent pas un suivi complet.

### 2.3. Absence d'outils prédictifs
Peu d'agriculteurs disposent de prévisions sur :

- **Les rendements attendus**
- **Les risques de maladies ou de ravageurs**
- **Les périodes optimales de semis ou de traitement**

### 2.4. Facturation manuelle
La gestion des intrants (engrais, semences) est souvent réalisée à la main, entraînant des erreurs, des retards et un manque de transparence pour toutes les parties.

### 2.5. Manque d'unification
Chaque besoin est traité par un outil isolé. Il n'existe pas de système intégré, sécurisé et extensible permettant une vue globale et unifiée de l'exploitation.

---

## 3. ✅ Solution proposée

Le présent projet propose la conception d'un **système SOA agricole**, composé de services indépendants (REST & SOAP), interconnectés via une API Gateway, et offrant :

| Fonctionnalité | Description |
|----------------|-------------|
| 🔐 **Authentification Unique** | Sécurisée via JWT |
| 👨‍🌾 **Gestion normalisée** | Des agriculteurs |
| 📊 **Suivi en temps réel** | Des cultures et des parcelles |
| 🔮 **Moteur de prédiction** | Simple mais exploitable |
| 💰 **Gestion claire des coûts** | Agricoles |
| 🔗 **Interopérabilité complète** | Via architecture SOA |

> **Note importante** : Chaque service peut évoluer indépendamment grâce à un découplage strict.

---

## 4. 🏗️ Architecture Générale

L'architecture repose sur **six services distribués**, chacun dédié à une responsabilité métier précise, et intégrés via **Spring Cloud Gateway**.

### 4.1. Services à développer

Le tableau ci-dessous détaille les six microservices ainsi que leurs technologies et responsabilités :

| Couleur | Service | Technologie | Rôle Principal | Fonctions Clés |
|---------|---------|-------------|----------------|----------------|
| 🟩 | **Auth-Service** | REST – Spring Boot | Authentification centralisée (JWT) | Inscription / Connexion, Gestion des rôles, Sécurisation des appels inter-services |
| 🟦 | **Farmer-Service** | REST – Node.js/Express | Gestion administrative des exploitants | CRUD Exploitants, Recherche et listing, Vérification automatique du JWT |
| 🟨 | **Crop-Service** | SOAP – Java JAX-WS | Suivi des cultures, parcelles et calendrier | Ajouter/modifier/supprimer une culture, Organisation des parcelles, Retours XML structurés via WSDL |
| 🟧 | **Prediction-Service** | REST – FastAPI | Analyse et prédiction agricole | Estimation de rendement, Détection de risques potentiels (maladies, sécheresse), Calculs rapides (modèle asynchrone) |
| 🟥 | **Billing-Service** | SOAP – .NET Core | Gestion financière des intrants | Calcul des coûts d'engrais et semences, Suivi des paiements, Statut en règle / non en règle |
| 🟪 | **API Gateway** | Spring Cloud | Point d'accès unique du système | Routage intelligent vers les services, Vérification du JWT, Masquage des services internes |

---

## 5. ⚙️ Contraintes Techniques

Le respect des contraintes techniques est impératif pour garantir l'interopérabilité et le déploiement.

- ✅ **Respect strict des technologies imposées** : Spring Boot, Node.js, Java/JAX-WS, FastAPI, .NET Core
- ✅ **Architecture SOA distribuée** : Services indépendants et déployables séparément
- ✅ **Conteneurisation** : Dockerisation de chaque service requise
- ✅ **Documentation** : Documentation complète exigée pour chaque brique (code, déploiement, utilisation)

---

## 6. 📦 Livrables

### 6.1. Code source
Un répertoire Git structuré doit être fourni, contenant au minimum les dossiers suivants :
/documentation
/services
├── auth-service/
├── farmer-service/
├── crop-service/
├── prediction-service/
├── billing-service/
└── gateway-service/
/docker
/presentations

### 6.2. Microservices opérationnels
- 4 services REST fonctionnels
- 2 services SOAP fonctionnels
- API Gateway configurée et opérationnelle

### 6.3. Documentation
- Cahier des charges (ce document)
- Spécifications techniques détaillées par service
- Manuel d'utilisation pour les techniciens et les agriculteurs

### 6.4. Plan de déploiement & Docker
- Fichier `docker-compose.yml` pour un déploiement local rapide
- Dockerfiles séparés pour chaque service
- Configuration d'un réseau interne pour les services et d'une passerelle (Gateway) publique

---

## 7. 🎯 Bénéfices attendus

L'implémentation de ce système apportera les avantages suivants aux acteurs du secteur agricole :

| Bénéfice | Description |
|----------|-------------|
| 📊 **Centralisation** | Des données agricoles |
| 🤖 **Automatisation** | Des calculs (rendements, coûts) |
| 🔄 **Interopérabilité** | Garantie via l'architecture SOA (mélange REST/SOAP) |
| 🔒 **Sécurité renforcée** | Via l'utilisation de JWT |
| 📈 **Scalabilité** | Grâce au découpage en microservices indépendants |
| 🛠️ **Facilité de maintenance** | Et d'évolution future |

---

## 8. 🏁 Conclusion

Ce projet propose la mise en place d'une **architecture logicielle avancée, modulaire, sécurisée et extensible**, dédiée à la digitalisation du secteur agricole.

Grâce à une répartition claire des responsabilités entre services indépendants, le système offre une base solide pour le développement futur d'une plateforme complète d'aide à la décision, de gestion et de suivi des exploitations agricoles.

**Valeur ajoutée** : Système aligné avec :
- Les besoins réels du terrain
- Les standards modernes du cloud
- Les exigences d'un environnement informatique distribué professionnel

---

**📅 Dernière mise à jour** : `05/12/2025`  
**👤 Auteur** : `MAHAMADOU AMADOU HABOU`  
**🏷️ Version** : `1.1`

---
