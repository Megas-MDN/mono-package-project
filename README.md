# Project Uno - Fullstack Package

## 🚀 Overview
**Project Uno** is a modern Fullstack application that combines a **React 19** frontend with a **Node.js (Express)** backend, powered by the latest **Prisma 7 ORM** and **PostgreSQL**. The project is structured as a simplified monorepo where the Express server serves both the API and the static frontend assets.

### 🌟 Key Highlights
- **Unified Workflow**: Manage frontend and backend within a single `package.json`.
- **Modern Tech**: React 19, Vite 7 (Rolldown), Tailwind CSS 4, and **Prisma 7**.
- **Docker Ready**: Fully containerized environment with Docker and Docker Compose.
- **Real-time**: Built-in support for WebSockets via Socket.io.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, Zustand |
| **Backend** | Node.js, Express, TypeScript, Socket.io |
| **Database** | PostgreSQL 17, **Prisma 7 ORM** |
| **Infra/Dev** | Docker, Docker Compose, tsx, ESLint, Prettier |

---

## 🏗️ Project Structure

```bash
.
├── app/                # React Frontend (Vite Root)
├── src/                # Node.js Backend (Express API)
├── prisma/             # Database Schema and Migrations
├── public/             # Frontend Build Output (served by Express)
├── dist/               # Backend Build Output (optional, processed via tsx)
├── Dockerfile          # Simplified Dockerfile (Install -> Build -> Start)
└── docker-compose.yml  # PostgreSQL + App Orchestration
```

---

## 🏁 Getting Started

### 1. Prerequisites
- Node.js installed
- Docker & Docker Compose

### 2. Initial Setup
Clone the repository and configure the environment variables:
```bash
cp .env.sample .env
npm install
```

### 3. Local Development
To run both frontend and backend simultaneously with Hot Reload:
```bash
yarn dev # or npm run dev
```
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001

### 4. Running with Docker (Recommended)
To start the full environment (App + Database):
```bash
yarn dc:up   # Start containers
yarn dc:logs # Follow logs
```

To reset the database (clear volumes):
```bash
yarn dc:clean
```

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `yarn dev` | Starts Frontend (Vite) + Backend (tsx watch) concurrently. |
| `yarn build` | Builds both the Client (React) and the Server (TS). |
| `yarn start` | Starts the production server using `tsx`. |
| `yarn dc:up` | Starts the App and Postgres containers via Docker Compose. |
| `yarn dc:down` | Stops and removes the containers. |
| `yarn dc:clean`| Removes containers, volumes, and orphan images (Total Reset). |
| `yarn dc:logs` | View real-time logs. |
| `yarn dc:rebuild` | Rebuilds the app image and restarts containers. |

---

## 🐳 Docker Workflow
The project uses a simplified single-stage `Dockerfile` that:
1. Installs dependencies.
2. Generates the Prisma Client.
3. Performs the frontend build (outputting to `/public`).
4. Starts the server while automatically handling database migrations.

<hr>
<p align="center">
Developed with ❤️ by Megas
</p>