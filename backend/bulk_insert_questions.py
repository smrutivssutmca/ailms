import os
import csv
import re
from sqlalchemy.orm import Session
from services.db import SessionLocal
from models.question import Question

# Folder where your CSV files are located
CSV_FOLDER = "csvdata"


def safe_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def safe_int(value):
    try:
        if value is None:
            return 0
        match = re.search(r"\d+", str(value))
        return int(match.group()) if match else 0
    except Exception:
        return 0


def insert_questions_from_folder(folder_path: str):
    db: Session = SessionLocal()

    try:
        question_objects = []

        for filename in os.listdir(folder_path):
            if filename.endswith(".csv"):
                file_path = os.path.join(folder_path, filename)
                print(f"📥 Reading: {file_path}")

                with open(file_path, newline="", encoding="utf-8") as csvfile:
                    reader = csv.DictReader(csvfile)
                    for raw_row in reader:
                        # Normalize keys to lowercase
                        row = {k.lower(): v for k, v in raw_row.items()}

                        question = Question(
                            topic=row.get("topic", ""),
                            explanation=row.get("explanation", ""),
                            question=row.get("question", ""),
                            answer=row.get("answer", ""),
                            difficulty=row.get("difficulty", ""),
                            student_level=row.get("studentlevel", ""),
                            question_type=row.get("questiontype", ""),
                            question_complexity=safe_float(
                                row.get("questioncomplexity")
                            ),
                            prerequisites=row.get("prerequisites", ""),
                            estimated_time=safe_float(row.get("estimatedtime")),
                            subject=row.get("subject", ""),
                            grade=safe_int(row.get("grade")),
                        )
                        question_objects.append(question)

        if question_objects:
            db.bulk_save_objects(question_objects)
            db.commit()
            print(f"✅ Inserted {len(question_objects)} questions from CSV files.")
        else:
            print("⚠️ No questions found to insert.")

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    insert_questions_from_folder(CSV_FOLDER)
