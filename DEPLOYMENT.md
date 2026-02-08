# Deployment Guide: JDPC Bauchi Digital Platform

This guide provides instructions for deploying the JDPC Bauchi Digital Platform to **Railway**.

## 1. Prerequisites
- A **GitHub** account with the repository pushed.
- A **Railway** account connected to your GitHub.
- **Paystack** account for the Public Key.

## 2. Service Architecture
The platform consists of three main components:
1. **Frontend**: React application served by Nginx.
2. **Backend**: Django REST API served by Gunicorn.
3. **Database**: PostgreSQL for data persistence.

## 3. Step-by-Step Deployment

### A. Add PostgreSQL
1. Go to your Railway dashboard.
2. Click **New** -> **Database** -> **Add Postgres**.
3. Once created, Railway automatically sets up a `DATABASE_URL`.

### B. Deploy Backend
1. Click **New** -> **GitHub Repo** -> Select `jdpc-bauchi-digital-platform`.
2. Edit its settings:
   - **Root Directory**: `backend`
   - **Deploy Settings**:
     - **Start Command**: `gunicorn jdpc_bauchi_api.wsgi:application --bind 0.0.0.0:8000`
     - **Release Command**: `python manage.py migrate`
   - **Variables**:
     - `DEBUG`: `False`
     - `SECRET_KEY`: *[A long random string]*
     - `ALLOWED_HOSTS`: `*`
     - `CSRF_TRUSTED_ORIGINS`: `https://[your-backend-railway-url]` (Update this after deployment)
     - `RAILWAY_STATIC_URL`: `true`
     - `DATABASE_URL`: `${{ Postgres.DATABASE_URL }}` (Railway usually links this automatically)

### C. Deploy Frontend
1. Click **New** -> **GitHub Repo** -> Select your repo.
2. Edit its settings:
   - **Root Directory**: `frontend`
   - **Variables**:
     - `BACKEND_HOST`: `Judsci` (Must match your Backend Service Name **EXACTLY**, including Capital Letters).
     - `VITE_PAYSTACK_PUBLIC_KEY`: `[Your Paystack Public Key]`

### D. Verification & Database Setup
Once both services are "Active", you **must** initialize the database.

1. Go to the **Backend Service** in Railway.
2. Click the **"Shell"** tab.
3. Run the following commands one by one:
   ```bash
   python manage.py migrate
   python populate_all.py
   python manage.py createsuperuser
   ```
   *(Note: Do not type 'python' twice. Just type exactly as shown above.)*

## 4. Final Handshake
- **Frontend URL**: Generate a domain for your frontend service in its Settings.
- **Backend CSRF**: Go to your **Backend Service** variables and update `CSRF_TRUSTED_ORIGINS` to include your new frontend URL (e.g., `https://judsci-frontend.up.railway.app`).

---
**Need Help? Contact the technical team at JDPC Bauchi.**
