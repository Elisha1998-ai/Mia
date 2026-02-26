import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from models import Base

load_dotenv()

# Use PostgreSQL database
DATABASE_URL = os.getenv("DATABASE_URL")

# Handle different database types
if "postgresql" in DATABASE_URL:
    # PostgreSQL configuration
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
else:
    # Fallback to SQLite for local development
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initializes the database, creating tables if they don't exist."""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency for getting a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
