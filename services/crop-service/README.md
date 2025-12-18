# 🌱 Crop Service (SOAP)

Service SOAP Java JAX-WS pour la gestion des cultures agricoles.

## 📋 Description

Le Crop Service fournit une interface SOAP pour gérer les cultures, incluant :
- Création, lecture, mise à jour et suppression de cultures
- Suivi du statut de santé des cultures
- Gestion des types de cultures

## 🛠️ Technologies

- **Java** 21
- **JAX-WS** - Framework SOAP
- **Maven** - Build tool
- **Jakarta XML Web Services** 4.0.2

## 📦 Installation

```bash
# Build le projet
./mvnw clean package

# Le JAR sera créé dans target/crop-service-1.0.0.jar
```

## 🚀 Démarrage

```bash
# Méthode 1: Avec Maven
./mvnw exec:java

# Méthode 2: Avec le JAR
java -jar target/crop-service-1.0.0.jar

# Méthode 3: Avec Docker
docker build -f ../../docker/Dockerfiles/crop-service.Dockerfile -t crop-service .
docker run -p 8082:8082 crop-service
```

Le service démarre sur le port **8082** par défaut.

## 📚 WSDL

Une fois le service démarré, le WSDL est disponible à :

```
http://localhost:8082/crop?wsdl
```

## 🔗 Opérations SOAP

### 1. hello

Test de connexion au service.

**Requête SOAP:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:hello/>
  </soapenv:Body>
</soapenv:Envelope>
```

**Réponse:**
```xml
<soap:Envelope>
  <soap:Body>
    <ns2:helloResponse>
      <return>Hello World from Crop Service (SOAP)!</return>
    </ns2:helloResponse>
  </soap:Body>
</soap:Envelope>
```

### 2. createCrop

Créer une nouvelle culture.

**Paramètres:**
- `name` (string) - Nom de la culture
- `type` (string) - Type de culture (ex: Cereal, Vegetable, Fruit)
- `diseaseStatus` (string) - Statut sanitaire (Healthy, At Risk, Under Treatment)

**Requête SOAP:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:createCrop>
      <name>Winter Wheat</name>
      <type>Cereal</type>
      <diseaseStatus>Healthy</diseaseStatus>
    </crop:createCrop>
  </soapenv:Body>
</soapenv:Envelope>
```

**Réponse:**
```xml
<soap:Envelope>
  <soap:Body>
    <ns2:createCropResponse>
      <return>Crop created successfully with ID: 4</return>
    </ns2:createCropResponse>
  </soap:Body>
</soap:Envelope>
```

### 3. getCrop

Récupérer une culture par son ID.

**Paramètres:**
- `id` (int) - ID de la culture

**Requête SOAP:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:getCrop>
      <id>1</id>
    </crop:getCrop>
  </soapenv:Body>
</soapenv:Envelope>
```

**Réponse:**
```xml
<soap:Envelope>
  <soap:Body>
    <ns2:getCropResponse>
      <return>
        <id>1</id>
        <name>Winter Wheat</name>
        <type>Cereal</type>
        <diseaseStatus>Healthy</diseaseStatus>
      </return>
    </ns2:getCropResponse>
  </soap:Body>
</soap:Envelope>
```

### 4. updateCrop

Mettre à jour une culture existante.

**Paramètres:**
- `id` (int) - ID de la culture
- `name` (string) - Nouveau nom (optionnel)
- `type` (string) - Nouveau type (optionnel)
- `diseaseStatus` (string) - Nouveau statut (optionnel)

**Requête SOAP:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:updateCrop>
      <id>1</id>
      <name>Winter Wheat Premium</name>
      <type>Cereal</type>
      <diseaseStatus>Under Treatment</diseaseStatus>
    </crop:updateCrop>
  </soapenv:Body>
</soapenv:Envelope>
```

### 5. deleteCrop

Supprimer une culture.

**Paramètres:**
- `id` (int) - ID de la culture

**Requête SOAP:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:deleteCrop>
      <id>3</id>
    </crop:deleteCrop>
  </soapenv:Body>
