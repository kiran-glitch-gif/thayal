# 🎯 GitHub Connection & Deployment - Step by Step

## ✅ Current Status

Your code is ready and committed to Git locally!
- ✅ Git initialized
- ✅ All files committed
- ✅ Branch renamed to `main`
- ✅ Ready to push to GitHub

---

## 📝 Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Recommended)

1. **Open your browser** and go to: https://github.com/new

2. **Fill in repository details:**
   - **Repository name:** `thayal360`
   - **Description:** `Doorstep Tailoring Platform - Full Stack Application`
   - **Visibility:** Choose Public or Private
   - **⚠️ IMPORTANT:** Do NOT initialize with README, .gitignore, or license
   - Click **"Create repository"**

3. **Copy the repository URL** (you'll see it on the next page)
   - It will look like: `https://github.com/YOUR_USERNAME/thayal360.git`

### Option B: Using GitHub CLI (If installed)

```bash
gh repo create thayal360 --public --source=. --remote=origin --push
```

---

## 📝 Step 2: Connect Local Repository to GitHub

Run these commands in your terminal (PowerShell):

```bash
# Navigate to your project (if not already there)
cd "c:/Users/Hi/OneDrive/T 360/vimal"

# Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/thayal360.git

# Verify remote was added
git remote -v

# Push code to GitHub
git push -u origin main
```

**Example:**
If your GitHub username is `johndoe`, the command would be:
```bash
git remote add origin https://github.com/johndoe/thayal360.git
```

---

## 📝 Step 3: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/thayal360`
2. You should see all your files uploaded
3. Check that README.md is displayed on the main page

---

## 🚀 Step 4: Deploy Frontend to Vercel

### 4.1: Sign Up for Vercel

1. Go to: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account

### 4.2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find and select your `thayal360` repository
3. Click **"Import"**

### 4.3: Configure Project

Vercel will auto-detect Vite. Verify these settings:
- **Framework Preset:** Vite
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 4.4: Add Environment Variable

1. Click **"Environment Variables"**
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `http://localhost:5000` (temporary, will update after backend deployment)
3. Click **"Deploy"**

### 4.5: Wait for Deployment

- Vercel will build and deploy your app (takes 2-3 minutes)
- You'll get a URL like: `https://thayal360.vercel.app`

---

## 🚀 Step 5: Deploy Backend to Render

### 5.1: Sign Up for Render

1. Go to: https://render.com/register
2. Click **"Sign up with GitHub"**
3. Authorize Render to access your GitHub account

### 5.2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect account"** to link GitHub
3. Find and select your `thayal360` repository
4. Click **"Connect"**

### 5.3: Configure Service

Fill in these details:
- **Name:** `thayal360-backend`
- **Region:** Choose closest to you (e.g., Singapore, Oregon)
- **Branch:** `main`
- **Root Directory:** Leave empty
- **Runtime:** Node
- **Build Command:** `cd backend && npm install`
- **Start Command:** `node backend/server.cjs`
- **Instance Type:** Free

### 5.4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these:
1. **PORT** = `5000`
2. **NODE_ENV** = `production`

### 5.5: Create Web Service

1. Click **"Create Web Service"**
2. Wait for deployment (takes 3-5 minutes)
3. Copy your backend URL (e.g., `https://thayal360-backend.onrender.com`)

---

## 🔗 Step 6: Connect Frontend to Backend

### 6.1: Update Vercel Environment Variable

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Find `VITE_API_URL`
4. Click **"Edit"**
5. Update value to your Render backend URL:
   - `https://thayal360-backend.onrender.com`
6. Click **"Save"**

### 6.2: Redeploy Frontend

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment

---

## 🔗 Step 7: Update Backend CORS

### 7.1: Update server.cjs

Add your Vercel URL to CORS configuration:

```javascript
// In backend/server.cjs
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://thayal360.vercel.app',  // Add your Vercel URL
    'https://thayal360-*.vercel.app'  // Allows preview deployments
  ],
  credentials: true
}));
```

### 7.2: Commit and Push

```bash
git add backend/server.cjs
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy!

---

## ✅ Step 8: Test Your Deployed App

### 8.1: Open Your App

Go to your Vercel URL: `https://thayal360.vercel.app`

### 8.2: Test Features

1. ✅ Homepage loads
2. ✅ Navigate to Services
3. ✅ Login with: `priya@example.com` / `123456`
4. ✅ Add item to cart
5. ✅ Go to checkout
6. ✅ Place order
7. ✅ Check dashboard for order

---

## 🎉 Your App is Live!

**Frontend URL:** `https://thayal360.vercel.app`  
**Backend URL:** `https://thayal360-backend.onrender.com`

---

## 🔄 Future Updates

Whenever you make changes:

```bash
# Make your changes
# ...

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

Both Vercel and Render will automatically deploy your updates!

---

## 🐛 Troubleshooting

### Problem: "git push" asks for username/password

**Solution:** Use Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Select scopes: `repo`
4. Generate and copy token
5. When pushing, use token as password

### Problem: API calls failing on deployed app

**Solution:** Check CORS and API URL
1. Verify `VITE_API_URL` in Vercel
2. Check CORS settings in backend
3. Check browser console for errors

### Problem: Backend not starting on Render

**Solution:** Check logs
1. Go to Render dashboard
2. Click on your service
3. Check **"Logs"** tab
4. Look for errors

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **GitHub Docs:** https://docs.github.com

---

## 🎯 Quick Commands Reference

```bash
# Check git status
git status

# View commit history
git log --oneline

# Check remote
git remote -v

# Pull latest changes
git pull origin main

# Push changes
git push origin main

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout main
```

---

**You're all set! 🚀 Happy deploying!**
