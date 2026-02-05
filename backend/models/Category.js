const { query } = require('../config/database');

class Category {
  // Create a new category
  static async create({ name, user_id, color = '#3B82F6' }) {
    const result = await query(
      'INSERT INTO categories (name, user_id, color) VALUES ($1, $2, $3) RETURNING *',
      [name, user_id, color]
    );
    return result.rows[0];
  }

  // Get all categories for a user
  static async findByUserId(userId) {
    const result = await query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC',
      [userId]
    );
    return result.rows;
  }

  // Get a single category by ID (with user verification)
  static async findById(id, userId) {
    const result = await query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  // Update category
  static async update(id, userId, { name, color }) {
    const result = await query(
      'UPDATE categories SET name = $1, color = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [name, color, id, userId]
    );
    return result.rows[0];
  }

  // Delete category
  static async delete(id, userId) {
    const result = await query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }

  // Check if category exists for user
  static async exists(name, userId, excludeId = null) {
    let queryText = 'SELECT id FROM categories WHERE name = $1 AND user_id = $2';
    const params = [name, userId];

    if (excludeId) {
      queryText += ' AND id != $3';
      params.push(excludeId);
    }

    const result = await query(queryText, params);
    return result.rows.length > 0;
  }
}

module.exports = Category;
