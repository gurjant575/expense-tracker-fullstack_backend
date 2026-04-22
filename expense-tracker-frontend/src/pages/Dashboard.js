import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expenseAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [expenses, setExpenses]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const now          = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  /* Load all data in parallel on mount */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [expData, catData, summaryData] = await Promise.all([
          expenseAPI.getExpenses(),
          categoryAPI.getCategories(),
          expenseAPI.getMonthlySummary(now.getFullYear(), now.getMonth() + 1),
        ]);
        setExpenses(expData.data?.expenses || []);
        setCategories(catData.data?.categories || []);
        setMonthlySummary(summaryData.data?.summary || []);
      } catch (err) {
        setError('Failed to load dashboard data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Compute derived stats */
  const monthStart      = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyExpenses = expenses.filter(e => new Date(e.date) >= monthStart);
  const monthlyTotal    = monthlyExpenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const allTimeTotal    = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const dailyAvg        = monthlyExpenses.length > 0 ? monthlyTotal / now.getDate() : 0;

  /* Five most recent expenses */
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  /* For bar chart: widest bar = 100 % */
  const maxSummary = Math.max(...monthlySummary.map(s => parseFloat(s.total || 0)), 1);

  const getCategoryColor = (name) => {
    const cat = categories.find(c => c.name === name);
    return cat?.color || '#6366f1';
  };

  const getCatById = (id) => categories.find(c => c.id === id);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-ring"></div>
        <p>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* ── Header ── */}
      <div className="dash-header">
        <div>
          <h1 className="dash-greeting">Welcome back, {user?.name || 'there'}! 👋</h1>
          <p className="dash-sub">Here's your financial overview for <strong>{currentMonth}</strong></p>
        </div>
        <Link to="/expenses" className="btn-add-expense">+ Add Expense</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* ── Stat cards ── */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--card-color': '#6366f1' }}>
          <div className="stat-emoji">💸</div>
          <div className="stat-body">
            <span className="stat-label">This Month</span>
            <span className="stat-value">${monthlyTotal.toFixed(2)}</span>
            <span className="stat-meta">{monthlyExpenses.length} expenses</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--card-color': '#8b5cf6' }}>
          <div className="stat-emoji">📊</div>
          <div className="stat-body">
            <span className="stat-label">All Time</span>
            <span className="stat-value">${allTimeTotal.toFixed(2)}</span>
            <span className="stat-meta">{expenses.length} total</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--card-color': '#06b6d4' }}>
          <div className="stat-emoji">🏷️</div>
          <div className="stat-body">
            <span className="stat-label">Categories</span>
            <span className="stat-value">{categories.length}</span>
            <span className="stat-meta">active</span>
          </div>
        </div>

        <div className="stat-card" style={{ '--card-color': '#10b981' }}>
          <div className="stat-emoji">📅</div>
          <div className="stat-body">
            <span className="stat-label">Daily Average</span>
            <span className="stat-value">${dailyAvg.toFixed(2)}</span>
            <span className="stat-meta">this month</span>
          </div>
        </div>
      </div>

      {/* ── Two-column content ── */}
      <div className="dash-grid">
        {/* Category breakdown */}
        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Spending by Category</h2>
            <span className="dash-card-sub">{currentMonth}</span>
          </div>

          {monthlySummary.length === 0 ? (
            <div className="dash-empty">
              <span className="dash-empty-icon">📂</span>
              <p>No expenses this month yet.</p>
              <Link to="/expenses" className="dash-empty-link">Add your first expense →</Link>
            </div>
          ) : (
            <div className="breakdown-list">
              {monthlySummary.map((item, i) => {
                const pct   = (parseFloat(item.total) / maxSummary) * 100;
                const color = getCategoryColor(item.category_name);
                return (
                  <div key={i} className="breakdown-item">
                    <div className="breakdown-row">
                      <span className="breakdown-dot" style={{ background: color }}></span>
                      <span className="breakdown-name">{item.category_name}</span>
                      <span className="breakdown-amount">${parseFloat(item.total).toFixed(2)}</span>
                    </div>
                    <div className="breakdown-track">
                      <div
                        className="breakdown-fill"
                        style={{ width: `${pct}%`, background: color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent expenses */}
        <div className="dash-card">
          <div className="dash-card-head">
            <h2>Recent Expenses</h2>
            <Link to="/expenses" className="dash-view-all">View all →</Link>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="dash-empty">
              <span className="dash-empty-icon">🧾</span>
              <p>No expenses recorded yet.</p>
              <Link to="/expenses" className="dash-empty-link">Record one now →</Link>
            </div>
          ) : (
            <div className="recent-list">
              {recentExpenses.map(exp => {
                const cat = getCatById(exp.category_id);
                return (
                  <div key={exp.id} className="recent-item">
                    <div className="recent-dot" style={{ background: cat?.color || '#6366f1' }}></div>
                    <div className="recent-info">
                      <span className="recent-desc">{exp.description}</span>
                      <span className="recent-meta">
                        {cat?.name || 'Unknown'} &middot; {new Date(exp.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="recent-amount">${parseFloat(exp.amount).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
