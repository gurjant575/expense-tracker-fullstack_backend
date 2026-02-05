# Render Deployment Guide - Complete Step-by-Step

This guide will walk you through deploying your Personal Expense & Budget Tracker API to Render with PostgreSQL database.

## Prerequisites
- GitHub account
- Render account (free tier works)
- Your code ready in the backend folder

---

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository

Open terminal in your project directory:

```bash
cd "location"

# Initialize git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit - Personal Expense Tracker API"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Fill in:
   - Repository name: `expense-tracker-fullstack`
   - Description: "Personal Expense & Budget Tracker - Full Stack Application"
   - Visibility: Public (required for free Render deployment)
4. **DO NOT** check "Add README" (we already have one)
5. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add remote (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker-fullstack.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Part 2: Set Up PostgreSQL Database on Render

### Step 1: Create Database

1. Go to https://dashboard.render.com/
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - **Name**: `expense-tracker-db`
   - **Database**: `expense_tracker` (lowercase, no spaces)
   - **User**: (auto-generated, leave as is)
   - **Region**: Choose closest region (e.g., Oregon USA)
   - **PostgreSQL Version**: 16 (latest)
   - **Datadog API Key**: (leave blank)
   - **Plan**: Free
4. Click "Create Database"

### Step 2: Wait for Database Creation

- It takes 2-3 minutes
- Status will change from "Creating" to "Available"
- Don't close the page!

### Step 3: Copy Connection Details

Once available, you'll see:

**Internal Database URL** (for apps on Render):
```
postgresql://expense_tracker_db_user:xxx@dpg-xxx.oregon-postgres.render.com/expense_tracker_db
```

**External Database URL** (for local development):
```
postgresql://expense_tracker_db_user:xxx@dpg-xxx.oregon-postgres.render.com/expense_tracker_db
```

**IMPORTANT**: 
- Copy the **Internal Database URL** for your web service
- Copy the **External Database URL** for local testing

✅ Database is ready!

---

## Part 3: Deploy Web Service (API)

### Step 1: Create Web Service

1. Still in Render dashboard, click "New +" → "Web Service"
2. Click "Connect account" to connect GitHub (if not already)
3. Find and select your repository: `expense-tracker-fullstack`
4. Click "Connect"

### Step 2: Configure Web Service

Fill in the following:

**Basic Settings:**
- **Name**: `expense-tracker-api`
- **Region**: Same as your database (e.g., Oregon USA)
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ IMPORTANT!
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- **Plan**: Free

### Step 3: Add Environment Variables

Scroll down to "Environment Variables" section and add these:

Click "Add Environment Variable" for each:

1. **Key**: `NODE_ENV`  
   **Value**: `production`

2. **Key**: `DATABASE_URL`  
   **Value**: `[Paste Internal Database URL from Step 2]`

3. **Key**: `JWT_SECRET`  
   **Value**: `your_super_secure_random_secret_key_change_this_12345`

4. **Key**: `JWT_EXPIRE`  
   **Value**: `7d`

5. **Key**: `CLIENT_URL`  
   **Value**: `*` (for now, will update when frontend is ready)

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will:
   - Clone your repository
   - Run `npm install`
   - Run `npm start`
   - Initialize database tables automatically
3. Watch the logs - takes 2-3 minutes
4. Status will change to "Live" when ready

✅ Your API is now deployed!

---

## Part 4: Test Your Deployment

### Get Your API URL

After deployment, you'll see:
```
https://expense-tracker-api.onrender.com
```

### Test Endpoints

#### 1. Test Health Check

Open browser or use curl:
```
https://expense-tracker-api.onrender.com
```

Should return:
```json
{
  "success": true,
  "message": "Personal Expense & Budget Tracker API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "categories": "/api/categories",
    "expenses": "/api/expenses"
  }
}
```

#### 2. Test Registration

Using Postman or curl:
```bash
curl -X POST https://expense-tracker-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

✅ If you get a token back, everything works!

---

## Part 5: Connect Local Development to Render Database

Want to test locally with production database?

### Update .env file:

