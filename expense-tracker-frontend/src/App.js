import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ExpenseList from './components/ExpenseList';
import CategoryList from './components/CategoryList';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [currentView, setCurrentView] = useState('expenses');
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('expenses');
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-page">
        {showLogin ? (
          <Login onSwitchToRegister={() => setShowLogin(false)} />
        ) : (
          <Register onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Expense Tracker</h1>
          <div className="header-user">
            <span>Welcome, {user?.name || user?.email}!</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button className={`nav-btn ${currentView === 'expenses' ? 'active' : ''}`} onClick={() => setCurrentView('expenses')}>
          Expenses
        </button>
        <button className={`nav-btn ${currentView === 'categories' ? 'active' : ''}`} onClick={() => setCurrentView('categories')}>
          Categories
        </button>
      </nav>

      <main className="app-main">
        {currentView === 'expenses' && <ExpenseList />}
        {currentView === 'categories' && <CategoryList />}
      </main>

      <footer className="app-footer">
        <p>Expense Tracker 2024</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
