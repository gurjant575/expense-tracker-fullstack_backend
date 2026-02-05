-- Personal Expense & Budget Tracker Database Schema
-- PostgreSQL Database for Render Deployment

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(name, user_id)
);

-- Create Expenses Table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    description VARCHAR(255),
    date DATE NOT NULL,
    category_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Indexes for Better Performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Create Function to Update updated_at Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Triggers for Automatic Timestamp Updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Sample Data (Optional - for testing)
-- Note: Password is 'password123' hashed with bcrypt
-- You can remove this section or modify as needed

-- Sample User
INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere');

-- Sample Categories (user_id = 1)
INSERT INTO categories (name, user_id, color) VALUES
('Food', 1, '#FF6B6B'),
('Transport', 1, '#4ECDC4'),
('Entertainment', 1, '#45B7D1'),
('Utilities', 1, '#FFA07A'),
('Healthcare', 1, '#98D8C8'),
('Shopping', 1, '#F7DC6F');

-- Sample Expenses (user_id = 1)
INSERT INTO expenses (amount, description, date, category_id, user_id) VALUES
(45.50, 'Grocery shopping', '2026-02-01', 1, 1),
(15.00, 'Bus pass', '2026-02-02', 2, 1),
(25.00, 'Movie tickets', '2026-02-03', 3, 1),
(85.00, 'Electric bill', '2026-02-04', 4, 1),
(30.00, 'Pharmacy', '2026-02-05', 5, 1);

-- Query Examples for Testing

-- Get all expenses with category details
SELECT 
    e.id,
    e.amount,
    e.description,
    e.date,
    c.name as category_name,
    c.color as category_color,
    u.name as user_name
FROM expenses e
JOIN categories c ON e.category_id = c.id
JOIN users u ON e.user_id = u.id
ORDER BY e.date DESC;

-- Get monthly summary by category
SELECT 
    c.name as category_name,
    c.color as category_color,
    SUM(e.amount) as total_amount,
    COUNT(e.id) as expense_count
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE 
    e.user_id = 1 
    AND EXTRACT(YEAR FROM e.date) = 2026 
    AND EXTRACT(MONTH FROM e.date) = 2
GROUP BY c.id, c.name, c.color
ORDER BY total_amount DESC;

-- Get total expenses for a user
SELECT SUM(amount) as total_expenses
FROM expenses
WHERE user_id = 1;

-- Get expenses by date range
SELECT 
    e.*,
    c.name as category_name
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE 
    e.user_id = 1
    AND e.date BETWEEN '2026-02-01' AND '2026-02-28'
ORDER BY e.date DESC;
