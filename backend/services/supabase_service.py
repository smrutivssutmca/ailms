import os
from supabase import create_client, Client
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

DATABASE_URL = (os.getenv("DATABASE_URL"))


def get_db_conn():
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
