# 🏗️ PROJECT ARCHITECTURE

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser/Postman)                 │
│                                                              │
│  - User Registration/Login                                   │
│  - Category Management                                       │
│  - Expense Tracking                                          │
│  - Monthly Summaries                                         │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTP Requests (JSON)
                       │ JWT Token in Headers
                       ↓
┌─────────────────────────────────────────────────────────────┐
│               RENDER WEB SERVICE (Express API)               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    server.js                          │  │
│  │  - Initialize Express app                             │  │
│  │  - Configure middleware (CORS, Helmet, etc.)          │  │
│  │  - Mount routes                                       │  │
│  │  - Initialize database                                │  │
│  └────────────┬──────────────────────────────────────────┘  │
│               │                                              │
│               ↓                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 MIDDLEWARE                            │  │
│  │  ┌─────────────────────────────────────────────┐     │  │
│  │  │  auth.js - JWT Verification                 │     │  │
│  │  │  - Extract token from header                │     │  │
│  │  │  - Verify token signature                   │     │  │
│  │  │  - Attach user info to request              │     │  │
│  │  └─────────────────────────────────────────────┘     │  │
│  └────────────┬──────────────────────────────────────────┘  │
│               │                                              │
│               ↓                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    ROUTES                             │  │
│  │  ┌────────────────────────────────────────────┐      │  │
│  │  │  /api/auth (auth.js)                       │      │  │
│  │  │  - POST /register                          │      │  │
│  │  │  - POST /login                             │      │  │
│  │  │  - GET /profile (protected)                │      │  │
│  │  │  - PUT /profile (protected)                │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  │  ┌────────────────────────────────────────────┐      │  │
│  │  │  /api/categories (categories.js)           │      │  │
│  │  │  - GET / (protected)                       │      │  │
│  │  │  - POST / (protected)                      │      │  │
│  │  │  - GET /:id (protected)                    │      │  │
│  │  │  - PUT /:id (protected)                    │      │  │
│  │  │  - DELETE /:id (protected)                 │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  │  ┌────────────────────────────────────────────┐      │  │
│  │  │  /api/expenses (expenses.js)               │      │  │
│  │  │  - GET / (protected)                       │      │  │
│  │  │  - POST / (protected)                      │      │  │
│  │  │  - GET /:id (protected)                    │      │  │
│  │  │  - PUT /:id (protected)                    │      │  │
│  │  │  - DELETE /:id (protected)                 │      │  │
│  │  │  - GET /summary/monthly (protected)        │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  └────────────┬──────────────────────────────────────────┘  │
│               │                                              │
│               ↓                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 CONTROLLERS                           │  │
│  │  ┌────────────────────────────────────────────┐      │  │
│  │  │  authController.js                         │      │  │
│  │  │  - register()                              │      │  │
│  │  │  - login()                                 │      │  │
│  │  │  - getProfile()                            │      │  │
│  │  │  - updateProfile()                         │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  │  ┌────────────────────────────────────────────┐      │  │
│  │  │  categoryController.js                     │      │  │
│  │  │  - getCategories()                         │      │  │
│  │  │  - getCategory()                           │      │  │
│  │  │  - createCategory()                        │      │  │
│  │  │  - updateCategory()                        │      │  │
│  │  │  - deleteCategory()                        │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  │  ┌────────────────────────────────────────────┐      │  │
│  │  │  expenseController.js                      │      │  │
│  │  │  - getExpenses()                           │      │  │
│  │  │  - getExpense()                            │      │  │
│  │  │  - createExpense()                         │      │  │
│  │  │  - updateExpense()                         │      │  │
│  │  │  - deleteExpense()                         │      │  │
│  │  │  - getMonthlySummary()                     │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  └────────────┬──────────────────────────────────────────┘  │
│               │                                              │
│               ↓                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    MODELS                             │  │
│  │  ┌────────────────────────────────────────────┐      │  │
│  │  │  User.js                                   │      │  │
│  │  │  - create()                                │      │  │
│  │  │  - findByEmail()                           │      │  │
│  │  │  - findById()                              │      │  │
│  │  │  - update()                                │      │  │
│  │  │  - delete()                                │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  │  ┌────────────────────────────────────────────┐      │  │
│  │  │  Category.js                               │      │  │
│  │  │  - create()                                │      │  │
│  │  │  - findByUserId()                          │      │  │
│  │  │  - findById()                              │      │  │
│  │  │  - update()                                │      │  │
│  │  │  - delete()                                │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  │  ┌────────────────────────────────────────────┐      │  │
│  │  │  Expense.js                                │      │  │
│  │  │  - create()                                │      │  │
│  │  │  - findByUserId()                          │      │  │
│  │  │  - findById()                              │      │  │
│  │  │  - update()                                │      │  │
│  │  │  - delete()                                │      │  │
│  │  │  - getMonthlySummary()                     │      │  │
│  │  │  - getTotal()                              │      │  │
│  │  └────────────────────────────────────────────┘      │  │
│  └────────────┬──────────────────────────────────────────┘  │
│               │ SQL Queries                                  │
└───────────────┼──────────────────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────────────────┐
│            RENDER POSTGRESQL DATABASE                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  users                                │  │
│  │  - id (PRIMARY KEY)                                   │  │
│  │  - name                                               │  │
│  │  - email (UNIQUE)                                     │  │
│  │  - password (hashed with bcrypt)                      │  │
│  │  - created_at                                         │  │
│  │  - updated_at                                         │  │
│  └──────────────────┬────────────────────────────────────┘  │
│                     │ 1:N                                    │
│                     ↓                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                categories                             │  │
│  │  - id (PRIMARY KEY)                                   │  │
│  │  - name                                               │  │
│  │  - user_id (FOREIGN KEY → users.id)                  │  │
│  │  - color                                              │  │
│  │  - created_at                                         │  │
│  │  - updated_at                                         │  │
│  │  - UNIQUE(name, user_id)                              │  │
│  └──────────────────┬────────────────────────────────────┘  │
│                     │ 1:N                                    │
│                     ↓                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 expenses                              │  │
│  │  - id (PRIMARY KEY)                                   │  │
│  │  - amount                                             │  │
│  │  - description                                        │  │
│  │  - date                                               │  │
│  │  - category_id (FOREIGN KEY → categories.id)         │  │
│  │  - user_id (FOREIGN KEY → users.id)                  │  │
│  │  - created_at                                         │  │
│  │  - updated_at                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Indexes:                                                    │
│  - idx_expenses_user_id                                      │
│  - idx_expenses_category_id                                  │
│  - idx_expenses_date                                         │
│  - idx_categories_user_id                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow Example

