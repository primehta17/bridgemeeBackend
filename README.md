# BridgeMee - Backend

Express REST API with MongoDB, JWT auth, plans, subscriptions, users, and audit logs.

**Live API:** https://bridgemeebackend.onrender.com/api  
**Repository:** https://github.com/primehta17/bridgemeeBackend.git  
**Frontend repo:** https://github.com/primehta17/bridgemeeFrontend.git

## Clone and run

```bash
git clone https://github.com/primehta17/bridgemeeBackend.git
cd bridgemeeBackend
cp .env.example .env
npm install
npm run seed
npm run dev
```

API: `http://localhost:5000/api`

> **Monorepo:** If you downloaded the full project, this code is in the `server/` folder - run the commands above from `server/` instead of `bridgemeeBackend/`.

## Environment variables

Copy `.env.example` to `.env`:

- `MONGODB_URI` - required  
- `JWT_SECRET` - required  
- `CLIENT_URL` - optional (CORS), e.g. `http://localhost:3000,https://bridgemeefrontend.onrender.com`  
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` - for `npm run seed`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with reload |
| `npm start` | Production |
| `npm run seed` | Admin user + sample plans |

**Admin after seed:** `admin@example.com` / `admin123`

## Run with frontend

1. Start this API (port 5000).  
2. Clone and run [bridgemeeFrontend](https://github.com/primehta17/bridgemeeFrontend.git):

```bash
git clone https://github.com/primehta17/bridgemeeFrontend.git
cd bridgemeeFrontend
npm install && npm run dev
```

## API (summary)

Base: `/api` - local `http://localhost:5000/api`, live `https://bridgemeebackend.onrender.com/api`

- `GET /health`, `GET /` (info)  
- Auth: `POST /auth/register`, `/login`, `/refresh`; `POST /logout`, `GET /me`  
- Plans: `GET /plans` (public); admin `POST`, `PUT`, `DELETE`  
- Subscriptions: `GET /subscriptions/me`, `POST /subscriptions`, `PATCH .../change-plan`, `PATCH .../cancel`  
- Admin: `GET /users`, `GET /audit-logs`

## Tests

```bash
curl https://bridgemeebackend.onrender.com/api/health
```

## Render deploy

Repo: [bridgemeeBackend](https://github.com/primehta17/bridgemeeBackend.git) · Start: `npm start` · Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL=https://bridgemeefrontend.onrender.com`