```env
NODE_ENV=development
PORT=5000

# Use External Database URL from Render
DATABASE_URL=postgresql://expense_tracker_db_user:xxx@dpg-xxx.oregon-postgres.render.com/expense_tracker_db

JWT_SECRET=your_super_secure_random_secret_key_change_this_12345
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

Now run locally:
```bash
cd backend
npm install
npm start
```

Your local app will use the Render database!

---

## Part 6: Troubleshooting

### Issue: "Application failed to respond"

**Solution**: Check the logs in Render dashboard
- Usually means database connection failed
- Verify `DATABASE_URL` is correct (Internal URL for Render)

### Issue: "Table does not exist"

**Solution**: Database wasn't initialized
- Check server.js has `initDatabase()` call
- Restart the service in Render dashboard

### Issue: "Cannot find module"

**Solution**: Dependencies not installed
- Verify `package.json` is in `backend` folder
- Check "Root Directory" is set to `backend`

### Issue: Free tier sleeping

**Note**: Render free tier sleeps after 15 min of inactivity
- First request after sleep takes 30-50 seconds
- This is normal for free tier

---

## Part 7: Sprint 1 Submission

### For GitHub Repository URL:

Your repo URL will be:
```
https://github.com/YOUR_USERNAME/expense-tracker-fullstack
```

### For Live Demo:

Your API URL will be:
```
https://expense-tracker-api.onrender.com
```

### Create Submission Text File:

Create a file named `SUBMISSION.txt`:

```
Student Name: Gurjant Singh
Course: PROG2500-26W-Sec1

GitHub Repository:
https://github.com/YOUR_USERNAME/expense-tracker-fullstack

Live API URL:
https://expense-tracker-api.onrender.com

Database Type: PostgreSQL (Render)

API Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile
- GET /api/categories
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id
- GET /api/expenses
- POST /api/expenses
- PUT /api/expenses/:id
- DELETE /api/expenses/:id
- GET /api/expenses/summary/monthly

Technologies Used:
- Node.js & Express
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation

Features Implemented:
✅ User registration and login with JWT
✅ Complete CRUD for Categories
✅ Complete CRUD for Expenses
✅ Monthly expense summaries
✅ Database relationships (Users → Categories → Expenses)
✅ Input validation and error handling
✅ Deployed to Render with PostgreSQL
✅ GitHub repository with commit history

Notes:
- All endpoints are protected with JWT authentication
- Database automatically initializes on first run
- API is fully functional and tested
```

---

## Part 8: Regular Updates & Commits

As you continue working:

```bash
# Check status
git status

# Add changes
git add .

# Commit with meaningful message
git commit -m "Add expense filtering by date range"

# Push to GitHub
git push origin main
```

Render will **automatically redeploy** when you push to GitHub!

---

## Part 9: Monitoring & Logs

### View Logs in Render:

1. Go to your Web Service dashboard
2. Click "Logs" tab
3. See real-time application logs

### Check Database:

1. Go to your PostgreSQL dashboard
2. Click "Connect"
3. Use provided connection details with any PostgreSQL client (like DBeaver or pgAdmin)

---

## Part 10: Cost & Limits

**Free Tier Includes:**
- PostgreSQL Database: 256 MB storage, 97 hours/month uptime
- Web Service: 512 MB RAM, 750 hours/month
- Auto-sleep after 15 min inactivity

**For Production** (after course):
- Upgrade to Starter ($7/month per service)
- No sleep, always available
- More resources

---

## Summary Checklist

Before submission, verify:

✅ Code is on GitHub with commit history  
✅ PostgreSQL database created on Render  
✅ Web Service deployed on Render  
✅ Environment variables configured  
✅ API is accessible at public URL  
✅ All endpoints tested and working  
✅ SUBMISSION.txt file created  
✅ README.md is complete  

---

## Need Help?

**Common Commands:**

```bash
# Check git status
git status

# View commit history
git log --oneline

# View environment variables locally
cat .env

# Test API locally
npm start

# View PostgreSQL version
node -e "const { pool } = require('./config/database'); pool.query('SELECT version()').then(r => console.log(r.rows[0]))"
```

**Render Support:**
- Documentation: https://render.com/docs
- Community: https://community.render.com/

---

## 🎉 Congratulations!

Your API is now:
- ✅ Deployed to production
- ✅ Using PostgreSQL database
- ✅ Accessible worldwide
- ✅ Ready for Sprint 1 review

Good luck with your live demo!
