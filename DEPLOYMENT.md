# Deployment Guide

Follow these steps to deploy ExpenseIQ to production.

## 1. Backend Deployment (Render)

Render is a great platform for hosting Node.js APIs for free.

1. **Push your code to GitHub**
   Ensure all your latest changes are pushed to your GitHub repository.

2. **Create a Web Service on Render**
   - Go to [render.com](https://render.com) and log in.
   - Click **New +** and select **Web Service**.
   - Connect your GitHub repository.
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Configure Environment Variables**
   In the Render dashboard for your service, go to the "Environment" tab and add the following variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render will use this)
   - `MONGO_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *A strong random string for signing tokens*
   - `FRONTEND_URL`: *Leave this blank for now, you will fill it in after deploying the frontend.*

4. **Deploy**
   Save the changes. Render will build and deploy your backend. Once complete, copy the backend URL (e.g., `https://expenseiq-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

Vercel is the best platform for hosting Vite/React applications.

1. **Create a New Project on Vercel**
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **Add New...** -> **Project**.
   - Import your GitHub repository.

2. **Configure the Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Configure Environment Variables**
   Open the "Environment Variables" section before deploying and add:
   - `VITE_API_URL`: *The URL of your Render backend plus `/api/v1`* 
     *(e.g., `https://expenseiq-backend.onrender.com/api/v1`)*

4. **Deploy**
   Click **Deploy**. Vercel will build your frontend. Once complete, copy your new Vercel domain (e.g., `https://expenseiq.vercel.app`).

---

## 3. Finalizing CORS (Very Important)

Now that you have your Vercel frontend URL, you need to tell your Render backend to allow requests from it.

1. Go back to your **Render Web Service** dashboard.
2. Go to the **Environment** tab.
3. Add or update the `FRONTEND_URL` variable with your Vercel URL *(e.g., `https://expenseiq.vercel.app`)*. Do not include a trailing slash.
4. Save the changes. Render will automatically restart your backend.

**Your application is now fully deployed and ready for production!**
