from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from .employee import Employee
from .metrics import PerformanceMetric, SkillAssessment, MetricType

# This makes these models available when someone imports from models
__all__ = ['Employee', 'PerformanceMetric', 'SkillAssessment', 'MetricType']
