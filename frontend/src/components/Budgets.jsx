import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = [
    { value: 'Food', icon: '🍔', color: '#ef4444' },
    { value: 'Transportation', icon: '🚗', color: '#3b82f6' },
    { value: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
    { value: 'Bills', icon: '📱', color: '#06b6d4' },
    { value: 'Shopping', icon: '🛍️', color: '#f59e0b' },
    { value: 'Healthcare', icon: '🏥', color: '#10b981' },
    { value: 'Education', icon: '📚', color: '#6366f1' },
    { value: 'Travel', icon: '✈️', color: '#ec4899' },
    { value: 'Personal', icon: '👤', color: '#f97316' },
    { value: 'Other', icon: '📦', color: '#64748b' }
  ];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/budgets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setBudgets(budgets.filter(b => b._id !== id));
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const getCategoryInfo = (category) => {
    return categories.find(cat => cat.value === category) || { icon: '📦', color: '#64748b' };
  };

  const getBudgetStatus = (percentage) => {
    if (percentage > 100) return { status: 'over', color: '#ef4444', label: 'Over Budget' };
    if (percentage > 80) return { status: 'warning', color: '#f59e0b', label: 'Near Limit' };
    if (percentage > 50) return { status: 'moderate', color: '#3b82f6', label: 'Moderate' };
    return { status: 'healthy', color: '#22c55e', label: 'Healthy' };
  };

  const getRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredAndSortedBudgets = budgets
    .filter(budget => {
      if (filter === 'all') return true;
      const percentage = (budget.spent / budget.amount) * 100;
      if (filter === 'over') return percentage > 100;
      if (filter === 'warning') return percentage > 80 && percentage <= 100;
      if (filter === 'healthy') return percentage <= 80;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          return b.amount - a.amount;
        case 'spent':
          return b.spent - a.spent;
        case 'percentage':
          return (b.spent / b.amount) - (a.spent / a.amount);
        case 'remaining':
          return getRemainingDays(a.endDate) - getRemainingDays(b.endDate);
        default:
          return 0;
      }
    });

  const getTotalBudgeted = () => {
    return budgets.reduce((total, budget) => total + budget.amount, 0);
  };

  const getTotalSpent = () => {
    return budgets.reduce((total, budget) => total + budget.spent, 0);
  };

  const getAverageUsage = () => {
    if (budgets.length === 0) return 0;
    const totalPercentage = budgets.reduce((total, budget) => {
      return total + (budget.spent / budget.amount) * 100;
    }, 0);
    return totalPercentage / budgets.length;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading your budgets...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.animatedBackground}>
        <div style={styles.floatingShapes}>
          <div style={{...styles.shape, ...styles.shape1}}></div>
          <div style={{...styles.shape, ...styles.shape2}}></div>
          <div style={{...styles.shape, ...styles.shape3}}></div>
        </div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerText}>
            <h1 style={styles.title}>Budget Management 💰</h1>
            <p style={styles.subtitle}>Track and manage your spending across all categories</p>
          </div>
          <Link to="/budgets/add" style={styles.addButton}>
            <span style={styles.addIcon}>+</span>
            Create Budget
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>📊</div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Total Budgeted</h3>
            <div style={styles.summaryAmount}>${getTotalBudgeted().toLocaleString()}</div>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>💸</div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Total Spent</h3>
            <div style={styles.summaryAmount}>${getTotalSpent().toLocaleString()}</div>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>🎯</div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Average Usage</h3>
            <div style={styles.summaryAmount}>{getAverageUsage().toFixed(1)}%</div>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>📈</div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Active Budgets</h3>
            <div style={styles.summaryAmount}>{budgets.length}</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div style={styles.controls}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter by Status:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Budgets</option>
            <option value="healthy">Healthy (&lt;80%)</option>
            <option value="warning">Warning (80-100%)</option>
            <option value="over">Over Budget</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="name">Name</option>
            <option value="amount">Budget Amount</option>
            <option value="spent">Amount Spent</option>
            <option value="percentage">Usage %</option>
            <option value="remaining">Days Remaining</option>
          </select>
        </div>
      </div>

      {/* Budgets Grid */}
      <div style={styles.budgetsGrid}>
        {filteredAndSortedBudgets.length > 0 ? (
          filteredAndSortedBudgets.map(budget => {
            const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const status = getBudgetStatus(percentage);
            const categoryInfo = getCategoryInfo(budget.category);
            const remainingDays = getRemainingDays(budget.endDate);
            const remainingAmount = budget.amount - budget.spent;

            return (
              <div key={budget._id} style={styles.budgetCard}>
                {/* Budget Header */}
                <div style={styles.budgetHeader}>
                  <div style={styles.budgetTitleSection}>
                    <div style={{
                      ...styles.categoryBadge,
                      backgroundColor: `${categoryInfo.color}20`,
                      borderColor: categoryInfo.color
                    }}>
                      <span style={styles.categoryIcon}>{categoryInfo.icon}</span>
                      <span style={styles.categoryName}>{budget.category}</span>
                    </div>
                    <h3 style={styles.budgetName}>{budget.name}</h3>
                  </div>
                  <div style={styles.budgetActions}>
                    <div style={{
                      ...styles.statusBadge,
                      backgroundColor: `${status.color}20`,
                      color: status.color
                    }}>
                      {status.label}
                    </div>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      style={styles.deleteButton}
                      title="Delete budget"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Progress Section */}
                <div style={styles.progressSection}>
                  <div style={styles.progressHeader}>
                    <span style={styles.progressLabel}>Progress</span>
                    <span style={styles.progressPercentage}>{percentage.toFixed(1)}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        backgroundColor: status.color,
                        width: `${Math.min(percentage, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div style={styles.progressStats}>
                    <span style={styles.progressStat}>
                      <span style={styles.statLabel}>Spent:</span>
                      <span style={styles.statValue}>${budget.spent?.toFixed(2) || '0.00'}</span>
                    </span>
                    <span style={styles.progressStat}>
                      <span style={styles.statLabel}>Budget:</span>
                      <span style={styles.statValue}>${budget.amount.toFixed(2)}</span>
                    </span>
                    <span style={styles.progressStat}>
                      <span style={styles.statLabel}>Remaining:</span>
                      <span style={{
                        ...styles.statValue,
                        color: remainingAmount >= 0 ? '#22c55e' : '#ef4444'
                      }}>
                        ${Math.abs(remainingAmount).toFixed(2)}
                        {remainingAmount < 0 && ' over'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Alerts and Info */}
                <div style={styles.budgetInfo}>
                  {percentage > 100 && (
                    <div style={styles.alert}>
                      <span style={styles.alertIcon}>⚠️</span>
                      <span style={styles.alertText}>
                        Over budget by ${(budget.spent - budget.amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  {budget.alerts?.enabled && percentage >= budget.alerts.threshold && percentage <= 100 && (
                    <div style={styles.warning}>
                      <span style={styles.warningIcon}>🔔</span>
                      <span style={styles.warningText}>
                        Alert: {percentage.toFixed(1)}% used (threshold: {budget.alerts.threshold}%)
                      </span>
                    </div>
                  )}

                  <div style={styles.metaInfo}>
                    <div style={styles.metaItem}>
                      <span style={styles.metaIcon}>🔄</span>
                      <span style={styles.metaText}>{budget.period}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <span style={styles.metaIcon}>📅</span>
                      <span style={styles.metaText}>
                        {remainingDays > 0 ? `${remainingDays} days left` : 'Expired'}
                      </span>
                    </div>
                    <div style={styles.metaItem}>
                      <span style={styles.metaIcon}>⏰</span>
                      <span style={styles.metaText}>
                        {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={styles.quickActions}>
                  <Link 
                    to={`/transactions?category=${budget.category}`}
                    style={styles.quickAction}
                  >
                    View Transactions
                  </Link>
                  <Link 
                    to={`/budgets/edit/${budget._id}`}
                    style={styles.quickAction}
                  >
                    Edit Budget
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💰</div>
            <h3 style={styles.emptyTitle}>No Budgets Found</h3>
            <p style={styles.emptyText}>
              {filter !== 'all' 
                ? `No budgets match the current filter. Try changing the filter settings.`
                : `You haven't created any budgets yet. Start planning your finances by creating your first budget.`
              }
            </p>
            <Link to="/budgets/add" style={styles.emptyAction}>
              Create Your First Budget
            </Link>
          </div>
        )}
      </div>

      {/* Insights Section */}
      {budgets.length > 0 && (
        <div style={styles.insightsSection}>
          <h3 style={styles.insightsTitle}>Budget Insights 💡</h3>
          <div style={styles.insightsGrid}>
            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>🎯</div>
              <div style={styles.insightContent}>
                <h4>Top Spending Category</h4>
                <p>
                  {budgets.reduce((max, budget) => 
                    budget.spent > max.spent ? budget : max, budgets[0]
                  )?.category || 'N/A'}
                </p>
              </div>
            </div>
            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>⚠️</div>
              <div style={styles.insightContent}>
                <h4>Budgets Needing Attention</h4>
                <p>
                  {budgets.filter(b => (b.spent / b.amount) * 100 > 80).length} budgets over 80% usage
                </p>
              </div>
            </div>
            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>💰</div>
              <div style={styles.insightContent}>
                <h4>Total Remaining</h4>
                <p>
                  ${budgets.reduce((total, budget) => total + Math.max(0, budget.amount - budget.spent), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// All styles defined as JavaScript objects
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  floatingShapes: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  shape: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    animation: 'float 6s ease-in-out infinite',
    filter: 'blur(40px)',
  },
  shape1: {
    width: '200px',
    height: '200px',
    top: '10%',
    left: '10%',
    animationDelay: '0s',
  },
  shape2: {
    width: '150px',
    height: '150px',
    top: '60%',
    left: '80%',
    animationDelay: '2s',
  },
  shape3: {
    width: '100px',
    height: '100px',
    top: '30%',
    left: '85%',
    animationDelay: '4s',
  },
  header: {
    position: 'relative',
    zIndex: 10,
    padding: '2rem 2rem 1rem',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #fff, #e2e8f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.1rem',
    maxWidth: '600px',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
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
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
  },
  addIcon: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    padding: '0 2rem 2rem',
    position: 'relative',
    zIndex: 10,
  },
  summaryCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  summaryIcon: {
    fontSize: '2rem',
    width: '60px',
    height: '60px',
    background: 'rgba(74, 144, 226, 0.1)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    margin: '0 0 0.5rem 0',
    color: '#4a5568',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  summaryAmount: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  controls: {
    position: 'relative',
    zIndex: 10,
    padding: '0 2rem 2rem',
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  filterLabel: {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  filterSelect: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    fontSize: '0.9rem',
  },
  budgetsGrid: {
    position: 'relative',
    zIndex: 10,
    padding: '0 2rem 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  budgetCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
  },
  budgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  budgetTitleSection: {
    flex: 1,
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '20px',
    border: '2px solid',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
  },
  categoryIcon: {
    fontSize: '1rem',
  },
  categoryName: {
    color: '#4a5568',
  },
  budgetName: {
    margin: '0',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  budgetActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: '600',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    color: '#ef4444',
  },
  progressSection: {
    marginBottom: '1.5rem',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  progressLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  progressPercentage: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  progressBar: {
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
  },
  progressStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '0.7rem',
    color: '#718096',
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  budgetInfo: {
    marginBottom: '1.5rem',
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    marginBottom: '0.75rem',
  },
  alertIcon: {
    fontSize: '1rem',
  },
  alertText: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#dc2626',
  },
  warning: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    background: '#fffbeb',
    border: '1px solid #fed7aa',
    borderRadius: '8px',
    marginBottom: '0.75rem',
  },
  warningIcon: {
    fontSize: '1rem',
  },
  warningText: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#d97706',
  },
  metaInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  metaIcon: {
    fontSize: '0.8rem',
    color: '#718096',
  },
  metaText: {
    fontSize: '0.8rem',
    color: '#64748b',
  },
  quickActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  quickAction: {
    flex: 1,
    padding: '0.75rem',
    background: '#f7fafc',
    color: '#4a90e2',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
    opacity: '0.5',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  emptyText: {
    color: '#718096',
    fontSize: '1rem',
    marginBottom: '2rem',
    maxWidth: '400px',
    margin: '0 auto 2rem',
  },
  emptyAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  insightsSection: {
    position: 'relative',
    zIndex: 10,
    padding: '0 2rem 2rem',
  },
  insightsTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '1.5rem',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  insightCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  insightIcon: {
    fontSize: '2rem',
  },
  insightContent: {
    flex: 1,
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '6px solid rgba(255, 255, 255, 0.3)',
    borderTop: '6px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  
};
export default Budgets;