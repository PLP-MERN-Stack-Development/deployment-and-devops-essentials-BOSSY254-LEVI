import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-content">
            <div className="brand-icon">💰</div>
            <h1>AI Finance Tracker</h1>
          </div>
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <nav className={`navbar-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            {user ? (
              <>
                <li>
                  <Link
                    to="/"
                    className={isActive('/') ? 'active' : ''}
                    onClick={closeMenu}
                  >
                    <span className="nav-icon">📊</span>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/transactions"
                    className={isActive('/transactions') ? 'active' : ''}
                    onClick={closeMenu}
                  >
                    <span className="nav-icon">💳</span>
                    Transactions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/budgets"
                    className={isActive('/budgets') ? 'active' : ''}
                    onClick={closeMenu}
                  >
                    <span className="nav-icon">🎯</span>
                    Budgets
                  </Link>
                </li>
                <li className="user-info">
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-name">{user.name || 'User'}</span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn-logout"
                  >
                    <span className="nav-icon">🚪</span>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={isActive('/login') ? 'active' : ''}
                    onClick={closeMenu}
                  >
                    <span className="nav-icon">🔐</span>
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={isActive('/register') ? 'active' : ''}
                    onClick={closeMenu}
                  >
                    <span className="nav-icon">✨</span>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
