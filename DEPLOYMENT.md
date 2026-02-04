# Deploying to Railway.app 🚀

Since this project has both a **Backend** (Django) and **Frontend** (React) in one folder, you will deploy them as two separate services in Railway.

## Prerequisites
1.  Push this entire project folder to **GitHub**.
2.  Create an account on [Railway.app](https://railway.app).

## Step 1: Deploy the Database (PostgreSQL)
1.  In your Railway project, click **New > Database > PostgreSQL**.
2.  Wait for it to initialize.

## Step 2: Deploy the Backend (Django)
1.  Click **New > GitHub Repo** and select this repo.
2.  Click **"Configure"** (or Settings for the service).
3.  **Root Directory**: Change this to `/backend`.
4.  **Variables**: Add these environment variables:
    -   `SECRET_KEY`: (Generate a random string)
    -   `DEBUG`: `False`
    -   `ALLOWED_HOSTS`: `*` (or your railway custom domain)
    -   `DATABASE_URL`: (Railway provides this automatically if you link the DB, or copy it from the DB Config).
5.  **Build Command**: Railway usually detects the Dockerfile automatically. If not, ensure it sees `backend/Dockerfile`.
6.  **Public Networking**: Generate a Domain keys (e.g., `jdpc-backend.up.railway.app`).

## Step 3: Deploy the Frontend (React)
1.  Click **New > GitHub Repo** and select the **same repo again**.
2.  **Root Directory**: Change this to `/frontend`.
3.  **Variables**:
    -   `VITE_API_URL`: Set this to your Backend URL (e.g., `https://jdpc-backend.up.railway.app`).
    -   `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack Key.
4.  **Public Networking**: Generate a Domain (e.g., `jdpc-bauchi.up.railway.app`).

## Final Check
- Visit your **Frontend URL**.
- Try to log in to `/admin` on your **Backend URL**.
- If images don't load, you may need to configure an S3 bucket (AWS/Cloudinary) for media storage, as Railway file storage is impermanent (files disappear when you redeploy).
