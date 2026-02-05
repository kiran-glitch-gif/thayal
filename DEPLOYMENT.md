# 🚀 Deployment Guide - Thayal360

This guide will help you deploy your Thayal360 application to production.

## 📋 Table of Contents
1. [GitHub Setup](#github-setup)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Alternative: Full-Stack on Railway](#alternative-railway)
5. [Environment Configuration](#environment-configuration)

---

## 1️⃣ GitHub Setup

### Create GitHub Repository

1. **Go to GitHub:** https://github.com/new
2. **Repository Name:** `thayal360`
3. **Description:** "Doorstep Tailoring Platform - Full Stack Application"
4. **Visibility:** Public or Private
5. **Click:** "Create repository"

### Push Code to GitHub

```bash
# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/thayal360.git

# Push code
git branch -M main
git push -u origin main
```

---

## 2️⃣ Frontend Deployment (Vercel)

### Step 1: Prepare for Deployment

Update `vite.config.js` for production:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
6. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Your frontend will be live at:** `https://thayal360.vercel.app`

---

## 3️⃣ Backend Deployment (Render)

### Step 1: Prepare Backend

Create `backend/package.json`:

```json
{
  "name": "thayal360-backend",
  "version": "1.0.0",
  "main": "server.cjs",
  "scripts": {
    "start": "node server.cjs"
  },
  "dependencies": {
    "express": "^5.2.1",
    "cors": "^2.8.6",
    "body-parser": "^2.2.2",
    "sqlite3": "^5.1.7"
  }
}
```

### Step 2: Deploy to Render

1. **Go to:** https://render.com
2. **Sign up/Login** with GitHub
3. **Click:** "New +" → "Web Service"
4. **Connect Repository:** Select `thayal360`
5. **Configure:**
   - **Name:** `thayal360-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.cjs`
   - **Instance Type:** Free
6. **Environment Variables:**
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
7. **Click:** "Create Web Service"

### Step 3: Update Frontend API URL

After backend is deployed, update Vercel environment variable:
- `VITE_API_URL` = `https://thayal360-backend.onrender.com`

**Your backend will be live at:** `https://thayal360-backend.onrender.com`

---

## 4️⃣ Alternative: Full-Stack on Railway

Deploy both frontend and backend on Railway:

### Step 1: Deploy to Railway

1. **Go to:** https://railway.app
2. **Sign up/Login** with GitHub
3. **Click:** "New Project" → "Deploy from GitHub repo"
4. **Select:** `thayal360` repository
5. **Railway will auto-detect** your app

### Step 2: Configure Services

Railway will create two services:
- **Frontend Service** (Vite)
- **Backend Service** (Node.js)

### Step 3: Set Environment Variables

**Frontend:**
- `VITE_API_URL` = `${{backend.RAILWAY_PUBLIC_DOMAIN}}`

**Backend:**
- `PORT` = `5000`
- `NODE_ENV` = `production`

### Step 4: Deploy

Railway will automatically deploy on every push to `main` branch.

**Your app will be live at:** `https://thayal360.up.railway.app`

---

## 5️⃣ Environment Configuration

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend (.env)

```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://thayal360.vercel.app
DATABASE_URL=./database.db
```

---

## 🔧 Post-Deployment Checklist

- [ ] Frontend is accessible
- [ ] Backend API is responding
- [ ] Login functionality works
- [ ] Products are loading
- [ ] Orders can be placed
- [ ] Database is persisting data
- [ ] CORS is configured correctly
- [ ] SSL/HTTPS is enabled
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional)

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** API calls failing
**Solution:** Check `VITE_API_URL` environment variable

**Problem:** Build fails
**Solution:** Run `npm run build` locally to check for errors

### Backend Issues

**Problem:** Database not persisting
**Solution:** Use persistent storage on Render (upgrade to paid plan) or use external database

**Problem:** CORS errors
**Solution:** Update CORS configuration in `backend/server.cjs`:
```javascript
app.use(cors({
  origin: 'https://thayal360.vercel.app',
  credentials: true
}));
```

---

## 📊 Monitoring & Analytics

### Add Google Analytics (Optional)

1. Create GA4 property
2. Add to `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Update feature"
git push origin main
```

2. **Automatic Deployment:** Platforms will automatically deploy changes

---

## 💰 Cost Breakdown

### Free Tier (Recommended for MVP)
- **Vercel:** Free (Hobby plan)
- **Render:** Free (Web Service)
- **Total:** $0/month

### Production Tier
- **Vercel Pro:** $20/month
- **Render Starter:** $7/month
- **Total:** $27/month

---

## 📞 Support

If you encounter issues:
1. Check deployment logs on platform dashboard
2. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. Contact support@thayal360.com

---

**Happy Deploying! 🚀**
