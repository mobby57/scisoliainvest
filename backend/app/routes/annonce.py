from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.annonce import Annonce
from app.schemas import AnnonceCreate, AnnonceResponse
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/annonces", response_model=AnnonceResponse, tags=["annonce"])
def create_annonce(annonce_data: AnnonceCreate, db: Session = Depends(get_db)):
    """Create a new property listing"""
    annonce = Annonce(
        titre=annonce_data.titre,
        description=annonce_data.description,
        prix=annonce_data.prix,
        localisation=annonce_data.localisation
    )
    db.add(annonce)
    db.commit()
    db.refresh(annonce)
    return annonce

@router.get("/annonces", response_model=List[AnnonceResponse], tags=["annonce"])
def read_annonces(db: Session = Depends(get_db)):
    """Get all property listings"""
    return db.query(Annonce).all()
