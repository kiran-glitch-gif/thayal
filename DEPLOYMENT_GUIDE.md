# 🚀 Ultimate Deployment Guide for Thayal360

Follow these exact steps to make your website live for the world to see!

---

## **Part 1: Push Code to GitHub**

You must have your code on GitHub first.
1. Run the `push-to-github.bat` file in your project folder.
2. Enter your GitHub Repository URL when asked.
3. Wait for the success message.

---

## **Part 2: Deploy Backend (Render.com)**

We need to deploy the server first because the frontend needs the server URL.

1. **Go to [Render.com](https://render.com)** and Create an Account.
2. Click **"New +"** → Select **"Web Service"**.
3. Connect your GitHub account and select your **thayal360** repository.
4. **Configure Settings:**
   - **Name:** `thayal360-backend`
   - **Region:** Singapore or closest to you.
   - **Branch:** `main`
   - **Root Directory:** `.` (Leave empty)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **"Create Web Service"**.
6. ⏳ **Wait** for it to deploy (it will say "Live").
7. **Copy the URL** at the top left (e.g., `https://thayal360-backend.onrender.com`).
   👉 **Save this URL! You need it for Part 3.**

---

## **Part 3: Deploy Frontend (Vercel.com)**

1. **Go to [Vercel.com](https://vercel.com)** and Sign Up.
2. Click **"Add New..."** → **"Project"**.
3. Import your **thayal360** repository.
4. **Configure Project:**
   - **Framework Preset:** `Vite` (It should auto-detect).
   - **Root Directory:** `.` (Leave empty).
5. **Expand "Environment Variables"** (Crucial Step!):
   - **Key:** `VITE_API_URL`
   - **Value:** Paste your Render Backend URL from Part 2 (e.g., `https://thayal360-backend.onrender.com`).
   - *Note: Do NOT include a trailing slash `/` at the end.*
6. Click **"Deploy"**.

---

## 🎉 **Success!**

Vercel will give you a domain like `https://thayal360.vercel.app`.
**This is your permanent, shareable website link!**
