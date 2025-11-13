from sqlalchemy import Column, Integer, String
from app.db import Base

class Annonce(Base):
    __tablename__ = "annonces"
    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, index=True)
    description = Column(String)
    prix = Column(Integer)
    localisation = Column(String)
