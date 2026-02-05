# Personal Expense & Budget Tracker - Full Stack Application

> **Course**: PROG2500-26W-Sec1 - Open-Source Full Stack Development  
> **Student**: Gurjant Singh 
> **Sprint 1**: Backend API Development with PostgreSQL

---

## 📋 Project Overview

A comprehensive expense tracking application that helps users manage their personal finances by tracking expenses, categorizing spending, and viewing monthly summaries.

### Elevator Pitch
Many people struggle to understand where their money goes each month. This application allows users to track expenses, categorize spending, and set monthly budgets, helping them make smarter financial decisions through simple visual summaries.

---

## 🏗️ Architecture

### Database Design (PostgreSQL)

**Three Core Tables:**
1. **Users** - User accounts with authentication
2. **Categories** - Expense categories (Food, Transport, etc.)
3. **Expenses** - Individual expense records

**Relationships:**
- One User → Many Categories
- One Category → Many Expenses
- Expenses reference Categories via foreign key

```
┌─────────────┐
│   Users     │
│  (id, name) │
└──────┬──────┘
       │ 1:N
       ↓
┌──────────────┐
│  Categories  │
│ (id, name)   │
└──────┬───────┘
       │ 1:N
       ↓
┌──────────────┐
│   Expenses   │
│(id, amount)  │
└──────────────┘
```

---

## ✨ Features Implemented (Sprint 1)

### Authentication & Authorization
- ✅ User registration with password hashing (bcryptjs)
- ✅ User login with JWT tokens
- ✅ Protected routes with JWT middleware
- ✅ Profile viewing and updating

### Category Management (Full CRUD)
- ✅ Create expense categories
- ✅ View all user categories
- ✅ Update category details
- ✅ Delete categories (cascades to expenses)

### Expense Tracking (Full CRUD)
- ✅ Add new expenses
- ✅ View all expenses with filtering
- ✅ Filter by category and date range
- ✅ Update expense details
- ✅ Delete expenses
- ✅ Monthly spending summaries

### Technical Implementation
- ✅ RESTful API design
- ✅ PostgreSQL database with proper relationships
- ✅ Input validation with express-validator
- ✅ Error handling and proper status codes
- ✅ Security headers with Helmet
- ✅ CORS configuration

---

## 🚀 Technology Stack

**Backend:**
- Node.js 18+
- Express.js 4.18
- PostgreSQL 16
- JWT for authentication
- bcryptjs for password hashing

**Database:**
- PostgreSQL (Render PostgreSQL)
- pg (node-postgres) driver

**Deployment:**
- Render Web Service (Backend API)
- Render PostgreSQL (Database)

---

## 📁 Project Structure

```
Project/
├── backend/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── initDb.js            # Database initialization
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── categoryController.js
│   │   └── expenseController.js
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   └── expenses.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── server.js                # Main application
│   ├── database_schema.sql      # SQL schema
│   ├── README.md
│   ├── API_TESTING_GUIDE.md
│   └── DEPLOYMENT_GUIDE.md
└── README.md (this file)
```

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database (local or Render)
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/gurjant575/expense-tracker-fullstack_backend.git
cd expense-tracker-fullstack/backend
```

2. **Install dependencies**
```bash
cd backend
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Start the server**
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Server runs on: `http://localhost:5000`

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |
| GET | `/profile` | Get user profile (protected) |
| PUT | `/profile` | Update profile (protected) |

### Categories (`/api/categories`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all categories |
| GET | `/:id` | Get single category |
| POST | `/` | Create category |
| PUT | `/:id` | Update category |
| DELETE | `/:id` | Delete category |

### Expenses (`/api/expenses`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all expenses (supports filters) |
| GET | `/:id` | Get single expense |
| POST | `/` | Create expense |
| PUT | `/:id` | Update expense |
| DELETE | `/:id` | Delete expense |
| GET | `/summary/monthly` | Get monthly summary |

**All endpoints except `/auth/register` and `/auth/login` require JWT authentication.**

---

## 📊 Database Schema

