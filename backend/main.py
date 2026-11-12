
from fastapi import FastAPI

app = FastAPI(
    title="CheckMyHeart API",
    description="API d'analyse de signaux ECG",
    version="0.1.0"
)


@app.get("/")
def home():
    return {
        "message": "Bienvenue sur l'API CheckMyHeart"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }
