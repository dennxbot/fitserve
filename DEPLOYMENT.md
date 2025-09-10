# 🚀 FITSERVE Deployment Guide for Render

This guide will walk you through deploying FITSERVE to Render with separate backend and frontend services.

## Prerequisites

1. [Render account](https://render.com/) (free tier available)
2. GitHub repository connected (✅ Already done: https://github.com/dennxbot/fitserve)
3. Supabase project set up
4. USDA API key

## 📦 Part 1: Deploy Backend to Render

### Step 1: Create Backend Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (`dennxbot/fitserve`)
4. Configure the service:
   - **Name**: `fitserve-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or choose based on needs)

### Step 2: Set Environment Variables

In the Render backend service settings, go to **Environment** tab and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `3000` | |
| `SUPABASE_URL` | `your-supabase-url` | From Supabase dashboard |
| `SUPABASE_KEY` | `your-supabase-anon-key` | From Supabase dashboard |
| `JWT_SECRET` | `generate-a-secure-random-string` | Use a password generator |
| `USDA_API_KEY` | `your-usda-api-key` | From USDA FoodData Central |

### Step 3: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the build and deployment to complete
3. Note your backend URL (e.g., `https://fitserve-backend.onrender.com`)

## 🎨 Part 2: Deploy Frontend to Render

### Step 1: Update Frontend Configuration

Before deploying, update the production API URL:

1. Edit `frontend/.env.production`:
```env
VITE_API_URL=https://fitserve-backend.onrender.com/api/v1
```
Replace `fitserve-backend.onrender.com` with your actual backend URL from Part 1.

2. Commit and push changes:
```bash
git add frontend/.env.production
git commit -m "Update production API URL for Render deployment"
git push origin main
```

### Step 2: Create Frontend Static Site

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository (`dennxbot/fitserve`)
4. Configure the service:
   - **Name**: `fitserve-frontend` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Step 3: Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for the build and deployment to complete
3. Your frontend will be available at the provided URL

## ⚙️ Part 3: Configure CORS (Important!)

### Update Backend CORS Settings

The backend needs to allow requests from your frontend domain. Update your backend's CORS configuration:

1. In `backend/app.js`, ensure CORS is configured:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173', // Development
    'https://fitserve-frontend.onrender.com', // Your Render frontend URL
    // Add any other allowed origins
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

2. Commit and push:
```bash
git add backend/app.js
git commit -m "Update CORS for Render deployment"
git push origin main
```

The backend will automatically redeploy on Render.

## 🔍 Part 4: Verify Deployment

### Test Backend
```bash
curl https://fitserve-backend.onrender.com/api/v1/health
```

### Test Frontend
1. Visit your frontend URL
2. Try registering a new account
3. Test food logging and other features

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. Backend not starting
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure `npm start` script exists in `package.json`

#### 2. Frontend can't connect to backend
- Verify CORS settings
- Check that `VITE_API_URL` in production build is correct
- Ensure backend is running

#### 3. Database connection issues
- Verify Supabase URL and key are correct
- Check Supabase connection pooling settings
- Ensure IP restrictions are disabled or Render IPs are whitelisted

#### 4. Slow initial load (Cold starts)
- Free tier services sleep after inactivity
- Consider upgrading to paid tier for always-on service
- Implement a health check ping to keep service warm

## 📊 Monitoring

### Render Dashboard Features
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, and request metrics
- **Events**: Deployment history and status
- **Environment**: Manage environment variables

### Recommended Monitoring Setup
1. Set up health check endpoint
2. Configure alerts for failures
3. Monitor response times
4. Track error rates

## 🔄 Continuous Deployment

Render automatically deploys when you push to the main branch:

1. Make changes locally
2. Test thoroughly
3. Commit and push:
```bash
git add .
git commit -m "Your changes"
git push origin main
```
4. Render will automatically rebuild and deploy

## 💰 Cost Considerations

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- Limited build minutes (750 hours/month)
- Basic metrics only

### When to Upgrade
- Need always-on services
- Require more performance
- Need advanced features (custom domains, etc.)

## 🔒 Security Best Practices

1. **Never commit sensitive data**
   - Keep `.env` files out of version control
   - Use Render's environment variables

2. **Use HTTPS everywhere**
   - Render provides SSL certificates automatically

3. **Regularly update dependencies**
```bash
npm audit
npm update
```

4. **Monitor for vulnerabilities**
   - Use GitHub's Dependabot
   - Regular security audits

## 📝 Deployment Checklist

- [ ] Backend deployed and running
- [ ] All environment variables configured
- [ ] Frontend deployed with correct API URL
- [ ] CORS configured properly
- [ ] Database connections working
- [ ] User registration working
- [ ] Food search working
- [ ] Authentication flow working
- [ ] Health check endpoint responding

## 🆘 Support Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [FITSERVE Issues](https://github.com/dennxbot/fitserve/issues)

---

**Deployment Complete! 🎉** Your FITSERVE app should now be live on Render!
