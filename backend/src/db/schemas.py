from pydantic import BaseModel, EmailStr, HttpUrl, ConfigDict, field_validator, Field
from typing import List, Optional
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class User(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# comment schemas
class CommentBase(BaseModel):
    author_name: str
    content: str


class CommentCreate(CommentBase):
    project_id: int | None = None
    pass


class Comment(CommentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Project schemas
def to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(w.capitalize() for w in parts[1:])


class ProjectBase(BaseModel):
    title: str
    short_desc: str
    detail_desc: Optional[str] = None  # ← allow None
    tech_tags: List[str] = []
    thumbnail: Optional[HttpUrl] = None
    images: Optional[List[HttpUrl]] = None
    demo_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    model_config = ConfigDict(
        alias_generator=to_camel,  # so you get "shortDesc" in JSON
        populate_by_name=True,  # allow setting via `short_desc`
        from_attributes=True,  # ← this replaces `orm_mode=True`
    )


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class Project(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    view_count: int
    comments: List[Comment] = Field(default_factory=list)
    model_config = ConfigDict(
        **ProjectBase.model_config,
    )

    @field_validator("comments", mode="before")
    def ensure_comments_list(cls, v):
        # if the ORM attr is None, turn it into []
        return [] if v is None else v


# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


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
