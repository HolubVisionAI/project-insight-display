from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from src.db.models import Base
from src.db.database import engine
from src.routes import auth, projects, analytics
from src.routes import chat

# Create database tables
Base.metadata.create_all(bind=engine)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Portfolio Showcase API",
    description="Backend API for Portfolio Showcase application",
    version="1.0.0"
)

# during dev you can allow *; in prod lock this down
origins = [
    "http://localhost:8080",
    "https://project-insight-display.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(analytics.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {"message": "Welcome to Portfolio Showcase API"}
