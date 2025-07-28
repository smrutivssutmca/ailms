from sqlalchemy import Column, Integer, String, Float, ForeignKey
from services.db import Base
from sqlalchemy.schema import UniqueConstraint


class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String)
    explanation = Column(String)
    question = Column(String)
    answer = Column(String)
    difficulty = Column(String)
    student_level = Column(String)
    question_type = Column(String)
    question_complexity = Column(Float)
    prerequisites = Column(String)
    estimated_time = Column(Float)
    subject = Column(String)
    grade = Column(Integer)


class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)


class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)


class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))

    __table_args__ = (
        UniqueConstraint("name", "subject_id", name="uq_topic_name_subject"),
    )


class Difficulty(Base):
    __tablename__ = "difficulties"
    id = Column(Integer, primary_key=True, index=True)
    level = Column(String, unique=True, index=True)


class UpdatedQuestion(Base):
    __tablename__ = "updated_questions"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    difficulty_id = Column(Integer, ForeignKey("difficulties.id"))
    explanation = Column(String)
    question = Column(String)
    answer = Column(String)
    student_level = Column(String)
    question_type = Column(String)
    question_complexity = Column(Float)
    prerequisites = Column(String)
    estimated_time = Column(Float)
    grade_id = Column(Integer, ForeignKey("grades.id"))
    created_at = Column(String)
    discrimintion_value = Column(Float)
    guessing_value = Column(Float)

    __table_args__ = (
        UniqueConstraint(
            "question", "topic_id", "subject_id", name="uq_question_topic_subject"
        ),
    )
