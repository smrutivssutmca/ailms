# FastAPI backend for AI-based LMS

- Modular structure
- Supabase integration
- APIs: login, register, questions

## Structure

- main.py: FastAPI app entry
- api/: API routers
- models/: Pydantic models
- services/: Business logic
- utils/: Utility functions

## Setup

1. Create venv: `python3 -m venv venv`
2. Activate: `source venv/bin/activate`
3. Install: `pip install fastapi uvicorn supabase`
4. Run: `uvicorn main:app --reload`

## Environment

- Set SUPABASE_URL and SUPABASE_KEY in `.env` file

---

# TODO

- Implement endpoints
- Connect to Supabase
- Add authentication
