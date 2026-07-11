import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Shield, User } from 'lucide-react';
import { login as apiLogin } from '../services/api';

export default function Login({ onLogin, showToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from || '/';

  const handleTemplateLogin = (role) => {
    const templates = {
      admin: { email: 'admin@tukufy.com', password: 'admin123' },
      user: { email: 'user@tukufy.com', password: 'user123' }
    };
    setFormData(templates[role]);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiLogin(formData.email, formData.password);
      onLogin(data.user);
      showToast(`Welcome back, ${data.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <LogIn size={28} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your Tukufy account</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control input-with-icon"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control input-with-icon"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or login as</span>
        </div>

        <div className="auth-template-buttons">
          <button
            type="button"
            className="btn btn-secondary auth-template-btn"
            onClick={() => handleTemplateLogin('admin')}
          >
            <Shield size={16} />
            Admin
          </button>
          <button
            type="button"
            className="btn btn-secondary auth-template-btn"
            onClick={() => handleTemplateLogin('user')}
          >
            <User size={16} />
            User
          </button>
        </div>

        <p className="auth-footer-text">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="auth-link">Sign Up</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 40px 36px;
          box-shadow: var(--shadow-md);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .auth-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: var(--color-text-primary);
        }

        .auth-header h1 {
          font-size: 24px;
          font-family: var(--font-heading);
          margin-bottom: 6px;
        }

        .auth-header p {
          color: var(--color-text-secondary);
          font-size: 14px;
        }

        .auth-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--color-error-bg);
          border: 1px solid var(--color-error-border);
          color: var(--color-error);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 13px;
          margin-bottom: 20px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-icon-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          pointer-events: none;
        }

        .input-with-icon {
          padding-left: 42px;
        }

        .auth-submit-btn {
          width: 100%;
          height: 48px;
          border-radius: var(--radius-md);
          font-size: 16px;
          justify-content: center;
          margin-top: 16px;
        }

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          color: var(--color-text-muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }

        .auth-template-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
        }

        .auth-template-btn {
          justify-content: center;
          font-size: 14px;
          padding: 10px 16px;
          border-radius: var(--radius-md);
          gap: 8px;
          transition: var(--transition-fast);
        }

        .auth-template-btn:hover {
          background-color: var(--color-accent);
          color: #fff;
        }

        .auth-footer-text {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .auth-link {
          font-weight: 600;
          color: var(--color-text-primary);
          text-decoration: underline;
        }

        .auth-link:hover {
          color: var(--color-accent-hover);
        }
      `}</style>
    </div>
  );
}
