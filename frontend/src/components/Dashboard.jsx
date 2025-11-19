import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [activeView, setActiveView] = useState('overview');

  const quickActions = [
    { icon: '💰', label: 'Add Income', link: '/transactions/add?type=income', color: '#22c55e' },
    { icon: '🛒', label: 'Add Expense', link: '/transactions/add?type=expense', color: '#ef4444' },
    { icon: '🎯', label: 'Set Budget', link: '/budgets/add', color: '#8b5cf6' },
    { icon: '🎯', label: 'Set Goal', link: '/goals/add', color: '#f59e0b' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, transactionsRes, budgetsRes, trendsRes, goalsRes, insightsRes] = await Promise.all([
        fetch('/api/transactions/stats/summary', { headers }),
        fetch('/api/transactions?page=1&limit=8', { headers }),
        fetch('/api/budgets', { headers }),
        fetch(`/api/transactions/trends?range=${timeRange}`, { headers }),
        fetch('/api/financial-goals', { headers }),
        fetch('/api/insights', { headers })
      ]);

      const statsData = await statsRes.json();
      const transactionsData = await transactionsRes.json();
      const budgetsData = await budgetsRes.json();
      const trendsData = await trendsRes.json();
      const goalsData = await goalsRes.json();
      const insightsData = await insightsRes.json();

      setStats(statsData);
      setRecentTransactions(transactionsData.transactions || []);
      setBudgets(budgetsData.budgets || []);
      setTrendData(trendsData.trends || []);
      setFinancialGoals(goalsData.goals || []);
      setInsights(insightsData.insights || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFinancialHealthScore = () => {
    if (!stats) return 0;
    const netIncome = stats.netIncome || 0;
    const savingsRate = ((netIncome / (stats.totalIncome || 1)) * 100) || 0;
    return Math.min(100, Math.max(0, savingsRate + 50));
  };

  const getSpendingInsights = () => {
    const insights = [];
    if (stats?.totalExpenses > (stats?.totalIncome * 0.7)) {
      insights.push('Your expenses are high relative to income. Consider reviewing your spending.');
    }
    if (stats?.netIncome > 0) {
      insights.push(`Great! You're saving $${stats.netIncome.toFixed(2)} this period.`);
    }
    if (stats?.totalExpenses < (stats?.totalIncome * 0.3)) {
      insights.push('Excellent savings rate! Consider investing your extra funds.');
    }
    return insights;
  };

  // Enhanced chart data preparation
  const categoryData = {};
  recentTransactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
    }
  });

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          color: '#e2e8f0',
          font: { size: 11 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#94a3b8',
          callback: (value) => '$' + value
        }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };



  const doughnutData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(168, 85, 247, 0.8)',
        'rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(14, 165, 233, 0.8)',
      ],
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 2,
      cutout: '70%',
    }],
  };

  const trendChartData = {
    labels: trendData.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: trendData.map(item => item.income),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: 'Expenses',
        data: trendData.map(item => item.expenses),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      }
    ]
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading your financial dashboard...</p>
      </div>
    );
  }

  const healthScore = getFinancialHealthScore();
  const spendingInsights = getSpendingInsights();

  return (
    <div style={styles.dashboardContainer}>
      {/* Animated Background */}
      <div style={styles.animatedBackground}>
        <div style={styles.floatingShapes}>
          <div style={{...styles.shape, ...styles.shape1}}></div>
          <div style={{...styles.shape, ...styles.shape2}}></div>
          <div style={{...styles.shape, ...styles.shape3}}></div>
          <div style={{...styles.shape, ...styles.shape4}}></div>
        </div>
      </div>

      {/* Header Section */}
      <div style={styles.dashboardHeader}>
        <div style={styles.headerContent}>
          <div style={styles.welcomeSection}>
            <h1 style={styles.welcomeTitle}>Welcome Back! 👋</h1>
            <p style={styles.dashboardSubtitle}>Here's your financial overview for {timeRange}</p>
          </div>
          <div style={styles.headerActions}>
            <div style={styles.timeRangeSelector}>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                style={styles.timeSelect}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div style={styles.viewToggle}>
              <button 
                style={{
                  ...styles.viewBtn,
                  ...(activeView === 'overview' ? styles.viewBtnActive : {})
                }}
                onClick={() => setActiveView('overview')}
              >
                Overview
              </button>
              <button 
                style={{
                  ...styles.viewBtn,
                  ...(activeView === 'analytics' ? styles.viewBtnActive : {})
                }}
                onClick={() => setActiveView('analytics')}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link} style={styles.quickActionCard}>
            <div 
              style={{
                ...styles.actionIcon,
                backgroundColor: `${action.color}20`
              }}
            >
              <span style={{ color: action.color }}>{action.icon}</span>
            </div>
            <span style={styles.actionLabel}>{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Enhanced Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.cardGlow}></div>
          <div style={styles.cardContent}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, ...styles.incomeIcon}}>
                <span>💰</span>
              </div>
              <div style={styles.cardTrendPositive}>
                <span>↑ 12%</span>
              </div>
            </div>
            <h3 style={styles.cardTitle}>Total Income</h3>
            <div style={styles.amountPositive}>${stats?.totalIncome?.toFixed(2) || '0.00'}</div>
            <p style={styles.cardSubtext}>From all sources</p>
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.cardGlow}></div>
          <div style={styles.cardContent}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, ...styles.expenseIcon}}>
                <span>💸</span>
              </div>
              <div style={styles.cardTrendNegative}>
                <span>↓ 5%</span>
              </div>
            </div>
            <h3 style={styles.cardTitle}>Total Expenses</h3>
            <div style={styles.amountNegative}>${stats?.totalExpenses?.toFixed(2) || '0.00'}</div>
            <p style={styles.cardSubtext}>Across all categories</p>
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.cardGlow}></div>
          <div style={styles.cardContent}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, ...styles.netIcon}}>
                <span>📊</span>
              </div>
              <div style={stats?.netIncome >= 0 ? styles.cardTrendPositive : styles.cardTrendNegative}>
                <span>{stats?.netIncome >= 0 ? '↑' : '↓'} 8%</span>
              </div>
            </div>
            <h3 style={styles.cardTitle}>Net Income</h3>
            <div style={stats?.netIncome >= 0 ? styles.amountPositive : styles.amountNegative}>
              ${stats?.netIncome?.toFixed(2) || '0.00'}
            </div>
            <p style={styles.cardSubtext}>Your financial balance</p>
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.cardGlow}></div>
          <div style={styles.cardContent}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, ...styles.healthIcon}}>
                <span>❤️</span>
              </div>
              <div style={styles.healthScore}>
                <span>{healthScore}</span>
              </div>
            </div>
            <h3 style={styles.cardTitle}>Financial Health</h3>
            <div style={styles.healthProgress}>
              <div style={styles.progressCircle}>
                <svg width="80" height="80" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#334155" strokeWidth="8"/>
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#22c55e" strokeWidth="8" 
                    strokeLinecap="round" strokeDasharray="339.292" 
                    strokeDashoffset={339.292 * (1 - healthScore / 100)}/>
                </svg>
                <span style={styles.scoreText}>{healthScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div style={styles.dashboardMainGrid}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          {/* Financial Trends Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Income vs Expenses Trend</h3>
              <div style={styles.chartLegend}>
                <div style={styles.legendItem}>
                  <div style={{...styles.legendColor, ...styles.legendIncome}}></div>
                  <span>Income</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{...styles.legendColor, ...styles.legendExpense}}></div>
                  <span>Expenses</span>
                </div>
              </div>
            </div>
            <div style={styles.chartContainer}>
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Transactions */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Recent Transactions</h3>
              <Link to="/transactions/add" style={styles.btnPrimary}>
                <span>+ Add New</span>
              </Link>
            </div>
            <div style={styles.cardContent}>
              {recentTransactions.length > 0 ? (
                <div style={styles.transactionList}>
                  {recentTransactions.map(transaction => (
                    <div key={transaction._id} style={styles.transactionItem}>
                      <div style={styles.transactionIcon}>
                        {transaction.type === 'income' ? '📥' : '📤'}
                      </div>
                      <div style={styles.transactionDetails}>
                        <h4 style={styles.transactionName}>{transaction.description}</h4>
                        <p style={styles.transactionMeta}>{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <div style={{
                        ...styles.transactionAmount,
                        ...(transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount)
                      }}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>💳</div>
                  <p>No transactions yet</p>
                  <Link to="/transactions/add" style={styles.btnOutline}>
                    Add your first transaction
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          {/* Expense Distribution */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>Expense Distribution</h3>
              <span style={styles.chartBadge}>This Month</span>
            </div>
            <div style={styles.chartContainer}>
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>

          {/* Budget Overview */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Budget Overview</h3>
              <Link to="/budgets/add" style={styles.btnPrimary}>
                <span>+ Create</span>
              </Link>
            </div>
            <div style={styles.cardContent}>
              {budgets.length > 0 ? (
                <div style={styles.budgetList}>
                  {budgets.slice(0, 3).map(budget => {
                    const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                    const status = percentage > 90 ? 'danger' : percentage > 75 ? 'warning' : 'healthy';
                    
                    return (
                      <div key={budget._id} style={styles.budgetItem}>
                        <div style={styles.budgetHeader}>
                          <h4 style={styles.budgetName}>{budget.name}</h4>
                          <span style={styles.budgetCategory}>{budget.category}</span>
                        </div>
                        <div style={styles.budgetProgress}>
                          <div style={styles.progressInfo}>
                            <span>${budget.spent?.toFixed(2) || '0.00'}</span>
                            <span>${budget.amount.toFixed(2)}</span>
                          </div>
                          <div style={styles.progressBar}>
                            <div
                              style={{
                                ...styles.progressFill,
                                ...styles[`progressFill${status.charAt(0).toUpperCase() + status.slice(1)}`],
                                width: `${Math.min(percentage, 100)}%`
                              }}
                            ></div>
                          </div>
                          <div style={styles.progressPercentage}>
                            {percentage.toFixed(1)}% used
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🎯</div>
                  <p>No budgets set yet</p>
                  <Link to="/budgets/add" style={styles.btnOutline}>
                    Create your first budget
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Financial Insights */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Financial Insights</h3>
              <span style={styles.insightsBadge}>AI Powered</span>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.insightsList}>
                {spendingInsights.map((insight, index) => (
                  <div key={index} style={styles.insightItem}>
                    <div style={styles.insightIcon}>💡</div>
                    <p style={styles.insightText}>{insight}</p>
                  </div>
                ))}
                <div style={styles.insightItem}>
                  <div style={styles.insightIcon}>🎯</div>
                  <p style={styles.insightText}>Consider setting up automatic savings for your goals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div style={styles.goalsSection}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Financial Goals</h3>
          <Link to="/goals/add" style={styles.btnOutline}>
            + Add Goal
          </Link>
        </div>
        <div style={styles.goalsGrid}>
          {financialGoals.slice(0, 2).map(goal => (
            <div key={goal._id} style={styles.goalCard}>
              <div style={styles.goalIcon}>{goal.icon || '🎯'}</div>
              <div style={styles.goalContent}>
                <h4 style={styles.goalName}>{goal.name}</h4>
                <p style={styles.goalTarget}>Target: ${goal.targetAmount?.toFixed(2)}</p>
                <div style={styles.goalProgress}>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        ...styles.progressFillHealthy,
                        width: `${(goal.savedAmount / goal.targetAmount) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span style={styles.goalPercentage}>{((goal.savedAmount / goal.targetAmount) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
          {financialGoals.length === 0 && (
            <div style={styles.goalCard}>
              <div style={styles.goalIcon}>🎯</div>
              <p>No goals set yet</p>
              <Link to="/goals/add" style={styles.btnOutline}>
                Set Your First Goal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// All styles defined as JavaScript objects
const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    position: 'relative',
    overflowX: 'hidden',
  },
  animatedBackground: {
    position: 'fixed',
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
    background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))',
    animation: 'float 6s ease-in-out infinite',
    filter: 'blur(40px)',
  },
  shape1: {
    width: '300px',
    height: '300px',
    top: '10%',
    left: '10%',
    animationDelay: '0s',
  },
  shape2: {
    width: '200px',
    height: '200px',
    top: '60%',
    left: '80%',
    animationDelay: '2s',
  },
  shape3: {
    width: '250px',
    height: '250px',
    top: '30%',
    left: '70%',
    animationDelay: '4s',
  },
  shape4: {
    width: '180px',
    height: '180px',
    top: '70%',
    left: '20%',
    animationDelay: '1s',
  },
  dashboardHeader: {
    position: 'relative',
    zIndex: 10,
    padding: '2rem 2rem 1rem',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
  },
  dashboardSubtitle: {
    color: '#94a3b8',
    fontSize: '1.1rem',
  },
  headerActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  timeRangeSelector: {
    position: 'relative',
  },
  timeSelect: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#e2e8f0',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    fontSize: '0.9rem',
  },
  viewToggle: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '4px',
    backdropFilter: 'blur(10px)',
  },
  viewBtn: {
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'transparent',
    color: '#94a3b8',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
  },
  viewBtnActive: {
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#60a5fa',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    padding: '0 2rem 2rem',
    position: 'relative',
    zIndex: 10,
  },
  quickActionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.5rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    textDecoration: 'none',
    color: '#e2e8f0',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  actionIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  actionLabel: {
    fontSize: '0.85rem',
    fontWeight: '500',
    textAlign: 'center',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    padding: '0 2rem 2rem',
    position: 'relative',
    zIndex: 10,
  },
  summaryCard: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    padding: '1.5rem',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(255, 255, 255, 0.1), transparent 40%)',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  cardContent: {
    position: 'relative',
    zIndex: 2,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  cardIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  incomeIcon: {
    background: 'rgba(34, 197, 94, 0.2)',
  },
  expenseIcon: {
    background: 'rgba(239, 68, 68, 0.2)',
  },
  netIcon: {
    background: 'rgba(59, 130, 246, 0.2)',
  },
  healthIcon: {
    background: 'rgba(236, 72, 153, 0.2)',
  },
  cardTrendPositive: {
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  cardTrendNegative: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#f87171',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  cardTitle: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.5rem',
  },
  amountPositive: {
    color: '#4ade80',
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0.5rem 0',
  },
  amountNegative: {
    color: '#f87171',
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0.5rem 0',
  },
  cardSubtext: {
    color: '#64748b',
    fontSize: '0.85rem',
    margin: 0,
  },
  healthScore: {
    color: '#22c55e',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  healthProgress: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  progressCircle: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    position: 'absolute',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#e2e8f0',
  },
  dashboardMainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.5rem',
    padding: '0 2rem 2rem',
    position: 'relative',
    zIndex: 10,
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  chartCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    padding: '1.5rem',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  chartTitle: {
    color: '#e2e8f0',
    fontSize: '1.2rem',
    fontWeight: '600',
    margin: 0,
  },
  chartLegend: {
    display: 'flex',
    gap: '1rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#94a3b8',
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  legendIncome: {
    background: '#22c55e',
  },
  legendExpense: {
    background: '#ef4444',
  },
  chartBadge: {
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#60a5fa',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  chartContainer: {
    height: '300px',
    position: 'relative',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
  },
  cardContent: {
    padding: '1.5rem',
  },
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  transactionIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(59, 130, 246, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    margin: '0 0 0.25rem 0',
    color: '#e2e8f0',
    fontSize: '0.95rem',
  },
  transactionMeta: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '0.8rem',
  },
  transactionAmount: {
    fontWeight: '600',
    fontSize: '1rem',
  },
  incomeAmount: {
    color: '#4ade80',
  },
  expenseAmount: {
    color: '#f87171',
  },
  budgetList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  budgetItem: {
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
  },
  budgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  budgetName: {
    margin: 0,
    color: '#e2e8f0',
    fontSize: '0.95rem',
  },
  budgetCategory: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#94a3b8',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
  },
  budgetProgress: {
    marginTop: '0.5rem',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '0.8rem',
    color: '#94a3b8',
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  progressFillHealthy: {
    background: '#22c55e',
  },
  progressFillWarning: {
    background: '#f59e0b',
  },
  progressFillDanger: {
    background: '#ef4444',
  },
  progressPercentage: {
    textAlign: 'right',
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginTop: '0.25rem',
  },
  insightsBadge: {
    background: 'rgba(168, 85, 247, 0.2)',
    color: '#a855f7',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
  },
  insightIcon: {
    fontSize: '1.1rem',
    marginTop: '0.1rem',
  },
  insightText: {
    margin: 0,
    color: '#e2e8f0',
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  goalsSection: {
    padding: '0 2rem 2rem',
    position: 'relative',
    zIndex: 10,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: 0,
  },
  goalsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  goalCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  goalIcon: {
    fontSize: '2rem',
  },
  goalContent: {
    flex: 1,
  },
  goalName: {
    margin: '0 0 0.5rem 0',
    color: '#e2e8f0',
    fontSize: '1.1rem',
  },
  goalTarget: {
    margin: '0 0 0.75rem 0',
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
  goalProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  goalPercentage: {
    color: '#94a3b8',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
  },
  btnOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#e2e8f0',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: '0.5',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    color: '#e2e8f0',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
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
export default Dashboard;