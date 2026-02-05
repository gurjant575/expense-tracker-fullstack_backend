const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

router.get('/', expenseController.getExpenses);
router.get('/summary/monthly', expenseController.getMonthlySummary);
router.get('/:id', expenseController.getExpense);
router.post('/', expenseController.expenseValidation, expenseController.createExpense);
router.put('/:id', expenseController.expenseValidation, expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
