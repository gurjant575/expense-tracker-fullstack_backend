import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import '../styles/Categories.css';

/* Preset colour palette users can pick from */
const COLOR_PRESETS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6',
  '#84cc16', '#f97316', '#64748b', '#1e293b',
];

/* Full CRUD component for expense categories */
const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [deleteId, setDeleteId]     = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* name + color – color replaces the old description field */
  const blankForm = { name: '', color: '#6366f1' };
  const [formData, setFormData] = useState(blankForm);

  /* Load categories on mount */
  useEffect(() => { fetchCategories(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data.data?.categories || []);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* Create or update category */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingId) {
        await categoryAPI.updateCategory(editingId, formData);
      } else {
        await categoryAPI.createCategory(formData);
      }
      await fetchCategories();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, color: cat.color || '#6366f1' });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await categoryAPI.deleteCategory(deleteId);
      setCategories(prev => prev.filter(c => c.id !== deleteId));
    } catch (err) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData(blankForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="categories-page">
      {/* ── Page header ── */}
      <div className="categories-header">
        <div>
          <h1>Categories</h1>
          <p className="categories-sub">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <button
          className={`btn-toggle-form-cat ${showForm ? 'cancel' : ''}`}
          onClick={() => { showForm ? resetForm() : setShowForm(true); }}
        >
          {showForm ? '✕ Cancel' : '+ Add Category'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ── Form ── */}
      {showForm && (
        <div className="category-form-card">
          <h2 className="form-title-cat">{editingId ? '✏️ Edit Category' : '➕ New Category'}</h2>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="cat-name">Category Name</label>
              <input
                id="cat-name" type="text" name="name"
                value={formData.name} onChange={handleChange}
                placeholder="e.g. Food, Transport, Entertainment…" required
              />
            </div>

            <div className="form-group">
              <label>Colour</label>
              <div className="color-picker-row">
                {/* Native colour input */}
                <input
                  type="color" name="color"
                  value={formData.color} onChange={handleChange}
                  className="color-native"
                  title="Pick any colour"
                />
                {/* Quick preset swatches */}
                {COLOR_PRESETS.map(c => (
                  <button
                    key={c} type="button"
                    className={`swatch ${formData.color === c ? 'swatch-active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setFormData(prev => ({ ...prev, color: c }))}
                    title={c}
                  />
                ))}
              </div>
              <span className="color-preview-text">Selected: <strong>{formData.color}</strong></span>
            </div>

            <div className="form-actions-cat">
              <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
              <button type="submit" className="btn-submit-cat" disabled={submitting}>
                {submitting ? 'Saving…' : editingId ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Category grid ── */}
      {loading ? (
        <div className="loading">
          <div className="spinner-ring"></div>
          <span>Loading categories…</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>🏷️</span>
          <p>No categories yet. Create your first one above!</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="category-card"
              style={{ borderTop: `4px solid ${cat.color || '#6366f1'}` }}
            >
              <div className="cat-card-top">
                <span
                  className="cat-color-dot-lg"
                  style={{ background: cat.color || '#6366f1' }}
                ></span>
                <h3 className="cat-name">{cat.name}</h3>
              </div>
              <div className="cat-color-chip" style={{ background: (cat.color || '#6366f1') + '22', color: cat.color || '#6366f1' }}>
                {cat.color || '#6366f1'}
              </div>
              <div className="card-actions">
                <button className="btn-secondary" onClick={() => handleEdit(cat)}>Edit</button>
                <button className="btn-danger"    onClick={() => setDeleteId(cat.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Inline delete confirmation ── */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <span className="modal-icon">🏷️</span>
            <h3>Delete Category?</h3>
            <p>All expenses in this category will lose their category assignment.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger-solid" onClick={handleDeleteConfirm}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
