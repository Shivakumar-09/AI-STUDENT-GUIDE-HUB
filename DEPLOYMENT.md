# 🚀 Deployment Guide: AI Student Guide Hub

## Overview

This guide will walk you through deploying your full-stack application:
- **Backend** → Render (Node.js + MongoDB Atlas)
- **Frontend** → Vercel (React + Vite)

---

## Prerequisites

✅ GitHub repository: https://github.com/Shivakumar-09/AI-STUDENT-GUIDE-HUB  
✅ MongoDB Atlas account with connection string  
✅ Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

---

## Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `AI-STUDENT-GUIDE-HUB`
3. Configure the service:
   - **Name**: `ai-student-guide-backend`
   - **Region**: Singapore (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node index.js`

### Step 3: Set Environment Variables

Click **"Environment"** and add these variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://vardhaman:shiva@cluster0.ls62kez.mongodb.net/?appName=Cluster0
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_secure_random_string_here
```

> **Important**: Replace `GEMINI_API_KEY` with your actual API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy your backend URL (e.g., `https://ai-student-guide-backend.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import `AI-STUDENT-GUIDE-HUB` repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variable

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

> **Important**: Replace with your actual Render backend URL from Part 1, Step 4

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Get your live URL (e.g., `https://ai-student-guide-hub.vercel.app`)

---

## Part 3: Update Backend CORS

### Step 1: Add Frontend URL to Render
1. Go back to Render dashboard
2. Select your backend service
3. Click **"Environment"**
4. Add new variable:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## Part 4: Verification

### Test Your Deployment

1. **Visit your frontend URL**
2. **Test Authentication**:
   - Try registering a new account
   - Try logging in
3. **Test Features**:
   - ✅ Dashboard loads
   - ✅ AI Mentor responds (if Gemini API key is valid)
   - ✅ Roadmap generator works
   - ✅ Quiz functionality
   - ✅ Resume analyzer

### Common Issues

#### Issue: "Network Error" or "Failed to fetch"
**Solution**: Check that `VITE_API_URL` in Vercel matches your Render backend URL exactly

#### Issue: "AI Mentor is currently unavailable"
**Solution**: 
1. Get a new Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Update `GEMINI_API_KEY` in Render environment variables
3. Redeploy backend

#### Issue: "MongoDB connection error"
**Solution**: Verify `MONGODB_URI` is correct in Render environment variables

---

## Environment Variables Summary

### Render (Backend)
| Variable | Example Value |
|----------|--------------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `GEMINI_API_KEY` | `AIzaSy...` |
| `JWT_SECRET` | `your_random_secret_123` |
| `FRONTEND_URL` | `https://your-app.vercel.app` |

### Vercel (Frontend)
| Variable | Example Value |
|----------|--------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` |

---

## 🎉 Deployment Complete!

Your AI Student Guide Hub is now live! Share your frontend URL with others to showcase your project.

### Next Steps
- Monitor backend logs in Render dashboard
- Check frontend analytics in Vercel dashboard
- Update your README.md with live demo links

---

## Troubleshooting

### Backend Logs
View logs in Render:
1. Go to your service
2. Click **"Logs"** tab
3. Look for errors

### Frontend Logs
View logs in Vercel:
1. Go to your project
2. Click **"Deployments"**
3. Click on latest deployment
4. Check **"Build Logs"** and **"Function Logs"**

### Need Help?
- Check [Render Documentation](https://render.com/docs)
- Check [Vercel Documentation](https://vercel.com/docs)
