import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import AddTransaction from './components/AddTransaction';
import AddBudget from './components/AddBudget';
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(err => console.error('Auth check failed:', err))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/login" />} />
            <Route path="/transactions/add" element={user ? <AddTransaction /> : <Navigate to="/login" />} />
            <Route path="/budgets" element={user ? <Budgets /> : <Navigate to="/login" />} />
            <Route path="/budgets/add" element={user ? <AddBudget /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
