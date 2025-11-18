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
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const handleDemoLogin = async (demoType) => {
    setLoading(true);
    setError('');
    
    const demoAccounts = {
      user: { email: 'demo@example.com', password: 'demo123' },
      premium: { email: 'premium@example.com', password: 'premium123' }
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(demoAccounts[demoType])
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError('Demo login failed. Please try again.');
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
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.animatedBackground}>
        <div style={styles.floatingShapes}>
          <div style={{...styles.shape, ...styles.shape1}}></div>
          <div style={{...styles.shape, ...styles.shape2}}></div>
          <div style={{...styles.shape, ...styles.shape3}}></div>
        </div>
        <div style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>Welcome Back! 👋</h1>
          <p style={styles.welcomeSubtitle}>
            Track your finances, achieve your goals, and take control of your financial future.
          </p>
          <div style={styles.featuresGrid}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>📊</span>
              <div>
                <h4>Smart Analytics</h4>
                <p>Visualize your spending patterns</p>
              </div>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🎯</span>
              <div>
                <h4>Goal Tracking</h4>
                <p>Set and achieve financial goals</p>
              </div>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>💰</span>
              <div>
                <h4>Budget Management</h4>
                <p>Stay on top of your finances</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div style={styles.formSection}>
        <div style={styles.formCard}>
          {/* Header */}
          <div style={styles.formHeader}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>💰</span>
              <span style={styles.logoText}>FinTrack</span>
            </div>
            <h2 style={styles.formTitle}>Welcome Back</h2>
            <p style={styles.formSubtitle}>Sign in to continue your financial journey</p>
          </div>

          {/* Demo Login Buttons */}
          <div style={styles.demoSection}>
            <p style={styles.demoLabel}>Quick Demo Access</p>
            <div style={styles.demoButtons}>
              <button 
                type="button"
                style={styles.demoButton}
                onClick={() => handleDemoLogin('user')}
                disabled={loading}
              >
                <span style={styles.demoIcon}>👤</span>
                Demo User
              </button>
              <button 
                type="button"
                style={{...styles.demoButton, ...styles.demoButtonPremium}}
                onClick={() => handleDemoLogin('premium')}
                disabled={loading}
              >
                <span style={styles.demoIcon}>⭐</span>
                Premium Demo
              </button>
            </div>
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or continue with email</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.errorAlert}>
                <span style={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.formLabel}>
                Email Address
              </label>
              <div style={styles.inputContainer}>
                <span style={styles.inputIcon}>📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.formInput}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={styles.formGroup}>
              <div style={styles.passwordHeader}>
                <label htmlFor="password" style={styles.formLabel}>
                  Password
                </label>
                <Link to="/forgot-password" style={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>
              <div style={styles.inputContainer}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.formInput}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={styles.formOptions}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  style={styles.checkboxInput}
                />
                <span style={styles.checkmark}></span>
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(loading || !formData.email || !formData.password ? styles.submitButtonDisabled : {})
              }}
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  Signing In...
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>🚀</span>
                  Sign In
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div style={styles.authFooter}>
              <p style={styles.authText}>
                Don't have an account?{' '}
                <Link to="/register" style={styles.authLink}>
                  Create an account
                </Link>
              </p>
            </div>
          </form>

          {/* Security Badge */}
          <div style={styles.securityBadge}>
            <span style={styles.securityIcon}>🔒</span>
            <span style={styles.securityText}>Your data is securely encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// All styles defined as JavaScript objects
