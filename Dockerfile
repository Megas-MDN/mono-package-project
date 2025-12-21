# Build stage - Frontend
FROM node:24-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm ci --only=production=false

# Copy frontend source
COPY app ./app

# Build frontend
RUN npm run build:client

# Build stage - Backend
FROM node:24-alpine AS backend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma.config.ts ./

# Install dependencies
RUN npm ci

# Copy backend source and prisma
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build backend
RUN npm run build:server

# Start application
CMD ["sh", "-c","npx prisma migrate deploy && npx prisma generate && npm run start"]