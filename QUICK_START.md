# 🚀 Quick Start Guide - Deploy SmartShort in 10 Minutes

## ⚡ Super Quick Deployment

### 1. Fix ESLint Errors (Critical!)
```bash
# Run the automatic fix script
node fix-eslint-errors.js
```

### 2. Test Build Locally
```bash
cd client
npm run build
```

### 3. Deploy to Vercel (Frontend)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `client`
5. Add environment variables:
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-super-secret-key
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
   ```
6. Click "Deploy"

### 4. Deploy Backend (Railway)
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set **Root Directory** to `server`
5. Add environment variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   BASE_URL=https://your-backend-domain.railway.app
   ```
6. Deploy

### 5. Update Frontend Environment
After getting your backend URL, update the frontend environment in Vercel:
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.railway.app
```

## 🗄️ Database Setup (Choose One)

### Option A: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster (free tier available)
3. Get connection string
4. Add to Railway environment variables

### Option B: Railway MongoDB
1. In Railway dashboard, add MongoDB plugin
2. Get connection string
3. Add to environment variables

## 🔧 Environment Variables Checklist

### Frontend (Vercel)
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXT_PUBLIC_API_BASE_URL`

### Backend (Railway)
- [ ] `MONGODB_URI`
- [ ] `JWT_SECRET`
- [ ] `CORS_ORIGIN`
- [ ] `BASE_URL`

## 🧪 Test Your Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend Health**: `curl https://your-backend-url.com/api/health`
3. **URL Shortening**: Try shortening a URL on your frontend
4. **Authentication**: Test sign up/sign in

## 🚨 Common Issues & Fixes

### Build Fails on Vercel
- Run `node fix-eslint-errors.js` first
- Check all environment variables are set
- Verify root directory is set to `client`

### CORS Errors
- Check `CORS_ORIGIN` matches your frontend URL exactly
- Include protocol: `https://your-domain.vercel.app`

### Database Connection Fails
- Verify MongoDB connection string
- Check network access (IP whitelist for Atlas)
- Ensure database is running

### Authentication Issues
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain
- Check OAuth provider configuration

## 📞 Need Help?

1. Check the full `DEPLOYMENT_GUIDE.md`
2. Review deployment logs in Vercel/Railway
3. Test locally first with `./deploy.sh`
4. Verify all environment variables

## 🎉 Success!

Your SmartShort URL Shortener is now live! 🚀

**Frontend**: https://your-domain.vercel.app  
**Backend**: https://your-backend-domain.railway.app

---

## 🔄 Update Deployment

To update your deployment:

1. Push changes to GitHub
2. Vercel will auto-deploy frontend
3. Railway will auto-deploy backend
4. Check deployment logs for any issues

**That's it! Your URL shortener is ready for production use! 🎉** 