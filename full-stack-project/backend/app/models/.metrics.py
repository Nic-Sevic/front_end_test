from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date, Enum, JSON
from sqlalchemy.orm import relationship
import enum
from datetime import date
from ..database import Base

class MetricType(enum.Enum):
    PERFORMANCE_REVIEW = "performance_review"
    GOAL_COMPLETION = "goal_completion"
    SKILL_ASSESSMENT = "skill_assessment"
    PROJECT_EVALUATION = "project_evaluation"

class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"))
    metric_type = Column(Enum(MetricType))
    evaluation_date = Column(Date, default=date.today)
    evaluator_id = Column(Integer, ForeignKey("employees.id"))
    
    # Core metrics
    overall_score = Column(Float)
    goals_achieved = Column(Integer)
    
    # Detailed metrics stored as JSON
    detailed_scores = Column(JSON, default={})
    
    # Text fields
    review_notes = Column(String)
    development_plan = Column(String)
    strengths = Column(String)
    areas_for_improvement = Column(String)

    # Relationships
    employee = relationship("Employee", foreign_keys=[employee_id], back_populates="performance_metrics")
    evaluator = relationship("Employee", foreign_keys=[evaluator_id])

class SkillAssessment(Base):
    __tablename__ = "skill_assessments"

    id = Column(Integer, primary_key=True, index=True)
    metric_id = Column(Integer, ForeignKey("performance_metrics.id", ondelete="CASCADE"))
    skill_name = Column(String)
    proficiency_level = Column(Integer)  # 1-5 scale
    last_demonstrated = Column(Date)
    notes = Column(String)
