import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
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
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [statsRes, transactionsRes, budgetsRes, trendsRes] = await Promise.all([
        fetch('/api/transactions/stats/summary', { headers }),
        fetch('/api/transactions?page=1&limit=6', { headers }),
        fetch('/api/budgets', { headers }),
        fetch(`/api/transactions/trends?range=${timeRange}`, { headers })
      ]);

      const statsData = await statsRes.json();
      const transactionsData = await transactionsRes.json();
      const budgetsData = await budgetsRes.json();
      const trendsData = await trendsRes.json();

      setStats(statsData);
      setRecentTransactions(transactionsData.transactions || []);
      setBudgets(budgetsData.budgets || []);
      setTrendData(trendsData.trends || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your financial dashboard...</p>
      </div>
    );
  }

  // Chart data preparation
  const categoryData = {};
  recentTransactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
    }
  });

  // Professional chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  const barData = {
    labels: Object.keys(categoryData),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(categoryData),
      backgroundColor: [
        'rgba(74, 144, 226, 0.8)',
        'rgba(108, 95, 199, 0.8)',
        'rgba(231, 74, 59, 0.8)',
        'rgba(34, 181, 115, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
      borderColor: [
        'rgba(74, 144, 226, 1)',
        'rgba(108, 95, 199, 1)',
        'rgba(231, 74, 59, 1)',
        'rgba(34, 181, 115, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(168, 85, 247, 1)',
      ],
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const doughnutData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: [
        'rgba(74, 144, 226, 0.8)',
        'rgba(108, 95, 199, 0.8)',
        'rgba(231, 74, 59, 0.8)',
        'rgba(34, 181, 115, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 2,
      cutout: '65%',
    }],
  };

  const trendChartData = {
    labels: trendData.map(item => item.month),
    datasets: [
      {
        label: 'Income',
        data: trendData.map(item => item.income),
        borderColor: 'rgba(34, 181, 115, 1)',
        backgroundColor: 'rgba(34, 181, 115, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: trendData.map(item => item.expenses),
        borderColor: 'rgba(231, 74, 59, 1)',
        backgroundColor: 'rgba(231, 74, 59, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="dashboard-container">
      {/* Header with Time Range Selector */}
      <div className="dashboard-header">
        <div>
          <h1>Financial Dashboard</h1>
          <p className="dashboard-subtitle">Overview of your financial health</p>
        </div>
        <div className="time-range-selector">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card income-card">
          <div className="card-icon">
            <i className="icon-income">💰</i>
          </div>
          <div className="card-content">
            <h3>Total Income</h3>
            <div className="amount positive">${stats?.totalIncome?.toFixed(2) || '0.00'}</div>
            <p className="card-trend positive">+12% from last month</p>
          </div>
        </div>
        
        <div className="summary-card expense-card">
          <div className="card-icon">
            <i className="icon-expense">💸</i>
          </div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <div className="amount negative">${stats?.totalExpenses?.toFixed(2) || '0.00'}</div>
            <p className="card-trend negative">-5% from last month</p>
          </div>
        </div>
        
        <div className="summary-card net-card">
          <div className="card-icon">
            <i className="icon-net">📊</i>
          </div>
          <div className="card-content">
            <h3>Net Income</h3>
            <div className={`amount ${stats?.netIncome >= 0 ? 'positive' : 'negative'}`}>
              ${stats?.netIncome?.toFixed(2) || '0.00'}
            </div>
            <p className="card-subtext">Your financial balance</p>
          </div>
        </div>
        
        <div className="summary-card transaction-card">
          <div className="card-icon">
            <i className="icon-transaction">🔄</i>
          </div>
          <div className="card-content">
            <h3>Transactions</h3>
            <div className="amount neutral">{stats?.transactionCount || 0}</div>
            <p className="card-subtext">Total transactions</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Income vs Expenses Trend</h3>
            <span className="chart-badge">Monthly</span>
          </div>
          <div className="chart-container">
            <Line data={trendChartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h3>Expense Distribution</h3>
            <span className="chart-badge">By Category</span>
          </div>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-header">
            <h3>Category Breakdown</h3>
            <span className="chart-badge">Detailed View</span>
          </div>
          <div className="chart-container">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        {/* Recent Transactions */}
        <div className="card recent-transactions">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <Link to="/transactions/add" className="btn btn-primary">
              <span>+ Add New</span>
            </Link>
          </div>
          <div className="card-content">
            {recentTransactions.length > 0 ? (
              <div className="transaction-list">
                {recentTransactions.map(transaction => (
                  <div key={transaction._id} className="transaction-item">
                    <div className="transaction-icon">
                      {transaction.type === 'income' ? '📥' : '📤'}
                    </div>
                    <div className="transaction-details">
                      <h4>{transaction.description}</h4>
                      <p>{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className={`transaction-amount ${transaction.type}-amount`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">💳</div>
                <p>No transactions yet</p>
                <Link to="/transactions/add" className="btn btn-outline">
                  Add your first transaction
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Budget Overview */}
        <div className="card budget-overview">
          <div className="card-header">
            <h3>Budget Overview</h3>
            <Link to="/budgets/add" className="btn btn-primary">
              <span>+ Create Budget</span>
            </Link>
          </div>
          <div className="card-content">
            {budgets.length > 0 ? (
              <div className="budget-list">
                {budgets.slice(0, 4).map(budget => {
                  const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                  const status = percentage > 90 ? 'danger' : percentage > 75 ? 'warning' : 'healthy';
                  
                  return (
                    <div key={budget._id} className="budget-item">
                      <div className="budget-header">
                        <h4>{budget.name}</h4>
                        <span className="budget-category">{budget.category}</span>
                      </div>
                      <div className="budget-progress">
                        <div className="progress-info">
                          <span>${budget.spent?.toFixed(2) || '0.00'}</span>
                          <span>${budget.amount.toFixed(2)}</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className={`progress-fill ${status}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="progress-percentage">
                          {percentage.toFixed(1)}% used
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <p>No budgets set yet</p>
                <Link to="/budgets/add" className="btn btn-outline">
                  Create your first budget
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;