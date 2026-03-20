import React, { useState, useEffect } from 'react';
import { expenseAPI, categoryAPI } from '../services/api';
import '../styles/Expenses.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseAPI.getExpenses();
      setExpenses(data.expenses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data.categories || []);
    } catch (err) {
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
        await expenseAPI.updateExpense(editingId, formData);
      } else {
        await expenseAPI.createExpense({ ...formData, amount: parseFloat(formData.amount) });
      }
      fetchExpenses();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category_id: expense.category_id,
      date: expense.date,
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await expenseAPI.deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category_id: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : 'Unknown';
  };

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h2>Expenses</h2>
        <button onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="expense-form">
          <h3>{editingId ? 'Edit Expense' : 'New Expense'}</h3>
          <div className="form-group">
            <label>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category_id" value={formData.category_id} onChange={handleChange} required>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'} Expense</button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">No expenses yet</div>
      ) : (
        <div className="expenses-list">
          <table>
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
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.description}</td>
                  <td>{getCategoryName(expense.category_id)}</td>
                  <td className="amount">${expense.amount.toFixed(2)}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(expense)} className="btn-secondary">Edit</button>
                    <button onClick={() => handleDelete(expense.id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
