import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (error) setError('');

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 75) return '#22c55e';
    if (passwordStrength >= 50) return '#f59e0b';
    if (passwordStrength >= 25) return '#f97316';
    return '#ef4444';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 75) return 'Strong';
    if (passwordStrength >= 50) return 'Good';
    if (passwordStrength >= 25) return 'Weak';
    return 'Very Weak';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isFormValid = () => {
    return formData.name && 
           formData.email && 
           formData.password && 
           formData.confirmPassword && 
           formData.password === formData.confirmPassword &&
           formData.password.length >= 6;
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
          <h1 style={styles.welcomeTitle}>Start Your Journey! 🚀</h1>
          <p style={styles.welcomeSubtitle}>
            Join thousands of users who are taking control of their financial future with our powerful tools.
          </p>
          <div style={styles.featuresGrid}>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>📈</span>
              <div>
                <h4 style={styles.featureTitle}>Smart Analytics</h4>
                <p style={styles.featureDesc}>Visualize your financial growth</p>
              </div>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🎯</span>
              <div>
                <h4 style={styles.featureTitle}>Goal Tracking</h4>
                <p style={styles.featureDesc}>Achieve your financial dreams</p>
              </div>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureIcon}>🛡️</span>
              <div>
                <h4 style={styles.featureTitle}>Secure & Private</h4>
                <p style={styles.featureDesc}>Your data is always protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div style={styles.formSection}>
        <div style={styles.formCard}>
          {/* Header */}
          <div style={styles.formHeader}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>💰</span>
              <span style={styles.logoText}>FinTrack</span>
            </div>
            <h2 style={styles.formTitle}>Create Account</h2>
            <p style={styles.formSubtitle}>Join us and start your financial journey</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.errorAlert}>
                <span style={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            {/* Name Field */}
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.formLabel}>
                Full Name
              </label>
              <div style={styles.inputContainer}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.formInput}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
            </div>

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
                  placeholder="Enter your email address"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.formLabel}>
                Password
              </label>
              <div style={styles.inputContainer}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.formInput}
                  placeholder="Create a strong password"
                  required
                  minLength="6"
                  autoComplete="new-password"
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
              {formData.password && (
                <div style={styles.passwordStrength}>
                  <div style={styles.strengthBar}>
                    <div 
                      style={{
                        ...styles.strengthFill,
                        width: `${passwordStrength}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <span style={styles.strengthText}>
                    Strength: <span style={{color: getPasswordStrengthColor()}}>
                      {getPasswordStrengthText()}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.formLabel}>
                Confirm Password
              </label>
              <div style={styles.inputContainer}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    ...styles.formInput,
                    ...(formData.confirmPassword && formData.password !== formData.confirmPassword ? styles.inputError : {}),
                    ...(formData.confirmPassword && formData.password === formData.confirmPassword ? styles.inputSuccess : {})
                  }}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={loading}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.confirmPassword && (
                <div style={styles.passwordMatch}>
                  {formData.password === formData.confirmPassword ? (
                    <span style={styles.matchSuccess}>✓ Passwords match</span>
                  ) : (
                    <span style={styles.matchError}>✗ Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div style={styles.termsSection}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  required
                  style={styles.checkboxInput}
                />
                <span style={styles.checkmark}></span>
                I agree to the{' '}
                <Link to="/terms" style={styles.termsLink}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" style={styles.termsLink}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(!isFormValid() || loading ? styles.submitButtonDisabled : {})
              }}
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span style={styles.buttonIcon}>🚀</span>
                  Create Account
                </>
              )}
            </button>

            {/* Login Link */}
            <div style={styles.authFooter}>
              <p style={styles.authText}>
                Already have an account?{' '}
                <Link to="/login" style={styles.authLink}>
                  Sign in here
                </Link>
              </p>
            </div>
          </form>

          {/* Security Badge */}
          <div style={styles.securityBadge}>
            <span style={styles.securityIcon}>🛡️</span>
            <span style={styles.securityText}>Your data is securely encrypted and protected</span>
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
    top: '15%',
    left: '15%',
    animationDelay: '0s',
  },
  shape2: {
    width: '80px',
    height: '80px',
    top: '65%',
    left: '75%',
    animationDelay: '2s',
  },
  shape3: {
    width: '100px',
    height: '100px',
    top: '35%',
    left: '85%',
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
  featureTitle: {
    margin: '0 0 0.25rem 0',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  featureDesc: {
    margin: 0,
    opacity: '0.9',
    fontSize: '0.9rem',
  },
  formSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'white',
  },
  formCard: {
    maxWidth: '480px',
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
  inputError: {
    borderColor: '#ef4444',
  },
  inputSuccess: {
    borderColor: '#22c55e',
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
  passwordStrength: {
    marginTop: '0.5rem',
  },
  strengthBar: {
    height: '4px',
    background: '#e2e8f0',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '0.25rem',
  },
  strengthFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  strengthText: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
  },
  passwordMatch: {
    marginTop: '0.5rem',
  },
  matchSuccess: {
    fontSize: '0.8rem',
    color: '#22c55e',
    fontWeight: '500',
  },
  matchError: {
    fontSize: '0.8rem',
    color: '#ef4444',
    fontWeight: '500',
  },
  termsSection: {
    marginTop: '1rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    cursor: 'pointer',
    color: '#4a5568',
    fontSize: '0.9rem',
    lineHeight: '1.4',
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
    flexShrink: 0,
    marginTop: '0.1rem',
  },
  termsLink: {
    color: '#4a90e2',
    textDecoration: 'none',
    fontWeight: '500',
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

// Add hover effects and checkbox styling using the same approach
const addInteractiveStyles = () => {
  const interactiveStyles = `
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
    .auth-link:hover, .terms-link:hover {
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
    .feature-item:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.15);
    }
  `;

  const interactiveStyleElement = document.createElement('style');
  interactiveStyleElement.textContent = interactiveStyles;
  document.head.appendChild(interactiveStyleElement);
};

// Initialize interactive styles
addInteractiveStyles();

export default Register;