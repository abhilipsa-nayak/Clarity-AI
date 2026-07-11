import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Database URL points to local sqlite file
DATABASE_URL = "sqlite:///./clarity.db"

# Create Sqlite engine
# connect_args={"check_same_thread": False} is required for SQLite to support multi-threading in FastAPI
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Session factory for db queries
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base model
Base = declarative_base()

# Dependency helper for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