### Example: Create Expense

```
1. CLIENT REQUEST
   POST https://expense-tracker-api.onrender.com/api/expenses
   Headers: {
     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "Content-Type": "application/json"
   }
   Body: {
     "amount": 45.50,
     "description": "Grocery shopping",
     "date": "2026-02-05",
     "category_id": 1
   }

   ↓

2. EXPRESS MIDDLEWARE
   - CORS: Allow cross-origin request
   - Body Parser: Parse JSON body
   - Helmet: Add security headers

   ↓

3. ROUTE MATCHING
   /api/expenses → expenses.js
   POST / → expenseController.createExpense

   ↓

4. AUTH MIDDLEWARE
   - Extract token from Authorization header
   - Verify JWT signature with JWT_SECRET
   - Decode token → { id: 1, email: "user@example.com" }
   - Attach to req.user
   - Call next()

   ↓

5. INPUT VALIDATION
   - Check amount is positive number
   - Check date is valid ISO format
   - Check category_id is integer
   - If errors → return 400

   ↓

6. CONTROLLER
   expenseController.createExpense()
   - Get user_id from req.user.id
   - Get data from req.body
   - Verify category belongs to user
   - Call Expense.create()

   ↓

7. MODEL
   Expense.create()
   - Build SQL query
   - Execute: INSERT INTO expenses (...) VALUES (...) RETURNING *
   - Return created expense

   ↓

8. DATABASE
   PostgreSQL
   - Validate foreign keys (category_id, user_id)
   - Insert row
   - Generate id with SERIAL
   - Set timestamps
   - Return row

   ↓

9. CONTROLLER (continued)
   - Fetch complete expense with category details
   - Build response object

   ↓

10. EXPRESS RESPONSE
    Status: 201 Created
    Body: {
      "success": true,
      "message": "Expense created successfully",
      "data": {
        "expense": {
          "id": 5,
          "amount": "45.50",
          "description": "Grocery shopping",
          "date": "2026-02-05",
          "category_id": 1,
          "user_id": 1,
          "category_name": "Food",
          "category_color": "#FF6B6B",
          "created_at": "2026-02-05T10:00:00.000Z"
        }
      }
    }

    ↓

11. CLIENT RECEIVES RESPONSE
    - Parse JSON
    - Update UI
    - Show success message
```

## Security Flow

```
┌────────────────────┐
│  User Registration │
└─────────┬──────────┘
          │
          ↓
┌─────────────────────────────────────┐
│  Password + bcrypt.genSalt(10)      │
│  → Hash password with salt          │
└─────────┬───────────────────────────┘
          │
          ↓
┌─────────────────────────────────────┐
│  Store in database:                 │
│  password: "$2a$10$hash..."         │
└─────────────────────────────────────┘

┌────────────────────┐
│    User Login      │
└─────────┬──────────┘
          │
          ↓
┌─────────────────────────────────────┐
│  Compare plain password with hash   │
│  bcrypt.compare(plain, hash)        │
└─────────┬───────────────────────────┘
          │ Match?
          ↓
┌─────────────────────────────────────┐
│  Generate JWT Token                 │
│  jwt.sign(                          │
│    { id, email, name },             │
│    JWT_SECRET,                      │
│    { expiresIn: "7d" }              │
│  )                                  │
└─────────┬───────────────────────────┘
          │
          ↓
┌─────────────────────────────────────┐
│  Return token to client             │
│  Token: "eyJhbGciOiJI..."           │
└─────────────────────────────────────┘

┌────────────────────┐
│  Protected Request │
└─────────┬──────────┘
          │
          ↓
┌─────────────────────────────────────┐
│  Extract token from header          │
│  Authorization: Bearer <token>      │
└─────────┬───────────────────────────┘
          │
          ↓
┌─────────────────────────────────────┐
│  Verify token                       │
│  jwt.verify(token, JWT_SECRET)      │
└─────────┬───────────────────────────┘
          │ Valid?
          ↓
┌─────────────────────────────────────┐
│  Decode payload                     │
│  { id: 1, email: "..." }            │
│  Attach to req.user                 │
└─────────┬───────────────────────────┘
          │
          ↓
┌─────────────────────────────────────┐
│  Proceed to controller              │
│  Access req.user.id                 │
└─────────────────────────────────────┘
```

