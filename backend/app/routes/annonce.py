from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.annonce import Annonce

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/annonces", tags=["annonce"])
def create_annonce(titre: str, description: str, prix: int, localisation: str, db: Session = Depends(get_db)):
    annonce = Annonce(titre=titre, description=description, prix=prix, localisation=localisation)
    db.add(annonce)
    db.commit()
    db.refresh(annonce)
    return annonce

@router.get("/annonces", tags=["annonce"])
def read_annonces(db: Session = Depends(get_db)):
    return db.query(Annonce).all()
