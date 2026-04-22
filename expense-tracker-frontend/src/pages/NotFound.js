import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

/* 404 – shown for any unmatched route */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <div className="notfound-illustration">
          <span className="nf-emoji">🔍</span>
          <div className="nf-code">404</div>
        </div>
        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-desc">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="nf-actions">
          <button className="btn-go-back" onClick={() => navigate(-1)}>← Go Back</button>
          <Link to="/" className="btn-go-home">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
