import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/Auth.css';

/* Registration page – same split layout as Login */
const Register = () => {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors]     = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]   = useState(false);

  /* Client-side validation */
  const validate = () => {
    const e = {};
    if (!formData.name.trim())
      e.name = 'Full name is required';
    else if (formData.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters';

    if (!formData.email.trim())
      e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Enter a valid email address';

    if (!formData.password)
      e.password = 'Password is required';
    else if (formData.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    else if (formData.password.length > 50)
      e.password = 'Password must be less than 50 characters';

    if (!formData.confirmPassword)
      e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match';

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
      const { confirmPassword, ...userData } = formData;
      const res = await authAPI.register({
        ...userData,
        name:  userData.name.trim(),
        email: userData.email.trim(),
      });
      /* Store credentials and update global auth state */
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      login(res.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pwMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

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
            Join thousands who track their spending smarter every day.
          </p>
          <ul className="auth-features">
            <li>🚀 Get started in seconds</li>
            <li>🔒 Your data stays private</li>
            <li>📊 Beautiful spending insights</li>
            <li>🏷️ Custom expense categories</li>
          </ul>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>Create your account</h2>
            <p>Start tracking smarter today</p>
          </div>

          {serverError && (
            <div className="error-banner" role="alert">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name" type="text" name="name"
                value={formData.name} onChange={handleChange}
                placeholder="John Doe"
                className={errors.name ? 'input-error' : ''}
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

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
                placeholder="At least 6 characters"
                className={errors.password ? 'input-error' : ''}
                autoComplete="new-password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
              {formData.password && !errors.password && (
                <span className="field-success">✓ Password looks good</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword" type="password" name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="Re-enter your password"
                className={errors.confirmPassword ? 'input-error' : ''}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              {pwMatch && !errors.confirmPassword && (
                <span className="field-success">✓ Passwords match</span>
              )}
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading && <span className="btn-spinner"></span>}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-switch-link">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
