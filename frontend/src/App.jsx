import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import AddTransaction from './components/AddTransaction';
import AddBudget from './components/AddBudget';
import { AuthContext } from './context/AuthContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appTheme, setAppTheme] = useState('light');
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedTheme = localStorage.getItem('appTheme');
    
    if (savedTheme) {
      setAppTheme(savedTheme);
    }

    if (token) {
      // Verify token and get user data
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Token validation failed');
        }
        return res.json();
      })
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(err => {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Update theme in localStorage and apply to document
    localStorage.setItem('appTheme', appTheme);
    document.documentElement.setAttribute('data-theme', appTheme);
  }, [appTheme]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  const toggleTheme = () => {
    setAppTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Get current page title for accessibility
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/': 'Dashboard - FinTrack',
      '/login': 'Sign In - FinTrack',
      '/register': 'Create Account - FinTrack',
      '/transactions': 'Transactions - FinTrack',
      '/transactions/add': 'Add Transaction - FinTrack',
      '/budgets': 'Budgets - FinTrack',
      '/budgets/add': 'Create Budget - FinTrack'
    };
    return titles[path] || 'FinTrack - Smart Finance Management';
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingLogo}>
            <div style={styles.logoIcon}>💰</div>
            <h1 style={styles.logoText}>FinTrack</h1>
          </div>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading your financial dashboard...</p>
          <div style={styles.loadingProgress}>
            <div style={styles.progressBar}>
              <div style={styles.progressFill}></div>
            </div>
          </div>
        </div>
        
        {/* Loading Tips */}
        <div style={styles.loadingTips}>
          <h4 style={styles.tipsTitle}>💡 Quick Tips</h4>
          <div style={styles.tipsList}>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>📊</span>
              <span>Track every transaction for better insights</span>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>🎯</span>
              <span>Set realistic budgets to achieve your goals</span>
            </div>
            <div style={styles.tipItem}>
              <span style={styles.tipIcon}>💰</span>
              <span>Regular reviews help identify spending patterns</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div style={{
        ...styles.app,
        ...(appTheme === 'dark' ? styles.appDark : styles.appLight)
      }}>
        {/* Dynamic Page Title */}
        <title>{getPageTitle()}</title>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          style={styles.themeToggle}
          aria-label={`Switch to ${appTheme === 'light' ? 'dark' : 'light'} mode`}
        >
          {appTheme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Background Elements */}
        <div style={styles.backgroundElements}>
          <div style={styles.bgCircle1}></div>
          <div style={styles.bgCircle2}></div>
          <div style={styles.bgCircle3}></div>
        </div>

        <Navbar />
        
        <main style={styles.main}>
          <div style={styles.container}>
            <Routes>
              <Route 
                path="/" 
                element={user ? <Dashboard /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/login" 
                element={!user ? <Login /> : <Navigate to="/" />} 
              />
              <Route 
                path="/register" 
                element={!user ? <Register /> : <Navigate to="/" />} 
              />
              <Route 
                path="/transactions" 
                element={user ? <Transactions /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/transactions/add" 
                element={user ? <AddTransaction /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/budgets" 
                element={user ? <Budgets /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/budgets/add" 
                element={user ? <AddBudget /> : <Navigate to="/login" />} 
              />
              
              {/* Catch all route - redirect to dashboard or login */}
              <Route 
                path="*" 
                element={<Navigate to={user ? "/" : "/login"} />} 
              />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerBrand}>
              <div style={styles.footerLogo}>
                <span style={styles.footerLogoIcon}>💰</span>
                <span style={styles.footerLogoText}>FinTrack</span>
              </div>
              <p style={styles.footerTagline}>
                Smart finance management for everyone
              </p>
            </div>
            
            <div style={styles.footerLinks}>
              <div style={styles.footerSection}>
                <h4 style={styles.footerHeading}>Product</h4>
                <a href="/transactions" style={styles.footerLink}>Transactions</a>
                <a href="/budgets" style={styles.footerLink}>Budgets</a>
                <a href="/reports" style={styles.footerLink}>Reports</a>
              </div>
              
              <div style={styles.footerSection}>
                <h4 style={styles.footerHeading}>Support</h4>
                <a href="/help" style={styles.footerLink}>Help Center</a>
                <a href="/contact" style={styles.footerLink}>Contact Us</a>
                <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
              </div>
              
              <div style={styles.footerSection}>
                <h4 style={styles.footerHeading}>Company</h4>
                <a href="/about" style={styles.footerLink}>About</a>
                <a href="/blog" style={styles.footerLink}>Blog</a>
                <a href="/careers" style={styles.footerLink}>Careers</a>
              </div>
            </div>
          </div>
          
          <div style={styles.footerBottom}>
            <div style={styles.footerCopyright}>
              © 2024 FinTrack. All rights reserved.
            </div>
            <div style={styles.footerSocial}>
              <span style={styles.socialText}>Follow us:</span>
              <button style={styles.socialLink} aria-label="Facebook">📘</button>
              <button style={styles.socialLink} aria-label="Twitter">🐦</button>
              <button style={styles.socialLink} aria-label="Instagram">📷</button>
              <button style={styles.socialLink} aria-label="LinkedIn">💼</button>
            </div>
          </div>
        </footer>

        {/* Toast Notification Container */}
        <div id="toast-container" style={styles.toastContainer}></div>

        {/* Quick Actions Floating Button */}
        {user && (
          <div style={styles.quickActions}>
            <button style={styles.quickActionButton}>
              <span style={styles.quickActionIcon}>⚡</span>
            </button>
            <div style={styles.quickActionMenu}>
              <Link to="/transactions/add" style={styles.quickActionItem}>
                <span style={styles.quickItemIcon}>💸</span>
                Add Expense
              </Link>
              <Link to="/transactions/add?type=income" style={styles.quickActionItem}>
                <span style={styles.quickItemIcon}>💰</span>
                Add Income
              </Link>
              <Link to="/budgets/add" style={styles.quickActionItem}>
                <span style={styles.quickItemIcon}>🎯</span>
                Create Budget
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

// Import Link for quick actions
const Link = ({ to, style, children }) => (
  <a href={to} style={style}>{children}</a>
);

// All styles defined as JavaScript objects
const styles = {
  app: {
    minHeight: '100vh',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  appLight: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    color: '#2d3748',
  },
  appDark: {
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    color: '#f7fafc',
  },
  themeToggle: {
    position: 'fixed',
    top: '100px',
    right: '2rem',
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  backgroundElements: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%)',
    animation: 'float 8s ease-in-out infinite',
  },
  bgCircle2: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
    animation: 'float 6s ease-in-out infinite 2s',
  },
  bgCircle3: {
    position: 'absolute',
    bottom: '20%',
    left: '60%',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
    animation: 'float 10s ease-in-out infinite 1s',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    minHeight: 'calc(100vh - 80px)',
    paddingTop: '80px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    padding: '2rem',
  },
  loadingContent: {
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
  },
  loadingLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '3rem',
  },
  logoIcon: {
    fontSize: '4rem',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  logoText: {
    fontSize: '3rem',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(135deg, #fff, #e2e8f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  loadingSpinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 2rem',
  },
  loadingText: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    opacity: '0.9',
  },
  loadingProgress: {
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'white',
    borderRadius: '3px',
    animation: 'progress 2s ease-in-out infinite',
  },
  loadingTips: {
    marginTop: '4rem',
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '400px',
  },
  tipsTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.2rem',
    textAlign: 'center',
  },
  tipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  tipItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    opacity: '0.9',
  },
  tipIcon: {
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  footer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    marginTop: '4rem',
    position: 'relative',
    zIndex: 10,
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '3rem',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  footerLogoIcon: {
    fontSize: '2rem',
  },
  footerLogoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  footerTagline: {
    color: '#718096',
    fontSize: '1rem',
    margin: 0,
  },
  footerLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  footerHeading: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2d3748',
    margin: '0 0 0.5rem 0',
  },
  footerLink: {
    color: '#718096',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  },
  footerBottom: {
    borderTop: '1px solid #e2e8f0',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  footerCopyright: {
    color: '#718096',
    fontSize: '0.9rem',
  },
  footerSocial: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  socialText: {
    color: '#718096',
    fontSize: '0.9rem',
  },
  socialLink: {
    fontSize: '1.2rem',
    textDecoration: 'none',
    transition: 'transform 0.2s ease',
  },
  toastContainer: {
    position: 'fixed',
    top: '100px',
    right: '2rem',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  quickActions: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 1000,
  },
  quickActionButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(74, 144, 226, 0.3)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: '1.5rem',
  },
  quickActionMenu: {
    position: 'absolute',
    bottom: '70px',
    right: 0,
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    padding: '0.5rem',
    minWidth: '200px',
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateY(10px)',
    transition: 'all 0.3s ease',
  },
  quickActionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: '#4a5568',
    fontSize: '0.9rem',
    fontWeight: '500',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  quickItemIcon: {
    fontSize: '1.1rem',
  },
};

// All styles are now defined as JavaScript objects above
// Removed the problematic CSS injection functions that were causing parsing errors

export default App;