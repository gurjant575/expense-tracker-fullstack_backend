const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

export const authAPI = {
  register: (userData) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile: () => apiCall('/auth/profile'),
  updateProfile: (userData) => apiCall('/auth/profile', { method: 'PUT', body: JSON.stringify(userData) }),
};

export const expenseAPI = {
  getExpenses: () => apiCall('/expenses'),
  getExpense: (id) => apiCall(`/expenses/${id}`),
  createExpense: (data) => apiCall('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  updateExpense: (id, data) => apiCall(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExpense: (id) => apiCall(`/expenses/${id}`, { method: 'DELETE' }),
  getMonthlySummary: () => apiCall('/expenses/summary/monthly'),
};

export const categoryAPI = {
  getCategories: () => apiCall('/categories'),
  getCategory: (id) => apiCall(`/categories/${id}`),
  createCategory: (data) => apiCall('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => apiCall(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => apiCall(`/categories/${id}`, { method: 'DELETE' }),
};
