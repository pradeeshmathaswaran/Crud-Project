# Step-by-Step Deployment Guide

Follow these steps to deploy your project.

## 1. Setup MongoDB Atlas (New Cluster)
1.  Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2.  Click **+ Create** to create a new cluster (Shared/Free Tier).
3.  Go to **Database Access** -> **+ Add New Database User**. Choose "Password" as the auth method and note down the **Username** and **Password**.
4.  Go to **Network Access** -> **+ Add IP Address**. Click **Allow Access From Anywhere** (`0.0.0.0/0`) and **Confirm**.
5.  Go to **Database** (clusters view) -> **Connect**.
6.  Select **Drivers** (Node.js).
7.  Copy the **Connection String** (it starts with `mongodb+srv://...`).

---

## 2. Prepare GitHub
1.  Initialize a Git repository in your project root (if not already done).
2.  Create a new repository on [GitHub](https://github.com/new).
3.  Push your code to GitHub:
    ```bash
    git add .
    git commit -m "Deploy project"
    git branch -M main
    git remote add origin <your-github-repo-url>
    git push -u origin main
    ```

---

## 2. Deploy Backend to Render
1.  Go to [Render.com](https://dashboard.render.com/) and log in.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    - **Name**: `crud-backend` (or similar)
    - **Root Directory**: `backend`
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5.  Click **Advanced** and add **Environment Variables**:
    - `MONGO_URI`: (Copy-paste your connection string from your local `backend/.env`)
    - `PORT`: `5000`
6.  Click **Create Web Service**.
7.  **Note your backend URL**: It will look like `https://crud-backend.onrender.com`.

---

## 3. Deploy Frontend to Vercel
1.  Go to [Vercel.com](https://vercel.com/dashboard) and log in.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  In the **Configure Project** screen:
    - **Framework Preset**: Vite (should be auto-detected)
    - **Root Directory**: `frontend`
5.  Expand **Environment Variables** and add:
    - **Key**: `VITE_API_URL`
    - **Value**: `https://your-backend-url.onrender.com/api` (Replace with your actual Render URL)
6.  Click **Deploy**.

---

## 4. Verification
1.  Open your Vercel URL.
2.  Try adding an employee.
3.  If it works, your full-stack app is live!
