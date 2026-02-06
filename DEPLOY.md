# Deployment Guide - BusBooker

Deploy both **Frontend** (Vite + React) and **Backend** (Express + MongoDB) to [Render.com](https://render.com) (free tier).

---

## Quick Start with Blueprint

### 1. Push to GitHub

```bash
git add .
git commit -m "Add deployment config"
git push origin main
```

### 2. Connect to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **New** → **Blueprint**
3. Connect your GitHub repo
4. Render will detect `render.yaml` and create both services

### 3. Set Environment Variables

**Backend (busbooker-api):**
- `MONGODB_URI` – Your MongoDB connection string ([MongoDB Atlas](https://mongodb.com/atlas) free tier works)
- `JWT_SECRET` – Random secret (e.g. run `openssl rand -hex 32`)
- `FRONTEND_URL` – Your frontend URL (e.g. `https://busbooker-web.onrender.com`)

**Frontend (busbooker-web):**
- `VITE_API_URL` – Your backend URL (e.g. `https://busbooker-api.onrender.com`)

> ⚠️ **Order matters:** Deploy the backend first → copy its URL → set as `VITE_API_URL` for frontend → redeploy frontend

---

## Manual Deployment

### Backend

1. **New** → **Web Service**
2. Connect repo, set **Root Directory** to `server`
3. **Build:** `npm install` | **Start:** `npm start`
4. Add: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`

### Frontend

1. **New** → **Static Site**
2. Connect repo
3. **Build:** `npm install && npm run build` | **Publish:** `dist`
4. Add: `VITE_API_URL` = your backend URL

---

## Notes

- Render free tier spins down after 15 min inactivity; first load may take ~30 sec
- Use full URLs with `https://` for `FRONTEND_URL` and `VITE_API_URL`
