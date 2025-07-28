# Use official Python image for backend
FROM python:3.11-slim AS backend
WORKDIR /app/backend
COPY backend/ /app/backend/
RUN pip install --upgrade pip && pip install -r requirements.txt
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Use official Node image for frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/ /app/frontend/
RUN npm install --force && npm run build
EXPOSE 3000
CMD ["npm", "start"]
