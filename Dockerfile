# --- Stage 1: Backend (FastAPI) ---
FROM python:3.11-slim AS backend
WORKDIR /app/backend
COPY backend/ /app/backend/
RUN pip install --upgrade pip && pip install -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# --- Stage 2: Frontend Build (React + CRA) ---
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --force
COPY frontend/ .
RUN npm run build
