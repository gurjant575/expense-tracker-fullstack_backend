# API Testing Guide - Postman Collection

## Quick Start

1. Import this guide into Postman or use any HTTP client
2. Set the base URL: `http://localhost:5000` (local) or `https://your-app.onrender.com` (production)
3. After login/register, copy the token and use it in Authorization header

---

## 1. Authentication Endpoints

### 1.1 Register New User

**POST** `/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
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

---

### 1.2 Login User

**POST** `/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
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

**⚠️ SAVE THE TOKEN!** - You'll need it for all protected routes

---

### 1.3 Get User Profile

**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-02-05T10:00:00.000Z",
      "updated_at": "2026-02-05T10:00:00.000Z"
    }
  }
}
```

---

### 1.4 Update Profile

**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

---

## 2. Category Endpoints

### 2.1 Get All Categories

**GET** `/api/categories`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Food",
        "user_id": 1,
        "color": "#FF6B6B",
        "created_at": "2026-02-05T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Transport",
        "user_id": 1,
        "color": "#4ECDC4",
        "created_at": "2026-02-05T10:05:00.000Z"
      }
    ]
  }
}
```

---

### 2.2 Get Single Category

**GET** `/api/categories/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example:** `GET /api/categories/1`

---

### 2.3 Create Category

**POST** `/api/categories`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Food",
  "color": "#FF6B6B"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": 1,
      "name": "Food",
      "user_id": 1,
      "color": "#FF6B6B",
      "created_at": "2026-02-05T10:00:00.000Z",
      "updated_at": "2026-02-05T10:00:00.000Z"
    }
  }
}
```

**Test with multiple categories:**
```json
{"name": "Transport", "color": "#4ECDC4"}
{"name": "Entertainment", "color": "#45B7D1"}
{"name": "Utilities", "color": "#FFA07A"}
{"name": "Healthcare", "color": "#98D8C8"}
{"name": "Shopping", "color": "#F7DC6F"}
```

---

### 2.4 Update Category

**PUT** `/api/categories/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Groceries",
  "color": "#FF8888"
}
```

---

### 2.5 Delete Category

**DELETE** `/api/categories/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "id": 1
  }
}
```

---

## 3. Expense Endpoints

### 3.1 Get All Expenses

**GET** `/api/expenses`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters (Optional):**
- `category_id`: Filter by category
- `start_date`: Filter from date (YYYY-MM-DD)
- `end_date`: Filter to date (YYYY-MM-DD)

**Examples:**
- Get all expenses: `GET /api/expenses`
- Filter by category: `GET /api/expenses?category_id=1`
- Filter by date range: `GET /api/expenses?start_date=2026-02-01&end_date=2026-02-28`

**Expected Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": {
    "expenses": [
      {
        "id": 1,
        "amount": "45.50",
        "description": "Grocery shopping",
        "date": "2026-02-05",
        "category_id": 1,
        "user_id": 1,
        "category_name": "Food",
        "category_color": "#FF6B6B",
        "created_at": "2026-02-05T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 3.2 Get Single Expense

**GET** `/api/expenses/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 3.3 Create Expense

**POST** `/api/expenses`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 45.50,
  "description": "Grocery shopping at Walmart",
  "date": "2026-02-05",
  "category_id": 1
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "expense": {
      "id": 1,
      "amount": "45.50",
      "description": "Grocery shopping at Walmart",
      "date": "2026-02-05",
      "category_id": 1,
      "user_id": 1,
      "category_name": "Food",
      "category_color": "#FF6B6B",
      "created_at": "2026-02-05T10:00:00.000Z",
      "updated_at": "2026-02-05T10:00:00.000Z"
    }
  }
}
```

**Test with multiple expenses:**
```json
{"amount": 15.00, "description": "Bus pass", "date": "2026-02-04", "category_id": 2}
{"amount": 25.00, "description": "Movie tickets", "date": "2026-02-03", "category_id": 3}
{"amount": 85.00, "description": "Electric bill", "date": "2026-02-02", "category_id": 4}
{"amount": 30.00, "description": "Pharmacy", "date": "2026-02-01", "category_id": 5}
```

---

### 3.4 Update Expense

**PUT** `/api/expenses/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 50.00,
  "description": "Updated grocery shopping",
  "date": "2026-02-05",
  "category_id": 1
}
```

---

### 3.5 Delete Expense

**DELETE** `/api/expenses/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### 3.6 Get Monthly Summary

**GET** `/api/expenses/summary/monthly?year=2026&month=2`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters (Required):**
- `year`: Year (e.g., 2026)
- `month`: Month (1-12)

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": [
      {
        "category_name": "Utilities",
        "category_color": "#FFA07A",
        "total": "85.00",
        "count": "1"
      },
      {
        "category_name": "Food",
        "category_color": "#FF6B6B",
        "total": "45.50",
        "count": "1"
      }
    ],
    "total": 200.50,
    "year": 2026,
    "month": 2
  }
}
```

---

## 4. Testing Workflow

### Step 1: Register or Login
1. Use `/api/auth/register` to create account
2. Or use `/api/auth/login` if account exists
3. **SAVE THE TOKEN FROM RESPONSE**

### Step 2: Create Categories
1. Create 3-5 categories using `/api/categories` POST
2. Note the category IDs for later use

### Step 3: Create Expenses
1. Create several expenses using `/api/expenses` POST
2. Use different categories and dates

### Step 4: Test Filtering
1. Get all expenses: `GET /api/expenses`
2. Filter by category: `GET /api/expenses?category_id=1`
3. Filter by date: `GET /api/expenses?start_date=2026-02-01&end_date=2026-02-05`

### Step 5: Get Summary
1. Use `/api/expenses/summary/monthly?year=2026&month=2`
2. Verify totals match your expenses

---

## 5. Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided. Authorization denied."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## 6. Postman Environment Setup

Create environment variables:
- `base_url`: `http://localhost:5000` or `https://your-app.onrender.com`
- `token`: (auto-set from login response)

**Auto-set token script** (add to Tests tab in login request):
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

Then use `{{token}}` in Authorization headers!

---

## 7. cURL Examples

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Category:
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Food","color":"#FF6B6B"}'
```

### Create Expense:
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":45.50,"description":"Grocery shopping","date":"2026-02-05","category_id":1}'
```
