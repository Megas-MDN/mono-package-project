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
RUN npm ci --only=production=false

# Copy backend source and prisma
COPY src ./src
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Build backend
RUN npm run build:server

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy Prisma schema (useful for reference or migrations, though generate is already done in builder)
COPY prisma ./prisma

# Copy built files from previous stages
COPY --from=frontend-builder /app/public ./public
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/generated ./generated

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/src/index.js"]