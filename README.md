# CRM Opportunity Tracker

A full-stack Mini CRM for tracking sales opportunities. Built with the MERN stack (MongoDB, Express, React, Node.js), it supports user authentication, opportunity CRUD, ownership-based access control, and a responsive dashboard with pipeline summaries.

## Live Demo

| Resource | URL |
|----------|-----|
| **Frontend (Vercel)** | https://mini-crm-opportunity-tracker-three.vercel.app |
| **Backend API (Render)** | https://mini-crm-opportunity-tracker-bzkf.onrender.com |
| **GitHub Repository** | https://github.com/Syed-98/mini-crm-opportunity-tracker |

### Test Access

Registration is open — create an account on the live app to test all features.

Alternatively, use these demo credentials (create this account locally or on production before submitting):

| Field | Value |
|-------|-------|
| Email | `demo@crmtracker.com` |
| Password | `demo1234` |

> **Production checklist:** On Render, set `CORS_ORIGIN=https://mini-crm-opportunity-tracker-three.vercel.app` and a strong `JWT_SECRET`. On Vercel, set `VITE_API_URL=https://mini-crm-opportunity-tracker-bzkf.onrender.com`.

## Tech Stack

| Layer    | Technologies                                      |
|----------|---------------------------------------------------|
| Backend  | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  |
| Frontend | React 18, Vite, Tailwind CSS, React Router v6     |
| Tooling  | Axios, express-validator, react-hot-toast         |

## Project Structure

```
/backend          → REST API (Node.js + Express)
/frontend         → React SPA (Vite + Tailwind)
README.md         → This file
```

---

## Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env`:**
   | Variable     | Description                          | Example                          |
   |--------------|--------------------------------------|----------------------------------|
   | `PORT`       | Server port                          | `5000`                           |
   | `MONGO_URI`  | MongoDB connection string            | `mongodb+srv://user:pass@cluster...` |
   | `JWT_SECRET` | Secret key for signing JWTs          | `your_random_secret_string`      |
   | `NODE_ENV`   | Environment mode                     | `development`                    |
   | `CORS_ORIGIN`| Allowed frontend origin(s), comma-separated. Defaults to `*` in development when unset. | `http://localhost:5173` |

5. **Start the server:**
   ```bash
   npm run dev
   ```
   API runs at `http://localhost:5000`

---

## Frontend Setup

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env`:**
   | Variable       | Description          | Example                    |
   |----------------|----------------------|----------------------------|
   | `VITE_API_URL` | Backend API base URL | `http://localhost:5000`    |

5. **Start the dev server:**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`

---

## API Endpoints

### Auth

| Method | Endpoint           | Auth | Description              |
|--------|--------------------|------|--------------------------|
| POST   | `/api/auth/register` | No   | Register a new user      |
| POST   | `/api/auth/login`    | No   | Login and receive JWT    |
| GET    | `/api/auth/me`       | Yes  | Get current user profile |

### Opportunities (all require `Authorization: Bearer <token>`)

| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| GET    | `/api/opportunities`      | List all opportunities (owner populated) |
| POST   | `/api/opportunities`      | Create opportunity (owner from JWT)      |
| GET    | `/api/opportunities/:id`  | Get single opportunity                   |
| PUT    | `/api/opportunities/:id`  | Update (owner only, 403 otherwise)       |
| DELETE | `/api/opportunities/:id`  | Delete (owner only, 403 otherwise)       |

---

## Deployment Guide

### MongoDB Atlas (Database)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and whitelist your IP (or `0.0.0.0/0` for cloud deploys).
3. Copy the connection string and set it as `MONGO_URI` in your backend environment.

### Render (Backend)

1. Push the repo to GitHub.
2. Create a new **Web Service** on [render.com](https://render.com).
3. Set root directory to `backend`, build command `npm install`, start command `npm start`.
4. Add environment variables:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — strong random secret (not the placeholder)
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://mini-crm-opportunity-tracker-three.vercel.app`
5. Note the deployed URL (e.g. `https://your-api.onrender.com`).

### Vercel (Frontend)

1. Import the repo on [vercel.com](https://vercel.com).
2. Set root directory to `frontend`.
3. Add environment variable: `VITE_API_URL=https://mini-crm-opportunity-tracker-bzkf.onrender.com`.
4. Deploy. Vercel auto-detects Vite.

---

## Known Limitations

- **No role-based access control** — all authenticated users see all opportunities; only edit/delete is restricted to the owner.
- **JWT expiry is client-tracked** — the frontend stores a 2-hour expiry; the backend also enforces 2-hour JWT expiry independently.
- **No pagination** — all opportunities are loaded at once; may be slow with very large datasets.
- **No email verification or password reset** — registration is open with no confirmation flow.
- **No real-time updates** — changes from other users require a page refresh to appear.
- **CORS must be configured in production** — set `CORS_ORIGIN` to your deployed frontend URL (comma-separated for multiple origins).

---

## Security Notes

- Passwords are hashed with bcrypt (salt rounds: 10); never stored in plain text.
- `owner` is always derived from the JWT — never accepted from the request body.
- Backend enforces ownership checks (403) on update and delete, independent of the UI.
- JWT secret and database URI must be set via environment variables only.
