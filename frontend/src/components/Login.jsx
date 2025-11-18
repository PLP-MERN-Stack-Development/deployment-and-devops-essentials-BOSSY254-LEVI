import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="card">
        <h2>
          <span className="icon">🔐</span>
          Welcome Back
        </h2>
        <p className="form-subtitle">Sign in to your account to continue</p>

        {error && (
          <div className="alert alert-error">
            <span className="icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">
            <span className="icon">📧</span>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <span className="icon">🔒</span>
            Password
          </label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" name="remember" />
            <span className="checkmark"></span>
            Remember me
          </label>
          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading || !formData.email || !formData.password}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Signing in...
            </>
          ) : (
            <>
              <span className="icon">🚀</span>
              Sign In
            </>
          )}
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="auth-links">
          <p>
            Don't have an account?
            <Link to="/register" className="link-primary">
              Create one here
            </Link>
          </p>
        </div>

        <div className="demo-notice">
          <small>
            <span className="icon">💡</span>
            Demo: Use any email/password to test the app
          </small>
        </div>
      </form>
    </div>
  );
};

export default Login;
