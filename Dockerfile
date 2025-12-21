# Build stage - Frontend
FROM node:24-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY app ./app
RUN npm ci
RUN npm run build:client

# Build stage - Backend
FROM node:24-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma.config.ts ./
RUN npm ci
COPY . .
# Copia o frontend construido para a pasta public que o express servirá
COPY --from=frontend-builder /app/public ./public
RUN npx prisma generate
RUN npm run build:server

# Final Production Image
FROM node:24-alpine
WORKDIR /app

# Instalar netcat para o healthcheck se necessário
RUN apk add --no-cache netcat-openbsd

COPY --from=backend-builder /app/package*.json ./
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/public ./public
COPY --from=backend-builder /app/prisma ./prisma
COPY --from=backend-builder /app/generated ./generated
COPY --from=backend-builder /app/src ./src
COPY --from=backend-builder /app/prisma.config.ts ./prisma.config.ts

ENV NODE_ENV=production

# O comando agora roda com tsx conforme configurado no package.json
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]