const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');

exports.categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex code')
];

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findByUserId(req.user.id);

    res.json({
      success: true,
      count: categories.length,
      data: { categories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id, req.user.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching category'
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, color } = req.body;

    const exists = await Category.exists(name, req.user.id);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name,
      color: color || '#3B82F6',
      user_id: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating category'
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, color } = req.body;

    const existingCategory = await Category.findById(req.params.id, req.user.id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name !== existingCategory.name) {
      const nameExists = await Category.exists(name, req.user.id, req.params.id);
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    const category = await Category.update(req.params.id, req.user.id, {
      name,
      color: color || existingCategory.color
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating category'
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.delete(req.params.id, req.user.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
      data: { id: category.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting category'
    });
  }
};