## Database Relationships Diagram

```
┌──────────────────┐
│      users       │
│──────────────────│
│ id (PK)          │────────┐
│ name             │        │
│ email            │        │ 1:N
│ password         │        │
│ created_at       │        │
│ updated_at       │        │
└──────────────────┘        │
                            ↓
                 ┌──────────────────┐
                 │   categories     │
                 │──────────────────│
                 │ id (PK)          │────────┐
                 │ name             │        │
                 │ user_id (FK)     │        │ 1:N
                 │ color            │        │
                 │ created_at       │        │
                 │ updated_at       │        │
                 └──────────────────┘        │
                                             ↓
                                  ┌──────────────────┐
                                  │    expenses      │
                                  │──────────────────│
                                  │ id (PK)          │
                                  │ amount           │
                                  │ description      │
                                  │ date             │
                                  │ category_id (FK) │
                                  │ user_id (FK)     │
                                  │ created_at       │
                                  │ updated_at       │
                                  └──────────────────┘

Relationships:
- One User can have Many Categories
- One Category can have Many Expenses
- One User can have Many Expenses (through Categories)
- Deleting a User cascades to Categories and Expenses
- Deleting a Category cascades to Expenses
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│                  DEPLOYMENT LAYER                        │
│  - Render Web Service (Node.js)                         │
│  - Render PostgreSQL (Database)                         │
│  - GitHub (Version Control)                             │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                        │
│  - Express.js (Web Framework)                           │
│  - Node.js (Runtime)                                    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                 MIDDLEWARE LAYER                         │
│  - JWT Authentication                                    │
│  - CORS                                                  │
│  - Helmet (Security)                                     │
│  - Body Parser                                           │
│  - Express Validator                                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   ROUTING LAYER                          │
│  - /api/auth                                             │
│  - /api/categories                                       │
│  - /api/expenses                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                 CONTROLLER LAYER                         │
│  - authController                                        │
│  - categoryController                                    │
│  - expenseController                                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   MODEL LAYER                            │
│  - User Model                                            │
│  - Category Model                                        │
│  - Expense Model                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                 DATABASE LAYER                           │
│  - PostgreSQL                                            │
│  - pg (node-postgres driver)                            │
└─────────────────────────────────────────────────────────┘
```

## File Organization Structure

```
Project/
│
├── backend/                    # Backend API application
│   │
│   ├── config/                 # Configuration files
│   │   ├── database.js         # PostgreSQL connection pool
│   │   └── initDb.js           # Database initialization script
│   │
│   ├── controllers/            # Business logic layer
│   │   ├── authController.js   # Authentication logic
│   │   ├── categoryController.js
│   │   └── expenseController.js
│   │
│   ├── middleware/             # Request processing
│   │   └── auth.js             # JWT verification middleware
│   │
│   ├── models/                 # Data access layer
│   │   ├── User.js             # User database operations
│   │   ├── Category.js         # Category database operations
│   │   └── Expense.js          # Expense database operations
│   │
│   ├── routes/                 # API endpoints definition
│   │   ├── auth.js             # Auth routes
│   │   ├── categories.js       # Category routes
│   │   └── expenses.js         # Expense routes
│   │
│   ├── .env                    # Environment variables (not in git)
│   ├── .env.example            # Environment template
│   ├── .gitignore              # Git ignore rules
│   ├── package.json            # Dependencies and scripts
│   ├── server.js               # Main application entry point
│   │
│   └── [Documentation]
│       ├── README.md           # Backend documentation
│       ├── API_TESTING_GUIDE.md
│       ├── DEPLOYMENT_GUIDE.md
│       └── database_schema.sql
│
└── [Root Documentation]
    ├── README.md               # Project overview
    ├── QUICKSTART.md           # Quick start guide
    ├── CHECKLIST.md            # Completion checklist
    ├── ARCHITECTURE.md         # This file
    └── SUBMISSION.txt          # Submission details
```

This architecture follows the **MVC (Model-View-Controller)** pattern:
- **Models**: Handle database operations
- **Views**: JSON responses (no traditional views)
- **Controllers**: Handle business logic and orchestrate models
- **Routes**: Define API endpoints and map to controllers
- **Middleware**: Process requests before reaching controllers
