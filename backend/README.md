# Personal Expense & Budget Tracker API

A full-stack expense tracking application with PostgreSQL database and RESTful API built with Node.js and Express.

## 🚀 Features

- **User Authentication**: JWT-based secure registration and login
- **Category Management**: Create, read, update, and delete expense categories
- **Expense Tracking**: Full CRUD operations for expenses with filtering
- **Monthly Summaries**: View spending breakdown by category
- **PostgreSQL Database**: Relational data storage with proper foreign key relationships
- **Deployed on Render**: Production-ready with cloud database and web service

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Render PostgreSQL or local)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=production
PORT=5000

# Render PostgreSQL Database URL (External Database URL from Render)
DATABASE_URL=postgresql://username:password@hostname:5432/database_name

# JWT Configuration
JWT_SECRET=your_super_secure_random_secret_key_here
JWT_EXPIRE=7d

# CORS (Frontend URL)
CLIENT_URL=http://localhost:3000
```

### 4. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The API will run on `http://localhost:5000`

## 🗄️ Database Setup (Render PostgreSQL)

### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - Name: `expense-tracker-db`
   - Database: `expense_tracker`
   - User: (auto-generated)
   - Region: Choose closest to you
   - Plan: Free tier
4. Click "Create Database"

### Step 2: Get Connection Details

After creation, you'll see:
- **Internal Database URL**: For apps on Render
- **External Database URL**: For external connections and local development

Copy the **External Database URL** and use it in your `.env` file as `DATABASE_URL`.

### Step 3: Database Initialization

The application automatically creates all necessary tables on first run:
- `users` - User accounts
- `categories` - Expense categories
- `expenses` - Individual expense records

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Category Routes (`/api/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | Yes |
| GET | `/api/categories/:id` | Get single category | Yes |
| POST | `/api/categories` | Create category | Yes |
| PUT | `/api/categories/:id` | Update category | Yes |
| DELETE | `/api/categories/:id` | Delete category | Yes |

### Expense Routes (`/api/expenses`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/expenses` | Get all expenses | Yes |
| GET | `/api/expenses/:id` | Get single expense | Yes |
| POST | `/api/expenses` | Create expense | Yes |
| PUT | `/api/expenses/:id` | Update expense | Yes |
| DELETE | `/api/expenses/:id` | Delete expense | Yes |
| GET | `/api/expenses/summary/monthly` | Monthly summary | Yes |

## 📝 API Usage Examples

### 1. Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Create Category

```bash
POST /api/categories
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Food",
  "color": "#FF6B6B"
}
```

### 4. Create Expense

```bash
POST /api/expenses
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 45.50,
  "description": "Grocery shopping",
  "date": "2026-02-05",
  "category_id": 1
}
```

### 5. Get Monthly Summary

```bash
GET /api/expenses/summary/monthly?year=2026&month=2
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🚢 Deployment to Render

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Expense Tracker API"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `expense-tracker-api`
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables

In the Render dashboard for your web service, add:

- `DATABASE_URL`: Use the **Internal Database URL** from your PostgreSQL instance
- `JWT_SECRET`: A secure random string
- `JWT_EXPIRE`: `7d`
- `NODE_ENV`: `production`
- `CLIENT_URL`: Your frontend URL (or `*` for now)

### Step 4: Deploy

Click "Create Web Service" and Render will automatically deploy your API!

Your API will be live at: `https://expense-tracker-api-jfc9.onrender.com`

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get the token from `/api/auth/register` or `/api/auth/login` responses.

## 📊 Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Categories Table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- user_id (INTEGER FK → users)
- color (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Expenses Table
```sql
- id (SERIAL PRIMARY KEY)
- amount (DECIMAL)
- description (VARCHAR)
- date (DATE)
- category_id (INTEGER FK → categories)
- user_id (INTEGER FK → users)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🧪 Testing the API

Use tools like:
- **Postman**: Import and test all endpoints
- **Thunder Client**: VS Code extension
- **curl**: Command line testing

Example curl command:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

## 📦 Project Structure

```
backend/
├── config/
│   ├── database.js       # PostgreSQL connection
│   └── initDb.js         # Database initialization
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   └── expenseController.js
├── middleware/
│   └── auth.js           # JWT authentication
├── models/
│   ├── User.js
│   ├── Category.js
│   └── Expense.js
├── routes/
│   ├── auth.js
│   ├── categories.js
│   └── expenses.js
├── .env.example
├── .gitignore
├── package.json
└── server.js             # Main application file
```

## 🎓 Sprint 1 Requirements Checklist

✅ **Deployment & Integrity**
- Project deployed to Render web service
- PostgreSQL database on Render
- GitHub repository with commit history

✅ **Sprint Completion**
- All CRUD operations for Users, Categories, Expenses
- JWT authentication implemented
- RESTful API design
- PostgreSQL database integration

✅ **Technical Implementation**
- Express.js framework
- PostgreSQL with proper relationships
- Security with bcryptjs and JWT
- Input validation with express-validator
- Error handling

## 👤 Author

Gurjant Singh

## 📄 License

ISC
