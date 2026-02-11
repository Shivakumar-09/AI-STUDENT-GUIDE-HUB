# Deployment Guide

Follow these steps to deploy your **AI Student Guide Hub** application.

## Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to GitHub.
2.  **Render Account**: Create an account on [render.com](https://render.com).
3.  **Vercel Account**: Create an account on [vercel.com](https://vercel.com).

---

## Part 1: Deploy Backend (Render)

We will use **Render** to host the backend (Node.js + Python + PostgreSQL).

1.  **Dashboard**: Go to your Render Dashboard.
2.  **New Web Service**: Click **New +** -> **Web Service**.
3.  **Connect GitHub**: Select "Build and deploy from a Git repository" and connect your repo.
4.  **Wait for Detection**: 
    - Render should automatically detect the `render.yaml` file in your repository.
    - If it asks, confirm the settings.
5.  **Environment Variables**:
    - Go to the **Environment** tab of your new service.
    - Add the following variables (copy values from your local `server/.env`):
        - `DATABASE_URL`: (Your Production PostgreSQL URL)
        - `OPENAI_API_KEY`: (Your OpenAI API Key)
        - `JWT_SECRET`: (Your Secret Key)
        - `NODE_ENV`: `production`
        - `PYTHON_VERSION`: `3.10.0`
6.  **Deploy**: Click **Create Web Service**. 
    - Render will install Node dependencies, Python dependencies, and start the server.

---

## Part 2: Deploy Frontend (Vercel)

We will use **Vercel** to host the React frontend.

1.  **Dashboard**: Go to your Vercel Dashboard.
2.  **New Project**: Click **Add New...** -> **Project**.
3.  **Import Git Repository**: Select your GitHub repository.
4.  **Configure Project**:
    - **Framework Preset**: Vercel should auto-detect **Vite**.
    - **Root Directory**: Click `Edit` and select `client`.
5.  **Environment Variables**:
    - Expand **Environment Variables**.
    - Add: `VITE_API_URL`
    - Value: `https://your-backend-service-name.onrender.com` (Copy this from your Render dashboard after backend deployment).
6.  **Deploy**: Click **Deploy**.

---

## Verification

1.  Open your Vercel deployment URL (e.g., `https://your-app.vercel.app`).
2.  Try to **Login/Register** (Tests Backend + DB).
3.  Go to **Opportunities** (Tests Python Resume API).
4.  Go to **AI Mentor** (Tests OpenAI Integration).

---

## Troubleshooting

-   **Backend Logs**: usage the "Logs" tab in Render to see if the server crashed.
-   **Frontend Errors**: Open Browser Console (F12) to see if API requests are failing (CORS or 404).
