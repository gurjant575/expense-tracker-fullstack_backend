const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', categoryController.categoryValidation, categoryController.createCategory);
router.put('/:id', categoryController.categoryValidation, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
