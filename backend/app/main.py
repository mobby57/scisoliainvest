from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from app.routes import health, annonce
from app.auth import authenticate_user, create_access_token, get_current_user

app = FastAPI(
    title="Hub Immobilier Digital API",
    description="API SaaS pour les opérations immobilières digitales.",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(annonce.router)

@app.post("/token", tags=["auth"])
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Identifiants incorrects")
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/secure-data", tags=["auth"])
def secure_data(user=Depends(get_current_user)):
    return {"message": f"Bonjour {user['username']} vous accédez à une ressource protégée."}
