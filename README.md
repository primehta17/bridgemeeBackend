# BridgeMee - Subscription Management Portal

A full-stack subscription management application with separate User and Admin roles. Users can browse plans, subscribe, upgrade or downgrade plans, and cancel subscriptions. Admins can manage plans, users, subscriptions, and audit logs. The application includes a mock checkout flow no real payment integration.

## Deliverables

| Item | Details |
|------|---------|
| Backend source code | [primehta17/backend.git](https://github.com/primehta17/backend.git) |
| Frontend source code | [primehta17/frontend.git](https://github.com/primehta17/frontend.git) |
| Live frontend | [https://bridgemeefrontend.onrender.com](https://bridgemeefrontend.onrender.com) |
| Live backend API | [https://bridgemeebackend.onrender.com/api](https://bridgemeebackend.onrender.com/api) |

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, React Router, Vite |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT access and refresh tokens, bcrypt |

## Repository Layout

The project is split into separate backend and frontend repositories. After cloning both repositories, keep them in sibling folders:

```text
bridgeMee/
├── backend/      # Backend API - Express + MongoDB
└──  frontend/     # Frontend SPA - React + Vite

```

Clone the repositories:

```bash
- Backend
git clone https://github.com/primehta17/backend.git 

- Frontend
git clone https://github.com/primehta17/frontend.git 
```

Each project contains its own `package.json` with the required dependencies.

## Prerequisites

- Node.js 18+
- MongoDB, either local or MongoDB Atlas

## Setup Instructions

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed    # optional: seeds admin user and sample plans
npm run dev     # development mode
# npm start     # production mode
```

Backend environment variables:

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port, defaults to `5000` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Access token lifetime, for example `7d` |
| `ADMIN_EMAIL` | Admin email used by the seed script |
| `ADMIN_PASSWORD` | Admin password used by the seed script |
| `ADMIN_NAME` | Admin name used by the seed script |
| `CLIENT_URL` | Comma-separated frontend URLs allowed by CORS |

Default admin after running `npm run seed`:

```text
Email: admin@example.com
Password: admin123
```

### Frontend

```bash
cd frontend
cp .env.example .env   # optional locally; required for custom API URL
npm install
npm run dev            # local frontend
npm run build          # production build
npm run preview        # preview production build locally
```

## Frontend Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL. Example production value: `https://bridgemeebackend.onrender.com` |

### Environment Files

#### `.env.development`
VITE_API_URL=http://localhost:5000
```
#### `.env.production`
VITE_API_URL=https://bridgemeebackend.onrender.com

## Tests

No automated test suite is included in this submission.

You can smoke-test the deployed backend API with:

```bash
curl https://bridgemeebackend.onrender.com/api/health
```

You can also test locally after starting the backend:

```bash
curl http://localhost:5000/api/health
```

## API Documentation Summary

Base URLs:

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:5000/api` |
| Production | `https://bridgemeebackend.onrender.com/api` |

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | Public | Service health check |

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | Public | Register a user |
| POST | `/auth/login` | Public | Login and receive access and refresh tokens |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | Bearer token | Logout |
| GET | `/auth/me` | Bearer token | Get current user |

### Plans

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/plans` | Public/Admin | List active plans for users; admins can use pagination and filters |
| GET | `/plans/:id` | Optional | Get one plan |
| POST | `/plans` | Admin | Create a plan |
| PUT | `/plans/:id` | Admin | Update a plan |
| DELETE | `/plans/:id` | Admin | Soft-deactivate a plan |

Supported admin filters for plans include `page`, `limit`, `q`, `isActive`, and `billingCycle`.

### Subscriptions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/subscriptions/me` | User | List current user's subscriptions |
| POST | `/subscriptions` | User | Subscribe to a plan |
| PATCH | `/subscriptions/:id/change-plan` | User | Upgrade or downgrade a subscription |
| PATCH | `/subscriptions/:id/cancel` | User | Cancel a subscription |
| GET | `/subscriptions` | Admin | List all subscriptions with pagination |

### Users and Audit Logs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users` | Admin | List users with pagination and filters |
| GET | `/audit-logs` | Admin | List audit logs with pagination and filters |

Supported user filters include `page`, `limit`, `q`, and `hasActivePlan`.

Supported audit log filters include `page`, `limit`, `q`, `entityType`, and `action`.

## Features

- User registration and login
- Browse subscription plans
- Subscribe to a plan
- Upgrade or downgrade subscriptions
- Cancel subscriptions
- View subscription history
- Mock checkout with simulated card payment flow
- Admin plan management with soft delete
- Admin user search, filtering, and pagination
- Admin subscription and audit log visibility
- JWT authentication with refresh token support
- Reusable frontend UI components
- Lazy-loaded frontend routes
- SEO metadata per page

## Deployment Notes

### Backend on Render

- Repository: [primehta17/backend.git](https://github.com/primehta17/backend.git)
- Root directory: `backend` if deployed from a monorepo, or repository root if deploying the backend repository directly
- Start command: `npm start`
- Required environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`

### Frontend on Render 

- Repository: [primehta17/frontend.git](https://github.com/primehta17/frontend.git)
- Root directory: `frontend` if deployed from a monorepo, or repository root if deploying the frontend repository directly
- Build command: `npm run build`
- Output directory: `dist`
- Required environment variable: `VITE_API_URL=https://bridgemeebackend.onrender.com/api`
