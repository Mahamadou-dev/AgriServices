# 🔧 CORRECTIFS REQUIS - Branche feature/initialize-hello-world

## ⚠️ RÉSUMÉ: La branche N'EST PAS prête à démarrer

**5 problèmes critiques** empêchent le démarrage des services Docker.

---

## 🚨 Problèmes Bloquants à Corriger

### 1. Chemins COPY incorrects dans les Dockerfiles

**Fichiers à corriger:**
- `docker/Dockerfiles/auth-service.Dockerfile`
- `docker/Dockerfiles/crop-service.Dockerfile`
- `docker/Dockerfiles/api-gateway.Dockerfile`

**Changements à faire:**

Dans **auth-service.Dockerfile**, remplacer lignes 9-11 et 17:
```dockerfile
# AVANT (INCORRECT):
COPY services/auth-service/pom.xml .
COPY services/auth-service/mvnw .
COPY services/auth-service/.mvn .mvn
COPY services/auth-service/src ./src

# APRÈS (CORRECT):
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY src ./src
```

Dans **crop-service.Dockerfile**, remplacer lignes 7-9 et 15:
```dockerfile
# AVANT (INCORRECT):
COPY services/crop-service/pom.xml .
COPY services/crop-service/mvnw .
COPY services/crop-service/.mvn .mvn
COPY services/crop-service/src ./src

# APRÈS (CORRECT):
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY src ./src
```

Dans **api-gateway.Dockerfile**, remplacer lignes 7-9 et 15:
```dockerfile
# AVANT (INCORRECT):
COPY services/api-gateway/pom.xml .
COPY services/api-gateway/mvnw .
COPY services/api-gateway/.mvn .mvn
COPY services/api-gateway/src ./src

# APRÈS (CORRECT):
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY src ./src
```

---

### 2. Crop-service manque Maven Wrapper

**Action:** Ajouter Maven wrapper au crop-service

```bash
cd services/crop-service
mvn wrapper:wrapper
git add mvnw mvnw.cmd .mvn/
```

---

### 3. Versions Java incohérentes

**Fichiers à corriger:**
- `docker/Dockerfiles/crop-service.Dockerfile` (lignes 2 et 21)
- `docker/Dockerfiles/api-gateway.Dockerfile` (lignes 2 et 21)

**Changements:**

Dans **crop-service.Dockerfile**:
```dockerfile
# Ligne 2 - AVANT:
FROM openjdk:25-jdk-slim AS builder

# Ligne 2 - APRÈS:
FROM openjdk:21-jdk-slim AS builder

# Ligne 21 - AVANT:
FROM openjdk:25-jre-slim

# Ligne 21 - APRÈS:
FROM openjdk:21-jre-slim
```

Dans **api-gateway.Dockerfile**:
```dockerfile
# Ligne 2 - AVANT:
FROM openjdk:25-jdk-slim AS builder

# Ligne 2 - APRÈS:
FROM openjdk:21-jdk-slim AS builder

# Ligne 21 - AVANT:
FROM openjdk:25-jre-slim

# Ligne 21 - APRÈS:
FROM openjdk:21-jre-slim
```

---

### 4. Billing-service structure incorrecte

**Fichier à corriger:** `docker/Dockerfiles/billing-service.Dockerfile`

**Changements aux lignes 6-7 et 10:**

```dockerfile
# AVANT (lignes 6-7):
COPY services/billing-service/*.csproj ./
RUN dotnet restore

# Copier le code source
COPY services/billing-service/ ./

# APRÈS:
COPY BillingService/*.csproj ./
RUN dotnet restore

# Copier le code source
COPY BillingService/ ./
```

---

### 5. Supprimer le fichier "touch"

**Action:** Supprimer le fichier inutile

```bash
rm touch
```

---

## 📝 Script de Correction Automatique

Voici un script bash pour appliquer tous les correctifs automatiquement :

```bash
#!/bin/bash
# fix-hello-world-branch.sh

echo "🔧 Application des correctifs..."

# 1. Corriger auth-service.Dockerfile (COPY paths seulement)
sed -i 's|COPY services/auth-service/|COPY |g' docker/Dockerfiles/auth-service.Dockerfile

# 2. Corriger crop-service.Dockerfile (COPY paths + version Java)
sed -i 's|COPY services/crop-service/|COPY |g' docker/Dockerfiles/crop-service.Dockerfile
sed -i 's|FROM openjdk:25|FROM openjdk:21|g' docker/Dockerfiles/crop-service.Dockerfile

# 3. Corriger api-gateway.Dockerfile (COPY paths + version Java)
sed -i 's|COPY services/api-gateway/|COPY |g' docker/Dockerfiles/api-gateway.Dockerfile
sed -i 's|FROM openjdk:25|FROM openjdk:21|g' docker/Dockerfiles/api-gateway.Dockerfile

# 4. Corriger billing-service.Dockerfile (COPY paths seulement)
sed -i 's|COPY services/billing-service/|COPY BillingService/|g' docker/Dockerfiles/billing-service.Dockerfile

# 5. Ajouter Maven wrapper au crop-service
cd services/crop-service
mvn wrapper:wrapper
cd ../..

# 6. Supprimer le fichier touch
rm -f touch

echo "✅ Correctifs appliqués avec succès!"
echo "🧪 Testez avec: cd docker && docker compose build"
```

---

## 🧪 Validation Après Correction

Exécutez ces commandes pour vérifier que tout fonctionne :

```bash
# 1. Valider la syntaxe Docker Compose
cd docker
docker compose config

# 2. Builder toutes les images
docker compose build

# 3. Si le build réussit, lancer les services
docker compose up -d

# 4. Vérifier l'état des services
docker compose ps

# 5. Voir les logs
docker compose logs -f
```

---

## ✅ Checklist de Validation

- [ ] Chemins COPY corrigés dans auth-service.Dockerfile
- [ ] Chemins COPY corrigés dans crop-service.Dockerfile
- [ ] Chemins COPY corrigés dans api-gateway.Dockerfile
- [ ] Chemins COPY corrigés dans billing-service.Dockerfile
- [ ] Versions Java harmonisées (Java 21)
- [ ] Maven wrapper ajouté au crop-service
- [ ] Fichier "touch" supprimé
- [ ] `docker compose config` valide
- [ ] `docker compose build` réussit
- [ ] `docker compose up` démarre tous les services

---

## 📞 Support

Pour toute question sur ces correctifs, consulter le rapport détaillé :
`documentation/branch-verification-report.md`
