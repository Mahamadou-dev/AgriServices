# 💰 Billing Service (SOAP)

Service SOAP .NET Core pour la gestion de la facturation agricole.

## 📋 Description

Le Billing Service fournit une interface SOAP pour gérer les factures, incluant :
- Génération de nouvelles factures
- Récupération des détails de facture
- Gestion des paiements agricoles

## 🛠️ Technologies

- **.NET** 9.0
- **CoreWCF** - Framework SOAP pour .NET Core
- **ASP.NET Core** - Web framework

## 📦 Installation

```bash
cd BillingService

# Restaurer les dépendances
dotnet restore

# Build le projet
dotnet build
```

## 🚀 Démarrage

```bash
# Méthode 1: Avec dotnet run
dotnet run

# Méthode 2: Avec Docker
docker build -f ../../docker/Dockerfiles/billing-service.Dockerfile -t billing-service .
docker run -p 8085:8085 billing-service
```

Le service démarre sur le port **8085** par défaut.

## 📚 WSDL

Une fois le service démarré, le WSDL est disponible à :

```
http://localhost:8085/billing?wsdl
```

## 🔗 Opérations SOAP

### 1. GetInvoiceDetailsAsync

Récupérer les détails d'une facture existante.

**Paramètres:**
- `invoiceId` (int) - ID de la facture

**Requête SOAP:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:GetInvoiceDetailsAsync>
      <tem:invoiceId>101</tem:invoiceId>
    </tem:GetInvoiceDetailsAsync>
  </soapenv:Body>
</soapenv:Envelope>
```

**Réponse:**
```xml
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <GetInvoiceDetailsAsyncResponse xmlns="http://tempuri.org/">
      <GetInvoiceDetailsAsyncResult>
        <Id>101</Id>
        <FarmerName>Simulated Farmer</FarmerName>
        <Amount>450.75</Amount>
        <IssueDate>2025-12-13T10:30:00</IssueDate>
      </GetInvoiceDetailsAsyncResult>
    </GetInvoiceDetailsAsyncResponse>
  </s:Body>
</s:Envelope>
```

### 2. GenerateNewInvoiceAsync

Générer une nouvelle facture pour un agriculteur.

**Paramètres:**
- `farmerName` (string) - Nom de l'agriculteur
- `amount` (decimal) - Montant de la facture

**Requête SOAP:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:GenerateNewInvoiceAsync>
      <tem:farmerName>John Doe</tem:farmerName>
      <tem:amount>1250.75</tem:amount>
    </tem:GenerateNewInvoiceAsync>
  </soapenv:Body>
</soapenv:Envelope>
```

**Réponse:**
```xml
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <GenerateNewInvoiceAsyncResponse xmlns="http://tempuri.org/">
      <GenerateNewInvoiceAsyncResult>
        Facture 102 générée pour John Doe d'un montant de 1 250,75 €.
      </GenerateNewInvoiceAsyncResult>
    </GenerateNewInvoiceAsyncResponse>
  </s:Body>
</s:Envelope>
```

## 🧪 Tests avec curl

```bash
# Test GetInvoiceDetailsAsync
curl -X POST http://localhost:8085/billing \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: http://tempuri.org/IBillingService/GetInvoiceDetailsAsync" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:GetInvoiceDetailsAsync>
      <tem:invoiceId>101</tem:invoiceId>
    </tem:GetInvoiceDetailsAsync>
  </soapenv:Body>
</soapenv:Envelope>'

# Test GenerateNewInvoiceAsync
curl -X POST http://localhost:8085/billing \
  -H "Content-Type: text/xml" \
  -H "SOAPAction: http://tempuri.org/IBillingService/GenerateNewInvoiceAsync" \
  -d '<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:GenerateNewInvoiceAsync>
      <tem:farmerName>Alice Martin</tem:farmerName>
      <tem:amount>850.50</tem:amount>
    </tem:GenerateNewInvoiceAsync>
  </soapenv:Body>
</soapenv:Envelope>'
```

## 🧪 Tests avec PowerShell

