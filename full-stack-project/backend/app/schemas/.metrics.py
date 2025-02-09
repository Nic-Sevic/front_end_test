from pydantic import BaseModel, Field, validator
from typing import Dict, List, Optional
from datetime import date
from enum import Enum

class MetricType(str, Enum):
    PERFORMANCE_REVIEW = "performance_review"
    GOAL_COMPLETION = "goal_completion"
    SKILL_ASSESSMENT = "skill_assessment"
    PROJECT_EVALUATION = "project_evaluation"

class SkillAssessmentBase(BaseModel):
    skill_name: str
    proficiency_level: int = Field(..., ge=1, le=5)
    last_demonstrated: date
    notes: Optional[str] = None

    @validator('proficiency_level')
    def validate_proficiency(cls, v):
        if not 1 <= v <= 5:
            raise ValueError('Proficiency level must be between 1 and 5')
        return v

class SkillAssessmentCreate(SkillAssessmentBase):
    pass

class SkillAssessment(SkillAssessmentBase):
    id: int
    metric_id: int

    class Config:
        from_attributes = True

class PerformanceMetricBase(BaseModel):
    metric_type: MetricType
    evaluation_date: date = Field(default_factory=date.today)
    overall_score: float = Field(..., ge=0, le=100)
    goals_achieved: int = Field(..., ge=0)
    detailed_scores: Dict[str, float] = Field(default_factory=dict)
    review_notes: Optional[str] = None
    development_plan: Optional[str] = None
    strengths: Optional[str] = None
    areas_for_improvement: Optional[str] = None

    @validator('overall_score')
    def validate_score(cls, v):
        if not 0 <= v <= 100:
            raise ValueError('Overall score must be between 0 and 100')
        return v

class PerformanceMetricCreate(PerformanceMetricBase):
    employee_id: int
    evaluator_id: int
    skill_assessments: Optional[List[SkillAssessmentCreate]] = None

class PerformanceMetric(PerformanceMetricBase):
    id: int
    employee_id: int
    evaluator_id: int
    skill_assessments: List[SkillAssessment] = []

    class Config:
        from_attributes = True

class MetricsSummary(BaseModel):
    average_score: float
    total_goals_achieved: int
    assessment_count: int
    trend: List[float]
    top_skills: List[str]
    improvement_areas: List[str]
