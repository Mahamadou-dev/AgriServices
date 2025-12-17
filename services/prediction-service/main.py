from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Prediction Service")

class HelloResponse(BaseModel):
    service: str
    message: str
    status: str

@app.get("/")
async def root():
    return {"message": "Prediction Service API"}

@app.get("/api/predictions/hello", response_model=HelloResponse)
async def hello():
    return {
        "service": "Prediction Service",
        "message":  "Hello World from Prediction Service! ",
        "status": "running"
    }

@app. get("/health")
async def health():
    return {"status": "ok"}
