from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Project schemas
class ProjectBase(BaseModel):
    title: str
    short_desc: str
    full_desc: str
    tech_tags: List[str]
    thumbnail: str
    demo_url: Optional[HttpUrl] = None
    repo_url: HttpUrl

class ProjectCreate(ProjectBase):
    images: Optional[List[str]] = []

class ProjectUpdate(ProjectBase):
    images: Optional[List[str]] = None

class Project(ProjectBase):
    id: int
    images: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Chat schemas
class ChatMessage(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    reply: str

# Analytics schemas
class PageViewCreate(BaseModel):
    project_id: int
    path: str
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

class PageView(PageViewCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True 