# Subscription Management Portal (MERN)

A full-stack subscription management app with **User** and **Admin** roles.

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

## API endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Register user (email unique, password strength) |
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

### Users (admin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users` | Admin | Paginated users with `?page&limit&q&hasActivePlan` |
| GET | `/audit-logs` | Admin | Paginated audit log with `?page&limit&q&entityType&action` |

## Setup

```bash
# Backend
cd server
cp .env.example .env
npm install
npm run seed
npm run dev

# Frontend
cd client
npm install
npm run dev
```

**Admin:** `admin@example.com` / `admin123` (after seed)

**Password rules:** min 8 characters, at least one letter and one number.

## Features

- **User:** register, login, browse plans, subscribe, change plan, cancel, view history
- **Mock checkout:** card form + simulated delay before subscribe/change-plan (no real gateway)
- **Admin:** CRUD plans (soft delete), search/filter/paginate plans & users, audit log view
- **Frontend:** Reusable UI components (`Alert`, `DataTable`, `TabList`, `PageHeader`, etc.), lazy-loaded routes, SEO meta per page
- **Auth:** JWT access + refresh tokens with automatic refresh on the client
