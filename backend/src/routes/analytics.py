from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Optional
from datetime import datetime
from ..db import models
from .. import auth
from ..db.database import get_db
from ..db import schemas

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])


@router.post("/views", response_model=schemas.PageView)
def create_page_view(
        view: schemas.PageViewCreate,
        db: Session = Depends(get_db)
):
    db_view = models.PageView(**view.model_dump())
    db.add(db_view)
    db.commit()
    db.refresh(db_view)
    return db_view


@router.get("/views", response_model=List[Dict])
def get_page_views(
        project_id: Optional[int] = None,
        from_date: datetime = Query(default=None),
        to_date: datetime = Query(default=None),
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_active_admin)
):
    query = db.query(
        func.date(models.PageView.timestamp).label('date'),
        func.count(models.PageView.id).label('count')
    )

    if project_id:
        query = query.filter(models.PageView.project_id == project_id)
    if from_date:
        query = query.filter(models.PageView.timestamp >= from_date)
    if to_date:
        query = query.filter(models.PageView.timestamp <= to_date)

    results = query.group_by('date').order_by('date').all()
    return [{"date": str(r.date), "count": r.count} for r in results]


@router.get("/tags/popularity", response_model=Dict[str, int])
def get_tag_popularity(
        from_date: datetime = Query(default=None),
        to_date: datetime = Query(default=None),
        db: Session = Depends(get_db),
        current_user: models.User = Depends(auth.get_current_active_admin)
):
    # Get all projects viewed in the date range
    project_query = db.query(models.PageView.project_id).distinct()
    if from_date:
        project_query = project_query.filter(models.PageView.timestamp >= from_date)
    if to_date:
        project_query = project_query.filter(models.PageView.timestamp <= to_date)

    viewed_project_ids = [p[0] for p in project_query.all()]

    # Get all tags from viewed projects
    projects = db.query(models.Project).filter(models.Project.id.in_(viewed_project_ids)).all()
    tag_counts = {}

    for project in projects:
        for tag in project.tech_tags:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1

    return tag_counts
