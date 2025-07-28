from fastapi import APIRouter, HTTPException
from schemas.user import UserRegister, UserLogin, UserOut
from services.supabase_service import get_db_conn
from typing import Dict

router = APIRouter()


@router.post("/register", response_model=UserOut)
def register(user: UserRegister):
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        # Check if user already exists
        cur.execute('SELECT * FROM "user" WHERE email = %s', (user.email,))
        existing = cur.fetchone()
        if existing:
            cur.close()
            conn.close()
            raise HTTPException(status_code=400, detail="Email already registered")
        # Insert new user
        cur.execute(
            'INSERT INTO "user" (name, email, password) VALUES (%s, %s, %s) RETURNING id, email, name',
            (user.name, user.email, user.password),
        )
        new_user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return UserOut(
            id=str(new_user["id"]), email=new_user["email"], name=new_user["name"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=Dict)
def login(user: UserLogin):
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute(
            'SELECT id, email, name FROM "user" WHERE email = %s AND password = %s',
            (user.email, user.password),
        )
        db_user = cur.fetchone()
        cur.close()
        conn.close()
        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        return {
            "user": {
                "id": str(db_user["id"]),
                "email": db_user["email"],
                "name": db_user["name"],
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