```powershell
# Test GetInvoiceDetailsAsync
$body = @"
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:GetInvoiceDetailsAsync>
      <tem:invoiceId>101</tem:invoiceId>
    </tem:GetInvoiceDetailsAsync>
  </soapenv:Body>
</soapenv:Envelope>
"@

Invoke-WebRequest -Uri "http://localhost:8085/billing" `
  -Method POST `
  -ContentType "text/xml" `
  -Headers @{"SOAPAction"="http://tempuri.org/IBillingService/GetInvoiceDetailsAsync"} `
  -Body $body

# Test GenerateNewInvoiceAsync
$body2 = @"
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:tem="http://tempuri.org/">
  <soapenv:Header/>
  <soapenv:Body>
    <tem:GenerateNewInvoiceAsync>
      <tem:farmerName>John Doe</tem:farmerName>
      <tem:amount>1250.75</tem:amount>
    </tem:GenerateNewInvoiceAsync>
  </soapenv:Body>
</soapenv:Envelope>
"@

Invoke-WebRequest -Uri "http://localhost:8085/billing" `
  -Method POST `
  -ContentType "text/xml" `
  -Headers @{"SOAPAction"="http://tempuri.org/IBillingService/GenerateNewInvoiceAsync"} `
  -Body $body2
```

## 📊 Modèle de Données

### Invoice (Facture)

```csharp
public class Invoice
{
    public int Id { get; set; }              // ID unique de la facture
    public string FarmerName { get; set; }   // Nom de l'agriculteur
    public decimal Amount { get; set; }      // Montant (en euros/devise locale)
    public DateTime IssueDate { get; set; }  // Date d'émission
}
```

## 🏗️ Structure du Projet

```
BillingService/
├── BillingService.csproj   # Configuration du projet
├── Program.cs              # Point d'entrée et configuration SOAP
├── Contracts/
│   └── IBillingService.cs  # Interface du contrat SOAP
├── Services/
│   └── BillingService.cs   # Implémentation du service
├── Models/
│   └── Invoice.cs          # Modèle de données
└── Properties/
    └── launchSettings.json # Configuration de démarrage
```

## 🐳 Docker

### Build
```bash
docker build -f ../../docker/Dockerfiles/billing-service.Dockerfile -t billing-service .
```

### Run
```bash
docker run -p 8085:8085 billing-service
```

## ⚙️ Configuration

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| ASPNETCORE_URLS | URL du serveur | http://0.0.0.0:8085 |
| MONGODB_URI | URI MongoDB (futur) | - |

## 🔧 Dépannage

### Port déjà utilisé

```bash
# Windows
netstat -ano | findstr :8085
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8085
kill -9 <PID>

# Changer le port
dotnet run --urls "http://0.0.0.0:8086"
```

### Erreur de compilation

```bash
# Nettoyer et rebuild
dotnet clean
dotnet restore
dotnet build
```

### WSDL non accessible

```bash
# Vérifier que le service est démarré
curl http://localhost:8085/billing?wsdl

# Vérifier les logs
dotnet run --verbosity detailed
```

## 📈 Améliorations Futures

1. **Base de données MongoDB**
   - Stockage persistant des factures
   - Historique complet

2. **Authentification**
   - Intégration avec Auth Service
   - WS-Security headers

3. **Fonctionnalités avancées**
   - Liste de toutes les factures
   - Mise à jour de facture
   - Statut de paiement (payé/impayé)
   - Génération PDF

4. **Calculs automatiques**
   - Calcul basé sur les intrants
   - Taxes et remises
   - Historique des prix

5. **Intégrations**
   - Lien avec Farmer Service
   - Notifications de facture
   - Exports comptables

## 🔒 Sécurité

### État Actuel
- Service public sans authentification
- Données simulées en mémoire

### Pour Production
1. **Implémenter WS-Security**
   ```csharp
   // Ajouter validation de token
   public class SecurityBehavior : IServiceBehavior
   {
       // Valider JWT token
   }
   ```

2. **Base de données sécurisée**
   - Chiffrement des données sensibles
   - Connexion MongoDB sécurisée

3. **HTTPS obligatoire**
   ```csharp
   app.UseHttpsRedirection();
   ```

4. **Rate Limiting**
   - Limiter les requêtes par IP
   - Protection contre les abus

## 🧪 Tests Unitaires

```csharp
// À implémenter
[TestClass]
public class BillingServiceTests
{
    [TestMethod]
    public async Task GetInvoiceDetails_ValidId_ReturnsInvoice()
    {
        // Arrange
        var service = new BillingService();
        
        // Act
        var result = await service.GetInvoiceDetailsAsync(101);
        
        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(101, result.Id);
    }
}
```

## 📖 Documentation API Complète

Pour une documentation complète avec tous les exemples de requêtes/réponses, consultez:
- [GUIDE-TESTS.md](../../documentation/GUIDE-TESTS.md)
- [tests-api.json](../../tests-api.json)

## 📞 Support

Pour toute question ou problème:
1. Vérifier les logs: `dotnet run`
2. Vérifier le WSDL: `http://localhost:8085/billing?wsdl`
3. Consulter la documentation du projet

## 📄 Licence

Projet académique - Usage pédagogique uniquement.

## 👤 Auteur

MAHAMADOU AMADOU HABOU
