# 🔮 Prediction Service

Service REST FastAPI pour les prédictions agricoles et l'évaluation des risques.

## 📋 Description

Le Prediction Service fournit des capacités d'analyse prédictive pour l'agriculture, incluant :
- Prédiction du rendement des cultures
- Évaluation des risques agricoles
- Recommandations basées sur les conditions

## 🛠️ Technologies

- **Python** 3.12
- **FastAPI** - Framework web moderne et rapide
- **Pydantic** - Validation des données
- **Uvicorn** - Serveur ASGI
- **PyJWT** - Gestion des tokens JWT

## 📦 Installation

```bash
# Créer un environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Copier le fichier d'environnement
cp .env.example .env
```

## 🚀 Démarrage

```bash
# Mode développement (avec rechargement auto)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Mode production
python main.py
```

Le service démarre sur le port **8000** par défaut.

## 📚 Documentation Interactive

Une fois le service démarré, accédez à :

- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

## 🔗 Endpoints API

### Health Check
```
GET /health
```
Vérifie l'état du service.

### Predictions

#### Informations du service
```
GET /predictions/
```

#### Prédire le rendement d'une culture
```
POST /predictions/predict

Body:
{
  "crop_type": "wheat",
  "area_hectares": 10.5,
  "soil_type": "loamy",
  "rainfall_mm": 500,
  "temperature_c": 25,
  "fertilizer_used": true
}

Response:
{
  "crop_type": "wheat",
  "predicted_yield_kg": 42000.0,
  "confidence_level": 0.87,
  "recommendation": "Good conditions. Consider optimizing irrigation.",
  "timestamp": "2025-12-17T08:00:00"
}
```

#### Évaluation des risques
```
POST /predictions/risk-assessment

Body:
{
  "crop_type": "corn",
  "area_hectares": 5,
  "soil_type": "sandy",
  "rainfall_mm": 250,
  "temperature_c": 38,
  "fertilizer_used": false
}

Response:
{
  "crop_type": "corn",
  "risk_level": "HIGH",
  "risk_factors": [
    "Low rainfall - drought risk",
    "High temperature stress",
    "No fertilizer - nutrient deficiency risk"
  ],
  "mitigation_strategies": [
    "Implement drip irrigation system",
    "Use shade nets or choose heat-resistant varieties",
    "Apply organic or chemical fertilizers based on soil test"
  ]
}
```

#### Historique des prédictions
```
GET /predictions/history?limit=20
```

## 📊 Modèles de Données

### CropData (Entrée)
```python
{
  "crop_type": str,          # Type de culture (wheat, corn, rice, etc.)
  "area_hectares": float,    # Surface en hectares (> 0)
  "soil_type": str,          # Type de sol
  "rainfall_mm": float,      # Précipitations moyennes (optionnel)
  "temperature_c": float,    # Température moyenne (optionnel)
  "fertilizer_used": bool    # Utilisation d'engrais (optionnel, défaut: true)
}
```

### PredictionResponse (Sortie)
```python
{
  "crop_type": str,
  "predicted_yield_kg": float,
  "confidence_level": float,    # 0.0 à 1.0
  "recommendation": str,
  "timestamp": datetime
}
```

## 🤖 Algorithme de Prédiction

**Note** : L'implémentation actuelle utilise un modèle simplifié. Pour la production, il faudrait :

1. **Collecte de données** : Historique réel des rendements
2. **Entraînement ML** : Utiliser scikit-learn, TensorFlow ou PyTorch
3. **Features** : Ajouter plus de paramètres (humidité, pH du sol, etc.)
4. **Validation** : Cross-validation et tests sur données réelles

### Modèle Actuel (Simplifié)
```python
yield = base_yield * yield_factor * area
où yield_factor dépend de :
- Utilisation d'engrais (+20%)
- Précipitations optimales (400-800mm) (+10%)
- Température optimale (20-30°C) (+5%)
```

## 🐳 Docker

### Build
```bash
docker build -f ../../docker/Dockerfiles/prediction-service.Dockerfile -t prediction-service .
```

### Run
```bash
docker run -p 8000:8000 \
  -e JWT_SECRET=<your_secret> \
  prediction-service
```

## ⚙️ Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| PORT | Port du serveur | 8000 |
| JWT_SECRET | Clé secrète JWT | (voir .env.example) |
| ENVIRONMENT | Environnement | production |

## 🧪 Tests

```bash
# Tests unitaires
pytest

# Tests avec coverage
pytest --cov=.

# À implémenter
```

## 📈 Améliorations Futures

1. **Intégration ML réelle**
   - Modèles entraînés sur données historiques
   - Random Forest, XGBoost ou réseaux de neurones

2. **Sources de données externes**
   - API météo en temps réel
   - Données satellitaires (NDVI, SAVI)
   - Prix du marché

3. **Base de données**
   - Stockage persistant des prédictions
   - Analyse des tendances
   - Feedback loop pour améliorer le modèle

4. **Features avancées**
   - Détection de maladies par image
   - Optimisation de l'irrigation
   - Calendrier de plantation optimal

## 🔒 Sécurité

Pour les endpoints protégés (à implémenter) :
```python
from fastapi import Depends
from auth.jwt import verify_token

@router.post("/predict", dependencies=[Depends(verify_token)])
```

## 📝 Logs

FastAPI log automatiquement :
- Requêtes HTTP (méthode, path, status)
- Erreurs de validation
- Exceptions serveur

## 🔧 Dépannage

### Erreur Import
```bash
# Vérifier que toutes les dépendances sont installées
pip install -r requirements.txt
```

### Port déjà utilisé
```bash
# Changer le port dans .env ou utiliser :
uvicorn main:app --port 8001
```

## 📄 Licence

Projet académique - Usage pédagogique uniquement.

## 👤 Auteur

MAHAMADOU AMADOU HABOU
