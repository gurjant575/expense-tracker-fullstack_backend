import React, { useState, useEffect } from 'react';
import { expenseAPI, categoryAPI } from '../services/api';
import '../styles/Expenses.css';

/* Full CRUD component for expenses – create, read, update, delete */
const ExpenseList = () => {
  const [expenses, setExpenses]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [deleteId, setDeleteId]     = useState(null); // id awaiting confirm
  const [submitting, setSubmitting] = useState(false);

  /* Controlled form state */
  const blankForm = {
    description: '',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
  };
  const [formData, setFormData] = useState(blankForm);

  /* Load expenses and categories in parallel on mount */
  useEffect(() => {
    Promise.all([fetchExpenses(), fetchCategories()]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseAPI.getExpenses();
      setExpenses(data.data?.expenses || []);
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data.data?.categories || []);
    } catch {
      /* Categories failing is non-fatal – form still works without them */
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* Create or update expense */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (editingId) {
        await expenseAPI.updateExpense(editingId, payload);
      } else {
        await expenseAPI.createExpense(payload);
      }
      await fetchExpenses();
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category_id: expense.category_id,
      date: expense.date?.split('T')[0] || expense.date,
    });
    setEditingId(expense.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Delete after user confirms in the inline modal */
  const handleDeleteConfirm = async () => {
    try {
      await expenseAPI.deleteExpense(deleteId);
      /* Optimistic UI – remove immediately, then sync */
      setExpenses(prev => prev.filter(e => e.id !== deleteId));
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
    } finally {
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData(blankForm);
    setEditingId(null);
    setShowForm(false);
  };

  const getCat = (id) => categories.find(c => c.id === id);

  /* Total of displayed expenses */
  const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  return (
    <div className="expenses-page">
      {/* ── Page header ── */}
      <div className="expenses-header">
        <div>
          <h1>Expenses</h1>
          <p className="expenses-sub">{expenses.length} record{expenses.length !== 1 ? 's' : ''} · Total: <strong>${total.toFixed(2)}</strong></p>
        </div>
        <button
          className={`btn-toggle-form ${showForm ? 'cancel' : ''}`}
          onClick={() => { showForm ? resetForm() : setShowForm(true); }}
        >
          {showForm ? '✕ Cancel' : '+ Add Expense'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ── Add / Edit form ── */}
      {showForm && (
        <div className="expense-form-card">
          <h2 className="form-title">{editingId ? '✏️ Edit Expense' : '➕ New Expense'}</h2>
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  id="description" type="text" name="description"
                  value={formData.description} onChange={handleChange}
                  placeholder="e.g. Coffee, Groceries…" required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount ($)</label>
                <input
                  id="amount" type="number" name="amount"
                  value={formData.amount} onChange={handleChange}
                  placeholder="0.00" step="0.01" min="0.01" required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category_id">Category</label>
                <select
                  id="category_id" name="category_id"
                  value={formData.category_id} onChange={handleChange} required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date" type="date" name="date"
                  value={formData.date} onChange={handleChange} required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
              <button type="submit" className="btn-submit-form" disabled={submitting}>
                {submitting ? 'Saving…' : editingId ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Expense list ── */}
      {loading ? (
        <div className="loading">
          <div className="spinner-ring"></div>
          <span>Loading expenses…</span>
        </div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 48 }}>🧾</span>
          <p>No expenses yet. Add your first one above!</p>
        </div>
      ) : (
        <div className="expenses-table-wrap">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(expense => {
                  const cat = getCat(expense.category_id);
                  return (
                    <tr key={expense.id}>
                      <td className="td-date">
                        {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="td-desc">{expense.description}</td>
                      <td>
                        {cat ? (
                          <span
                            className="cat-badge"
                            style={{ background: cat.color + '22', color: cat.color, borderColor: cat.color + '55' }}
                          >
                            {cat.name}
                          </span>
                        ) : (
                          <span className="cat-badge-unknown">Unknown</span>
                        )}
                      </td>
                      <td className="td-amount">${parseFloat(expense.amount).toFixed(2)}</td>
                      <td className="td-actions">
                        <button className="btn-secondary" onClick={() => handleEdit(expense)}>Edit</button>
                        <button className="btn-danger"    onClick={() => setDeleteId(expense.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Inline delete confirmation modal ── */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <span className="modal-icon">🗑️</span>
            <h3>Delete Expense?</h3>
            <p>This action cannot be undone.</p>
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

export default ExpenseList;
