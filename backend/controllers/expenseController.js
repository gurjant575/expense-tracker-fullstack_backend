const { body, validationResult, query } = require('express-validator');
const Expense = require('../models/Expense');
const Category = require('../models/Category');

exports.expenseValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('description').optional().trim(),
  body('date').isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('category_id').isInt().withMessage('Valid category ID is required')
];

exports.getExpenses = async (req, res) => {
  try {
    const { category_id, start_date, end_date } = req.query;

    const filters = {};
    if (category_id) filters.category_id = category_id;
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;

    const expenses = await Expense.findByUserId(req.user.id, filters);

    res.json({
      success: true,
      count: expenses.length,
      data: { expenses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching expenses'
    });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id, req.user.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: { expense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching expense'
    });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { amount, description, date, category_id } = req.body;

    const category = await Category.findById(category_id, req.user.id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category or category does not belong to user'
      });
    }

    const expense = await Expense.create({
      amount,
      description: description || null,
      date,
      category_id,
      user_id: req.user.id
    });

    const completeExpense = await Expense.findById(expense.id, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense: completeExpense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating expense'
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { amount, description, date, category_id } = req.body;

    const existingExpense = await Expense.findById(req.params.id, req.user.id);
    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    const category = await Category.findById(category_id, req.user.id);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category or category does not belong to user'
      });
    }

    const expense = await Expense.update(req.params.id, req.user.id, {
      amount,
      description: description || null,
      date,
      category_id
    });

    const completeExpense = await Expense.findById(expense.id, req.user.id);

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense: completeExpense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating expense'
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.delete(req.params.id, req.user.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully',
      data: { id: expense.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting expense'
    });
  }
};

exports.getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }

    const summary = await Expense.getMonthlySummary(req.user.id, year, month);
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const total = await Expense.getTotal(req.user.id, {
      start_date: `${year}-${month.padStart(2, '0')}-01`,
      end_date: `${year}-${month.padStart(2, '0')}-${lastDay}`
    });

    res.json({
      success: true,
      data: {
        summary,
        total,
        year: parseInt(year),
        month: parseInt(month)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching monthly summary'
    });
  }
};
