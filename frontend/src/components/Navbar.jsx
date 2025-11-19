import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    setUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header style={{
      ...styles.navbar,
      ...(isScrolled ? styles.navbarScrolled : {})
    }}>
      <div style={styles.container}>
        {/* Brand Logo */}
        <Link to="/" style={styles.brandLink} onClick={closeMenu}>
          <div style={styles.brandContent}>
            <div style={styles.brandIcon}>💰</div>
            <div style={styles.brandText}>
              <h1 style={styles.brandTitle}>FinTrack AI</h1>
              <p style={styles.brandSubtitle}>Smart Finance Management</p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={styles.desktopNav}>
          <ul style={styles.navList}>
            {user ? (
              <>
                <li style={styles.navItem}>
                  <Link
                    to="/"
                    style={{
                      ...styles.navLink,
                      ...(isActive('/') ? styles.navLinkActive : {})
                    }}
                    onClick={closeMenu}
                  >
                    <span style={styles.navIcon}>📊</span>
                    Dashboard
                  </Link>
                </li>
                <li style={styles.navItem}>
                  <Link
                    to="/transactions"
                    style={{
                      ...styles.navLink,
                      ...(isActive('/transactions') ? styles.navLinkActive : {})
                    }}
                    onClick={closeMenu}
                  >
                    <span style={styles.navIcon}>💳</span>
                    Transactions
                  </Link>
                </li>
                <li style={styles.navItem}>
                  <Link
                    to="/budgets"
                    style={{
                      ...styles.navLink,
                      ...(isActive('/budgets') ? styles.navLinkActive : {})
                    }}
                    onClick={closeMenu}
                  >
                    <span style={styles.navIcon}>🎯</span>
                    Budgets
                  </Link>
                </li>
                <li style={styles.navItem}>
                  <Link
                    to="/reports"
                    style={{
                      ...styles.navLink,
                      ...(isActive('/reports') ? styles.navLinkActive : {})
                    }}
                    onClick={closeMenu}
                  >
                    <span style={styles.navIcon}>📈</span>
                    Reports
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li style={styles.navItem}>
                  <Link
                    to="/features"
                    style={styles.navLink}
                    onClick={closeMenu}
                  >
                    <span style={styles.navIcon}>⭐</span>
                    Features
                  </Link>
                </li>
                <li style={styles.navItem}>
                  <Link
                    to="/pricing"
                    style={styles.navLink}
                    onClick={closeMenu}
                  >
                    <span style={styles.navIcon}>💎</span>
                    Pricing
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* User Section */}
        <div style={styles.userSection}>
          {user ? (
            <div style={styles.userContainer}>
              <div style={styles.userGreeting}>
                <span style={styles.greetingText}>{getGreeting()},</span>
                <span style={styles.userName}>{user.name || 'User'}</span>
              </div>
              
              <div style={styles.userMenuContainer}>
                <button
                  style={styles.userButton}
                  onClick={toggleUserMenu}
                  aria-label="User menu"
                >
                  <div style={styles.userAvatar}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={styles.userDropdownIcon}>▼</span>
                </button>

                {userMenuOpen && (
                  <div style={styles.userDropdown}>
                    <div style={styles.dropdownHeader}>
                      <div style={styles.dropdownAvatar}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div style={styles.dropdownUserInfo}>
                        <div style={styles.dropdownUserName}>{user.name || 'User'}</div>
                        <div style={styles.dropdownUserEmail}>{user.email}</div>
                      </div>
                    </div>
                    
                    <div style={styles.dropdownDivider}></div>
                    
                    <Link 
                      to="/profile" 
                      style={styles.dropdownItem}
                      onClick={closeMenu}
                    >
                      <span style={styles.dropdownIcon}>👤</span>
                      Profile Settings
                    </Link>
                    
                    <Link 
                      to="/preferences" 
                      style={styles.dropdownItem}
                      onClick={closeMenu}
                    >
                      <span style={styles.dropdownIcon}>⚙️</span>
                      Preferences
                    </Link>
                    
                    <div style={styles.dropdownDivider}></div>
                    
                    <button
                      onClick={handleLogout}
                      style={styles.dropdownItem}
                    >
                      <span style={styles.dropdownIcon}>🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={styles.authButtons}>
              <Link
                to="/login"
                style={styles.loginButton}
                onClick={closeMenu}
              >
                <span style={styles.buttonIcon}>🔐</span>
                Sign In
              </Link>
              <Link
                to="/register"
                style={styles.registerButton}
                onClick={closeMenu}
              >
                <span style={styles.buttonIcon}>✨</span>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          style={styles.mobileToggle}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span style={{
            ...styles.hamburgerLine,
            ...(isMenuOpen ? styles.hamburgerLine1Open : {})
          }}></span>
          <span style={{
            ...styles.hamburgerLine,
            ...(isMenuOpen ? styles.hamburgerLine2Open : {})
          }}></span>
          <span style={{
            ...styles.hamburgerLine,
            ...(isMenuOpen ? styles.hamburgerLine3Open : {})
          }}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav style={{
        ...styles.mobileNav,
        ...(isMenuOpen ? styles.mobileNavOpen : {})
      }}>
        <div style={styles.mobileNavContent}>
          {user ? (
            <>
              <div style={styles.mobileUserInfo}>
                <div style={styles.mobileUserAvatar}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={styles.mobileUserDetails}>
                  <div style={styles.mobileUserName}>{user.name || 'User'}</div>
                  <div style={styles.mobileUserEmail}>{user.email}</div>
                </div>
              </div>

              <div style={styles.mobileNavList}>
                <Link
                  to="/"
                  style={{
                    ...styles.mobileNavLink,
                    ...(isActive('/') ? styles.mobileNavLinkActive : {})
                  }}
                  onClick={closeMenu}
                >
                  <span style={styles.mobileNavIcon}>📊</span>
                  Dashboard
                </Link>
                
                <Link
                  to="/transactions"
                  style={{
                    ...styles.mobileNavLink,
                    ...(isActive('/transactions') ? styles.mobileNavLinkActive : {})
                  }}
                  onClick={closeMenu}
                >
                  <span style={styles.mobileNavIcon}>💳</span>
                  Transactions
                </Link>
                
                <Link
                  to="/budgets"
                  style={{
                    ...styles.mobileNavLink,
                    ...(isActive('/budgets') ? styles.mobileNavLinkActive : {})
                  }}
                  onClick={closeMenu}
                >
                  <span style={styles.mobileNavIcon}>🎯</span>
                  Budgets
                </Link>
                
                <Link
                  to="/reports"
                  style={{
                    ...styles.mobileNavLink,
                    ...(isActive('/reports') ? styles.mobileNavLinkActive : {})
                  }}
                  onClick={closeMenu}
                >
                  <span style={styles.mobileNavIcon}>📈</span>
                  Reports
                </Link>
                
                <Link
                  to="/profile"
                  style={styles.mobileNavLink}
                  onClick={closeMenu}
                >
                  <span style={styles.mobileNavIcon}>👤</span>
                  Profile
                </Link>
              </div>

              <div style={styles.mobileActions}>
                <button
                  onClick={handleLogout}
                  style={styles.mobileLogoutButton}
                >
                  <span style={styles.mobileLogoutIcon}>🚪</span>
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={styles.mobileNavList}>
                <Link
                  to="/features"
                  style={styles.mobileNavLink}
                  onClick={closeMenu}
                >
                  <span style={styles.mobileNavIcon}>⭐</span>
                  Features
                </Link>
                
                <Link
                  to="/pricing"
                  style={styles.mobileNavLink}
                  onClick={closeMenu}
                >
                  <span style={styles.mobileNavIcon}>💎</span>
                  Pricing
                </Link>
              </div>

              <div style={styles.mobileAuthButtons}>
                <Link
                  to="/login"
                  style={styles.mobileLoginButton}
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  style={styles.mobileRegisterButton}
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          style={styles.overlay}
          onClick={closeMenu}
        ></div>
      )}
    </header>
  );
};

// All styles defined as JavaScript objects
const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  navbarScrolled: {
    background: 'rgba(255, 255, 255, 0.98)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
  },
  brandLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  brandContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  brandIcon: {
    fontSize: '2rem',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    borderRadius: '12px',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #2d3748, #4a5568)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  brandSubtitle: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#718096',
    fontWeight: '500',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '2rem',
  },
  navItem: {
    display: 'flex',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: '#4a5568',
    fontWeight: '500',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
  },
  navLinkActive: {
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
  },
  navIcon: {
    fontSize: '1.1rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userGreeting: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  greetingText: {
    fontSize: '0.8rem',
    color: '#718096',
  },
  userName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  userMenuContainer: {
    position: 'relative',
  },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
  },
  userDropdownIcon: {
    fontSize: '0.7rem',
    color: '#718096',
    transition: 'transform 0.3s ease',
  },
  userDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    minWidth: '200px',
    zIndex: 1001,
    overflow: 'hidden',
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
  },
  dropdownAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
  },
  dropdownUserInfo: {
    flex: 1,
  },
  dropdownUserName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  dropdownUserEmail: {
    fontSize: '0.8rem',
    color: '#718096',
  },
  dropdownDivider: {
    height: '1px',
    background: '#e2e8f0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: '#4a5568',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    background: 'none',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
  },
  dropdownIcon: {
    fontSize: '1rem',
  },
  authButtons: {
    display: 'flex',
    gap: '0.75rem',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    color: '#4a5568',
    fontWeight: '500',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
  },
  registerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    color: 'white',
    fontWeight: '600',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
  },
  buttonIcon: {
    fontSize: '1rem',
  },
  mobileToggle: {
    display: 'none',
    flexDirection: 'column',
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    gap: '4px',
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  hamburgerLine: {
    width: '20px',
    height: '2px',
    background: '#4a5568',
    transition: 'all 0.3s ease',
    borderRadius: '2px',
  },
  hamburgerLine1Open: {
    transform: 'rotate(45deg) translate(6px, 6px)',
  },
  hamburgerLine2Open: {
    opacity: 0,
  },
  hamburgerLine3Open: {
    transform: 'rotate(-45deg) translate(6px, -6px)',
  },
  mobileNav: {
    position: 'fixed',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-100%)',
    transition: 'transform 0.3s ease',
    zIndex: 999,
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  mobileNavOpen: {
    transform: 'translateY(0)',
  },
  mobileNavContent: {
    padding: '2rem',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, #f7fafc, #edf2f7)',
    borderRadius: '12px',
    marginBottom: '2rem',
  },
  mobileUserAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.2rem',
  },
  mobileUserDetails: {
    flex: 1,
  },
  mobileUserName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  mobileUserEmail: {
    fontSize: '0.8rem',
    color: '#718096',
  },
  mobileNavList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    color: '#4a5568',
    fontWeight: '500',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
  },
  mobileNavLinkActive: {
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
  },
  mobileNavIcon: {
    fontSize: '1.2rem',
  },
  mobileActions: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '1rem',
  },
  mobileLogoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontWeight: '500',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
  },
  mobileLogoutIcon: {
    fontSize: '1.2rem',
  },
  mobileAuthButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '2rem',
  },
  mobileLoginButton: {
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    color: '#4a5568',
    fontWeight: '500',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
  mobileRegisterButton: {
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    color: 'white',
    fontWeight: '600',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
};

// All styles are now defined as JavaScript objects above
// Removed the problematic CSS injection function that was causing parsing errors

export default Navbar;