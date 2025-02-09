from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta
from sqlalchemy import func

from ..database import get_db
from ..models.metrics import PerformanceMetric, SkillAssessment, MetricType
from ..schemas.metrics import (
    PerformanceMetricCreate,
    PerformanceMetric as PerformanceMetricSchema,
    MetricsSummary
)

router = APIRouter(prefix="/metrics", tags=["metrics"])

@router.post("/", response_model=PerformanceMetricSchema)
def create_metric(metric: PerformanceMetricCreate, db: Session = Depends(get_db)):
    """Create a new performance metric with optional skill assessments."""
    # Create the main metric
    db_metric = PerformanceMetric(
        **metric.model_dump(exclude={'skill_assessments'})
    )
    db.add(db_metric)
    db.flush()  # Get the ID without committing

    # Add skill assessments if provided
    if metric.skill_assessments:
        for skill in metric.skill_assessments:
            db_skill = SkillAssessment(
                metric_id=db_metric.id,
                **skill.model_dump()
            )
            db.add(db_skill)

    db.commit()
    db.refresh(db_metric)
    return db_metric

@router.get("/employee/{employee_id}", response_model=List[PerformanceMetricSchema])
def get_employee_metrics(
    employee_id: int,
    start_date: date = None,
    end_date: date = None,
    metric_type: MetricType = None,
    db: Session = Depends(get_db)
):
    """Get metrics for a specific employee with optional filters."""
    query = db.query(PerformanceMetric).filter(
        PerformanceMetric.employee_id == employee_id
    )
    
    if start_date:
        query = query.filter(PerformanceMetric.evaluation_date >= start_date)
    if end_date:
        query = query.filter(PerformanceMetric.evaluation_date <= end_date)
    if metric_type:
        query = query.filter(PerformanceMetric.metric_type == metric_type)
        
    return query.order_by(PerformanceMetric.evaluation_date.desc()).all()

@router.get("/employee/{employee_id}/summary", response_model=MetricsSummary)
def get_metrics_summary(
    employee_id: int,
    lookback_days: int = 365,
    db: Session = Depends(get_db)
):
    """Get a summary of an employee's performance metrics."""
    start_date = date.today() - timedelta(days=lookback_days)
    
    # Get all metrics within the time period
    metrics = db.query(PerformanceMetric).filter(
        PerformanceMetric.employee_id == employee_id,
        PerformanceMetric.evaluation_date >= start_date
    ).all()
    
    if not metrics:
        raise HTTPException(status_code=404, detail="No metrics found for this period")
    
    # Calculate summary statistics
    scores = [m.overall_score for m in metrics]
    trend = calculate_trend(scores)
    
    # Get top skills and improvement areas from the latest assessment
    latest_metric = max(metrics, key=lambda m: m.evaluation_date)
    
    return MetricsSummary(
        average_score=sum(scores) / len(scores),
        total_goals_achieved=sum(m.goals_achieved for m in metrics),
        assessment_count=len(metrics),
        trend=trend,
        top_skills=parse_strengths(latest_metric.strengths),
        improvement_areas=parse_improvements(latest_metric.areas_for_improvement)
    )

def calculate_trend(scores: List[float]) -> List[float]:
    """Calculate a simple moving average trend."""
    window_size = min(3, len(scores))
    trends = []
    for i in range(len(scores) - window_size + 1):
        window = scores[i:i + window_size]
        trends.append(sum(window) / window_size)
    return trends

def parse_strengths(strengths_text: str) -> List[str]:
    """Parse strengths text into a list of top skills."""
    if not strengths_text:
        return []
    # Simple parsing - split by commas or newlines
    return [s.strip() for s in strengths_text.replace('\n', ',').split(',') if s.strip()]

def parse_improvements(improvements_text: str) -> List[str]:
    """Parse improvements text into a list of areas."""
    if not improvements_text:
        return []
    return [s.strip() for s in improvements_text.replace('\n', ',').split(',') if s.strip()]
