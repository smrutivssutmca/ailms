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

# --- Stage 3: Nginx to serve static frontend ---
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Remove default nginx page
RUN rm -rf ./*

# Copy built frontend from frontend stage
COPY --from=frontend /app/frontend/build ./

# Copy custom nginx config (if exists)
COPY backend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 10000
CMD ["nginx", "-g", "daemon off;"]
