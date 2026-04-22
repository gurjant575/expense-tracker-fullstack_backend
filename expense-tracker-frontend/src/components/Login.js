import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/Auth.css';

/* Login page – split layout: brand panel left, form right */
const Login = () => {
  const { login }    = useAuth();
  const navigate     = useNavigate();

  const [formData, setFormData]     = useState({ email: '', password: '' });
  const [errors, setErrors]         = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]       = useState(false);

  /* Client-side validation */
  const validate = () => {
    const e = {};
    if (!formData.email.trim())
      e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Enter a valid email address';

    if (!formData.password)
      e.password = 'Password is required';
    else if (formData.password.length < 6)
      e.password = 'Password must be at least 6 characters';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authAPI.login({ email: formData.email.trim(), password: formData.password });
      /* Store token and user then update global auth state */
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      login(res.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      {/* ── Left branding panel ── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div className="auth-logo-wrap">
            <span className="auth-logo-icon">💰</span>
          </div>
          <h1 className="auth-brand-title">SpendSmart</h1>
          <p className="auth-brand-tagline">
            Take control of your finances with intelligent, beautiful expense tracking.
          </p>
          <ul className="auth-features">
            <li>✅ Track every expense instantly</li>
            <li>✅ Organize by custom categories</li>
            <li>✅ Visualize monthly spending</li>
            <li>✅ Secure &amp; private by design</li>
          </ul>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your SpendSmart account</p>
          </div>

          {serverError && (
            <div className="error-banner" role="alert">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email" type="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className={errors.email ? 'input-error' : ''}
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password" type="password" name="password"
                value={formData.password} onChange={handleChange}
                placeholder="Your password"
                className={errors.password ? 'input-error' : ''}
                autoComplete="current-password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading && <span className="btn-spinner"></span>}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-switch-link">Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