</soapenv:Envelope>
```

### 6. listCrops

Lister toutes les cultures.

**Requête SOAP:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:listCrops/>
  </soapenv:Body>
</soapenv:Envelope>
```

**Réponse:**
```xml
<soap:Envelope>
  <soap:Body>
    <ns2:listCropsResponse>
      <return>
        Total Crops: 3
        
        ID: 1, Name: Winter Wheat, Type: Cereal, Disease Status: Healthy
        ID: 2, Name: Sweet Corn, Type: Cereal, Disease Status: Healthy
        ID: 3, Name: Basmati Rice, Type: Cereal, Disease Status: Moderate Risk
      </return>
    </ns2:listCropsResponse>
  </soap:Body>
</soap:Envelope>
```

## 🧪 Tests avec curl

```bash
# Test hello
curl -X POST http://localhost:8082/crop \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: hello" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:hello/>
  </soapenv:Body>
</soapenv:Envelope>'

# Créer une culture
curl -X POST http://localhost:8082/crop \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: createCrop" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:createCrop>
      <name>Organic Tomatoes</name>
      <type>Vegetable</type>
      <diseaseStatus>Healthy</diseaseStatus>
    </crop:createCrop>
  </soapenv:Body>
</soapenv:Envelope>'

# Lister les cultures
curl -X POST http://localhost:8082/crop \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: listCrops" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:crop="http://crop.agriservices.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <crop:listCrops/>
  </soapenv:Body>
</soapenv:Envelope>'
```

## 📊 Modèle de Données

### Crop

```java
public class Crop {
    private int id;              // ID unique
    private String name;         // Nom de la culture
    private String type;         // Type (Cereal, Vegetable, Fruit, etc.)
    private String diseaseStatus; // Statut sanitaire
}
```

### Statuts de Maladie Recommandés

- `Healthy` - Culture saine
- `At Risk` - Culture à risque
- `Under Treatment` - Culture en traitement
- `Moderate Risk` - Risque modéré
- `High Risk` - Risque élevé
- `Unknown` - Statut inconnu

### Types de Culture Recommandés

- `Cereal` - Céréales (blé, maïs, riz)
- `Vegetable` - Légumes
- `Fruit` - Fruits
- `Legume` - Légumineuses
- `Oilseed` - Oléagineux
- `Fiber` - Fibres

## 🐳 Docker

### Build
```bash
docker build -f ../../docker/Dockerfiles/crop-service.Dockerfile -t crop-service .
```

### Run
```bash
docker run -p 8082:8082 crop-service
```

## ⚙️ Configuration

| Variable | Description | Défaut |
|----------|-------------|--------|
| PORT | Port du serveur | 8082 |
| WSDL_PATH | Chemin du WSDL | /crop |

## 🔧 Dépannage

### Port déjà utilisé

```bash
# Trouver le processus utilisant le port 8082
lsof -i :8082

# Changer le port
java -Dserver.port=8083 -jar target/crop-service-1.0.0.jar
```

### WSDL non accessible

```bash
# Vérifier que le service est démarré
curl http://localhost:8082/crop?wsdl

# Vérifier les logs
tail -f logs/crop-service.log
```

## 📈 Améliorations Futures

1. **Base de données persistante**
   - MongoDB ou PostgreSQL pour stockage permanent
   - Transactions ACID

2. **Authentification**
   - Intégration avec Auth Service
   - WS-Security

3. **Recherche avancée**
   - Filtrage par type
   - Recherche par statut de maladie
   - Pagination

4. **Notifications**
   - Alertes pour changements de statut
   - Intégration avec système de notification

## 🔒 Sécurité

Pour l'instant, le service SOAP n'a pas d'authentification. Pour la production:

1. Implémenter WS-Security
2. Intégrer avec Auth Service
3. Valider les entrées strictement
4. Logger toutes les opérations

## 📄 Licence

Projet académique - Usage pédagogique uniquement.

## 👤 Auteur

MAHAMADOU AMADOU HABOU
