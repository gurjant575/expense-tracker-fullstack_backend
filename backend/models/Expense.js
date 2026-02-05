const { query } = require('../config/database');

class Expense {
  // Create a new expense
  static async create({ amount, description, date, category_id, user_id }) {
    const result = await query(
      'INSERT INTO expenses (amount, description, date, category_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [amount, description, date, category_id, user_id]
    );
    return result.rows[0];
  }

  // Get all expenses for a user with category details
  static async findByUserId(userId, filters = {}) {
    let queryText = `
      SELECT e.*, c.name as category_name, c.color as category_color 
      FROM expenses e 
      JOIN categories c ON e.category_id = c.id 
      WHERE e.user_id = $1
    `;
    const params = [userId];
    let paramIndex = 2;

    // Filter by category
    if (filters.category_id) {
      queryText += ` AND e.category_id = $${paramIndex}`;
      params.push(filters.category_id);
      paramIndex++;
    }

    // Filter by date range
    if (filters.start_date) {
      queryText += ` AND e.date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      queryText += ` AND e.date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    queryText += ' ORDER BY e.date DESC, e.created_at DESC';

    const result = await query(queryText, params);
    return result.rows;
  }

  // Get a single expense by ID (with user verification)
  static async findById(id, userId) {
    const result = await query(
      `SELECT e.*, c.name as category_name, c.color as category_color 
       FROM expenses e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.id = $1 AND e.user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  }

  // Update expense
  static async update(id, userId, { amount, description, date, category_id }) {
    const result = await query(
      'UPDATE expenses SET amount = $1, description = $2, date = $3, category_id = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND user_id = $6 RETURNING *',
      [amount, description, date, category_id, id, userId]
    );
    return result.rows[0];
  }

  // Delete expense
  static async delete(id, userId) {
    const result = await query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }

  // Get monthly summary
  static async getMonthlySummary(userId, year, month) {
    const result = await query(
      `SELECT 
        c.name as category_name,
        c.color as category_color,
        SUM(e.amount) as total,
        COUNT(e.id) as count
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.user_id = $1 
         AND EXTRACT(YEAR FROM e.date) = $2 
         AND EXTRACT(MONTH FROM e.date) = $3
       GROUP BY c.id, c.name, c.color
       ORDER BY total DESC`,
      [userId, year, month]
    );
    return result.rows;
  }

  // Get total expenses
  static async getTotal(userId, filters = {}) {
    let queryText = 'SELECT SUM(amount) as total FROM expenses WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (filters.start_date) {
      queryText += ` AND date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      queryText += ` AND date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    const result = await query(queryText, params);
    return parseFloat(result.rows[0].total) || 0;
  }
}

module.exports = Expense;
