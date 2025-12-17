# 🌾 Projet SOA Agricole — README d'Initialisation

Ce document présente l'initialisation du projet SOA Agricole. Il sert de première base pour la mise en place du dépôt Git, de la structure globale, des services et des outils.

---

## 🚀 Objectif

Mettre en place la structure complète du projet SOA multi-technologies, avec tous les services, prêts à être développés, testés et conteneurisés.

---

## 📁 Structure initiale du projet

```
projet-soa-agri/
│
├── documentation/
│   ├── cahier-des-charges.md
│   ├── specs-techniques.md
│   └── manuel-utilisation.md
│
├── services/
│   ├── auth-service/           (Spring Boot - REST)
│   ├── farmer-service/         (Node/Express - REST)
│   ├── crop-service/           (Java SOAP - JAX-WS)
│   ├── prediction-service/     (FastAPI - REST)
│   ├── billing-service/        (.NET Core SOAP)
│   └── api-gateway/            (Spring Cloud)
│
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfiles/
│
└── presentations/
    ├── soutenance-finale.pptx
    └── demo-video.mp4
```

---

## 🧰 IDEs recommandés

* **IntelliJ Ultimate** → Auth-Service + API Gateway (Spring Boot/Cloud)
* **VS Code** → Farmer-Service (Node.js) 
* **PyCharm Pro**-> Prediction-Service (FastAPI)
* **IntelliJ Ultimate** → Crop-Service SOAP (JAX-WS)
* **Visual Studio** → Billing-Service (.NET SOAP)

---

## 🧱 Technologies utilisées

* Java 25 — Spring Boot / Spring Cloud
* Node.js 22 — Express
* Python 3.12 — FastAPI
* .NET 9 — SOAP Services
* JAX-WS (SOAP XML, WSDL)
* Docker / Docker Compose
* JWT (HS256)

---

## 🗃️ Initialisation Git

```bash
git init
git branch -M main
git add .
git commit -m "Initialisation du projet SOA Agricole"
```

---

## 🛠️ Étapes d'initialisation

1. Création des dossiers principaux
2. Ajout des fichiers de documentation vides
3. Mise en place des squelettes des services
4. Préparation du docker-compose
5. Ajout du .gitignore global
6. Commit initial

---

## 📦 Services prévus

* **Auth-Service** : Authentification agriculteurs/experts + JWT
* **Farmer-Service** : Gestion des agriculteurs (CRUD)
* **Crop-Service** : Gestion cultures & parcelles en SOAP
* **Prediction-Service** : Prédictions agricoles simples
* **Billing-Service** : Facturation intrants agricoles en SOAP
* **API Gateway** : Routage, sécurité, agrégation

---

## 📜 Licence

Projet académique — Usage pédagogique uniquement.
