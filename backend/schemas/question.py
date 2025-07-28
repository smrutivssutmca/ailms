from pydantic import BaseModel
from typing import Optional, List


class QuestionOut(BaseModel):
    id: int
    topic: str
    explanation: str
    question: str
    answer: str
    difficulty: str
    student_level: str
    question_type: str
    question_complexity: float
    prerequisites: Optional[str]
    estimated_time: float
    subject: str
    grade: int


class SubjectBase(BaseModel):
    name: str


class SubjectCreate(SubjectBase):
    pass


class SubjectOut(SubjectBase):
    id: int

    class Config:
        orm_mode = True


class TopicBase(BaseModel):
    name: str
    subject_id: int


class TopicCreate(TopicBase):
    pass


class TopicOut(TopicBase):
    id: int
    name: str
    subject_id: int

    class Config:
        orm_mode = True


class GradeBase(BaseModel):
    name: str


class GradeCreate(GradeBase):
    pass


class GradeOut(GradeBase):
    id: int
    name: str

    class Config:
        orm_mode = True


class DifficultyBase(BaseModel):
    level: str


class DifficultyCreate(DifficultyBase):
    pass


class DifficultyOut(DifficultyBase):
    id: int
    level: str

    class Config:
        orm_mode = True


class UpdatedQuestionBase(BaseModel):
    id: Optional[int] = None
    topic_id: int
    subject_id: int
    difficulty_id: int
    explanation: Optional[str] = None
    question: str
    answer: str
    student_level: Optional[str] = None
    question_type: Optional[str] = None
    question_complexity: Optional[float] = None
    prerequisites: Optional[str] = None
    estimated_time: Optional[float] = None
    grade: Optional[int] = None
    created_at: Optional[str] = None


class UpdatedQuestionCreate(UpdatedQuestionBase):
    pass


class UpdatedQuestionOut(UpdatedQuestionBase):
    id: int

    class Config:
        orm_mode = True
