# Mono Package Project

## Overview

**ReactJS (Vite) + Node.js (Express) API + Prisma + Docker**, orchestrated from a single `package.json`.

### Why this project
- One codebase, one dependency graph, one command set.
- Vite React app served from the same Node.js server build (client output to `public`).
- Fully containerized with PostgreSQL via Docker Compose.
- Production-ready multi-stage Dockerfile and Vercel config.

---

## 🧠 Tech Stack

| Layer | Stack |
|-------|--------|
| Frontend | React 19, Vite (`@vitejs/plugin-react-swc`) |
| Backend | Node.js + Express 4, TypeScript |
| Database | PostgreSQL 17, Prisma ORM |
| Other | Zod (validation), Socket.io, Jest (+ ts-jest), ESLint + Prettier |
| Infra | Docker, Docker Compose, optional Vercel deployment |

---

## 📁 Project Structure

```bash
.
├─ app/                        # React app (Vite root)
│  ├─ index.html
│  ├─ main.tsx
│  ├─ App.tsx / App.css
│  └─ assets/
│
├─ public/                     # Vite build output
│
├─ src/                        # Node + Express API
│  ├─ index.ts
│  ├─ app.ts
│  ├─ db/prisma.ts
│  ├─ constants/
│  ├─ middlewares/
│  ├─ models/
│  ├─ controllers/
│  ├─ services/
│  ├─ routes/
│  ├─ types/
│  └─ validations/
│
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed.ts
│
├─ temp/
│  ├─ routerGenerate.js
│  ├─ seedCreator.cjs
│  └─ seeds/user.json
│
├─ dist/                       # Compiled server output
│
├─ .env.sample
├─ Dockerfile
├─ docker-compose.yml
├─ docker-compose.mono.yml
├─ vercel.json
├─ vite.config.ts
├─ tsconfig*.json
├─ eslint.config.js
└─ package.json
```

---

## ⚙️ How It Runs

### Development

One command runs both client and API:
```bash
npm run dev
```
> Uses `concurrently` to run `vite` and `tsx watch src/index.ts`.

- Frontend: http://localhost:5173  
- API: http://localhost:3001  
- Proxy: `/api` → `http://localhost:3001`

### Build and Start

```bash
npm run build
npm start
```

- Client build → `public/`
- Server build → `dist/`
- Serves both API and static files.

---

## 🌍 Environment Variables

Copy `.env.sample` to `.env` and set values:

```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
PRISMA_CLI_BINARY_TARGET=linux-musl
JWT_SECRET=your_secret
X_SIGN=...
VITE_X_SIGN=...
VITE_BASE_URL=http://localhost:5173
VITE_SOCKET_URL=http://localhost:3001
DB_PASSWORD=...
```

> **Note:** Vite variables must start with `VITE_` to be exposed to the client.

---

## 📜 NPM Scripts

| Script | Description |
|--------|--------------|
| `dev` | Run Vite + API watcher |
| `build` | Build client and server |
| `build:client` | Vite build |
| `build:server` | TypeScript compile |
| `start` | Run compiled server |
| `lint` | ESLint check |
| `dc:*` | Docker Compose commands (app + db) |
| `dcm:*` | Docker Compose mono (no db) |

---

## 🐳 Docker & Compose

### Dockerfile (3 stages)
1. **frontend-builder** → builds Vite app  
2. **backend-builder** → builds API (tsc + Prisma)  
3. **production** → serves both, exposes port `3001`

### docker-compose.yml
- **db:** PostgreSQL 17 (persistent volume, healthcheck)  
- **app:** builds Dockerfile, runs migrations, starts Node  

### docker-compose.mono.yml
- App only (expects external DB)

---

## 🧩 Vite Configuration

- root: `./app`  
- build.outDir: `../public`  
- devServer: port 5173, host true  
- proxy: `/api` → http://localhost:3001

---

## 🗃️ Database and Prisma

```bash
npx prisma generate
npx prisma migrate deploy
```
- Schema: `prisma/schema.prisma`
- Seeds: `prisma/seed.ts`

---

## 🔌 API Overview

Base: `/api`  
Health: `/api/health`  
Users: CRUD in `routes/users.routes.ts` with Zod validation

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm ci

# 2. Setup env
cp .env.sample .env

# 3. Run database
npm run dc:up

# 4. Apply migrations
npx prisma migrate deploy

# 5. Start in dev mode
npm run dev
```

---

## ☁️ Deployment

### Docker
Build once, Prisma generate at runtime.

### Vercel
Configured via `vercel.json` → serves from `dist/index.js`.

---

## 🧩 Conventions & Quality
- TypeScript strict mode
- ESLint + Prettier
- Jest + ts-jest
- Optimized `.dockerignore` and `.vercelignore`

---

## 🧾 Summary

✅ Single-repo, single-package workflow  
✅ React client served by Express API  
✅ PostgreSQL + Prisma via Docker  
✅ Layered architecture (routes → controllers → services → models)  
✅ Production-grade builds and healthchecks


<hr>
<p align="center">
Developed with ❤️ by Megas
</p>