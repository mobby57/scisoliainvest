"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field


class AnnonceCreate(BaseModel):
    """Schema for creating a new annonce"""
    titre: str = Field(..., min_length=1, max_length=200, description="Titre de l'annonce")
    description: str = Field(..., min_length=1, description="Description de l'annonce")
    prix: int = Field(..., gt=0, description="Prix en euros")
    localisation: str = Field(..., min_length=1, max_length=200, description="Localisation")


class AnnonceResponse(BaseModel):
    """Schema for annonce response"""
    id: int
    titre: str
    description: str
    prix: int
    localisation: str
    
    class Config:
        from_attributes = True
