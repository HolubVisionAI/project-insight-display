from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from .db.database import Base
from auth import get_password_hash

load_dotenv()

def init_db():
    # Get database URL from environment variable
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    # Handle PostgreSQL URL format from Render
    if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if admin user exists
        from backend.src.database.models import User
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        
        if not admin:
            # Create admin user
            admin_user = User(
                email="admin@example.com",
                password_hash=get_password_hash("admin123"),  # Change this in production!
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists.")
            
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 