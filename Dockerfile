# Stage 1: Build React App
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Stage 2: Serve with lightweight HTTP server
FROM node:20-alpine AS final
WORKDIR /app
COPY --from=builder /app/build ./build
RUN npm install -g serve
EXPOSE 10000
CMD ["serve", "-s", "build", "-l", "10000"]
