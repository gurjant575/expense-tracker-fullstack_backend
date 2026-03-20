import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import '../styles/Categories.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await categoryAPI.updateCategory(editingId, formData);
      } else {
        await categoryAPI.createCategory(formData);
      }
      fetchCategories();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await categoryAPI.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2>Categories</h2>
        <button onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <h3>{editingId ? 'Edit Category' : 'New Category'}</h3>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>
          <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Category</button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="empty-state">No categories yet</div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <h3>{category.name}</h3>
              {category.description && <p>{category.description}</p>}
              <div className="card-actions">
                <button onClick={() => handleEdit(category)} className="btn-secondary">Edit</button>
                <button onClick={() => handleDelete(category.id)} className="btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
