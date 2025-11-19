# Deployment Guide: AI Finance Tracker

## Overview
This guide covers deploying the AI Finance Tracker application with:
- **Frontend**: Netlify (React build)
- **Backend**: Render (Node.js Express)
- **Database**: MongoDB (Atlas or local)

---

## Prerequisites
1. GitHub account with the repository pushed
2. Netlify account (free tier available)
3. Render account (free tier available)
4. MongoDB Atlas account (free tier available) or local MongoDB instance
5. Environment variables ready (see `.env.example` files)

---

## Frontend Deployment (Netlify)

### Step 1: Prepare Frontend
```bash
cd frontend
npm install
npm run build  # Must compile without errors
```

### Step 2: Create Netlify Site
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Select GitHub and authorize
4. Choose your repository
5. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Base directory**: `frontend`

### Step 3: Configure Environment Variables
In Netlify Dashboard → Site Settings → Build & Deploy → Environment:
```
REACT_APP_API_URL=<your-render-backend-url>
```

### Step 4: Deploy
Push to GitHub's main branch to trigger automatic deployment.

---

## Backend Deployment (Render)

### Step 1: Prepare Backend

Create `.env` in backend directory:
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secure-secret>
CORS_ORIGIN=<your-netlify-frontend-url>
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure service:
   - **Name**: `ai-finance-tracker-backend`
   - **Environment**: Node
   - **Build Command**: `npm ci --only=production`
   - **Start Command**: `node server.js`
   - **Plan**: Starter (free tier)

### Step 3: Add Environment Variables
In Render Dashboard → Service Settings → Environment Variables:
```
NODE_ENV=production
MONGODB_URI=<connection-string>
JWT_SECRET=<secret>
CORS_ORIGIN=<netlify-url>
PORT=3000
NODE_OPTIONS=--max-old-space-size=512
npm_config_jobs=1
```

### Step 4: Deploy
Push to GitHub to trigger deployment. Monitor logs for any issues.

---

## MongoDB Setup

### Option A: MongoDB Atlas (Recommended for Production)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (M0 free tier)
4. Create database user
5. Whitelist IP (or 0.0.0.0 for development)
6. Copy connection string
7. Replace `<password>` in connection string with user password

### Option B: Local MongoDB
```bash
# Install MongoDB
# Start MongoDB service
mongod

# Connection string
MONGODB_URI=mongodb://localhost:27017/ai-finance-tracker
```

---

## Troubleshooting

### Netlify Build Fails with ESLint Errors
- ESLint warnings are treated as errors (CI=true)
- Fix all ESLint warnings before deployment
- Check build logs for specific errors
- Solution: Add `// eslint-disable-next-line` with comments or fix the issue

### Render Memory Issues
Render free tier has 512MB RAM limit. If npm install fails:
1. Use `.npmrc` with job limit: `npm_config_jobs=1`
2. Use `npm ci --only=production` instead of `npm install`
3. Set `NODE_OPTIONS=--max-old-space-size=512`
4. Upgrade to paid plan if needed

### CORS Errors
Backend and frontend must have matching CORS origin:
- Netlify frontend URL: `https://your-site.netlify.app`
- Render backend CORS_ORIGIN: Set to Netlify URL
- Backend CORS middleware: Uses CORS_ORIGIN env variable

### Database Connection Fails
1. Verify MongoDB URI is correct
2. Check IP whitelist in MongoDB Atlas
3. Ensure credentials are URL-encoded (special chars like @ need %40)
4. Test connection locally first

### 502/503 Errors from Backend
- Check Render logs for errors
- Verify environment variables are set
- Ensure MongoDB connection is working
- Check Node.js version compatibility

---

## Performance Optimization

### Frontend (Netlify)
- Code splitting is automatic with React
- Build output is gzipped
- Monitor bundle size
- Use lazy loading for components

### Backend (Render)
- Free tier may have cold starts (30 seconds)
- Upgrade to paid plan to avoid auto-sleep
- Use connection pooling for MongoDB
- Monitor response times

---

## Monitoring & Maintenance

### Netlify
- Monitor deploys in Netlify Dashboard
- Check build logs for warnings
- Set up alerts for failed builds
- Review performance in Lighthouse reports

### Render
- Check service health status
- Monitor memory/CPU usage
- Review logs regularly
- Set up alerts for crashes

### MongoDB Atlas
- Monitor database stats
- Check connection metrics
- Review security logs
- Backup your data regularly

---

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong, random secret (>32 characters)
3. **CORS**: Only allow your frontend domain
4. **HTTPS**: All platforms use HTTPS by default
5. **Database**: Use strong passwords, IP whitelist
6. **Rate Limiting**: Backend has rate limiting enabled
7. **Helmet**: Security headers are configured

---

## Quick Links
- Netlify Docs: https://docs.netlify.com
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Express Security: https://expressjs.com/en/advanced/best-practice-security.html

---

## Support
For deployment issues:
1. Check application logs (Netlify & Render dashboards)
2. Review error messages carefully
3. Verify environment variables
4. Test locally before deploying
5. Check GitHub Issues for similar problems
