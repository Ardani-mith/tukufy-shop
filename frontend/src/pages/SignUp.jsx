import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { register as apiRegister } from '../services/api';

export default function SignUp({ onSignUp, showToast }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await apiRegister(formData.name, formData.email, formData.password);
      onSignUp(data.user);
      showToast(`Account created! Welcome, ${data.user.name}!`);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <UserPlus size={28} />
          </div>
          <h1>Create Account</h1>
          <p>Join Tukufy and start shopping</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <User size={16} className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control input-with-icon"
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control input-with-icon"
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Log In</Link>
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
