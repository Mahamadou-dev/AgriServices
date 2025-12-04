# File: services/prediction-service/routers/predictions.py

from fastapi import APIRouter

# Créer un routeur
router = APIRouter()

@router.get("/")
def get_all_predictions():
    """Retourne une liste simulée des prédictions passées."""
    return [
        {"crop_id": 1, "predicted_yield": 1500, "date": "2025-01-01"},
        {"crop_id": 2, "predicted_yield": 800, "date": "2025-01-05"},
    ]

@router.post("/predict")
def make_prediction(data: dict):
    """Effectue une nouvelle prédiction (logique ML à implémenter)."""
    return {"status": "Prediction received", "data": data, "result": "Simulated Yield: 1250 kg/ha"}