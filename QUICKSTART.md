# 🚀 QUICK START GUIDE

**Get your Personal Expense Tracker API running in 5 minutes!**

---

## Local Development (Test Immediately)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Set Up Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your database URL
# For testing, you can use a local PostgreSQL or Render database
```

**Minimum .env setup:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/expense_tracker
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Step 3: Start Server
```bash
# Development mode (auto-restart)
npm run dev

# OR Production mode
npm start
```

**Expected output:**
```
🚀 Initializing database tables...
✅ Users table created
✅ Categories table created
✅ Expenses table created
✅ Database indexes created
🎉 Database initialization completed successfully!
✅ Connected to PostgreSQL database
🚀 Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000
```

### Step 4: Test API
Open browser: `http://localhost:5000`

**Expected response:**
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

✅ **Your API is running!**

---

## Deploy to Render (Production)

### Prerequisites
- GitHub account
- Render account (free)

### Quick Deploy Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. **Create PostgreSQL Database**
   - Go to https://dashboard.render.com/
   - New + → PostgreSQL
   - Name: `expense-tracker-db`
   - Plan: Free
   - Create Database
   - **Copy Internal Database URL**

3. **Create Web Service**
   - New + → Web Service
   - Connect GitHub repo
   - Settings:
     - Root Directory: `backend`
     - Build: `npm install`
     - Start: `npm start`
   - Add Environment Variables:
     - `DATABASE_URL`: [Internal Database URL]
     - `JWT_SECRET`: [Random string]
     - `NODE_ENV`: `production`
   - Create Web Service

4. **Wait for Deployment** (2-3 minutes)

5. **Test Live API**
   - Your URL: `https://expense-tracker-api-jfc9.onrender.com`

✅ **Your API is live!**

---

## Test with Postman

### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Copy the token from response!**

### 2. Create Category
```
POST http://localhost:5000/api/categories
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Food",
  "color": "#FF6B6B"
}
```

### 3. Create Expense
```
POST http://localhost:5000/api/expenses
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "amount": 45.50,
  "description": "Grocery shopping",
  "date": "2026-02-05",
  "category_id": 1
}
```

### 4. Get Expenses
```
GET http://localhost:5000/api/expenses
Authorization: Bearer YOUR_TOKEN
```

---

## Common Issues

### "Cannot connect to database"
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Test connection: `psql DATABASE_URL`

### "Port already in use"
- Change PORT in .env to 5001
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### "Module not found"
- Run `npm install` in backend folder
- Check you're in correct directory

### "Invalid token"
- Token expired (7 days)
- Login again to get new token
- Check Authorization header format

---

## Next Steps

1. ✅ Read `README.md` for full documentation
2. ✅ Check `API_TESTING_GUIDE.md` for all endpoints
3. ✅ Follow `DEPLOYMENT_GUIDE.md` for detailed deploy
4. ✅ Review `database_schema.sql` for DB structure

---

## Need Help?

**Documentation Files:**
- `README.md` - Project overview
- `API_TESTING_GUIDE.md` - All endpoints with examples
- `DEPLOYMENT_GUIDE.md` - Step-by-step deploy
- `SUBMISSION.txt` - Sprint submission details

**Test Everything:**
```bash
# Health check
curl http://localhost:5000

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

---

## 🎉 You're Ready!

- ✅ API running locally
- ✅ Database connected
- ✅ All endpoints working
- ✅ Ready for deployment
- ✅ Ready for Sprint 1 demo

**Good luck with your live code review!**
