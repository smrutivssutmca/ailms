from fastapi import APIRouter, HTTPException, Request
from schemas.question import (
    QuestionOut,
    SubjectOut,
    TopicOut,
    DifficultyOut,
    GradeOut,
    UpdatedQuestionBase,
)
from schemas.user import UserResultOut, UserQuestionAttendedOut
from models.question import Question, Subject, Topic, Difficulty, UpdatedQuestion
from services.supabase_service import get_db_conn
from typing import List

from .irt import (
    update_theta,
    info_3pl,  # Assuming this is a utility function for IRT calculations
)  # Assuming this is a utility function for IRT calculations


router = APIRouter()


@router.get("/", response_model=List[QuestionOut])
def get_questions():
    # Fetch questions from the database
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("SELECT * FROM questions")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No questions found")
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/subjects", response_model=List[SubjectOut])
def get_subjects():
    # Fetch subjects from the database
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("SELECT * FROM subjects")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No subjects found")
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/topics", response_model=List[TopicOut])
def get_topics(request: Request):
    """Fetch topics by subject ID from query param."""
    subject_id = int(request.query_params.get("subject_id", 0))
    if not subject_id:
        raise HTTPException(status_code=400, detail="Subject ID is required")

    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("SELECT * FROM topics WHERE subject_id = %s", (subject_id,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        if not rows:
            raise HTTPException(
                status_code=404, detail="No topics found for this subject"
            )
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/grades", response_model=List[GradeOut])
def get_grades():
    """Fetch all grades."""
    try:
        print("Fetching grades...")
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("SELECT * FROM grades")
        rows = cur.fetchall()
        print(f"Fetched {len(rows)} grades")
        cur.close()
        conn.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No grades found")
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/next", response_model=UpdatedQuestionBase)
async def get_next_question(request: Request):
    """Fetch the next question based on user progress."""
    # try:
    body = await request.json()
    grade_id = body.get("grade_id")
    subject_id = body.get("subject_id")
    user_id = body.get("user_id")
    result = body.get("result", None)  # result: {"question_id": int, "correct": bool}

    if not grade_id or not subject_id or not user_id:
        raise HTTPException(status_code=400, detail="Missing required parameters")

    conn = get_db_conn()
    cur = conn.cursor()
    # Get user's current score (theta) from user_results
    cur.execute(
        "SELECT score FROM user_results WHERE user_id = %s AND grade_id = %s AND subject_id = %s",
        (user_id, grade_id, subject_id),
    )
    result_row = cur.fetchone()
    theta = result_row["score"] if result_row else 0.0  # default to 0.0 if not found

    # If result is provided, update theta using IRT and mark question attended
    if result:
        question_id = result.get("question_id")
        correct = result.get("correct", 0)
        # Get IRT params for the question
        cur.execute(
            "SELECT discrimintion_value, question_complexity, guessing_value FROM updated_questions WHERE id = %s",
            (question_id,),
        )
        q_row = cur.fetchone()
        if not q_row:
            cur.close()
            conn.close()
            raise HTTPException(
                status_code=404, detail="Question not found for IRT update"
            )
        a = q_row["discrimintion_value"] or 1.0
        b = float(q_row["question_complexity"]) if q_row["question_complexity"] else 0.0
        c = q_row["guessing_value"] or 0.5
        theta = update_theta(theta, a, b, c, correct)
        # Update user_results
        if result_row:
            cur.execute(
                "UPDATE user_results SET score = %s WHERE user_id = %s AND grade_id = %s AND subject_id = %s",
                (theta, user_id, grade_id, subject_id),
            )
        else:
            cur.execute(
                "INSERT INTO user_results (user_id, grade_id, subject_id, score) VALUES (%s, %s, %s, %s)",
                (user_id, grade_id, subject_id, theta),
            )
        # Mark question attended
        from datetime import datetime

        # Ensure grade_id and subject_id are integers, not row objects
        if not isinstance(grade_id, int):
            cur.execute("SELECT id FROM grades WHERE id = %s", (grade_id,))
            grade_row = cur.fetchone()
            if not grade_row:
                cur.close()
                conn.close()
                raise HTTPException(status_code=404, detail="Grade not found")
            grade_id = grade_row["id"]
        if not isinstance(subject_id, int):
            cur.execute("SELECT id FROM subjects WHERE id = %s", (subject_id,))
            subject_row = cur.fetchone()
            if not subject_row:
                cur.close()
                conn.close()
                raise HTTPException(status_code=404, detail="Subject not found")
            subject_id = subject_row["id"]

        cur.execute(
            "INSERT INTO user_question_attended (user_id, question_id, score, grade_id, subject_id, is_correct, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (
                user_id,
                question_id,
                theta,
                grade_id,
                subject_id,
                correct,
                datetime.utcnow().isoformat(),
            ),
        )
        conn.commit()

    # Get attended question ids
    cur.execute(
        "SELECT question_id FROM user_question_attended WHERE user_id = %s",
        (user_id,),
    )
    attended_ids = set(row["question_id"] for row in cur.fetchall())

    # Pull all candidate questions for grade/subject not attended
    cur.execute(
        "SELECT * FROM updated_questions WHERE grade_id = %s AND subject_id = %s",
        (grade_id, subject_id),
    )
    questions = cur.fetchall()
    questions = [q for q in questions if q["id"] not in attended_ids]
    if not questions:
        cur.close()
        conn.close()
        raise HTTPException(status_code=404, detail="No questions available")

    # Use IRT pick_item logic for next question selection
    pool = []
    for q in questions:
        pool.append(
            {
                "id": q["id"],
                "row": q,
                "discrimination": (
                    float(q["discrimintion_value"]) if q["discrimintion_value"] else 1.0
                ),
                "difficulty": (
                    float(q["question_complexity"]) if q["question_complexity"] else 0.0
                ),
                "guessing": float(q["guessing_value"]) if q["guessing_value"] else 0.25,
            }
        )

    # Count steps for this user/grade/subject (number of attended questions)
    step_idx = len(attended_ids)
    # Use pick_item from irt.py
    from .irt import pick_item

    next_q = pick_item(theta, pool, step_idx)
    selected_question = next_q["row"]
    cur.close()
    conn.close()

    return UpdatedQuestionBase(**selected_question)
    # except Exception as e:
    #     print("Error fetching next question:", e)
    #     raise HTTPException(status_code=500, detail=str(e))


@router.post("/submit", response_model=dict)
async def submit_question(request: Request):
    """Calculate theta and update user_results, return analytics. Also mark attended questions."""
    try:
        body = await request.json()
        grade_id = body.get("grade_id")
        subject_id = body.get("subject_id")
        user_id = body.get("user_id")
        answers = body.get("answers", [])

        if not grade_id or not subject_id or not user_id:
            raise HTTPException(status_code=400, detail="Missing required parameters")

        conn = get_db_conn()
        cur = conn.cursor()
        # Get user's current score (theta) from user_results
        cur.execute(
            "SELECT score FROM user_results WHERE user_id = %s AND grade_id = %s AND subject_id = %s",
            (user_id, grade_id, subject_id),
        )
        result_row = cur.fetchone()
        theta = result_row["score"] if result_row else 0.0

        from datetime import datetime

        # For each answer, update theta using IRT and mark attended
        for ans in answers:
            question_id = ans.get("questionId")
            correct = ans.get("correct", 0)
            cur.execute(
                "SELECT discrimintion_value, question_complexity, guessing_value FROM updated_questions WHERE id = %s",
                (question_id,),
            )
            q_row = cur.fetchone()
            if not q_row:
                continue
            a = q_row["discrimintion_value"] or 1.0
            b = (
                float(q_row["question_complexity"])
                if q_row["question_complexity"]
                else 0.0
            )
            c = q_row["guessing_value"] or 0.5
            theta = update_theta(theta, a, b, c, correct)
            # Mark question attended
            # Ensure grade_id and subject_id are integers, not row objects
            if not isinstance(grade_id, int):
                cur.execute("SELECT id FROM grades WHERE id = %s", (grade_id,))
                grade_row = cur.fetchone()
                if not grade_row:
                    cur.close()
                    conn.close()
                    raise HTTPException(status_code=404, detail="Grade not found")
                grade_id = grade_row["id"]
            if not isinstance(subject_id, int):
                cur.execute("SELECT id FROM subjects WHERE id = %s", (subject_id,))
                subject_row = cur.fetchone()
                if not subject_row:
                    cur.close()
                    conn.close()
                    raise HTTPException(status_code=404, detail="Subject not found")
                subject_id = subject_row["id"]
            cur.execute(
                "INSERT INTO user_question_attended (user_id, question_id, score, grade_id, subject_id, is_correct, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (
                    user_id,
                    question_id,
                    theta,
                    grade_id,
                    subject_id,
                    correct,
                    datetime.utcnow().isoformat(),
                ),
            )
        # Update user_results
        if result_row:
            cur.execute(
                "UPDATE user_results SET score = %s WHERE user_id = %s AND grade_id = %s AND subject_id = %s",
                (theta, user_id, grade_id, subject_id),
            )
        else:
            cur.execute(
                "INSERT INTO user_results (user_id, grade_id, subject_id, score) VALUES (%s, %s, %s, %s)",
                (user_id, grade_id, subject_id, theta),
            )
        conn.commit()

        # Dummy analytics (replace with real logic as needed)
        analytics = {
            "performance_movement": f"Theta: {theta:.2f}",
            "correct_answers": sum(a.get("correct", 0) for a in answers),
            "total_questions": len(answers),
            "weak_areas": [],
        }
        cur.close()
        conn.close()
        return {"analytics": analytics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/userresult", response_model=List[UserResultOut])
def get_user_results(request: Request):
    """Fetch user results for a specific grade and subject, including subject name."""
    try:
        user_id = int(request.query_params.get("user_id", 0))
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT ur.*, s.name as subject_name FROM user_results ur JOIN subjects s ON ur.subject_id = s.id WHERE ur.user_id = %s",
            (user_id,),
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No results found")
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/userquestionattended", response_model=List[UserQuestionAttendedOut])
def get_user_question_attended(request: Request):
    """Fetch user question attended records."""
    try:
        user_id = int(request.query_params.get("user_id", 0))
        grade_id = int(request.query_params.get("grade_id", 0))
        subject_id = int(request.query_params.get("subject_id", 0))

        if not grade_id or not subject_id:
            raise HTTPException(
                status_code=400, detail="Grade ID and Subject ID are required"
            )
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID is required")
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT * FROM user_question_attended WHERE user_id = %s AND subject_id = %s AND grade_id = %s ORDER BY created_at DESC",
            (
                user_id,
                subject_id,
                grade_id,
            ),
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        if not rows:
            raise HTTPException(status_code=404, detail="No attended questions found")
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
