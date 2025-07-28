from pydantic import BaseModel, EmailStr
from typing import Optional


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str


class UserResultOut(BaseModel):
    id: int
    user_id: int
    grade_id: int
    subject_id: int
    subject_name: str
    score: float

    class Config:
        orm_mode = True


class UserQuestionAttendedOut(BaseModel):
    id: int
    user_id: int
    question_id: int
    is_correct: int
    score: float
    grade_id: int
    subject_id: int
    subject_name: Optional[str] = None
    created_at: str

    class Config:
        orm_mode = True
