from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional, Dict, Any
from ..db import models, schemas
from ..db.database import get_db
from .. import auth

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


@router.get("/", response_model=List[schemas.Project])
def list_projects(
        tag: Optional[str] = None,
        limit: int = Query(10, ge=1, le=100),
        offset: int = Query(0, ge=0),
        db: Session = Depends(get_db),
):
    # 1) Build the base Project query
    proj_q = db.query(models.Project)
    if tag:
        proj_q = proj_q.filter(models.Project.tech_tags.contains([tag]))

    # 2) Build a subquery that counts comments per project_id
    comment_counts = (
        db.query(
            models.Comment.project_id.label("pid"),
            func.count(models.Comment.id).label("cnt")
        )
        .group_by(models.Comment.project_id)
        .subquery()
    )

    # 3) Join Projects with that count (outer so 0 shows up when no comments)
    rows = (
        db.query(
            models.Project,
            comment_counts.c.cnt
        )
        .outerjoin(comment_counts, models.Project.id == comment_counts.c.pid)
        .offset(offset)
        .limit(limit)
        .all()
    )

    # 4) Build a list of dicts, injecting `comments = cnt or 0`
    result: List[dict] = []
    for project, cnt in rows:
        # take all the ORM fields
        proj_data = {
            "id": project.id,
            "title": project.title,
            "short_desc": project.short_desc,
            "detail_desc": project.detail_desc,
            "thumbnail": project.thumbnail,
            "demo_url": project.demo_url,
            "github_url": project.github_url,
            "tech_tags": project.tech_tags,
            "created_at": project.created_at,
            "updated_at": project.updated_at,
            "view_count": project.view_count,
            # **here** we override / supply the comment count:
            "comments": int(cnt or 0),
        }
        result.append(proj_data)

    return result


@router.get("/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = (
        db.query(models.Project)
        .filter(models.Project.id == project_id)
        .first()
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    cnt = (
              db.query(func.count(models.Comment.id))
              .filter(models.Comment.project_id == project_id)
              .scalar()
          ) or 0
    project.comments = cnt
    # ─── increment view count ────────────────────────────────────
    project.view_count = (project.view_count or 0) + 1
    db.commit()
    db.refresh(project)
    # ──────────────────────────────────────────────────────────────

    return project


@router.post("/", response_model=schemas.Project, status_code=status.HTTP_201_CREATED)
def create_project(
        project: schemas.ProjectCreate,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_active_admin),
):
    # 1) Dump to a JSON-compatible dict (Url → str, lists stay lists, etc.)
    proj_data: Dict[str, Any] = project.model_dump(mode="json")
    print(proj_data)

    # 2) Create the SQLAlchemy model with only DB-friendly types
    db_project = models.Project(
        title=project.title,
        short_desc=project.short_desc,
        detail_desc=project.detail_desc,
        thumbnail=str(project.thumbnail),
        demo_url=str(project.demo_url),
        github_url=str(project.github_url),
        tech_tags=project.tech_tags,
    )
    # db_project = models.Project(**filtered_data)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    data = {
        "id": db_project.id,
        "title": db_project.title,
        "short_desc": db_project.short_desc,
        "detail_desc": db_project.detail_desc,
        "tech_tags": db_project.tech_tags,
        "thumbnail": db_project.thumbnail,
        "images": db_project.images,
        "demo_url": db_project.demo_url,
        "github_url": db_project.github_url,
        "created_at": db_project.created_at,
        "updated_at": db_project.updated_at,
    }
    # Pydantic will treat this as a mapping and use your alias_generator
    return data


@router.put("/{project_id}", response_model=schemas.Project)
def update_project(
        project_id: int,
        project: schemas.ProjectUpdate,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_active_admin)
):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    # dump as JSON‐compatible primitives (so Url → str)
    updates = project.model_dump(exclude_none=True, mode="json")

    for key, value in updates.items():
        setattr(db_project, key, value)

    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
        project_id: int,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_active_admin)
):
    db_project = (db.query(models.Project)
                  .options(selectinload(models.Project.comments))
                  .filter(models.Project.id == project_id)
                  .first())
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    db.delete(db_project)
    db.commit()
    return None


@router.post(
    "/{project_id}/comments",
    response_model=schemas.Comment,
    status_code=status.HTTP_201_CREATED,
)
def add_comment(
        project_id: int,
        comment_in: schemas.CommentCreate,
        db: Session = Depends(get_db),
):
    proj = db.query(models.Project).filter_by(id=project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    # exclude project_id so we don’t duplicate it
    data = comment_in.model_dump(exclude={"project_id"})
    comment = models.Comment(**data, project_id=project_id)

    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.get("/{project_id}/comments", response_model=List[schemas.Comment])
def list_comments(project_id: int, db: Session = Depends(get_db)):
    comments = (
        db.query(models.Comment)
        .filter_by(project_id=project_id)
        .order_by(models.Comment.created_at.desc())
        .all()
    )
    if not comments:
        return []
    return comments
