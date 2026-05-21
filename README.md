# BridgeMee — Subscription Management Portal

A full-stack **subscription management** application with separate **User** and **Admin** roles. Users can browse plans, subscribe, upgrade/downgrade, and cancel. Admins manage plans, users, and audit logs.

| | URL |
|---|---|
| **Live frontend** | https://bridgemee-frontend.vercel.app/ |
| **Live backend API** | https://bridgemeebackend.onrender.com/api |

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 18, React Router, Vite |
| **Backend** | Node.js, Express, Mongoose |
| **Database** | MongoDB |
| **Auth** | JWT (access + refresh tokens), bcrypt |

## Repository layout

The repo uses `server/` and `client/` as the backend and frontend projects (each has its own `package.json`):

```
bridgemee/
├── server/          # Backend API (Express)
├── client/          # Frontend SPA (React + Vite)
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Setup

### Backend (`server/`)

```bash
cd server
cp .env.example .env
npm install
npm run seed    # optional: seed admin user and sample plans
npm run dev     # development with --watch
# npm start     # production
```

**Environment variables** (`server/.env`):

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Access token lifetime (e.g. `7d`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Seed script admin account |
| `CLIENT_URL` | Comma-separated frontend URLs for CORS (add Vercel preview/production domains) |

### Frontend (`client/`)

```bash
cd client
cp .env.example .env   # optional for local; required for custom API URL
npm install
npm run dev            # http://localhost:3000 — proxies /api to backend
npm run build          # production build
npm run preview        # preview production build locally
```

**Environment variables** (`client/.env` or Vercel project settings):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL including `/api`. **Set on Vercel** to `https://bridgemeebackend.onrender.com/api`. Omit locally to use the Vite proxy. |

### Default admin (after `npm run seed`)

- Email: `admin@example.com`
- Password: `admin123`

Password rules for registration: minimum 8 characters, at least one letter and one number.

## Tests

No automated test suite is included in this submission. You can smoke-test the API with:

```bash
curl https://bridgemeebackend.onrender.com/api/health
```

## Deployment notes

- **Render (backend):** Root directory `server`, start command `npm start`, set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` to your Vercel frontend URL(s).
- **Vercel (frontend):** Root directory `client`, build `npm run build`, output `dist`, set `VITE_API_URL=https://bridgemeebackend.onrender.com/api`.

## API documentation

**Base URLs**

- Local: `http://localhost:5000/api`
- Production: `https://bridgemeebackend.onrender.com/api`

**Health**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | — | Service health check |

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Register user (unique email, password strength rules) |
| POST | `/auth/login` | — | Login; returns `accessToken`, `refreshToken`, `token` |
| POST | `/auth/refresh` | — | Refresh access token |
| POST | `/auth/logout` | Bearer | Logout |
| GET | `/auth/me` | Bearer | Current user |

### Plans

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/plans` | Public | Active plans (no token). Admin: paginated list with `?page&limit&q&isActive&billingCycle` |
| GET | `/plans/:id` | Optional | Single plan |
| POST | `/plans` | Admin | Create plan |
| PUT | `/plans/:id` | Admin | Update plan |
| DELETE | `/plans/:id` | Admin | Soft-deactivate plan |

### Subscriptions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/subscriptions/me` | User | My subscriptions |
| POST | `/subscriptions` | User | Subscribe to a plan |
| PATCH | `/subscriptions/:id/change-plan` | User | Upgrade/downgrade |
| PATCH | `/subscriptions/:id/cancel` | User | Cancel subscription |
| GET | `/subscriptions` | Admin | All subscriptions (paginated) |

### Users & audit (admin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users` | Admin | Paginated users with `?page&limit&q&hasActivePlan` |
| GET | `/audit-logs` | Admin | Paginated audit log with `?page&limit&q&entityType&action` |

## Features

- **User:** register, login, browse plans, subscribe, change plan, cancel, view history
- **Mock checkout:** card form + simulated delay (no real payment gateway)
- **Admin:** CRUD plans (soft delete), search/filter/paginate plans & users, audit log
- **Frontend:** reusable UI components, lazy-loaded routes, SEO meta per page
- **Auth:** JWT access + refresh with automatic refresh on the client

## Backend structure

```
server/
├── controllers/     HTTP handlers
├── services/        Business logic (incl. audit logging)
├── routes/          Express routers
├── models/          Mongoose schemas
├── middleware/      auth, errors, optionalAuth
├── utils/           tokens, pagination, password validation
└── scripts/         seed.js
```
