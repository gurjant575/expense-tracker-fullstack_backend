const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* Central fetch wrapper – attaches JWT and parses JSON */
const apiCall = async (endpoint, options = {}) => {
  const token   = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const authAPI = {
  register:      (userData)    => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login:         (credentials) => apiCall('/auth/login',    { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile:    ()            => apiCall('/auth/profile'),
  updateProfile: (userData)    => apiCall('/auth/profile',  { method: 'PUT',  body: JSON.stringify(userData) }),
};

export const expenseAPI = {
  getExpenses:      (params = {}) => apiCall(`/expenses${buildQuery(params)}`),
  getExpense:       (id)          => apiCall(`/expenses/${id}`),
  createExpense:    (data)        => apiCall('/expenses',      { method: 'POST',   body: JSON.stringify(data) }),
  updateExpense:    (id, data)    => apiCall(`/expenses/${id}`, { method: 'PUT',   body: JSON.stringify(data) }),
  deleteExpense:    (id)          => apiCall(`/expenses/${id}`, { method: 'DELETE' }),
  /* Pass year + month so the backend returns the right month's summary */
  getMonthlySummary: (year, month) =>
    apiCall(`/expenses/summary/monthly?year=${year}&month=${month}`),
};

export const categoryAPI = {
  getCategories:  ()          => apiCall('/categories'),
  getCategory:    (id)        => apiCall(`/categories/${id}`),
  createCategory: (data)      => apiCall('/categories',       { method: 'POST',   body: JSON.stringify(data) }),
  updateCategory: (id, data)  => apiCall(`/categories/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
  deleteCategory: (id)        => apiCall(`/categories/${id}`, { method: 'DELETE' }),
};

/* Converts a plain object into a URL query string */
const buildQuery = (params) => {
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : '';
};
