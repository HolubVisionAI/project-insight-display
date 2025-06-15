from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..db import models, schemas
from ..db.database import get_db
from .. import auth

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])


@router.get("/", response_model=List[schemas.Project])
def list_projects(
        tag: Optional[str] = None,
        limit: int = Query(10, ge=1, le=100),
        offset: int = Query(0, ge=0),
        db: Session = Depends(get_db)
):
    query = db.query(models.Project)
    if tag:
        query = query.filter(models.Project.tech_tags.contains([tag]))
    return query.offset(offset).limit(limit).all()


@router.get("/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project


@router.post("/", response_model=schemas.Project, status_code=status.HTTP_201_CREATED)
def create_project(
        project: schemas.ProjectCreate,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_active_admin)
):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


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

    for key, value in project.model_dump(exclude_unset=True).items():
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
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    db.delete(db_project)
    db.commit()
    return None
