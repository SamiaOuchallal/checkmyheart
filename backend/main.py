
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CheckMyHeart API",
    description="API d'analyse de signaux ECG",
    version="0.1.0"
)

# Autoriser notre frontend React à communiquer avec l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
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


@app.get("/api/status")
def api_status():
    return {
        "status": "online",
        "service": "CheckMyHeart API"
    }
