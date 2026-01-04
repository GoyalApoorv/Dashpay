# Dashpay Deployment Guide

This guide will walk you through deploying the Dashpay application to production using free hosting services.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Vercel account (free tier)
- Render account (free tier)

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (select the free M0 tier)
4. Wait for the cluster to be created (2-5 minutes)
5. Click "Connect" on your cluster
6. Add your IP address (or use `0.0.0.0/0` for access from anywhere)
7. Create a database user with username and password
8. Select "Connect your application"
9. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
10. Replace `<password>` with your actual password
11. Add database name after `.net/` (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dashpay`)

## Step 2: Deploy Backend to Render

1. Push your code to GitHub if you haven't already
2. Go to [Render](https://render.com) and sign up/log in
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `dashpay-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev`
   - **Plan**: Free
6. Add environment variables (click "Advanced" then "Add Environment Variable"):
   - `DATABASE_URL`: Your MongoDB connection string from Step 1
   - `JWT_SECRET`: Generate a strong secret using this command in your terminal:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - `PORT`: `10000` (Render uses this port)
   - `FRONTEND_URL`: Leave empty for now, we'll update this after deploying the frontend
7. Click "Create Web Service"
8. Wait for deployment to complete (5-10 minutes)
9. Copy your backend URL (e.g., `https://dashpay-backend.onrender.com`)

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and sign up/log in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 2 (e.g., `https://dashpay-backend.onrender.com`)
6. Click "Deploy"
7. Wait for deployment to complete (2-5 minutes)
8. Copy your frontend URL (e.g., `https://dashpay.vercel.app`)

## Step 4: Update Backend CORS Configuration

1. Go back to Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update the `FRONTEND_URL` environment variable:
   - **Value**: Your Vercel frontend URL from Step 3 (e.g., `https://dashpay.vercel.app`)
5. Save changes
6. Render will automatically redeploy your backend

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try signing up with a new account
3. Sign in with your credentials
4. Check your wallet balance
5. Search for users and try a money transfer
6. Verify the transaction appears in your transaction history

## Troubleshooting

### Backend Issues
- **Check Render logs**: Go to your service → "Logs" tab
- **Database connection failed**: Verify your MongoDB connection string and IP whitelist
- **JWT errors**: Ensure JWT_SECRET is set correctly

### Frontend Issues
- **API calls failing**: Check that `VITE_API_URL` is set correctly in Vercel
- **CORS errors**: Verify `FRONTEND_URL` is set correctly in Render backend
- **Build errors**: Check Vercel deployment logs

### Common Issues
- **Free tier limitations**: Render free tier may spin down after inactivity (takes 30-60 seconds to wake up)
- **Environment variables**: Remember to redeploy after changing environment variables
- **HTTPS required**: Both services provide HTTPS by default, which is required for secure authentication

## Monitoring

- **Render**: Monitor backend logs and metrics in the Render dashboard
- **Vercel**: Check deployment status and analytics in Vercel dashboard
- **MongoDB Atlas**: Monitor database usage and performance in Atlas dashboard

## Updating Your Deployment

### Backend Updates
1. Push changes to GitHub
2. Render will automatically redeploy (if auto-deploy is enabled)
3. Or manually redeploy from Render dashboard

### Frontend Updates
1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Or manually redeploy from Vercel dashboard

## Cost

All services used in this guide have free tiers:
- **MongoDB Atlas**: 512MB storage (free forever)
- **Render**: 750 hours/month (free tier)
- **Vercel**: Unlimited deployments for personal projects

## Security Recommendations

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Regularly rotate secrets** - Update JWT_SECRET periodically
4. **Monitor access logs** - Check for suspicious activity
5. **Keep dependencies updated** - Run `npm audit` regularly
