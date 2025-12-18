# File: services/prediction-service/routers/predictions.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import random

router = APIRouter()

class CropData(BaseModel):
    crop_type: str = Field(..., description="Type of crop (e.g., wheat, corn, rice)")
    area_hectares: float = Field(..., gt=0, description="Area in hectares")
    soil_type: str = Field(..., description="Type of soil")
    rainfall_mm: Optional[float] = Field(None, description="Average rainfall in mm")
    temperature_c: Optional[float] = Field(None, description="Average temperature in Celsius")
    fertilizer_used: Optional[bool] = Field(True, description="Whether fertilizer was used")

class PredictionResponse(BaseModel):
    crop_type: str
    predicted_yield_kg: float
    confidence_level: float
    recommendation: str
    timestamp: datetime

class RiskAssessment(BaseModel):
    crop_type: str
    risk_level: str
    risk_factors: List[str]
    mitigation_strategies: List[str]

@router.get("/", summary="Get prediction service info")
def get_prediction_info():
    """Returns information about the prediction service."""
    return {
        "service": "Prediction Service",
        "version": "1.0.0",
        "description": "Agricultural yield prediction and risk assessment API",
        "endpoints": {
            "/yield": "POST - Make yield prediction",
            "/risk": "POST - Assess crop risks",
            "/history": "GET - View prediction history"
        }
    }

@router.post("/yield", response_model=PredictionResponse, summary="Predict crop yield")
def predict_yield(crop_data: CropData):
    """
    Predict crop yield based on input parameters.
    This is a simplified model - in production, this would use ML algorithms.
    """
    # Simple yield calculation (placeholder for actual ML model)
    base_yield = {
        "wheat": 3500,
        "corn": 5000,
        "rice": 4000,
        "soybean": 2500,
        "cotton": 1800
    }.get(crop_data.crop_type.lower(), 3000)
    
    # Adjust for factors
    yield_factor = 1.0
    
    if crop_data.fertilizer_used:
        yield_factor *= 1.2
    
    if crop_data.rainfall_mm:
        if 400 <= crop_data.rainfall_mm <= 800:
            yield_factor *= 1.1
        elif crop_data.rainfall_mm < 300:
            yield_factor *= 0.7
    
    if crop_data.temperature_c:
        if 20 <= crop_data.temperature_c <= 30:
            yield_factor *= 1.05
        elif crop_data.temperature_c > 35:
            yield_factor *= 0.85
    
    predicted_yield = base_yield * yield_factor * crop_data.area_hectares
    confidence = min(0.95, 0.65 + (random.random() * 0.3))
    
    # Generate recommendation
    if yield_factor > 1.15:
        recommendation = "Excellent conditions. Continue current practices."
    elif yield_factor > 1.0:
        recommendation = "Good conditions. Consider optimizing irrigation."
    else:
        recommendation = "Suboptimal conditions. Review soil health and water management."
    
    return PredictionResponse(
        crop_type=crop_data.crop_type,
        predicted_yield_kg=round(predicted_yield, 2),
        confidence_level=round(confidence, 2),
        recommendation=recommendation,
        timestamp=datetime.now()
    )

@router.post("/risk", response_model=RiskAssessment, summary="Assess crop risks")
def assess_risk(crop_data: CropData):
    """Assess potential risks for the crop based on conditions."""
    risk_factors = []
    mitigation_strategies = []
    
    # Evaluate risk factors
    if crop_data.rainfall_mm and crop_data.rainfall_mm < 300:
        risk_factors.append("Low rainfall - drought risk")
        mitigation_strategies.append("Implement drip irrigation system")
    
    if crop_data.temperature_c and crop_data.temperature_c > 35:
        risk_factors.append("High temperature stress")
        mitigation_strategies.append("Use shade nets or choose heat-resistant varieties")
    
    if not crop_data.fertilizer_used:
        risk_factors.append("No fertilizer - nutrient deficiency risk")
        mitigation_strategies.append("Apply organic or chemical fertilizers based on soil test")
    
    # Determine risk level
    if len(risk_factors) == 0:
        risk_level = "LOW"
    elif len(risk_factors) <= 1:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"
    
    if not risk_factors:
        risk_factors.append("No significant risks detected")
        mitigation_strategies.append("Continue monitoring and maintain current practices")
    
    return RiskAssessment(
        crop_type=crop_data.crop_type,
        risk_level=risk_level,
        risk_factors=risk_factors,
        mitigation_strategies=mitigation_strategies
    )

@router.get("/history", summary="Get prediction history")
def get_prediction_history(limit: int = 10):
    """Returns simulated prediction history."""
    # In production, this would fetch from a database
    history = []
    crops = ["wheat", "corn", "rice", "soybean"]
    
    for i in range(min(limit, 20)):
        history.append({
            "id": i + 1,
            "crop_type": random.choice(crops),
            "predicted_yield_kg": round(random.uniform(2000, 6000), 2),
            "actual_yield_kg": round(random.uniform(1800, 5800), 2),
            "date": f"2025-01-{(i % 28) + 1:02d}"
        })
    
    return {"total": len(history), "predictions": history}