### Users Table
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(100)
email           VARCHAR(255) UNIQUE
password        VARCHAR(255)        -- bcrypt hashed
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Categories Table
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(100)
user_id         INTEGER FK → users(id)
color           VARCHAR(7)          -- Hex color code
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Expenses Table
```sql
id              SERIAL PRIMARY KEY
amount          DECIMAL(10, 2)
description     VARCHAR(255)
date            DATE
category_id     INTEGER FK → categories(id)
user_id         INTEGER FK → users(id)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 🧪 Testing

### Using Postman

1. Import the API collection from `API_TESTING_GUIDE.md`
2. Register a new user
3. Save the JWT token
4. Test all endpoints with the token

### Quick Test Commands

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Category (replace TOKEN)
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Food","color":"#FF6B6B"}'
```

---

## 🚢 Deployment

### Deployed URLs

- **API**: `https://expense-tracker-api-jfc9.onrender.com`
- **Database**: PostgreSQL on Render
- **Repository**: `https://github.com/gurjant575/expense-tracker-fullstack_backend`

### Deployment Steps

Follow the complete guide in `backend/DEPLOYMENT_GUIDE.md`

**Quick Summary:**
1. Push code to GitHub
2. Create PostgreSQL database on Render
3. Create Web Service on Render
4. Configure environment variables
5. Deploy and test

---

## 📚 Documentation

- **README.md** - This file, project overview
- **backend/README.md** - Detailed backend documentation
- **backend/API_TESTING_GUIDE.md** - Complete API testing guide with examples
- **backend/DEPLOYMENT_GUIDE.md** - Step-by-step deployment instructions
- **backend/database_schema.sql** - PostgreSQL schema with sample data

---

## ✅ Sprint 1 Requirements Met

### Deployment & Integrity (10 points)
- ✅ Project deployed to Render (live public URL)
- ✅ GitHub repository with commit history
- ✅ PostgreSQL database configured

### Sprint Completion (40 points)
- ✅ All workshop milestones integrated
- ✅ Complete CRUD for Users (auth)
- ✅ Complete CRUD for Categories
- ✅ Complete CRUD for Expenses
- ✅ Additional features (monthly summaries, filtering)

### Technical Understanding (30 points)
- ✅ Clean, well-organized code
- ✅ Proper MVC architecture
- ✅ Database relationships implemented
- ✅ JWT authentication working
- ✅ Input validation and error handling

### Lab Participation (20 points)
- ✅ Attended workshop sessions
- ✅ Ready for live demo

---

## 🎯 Future Enhancements (Sprint 2 & 3)

### Sprint 2 - Frontend (React)
- React frontend application
- User dashboard with charts
- Category and expense management UI
- Responsive design

### Sprint 3 - Integration & Features
- Frontend-backend integration
- Budget setting and tracking
- Data visualization with charts
- Export functionality (CSV/PDF)

---

## 📝 Notes for Code Review

### Key Features to Demonstrate

1. **Authentication Flow**
   - Show user registration
   - Demonstrate login and token generation
   - Show protected route access

2. **CRUD Operations**
   - Create, read, update, delete categories
   - Create, read, update, delete expenses
   - Show database relationships

3. **Data Filtering**
   - Filter expenses by category
   - Filter by date range
   - Monthly summary generation

4. **Code Organization**
   - MVC pattern implementation
   - Middleware for authentication
   - Model layer for database operations
   - Input validation

### Technical Highlights

- **Security**: Passwords hashed, JWT tokens, protected routes
- **Database**: Proper foreign keys, cascading deletes, indexes
- **API Design**: RESTful endpoints, consistent response format
- **Error Handling**: Proper status codes, validation messages
- **Documentation**: Comprehensive README, API guide, deployment guide

---

## 🐛 Known Issues & Limitations

- Free tier Render services sleep after 15 minutes of inactivity
- First request after sleep may take 30-50 seconds
- Database limited to 256 MB on free tier

---

## 👤 Author

**Gurjant Singh**  
PROG2500-26W-Sec1 - Open-Source Full Stack Development

---

## 📄 License

ISC

---

## 🙏 Acknowledgments

- Course instructor for guidance
- Render for free hosting
- PostgreSQL community
- Express.js documentation
