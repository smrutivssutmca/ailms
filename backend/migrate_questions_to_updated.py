from sqlalchemy.orm import Session
from sqlalchemy import func
from models.question import Topic
from services.db import SessionLocal


def find_duplicate_topics():
    db: Session = SessionLocal()
    try:
        print("🔍 Searching for duplicate topic names...")

        # Find topic names that appear more than once (across all subjects)
        duplicates = (
            db.query(Topic.name, func.count(Topic.id).label("count"))
            .group_by(Topic.name)
            .having(func.count(Topic.id) > 1)
            .all()
        )

        if not duplicates:
            print("✅ No duplicate topics found.")
            return

        print(f"🚨 Found {len(duplicates)} duplicate topic names:")
        for name, count in duplicates:
            print(f"- {name} (x{count})")

            # Optional: List all topic records with this name
            records = db.query(Topic).filter(Topic.name == name).all()
            for r in records:
                print(f"    [ID: {r.id}] Subject ID: {r.subject_id}")

    except Exception as e:
        print("❌ Error during duplicate topic check:", e)
    finally:
        db.close()


if __name__ == "__main__":
    find_duplicate_topics()
