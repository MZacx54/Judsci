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
   - **Variables**:
     - `DEBUG`: `False`
     - `SECRET_KEY`: *[A long random string]*
     - `ALLOWED_HOSTS`: `*`
     - `CSRF_TRUSTED_ORIGINS`: `https://[your-backend-railway-url]` (Update this after deployment)
     - `RAILWAY_STATIC_URL`: `true`
     - `DATABASE_URL`: `${{ Postgres.DATABASE_URL }}` (Railway usually links this automatically)

### C. Deploy Frontend
1. Click **New** -> **GitHub Repo** -> Select `jdpc-bauchi-digital-platform`.
2. Edit its settings:
   - **Root Directory**: `frontend`
   - **Variables**:
     - `VITE_PAYSTACK_PUBLIC_KEY`: `[Your Paystack Public Key]`
     - `VITE_API_URL`: `https://[your-backend-railway-url]` (Update this after backend is live)

### D. Finalize Nginx & Proxy
The Nginx configuration in the frontend is designed to proxy requests to the backend. Ensure your backend service in Railway is named `backend` (or update `nginx.conf` to match the service name).

## 4. Post-Deployment
### Run Migrations & Populate Data
Once the backend is live, you can use the Railway CLI or the "Shell" tab in the dashboard to run:
```bash
python manage.py migrate
python populate_all.py
```

### Create Superuser
To access the Admin Panel:
```bash
python manage.py createsuperuser
```

---
**Need Help? Contact the technical team at JDPC Bauchi.**