const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  animatedBackground: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  floatingShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  shape: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    animation: 'float 6s ease-in-out infinite',
  },
  shape1: {
    width: '120px',
    height: '120px',
    top: '20%',
    left: '20%',
    animationDelay: '0s',
  },
  shape2: {
    width: '80px',
    height: '80px',
    top: '60%',
    left: '70%',
    animationDelay: '2s',
  },
  shape3: {
    width: '100px',
    height: '100px',
    top: '40%',
    left: '80%',
    animationDelay: '4s',
  },
  welcomeSection: {
    textAlign: 'center',
    zIndex: 2,
    maxWidth: '500px',
  },
  welcomeTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #fff, #e2e8f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  welcomeSubtitle: {
    fontSize: '1.2rem',
    opacity: '0.9',
    marginBottom: '3rem',
    lineHeight: '1.6',
  },
  featuresGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    fontSize: '2rem',
    width: '60px',
    height: '60px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'white',
  },
  formCard: {
    maxWidth: '450px',
    width: '100%',
    padding: '3rem',
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  logoIcon: {
    fontSize: '2rem',
  },
  logoText: {
    fontSize: '1.8rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  formTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  formSubtitle: {
    color: '#718096',
    fontSize: '1rem',
  },
  demoSection: {
    background: '#f7fafc',
    padding: '1.5rem',
    borderRadius: '16px',
    marginBottom: '2rem',
    border: '1px solid #e2e8f0',
  },
  demoLabel: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#4a5568',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  demoButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  demoButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    color: '#4a5568',
    fontWeight: '500',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  demoButtonPremium: {
    background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
    borderColor: '#f6e05e',
    color: '#744210',
  },
  demoIcon: {
    fontSize: '1.1rem',
  },
  divider: {
    textAlign: 'center',
    margin: '2rem 0',
    position: 'relative',
    color: '#a0aec0',
    fontSize: '0.9rem',
  },
  dividerText: {
    background: 'white',
    padding: '0 1rem',
    position: 'relative',
    zIndex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    background: '#fed7d7',
    color: '#c53030',
    borderRadius: '12px',
    border: '1px solid #feb2b2',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: '1.1rem',
  },
  formGroup: {
    marginBottom: '0',
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#4a5568',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  passwordHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    zIndex: 2,
    fontSize: '1.1rem',
    color: '#a0aec0',
  },
  formInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    background: 'white',
  },
  passwordToggle: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    color: '#a0aec0',
  },
  forgotLink: {
    color: '#4a90e2',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    color: '#4a5568',
    fontSize: '0.9rem',
    position: 'relative',
  },
  checkboxInput: {
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer',
  },
  checkmark: {
    width: '18px',
    height: '18px',
    border: '2px solid #cbd5e0',
    borderRadius: '4px',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
  },
  submitButtonDisabled: {
    opacity: '0.6',
    cursor: 'not-allowed',
    transform: 'none',
  },
  loadingSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  buttonIcon: {
    fontWeight: 'bold',
  },
  authFooter: {
    textAlign: 'center',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  authText: {
    color: '#718096',
    margin: 0,
  },
  authLink: {
    color: '#4a90e2',
    textDecoration: 'none',
    fontWeight: '600',
    marginLeft: '0.25rem',
  },
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '2rem',
    padding: '1rem',
    background: '#f7fafc',
    borderRadius: '12px',
    fontSize: '0.8rem',
    color: '#718096',
  },
  securityIcon: {
    fontSize: '1rem',
  },
  securityText: {
    fontWeight: '500',
  },
};

// Add keyframes for animations using CSS-in-JS approach
const keyframes = `
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) rotate(180deg) scale(1.1);
    opacity: 0.8;
  }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Create a style element and inject keyframes
const styleElement = document.createElement('style');
styleElement.textContent = keyframes;
document.head.appendChild(styleElement);

// Add hover effects using the same approach
const addHoverEffects = () => {
  const hoverStyles = `
    .demo-button:hover {
      background: #f7fafc;
      border-color: #cbd5e0;
      transform: translateY(-1px);
    }
    .form-input:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
    .password-toggle:hover {
      background: #f7fafc;
    }
    .submit-button:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
    }
    .auth-link:hover {
      text-decoration: underline;
    }
    .forgot-link:hover {
      text-decoration: underline;
    }
    input[type="checkbox"]:checked + .checkmark {
      background: #4a90e2;
      border-color: #4a90e2;
    }
    input[type="checkbox"]:checked + .checkmark::after {
      content: '✓';
      position: absolute;
      color: white;
      font-size: 12px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `;

  const hoverStyleElement = document.createElement('style');
  hoverStyleElement.textContent = hoverStyles;
  document.head.appendChild(hoverStyleElement);
};

// Initialize hover effects
addHoverEffects();

export default Login;