import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

/* Top navigation bar shown to authenticated users */
const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard',  label: 'Dashboard',  icon: '📊' },
    { path: '/expenses',   label: 'Expenses',   icon: '💸' },
    { path: '/categories', label: 'Categories', icon: '🏷️' },
  ];

  /* First letter of name or email for the avatar */
  const initials = (user?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand logo */}
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">💰</span>
          <span className="brand-name">SpendSmart</span>
        </Link>

        {/* Desktop nav links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* User section */}
        <div className="navbar-user">
          <div className="user-avatar">{initials}</div>
          <span className="user-name">{user?.name || user?.email}</span>
          <button className="btn-nav-logout" onClick={handleLogout}>Logout</button>
        </div>

        {/* Hamburger for mobile */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
