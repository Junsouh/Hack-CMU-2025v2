from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./inventory.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    quantity = Column(Float, default=1)
    unit = Column(String, default="pcs")
    calories_per_unit = Column(Float, default=0.0)

def init_db():
    Base.metadata.create_all(bind=engine)
