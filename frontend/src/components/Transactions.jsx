import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const categories = [
    { value: 'Food', icon: '🍔', color: '#ef4444' },
    { value: 'Transportation', icon: '🚗', color: '#3b82f6' },
    { value: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
    { value: 'Bills', icon: '📱', color: '#06b6d4' },
    { value: 'Shopping', icon: '🛍️', color: '#f59e0b' },
    { value: 'Healthcare', icon: '🏥', color: '#10b981' },
    { value: 'Education', icon: '📚', color: '#6366f1' },
    { value: 'Travel', icon: '✈️', color: '#ec4899' },
    { value: 'Salary', icon: '💰', color: '#22c55e' },
    { value: 'Freelance', icon: '💼', color: '#84cc16' },
    { value: 'Investment', icon: '📈', color: '#14b8a6' },
    { value: 'Other', icon: '📦', color: '#64748b' }
  ];

  const fetchTransactions = async () => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      // Simulate API call - replace with your actual API endpoint
      setTimeout(() => {
        // Mock data for demonstration
        const mockTransactions = [
          {
            _id: '1',
            description: 'Grocery Shopping',
            amount: 85.50,
            category: 'Food',
            type: 'expense',
            date: new Date().toISOString(),
            tags: ['supermarket', 'weekly']
          },
          {
            _id: '2',
            description: 'Freelance Payment',
            amount: 1200.00,
            category: 'Freelance',
            type: 'income',
            date: new Date(Date.now() - 86400000).toISOString(),
            tags: ['web design', 'client']
          },
          {
            _id: '3',
            description: 'Electricity Bill',
            amount: 75.30,
            category: 'Bills',
            type: 'expense',
            date: new Date(Date.now() - 172800000).toISOString(),
            tags: ['utilities']
          }
        ];
        
        setTransactions(mockTransactions);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      search: e.target.value
    });
    setCurrentPage(1);
  };

  const handleDeleteClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/transactions/${selectedTransaction._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTransactions(transactions.filter(t => t._id !== selectedTransaction._id));
        setShowDeleteModal(false);
        setSelectedTransaction(null);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const getCategoryInfo = (category) => {
    return categories.find(cat => cat.value === category) || { icon: '📦', color: '#64748b' };
  };

  const getTotalAmount = (type = 'all') => {
    if (type === 'all') {
      return transactions.reduce((total, transaction) => {
        return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
      }, 0);
    }
    return transactions
      .filter(t => t.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getTransactionCount = (type = 'all') => {
    if (type === 'all') return transactions.length;
    return transactions.filter(t => t.type === type).length;
  };

  // Sort and filter transactions
  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchTerm) ||
          transaction.category.toLowerCase().includes(searchTerm) ||
          (transaction.tags && transaction.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading your transactions...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerText}>
            <h1 style={styles.title}>Transaction History</h1>
            <p style={styles.subtitle}>Track and manage all your income and expenses</p>
          </div>
          <Link to="/transactions/add" style={styles.addButton}>
            <span style={styles.addIcon}>+</span>
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>📊</div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Total Balance</h3>
            <div style={{
              ...styles.summaryAmount,
              color: getTotalAmount() >= 0 ? '#22c55e' : '#ef4444'
            }}>
              {formatCurrency(Math.abs(getTotalAmount()))}
              {getTotalAmount() < 0 && ' negative'}
            </div>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>💰</div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Total Income</h3>
            <div style={styles.summaryAmount}>{formatCurrency(getTotalAmount('income'))}</div>
            <div style={styles.summaryCount}>{getTransactionCount('income')} transactions</div>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>💸</div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Total Expenses</h3>
            <div style={styles.summaryAmount}>{formatCurrency(getTotalAmount('expense'))}</div>
            <div style={styles.summaryCount}>{getTransactionCount('expense')} transactions</div>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>📈</div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Net Flow</h3>
            <div style={{
              ...styles.summaryAmount,
              color: getTotalAmount() >= 0 ? '#22c55e' : '#ef4444'
            }}>
              {getTotalAmount() >= 0 ? '+' : '-'}{formatCurrency(Math.abs(getTotalAmount()))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div style={styles.filtersCard}>
        <div style={styles.filtersHeader}>
          <h3 style={styles.filtersTitle}>Filters & Search</h3>
          <button onClick={clearFilters} style={styles.clearFiltersButton}>
            Clear All
          </button>
        </div>
        
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchInputContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search transactions by description, category, or tags..."
              value={filters.search}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={styles.filtersGrid}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Category</label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.value}
                </option>
              ))}
            </select>
          </div>
          
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Type</label>
            <select 
              name="type" 
              value={filters.type} 
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="">All Types</option>
              <option value="income">💰 Income</option>
              <option value="expense">💸 Expense</option>
            </select>
          </div>
          
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              style={styles.filterInput}
            />
          </div>
          
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              style={styles.filterInput}
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div style={styles.sortControls}>
          <div style={styles.sortGroup}>
            <label style={styles.sortLabel}>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="description">Description</option>
            </select>
          </div>
          <div style={styles.sortGroup}>
            <label style={styles.sortLabel}>Order:</label>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div style={styles.transactionsCard}>
        <div style={styles.transactionsHeader}>
          <h3 style={styles.transactionsTitle}>
            Transactions ({filteredAndSortedTransactions.length})
          </h3>
          <div style={styles.transactionsStats}>
            Showing {currentTransactions.length} of {filteredAndSortedTransactions.length} transactions
          </div>
        </div>

        {currentTransactions.length > 0 ? (
          <div style={styles.transactionsList}>
            {currentTransactions.map(transaction => {
              const categoryInfo = getCategoryInfo(transaction.category);
              return (
                <div key={transaction._id} style={styles.transactionItem}>
                  <div style={styles.transactionMain}>
                    <div style={styles.transactionIcon}>
                      <div style={{
                        ...styles.categoryIcon,
                        backgroundColor: `${categoryInfo.color}20`,
                        borderColor: categoryInfo.color
                      }}>
                        {categoryInfo.icon}
                      </div>
                    </div>
                    
                    <div style={styles.transactionDetails}>
                      <div style={styles.transactionHeader}>
                        <h4 style={styles.transactionDescription}>{transaction.description}</h4>
                        <div style={{
                          ...styles.amountBadge,
                          ...(transaction.type === 'income' ? styles.incomeBadge : styles.expenseBadge)
                        }}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                      
                      <div style={styles.transactionMeta}>
                        <div style={styles.metaItem}>
                          <span style={styles.metaIcon}>🏷️</span>
                          <span style={{
                            ...styles.categoryTag,
                            color: categoryInfo.color
                          }}>
                            {transaction.category}
                          </span>
                        </div>
                        <div style={styles.metaItem}>
                          <span style={styles.metaIcon}>📅</span>
                          <span style={styles.dateText}>
                            {formatDate(transaction.date)}
                          </span>
                        </div>
                        <div style={styles.metaItem}>
                          <span style={styles.metaIcon}>⏰</span>
                          <span style={styles.typeText}>
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </div>
                      </div>

                      {transaction.tags && transaction.tags.length > 0 && (
                        <div style={styles.tagsContainer}>
                          {transaction.tags.map((tag, index) => (
                            <span key={index} style={styles.tag}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={styles.transactionActions}>
                    <button
                      onClick={() => handleDeleteClick(transaction)}
                      style={styles.deleteButton}
                      title="Delete transaction"
                    >
                      🗑️
                    </button>
                    <Link 
                      to={`/transactions/edit/${transaction._id}`}
                      style={styles.editButton}
                      title="Edit transaction"
                    >
                      ✏️
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💳</div>
            <h3 style={styles.emptyTitle}>No Transactions Found</h3>
            <p style={styles.emptyText}>
              {Object.values(filters).some(filter => filter) 
                ? 'No transactions match your current filters. Try adjusting your search criteria.'
                : "You haven't recorded any transactions yet. Start tracking your finances by adding your first transaction."
              }
            </p>
            <Link to="/transactions/add" style={styles.emptyAction}>
              Add Your First Transaction
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                ...styles.paginationButton,
                ...(currentPage === 1 ? styles.paginationButtonDisabled : {})
              }}
            >
              ← Previous
            </button>
            
            <div style={styles.paginationNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  style={{
                    ...styles.paginationNumber,
                    ...(currentPage === number ? styles.paginationNumberActive : {})
                  }}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                ...styles.paginationButton,
                ...(currentPage === totalPages ? styles.paginationButtonDisabled : {})
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Delete Transaction</h3>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalText}>
                Are you sure you want to delete the transaction "{selectedTransaction?.description}"?
                This action cannot be undone.
              </p>
            </div>
            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.modalCancel}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={styles.modalDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Insights */}
      {transactions.length > 0 && (
        <div style={styles.insightsSection}>
          <h3 style={styles.insightsTitle}>Quick Insights</h3>
          <div style={styles.insightsGrid}>
            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>📅</div>
              <div style={styles.insightContent}>
                <h4>Most Active Day</h4>
                <p>
                  {(() => {
                    const dayCounts = {};
                    transactions.forEach(t => {
                      const day = new Date(t.date).toLocaleDateString();
                      dayCounts[day] = (dayCounts[day] || 0) + 1;
                    });
                    const mostActive = Object.entries(dayCounts).reduce((a, b) => a[1] > b[1] ? a : b);
                    return mostActive ? `${mostActive[0]} (${mostActive[1]} transactions)` : 'N/A';
                  })()}
                </p>
              </div>
            </div>
            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>🏷️</div>
              <div style={styles.insightContent}>
                <h4>Top Category</h4>
                <p>
                  {(() => {
                    const categoryTotals = {};
                    transactions.forEach(t => {
                      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
                    });
                    const topCategory = Object.entries(categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b);
                    return topCategory ? `${topCategory[0]} (${formatCurrency(topCategory[1])})` : 'N/A';
                  })()}
                </p>
              </div>
            </div>
            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>💰</div>
              <div style={styles.insightContent}>
                <h4>Average Transaction</h4>
                <p>{formatCurrency(getTotalAmount('all') / transactions.length)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '0 0 2rem 0',
  },
  header: {
    padding: '2rem 2rem 1rem',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: '1200px',
    margin: '0 auto',
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
    boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
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
    maxWidth: '1200px',
    margin: '0 auto',
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
    transition: 'transform 0.2s ease',
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
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.25rem',
  },
  summaryCount: {
    fontSize: '0.8rem',
    color: '#718096',
    fontWeight: '500',
  },
  filtersCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2rem',
    margin: '0 2rem 2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  filtersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  filtersTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: 0,
  },
  clearFiltersButton: {
    background: 'none',
    border: '1px solid #e2e8f0',
    color: '#718096',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  searchContainer: {
    marginBottom: '1.5rem',
  },
  searchInputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    zIndex: 2,
    fontSize: '1.1rem',
    color: '#a0aec0',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    background: 'white',
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  filterLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    background: 'white',
    transition: 'all 0.2s ease',
  },
  filterInput: {
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    background: 'white',
    transition: 'all 0.2s ease',
  },
  sortControls: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  sortGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  sortLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  sortSelect: {
    padding: '0.5rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    background: 'white',
  },
  transactionsCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2rem',
    margin: '0 2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  transactionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  transactionsTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: 0,
  },
  transactionsStats: {
    fontSize: '0.9rem',
    color: '#718096',
    fontWeight: '500',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease',
  },
  transactionMain: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    flex: 1,
  },
  transactionIcon: {
    flexShrink: 0,
  },
  categoryIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    border: '2px solid',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
  },
  transactionDescription: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2d3748',
    flex: 1,
  },
  amountBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '1rem',
    fontWeight: '700',
    marginLeft: '1rem',
  },
  incomeBadge: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#16a34a',
  },
  expenseBadge: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#dc2626',
  },
  transactionMeta: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  metaIcon: {
    fontSize: '0.8rem',
    color: '#94a3b8',
  },
  categoryTag: {
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  dateText: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '500',
  },
  typeText: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '500',
  },
  tagsContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap',
  },
  tag: {
    padding: '0.25rem 0.75rem',
    background: '#f1f5f9',
    color: '#475569',
    borderRadius: '16px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  transactionActions: {
    display: 'flex',
    gap: '0.5rem',
    flexShrink: 0,
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    color: '#ef4444',
  },
  editButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    color: '#3b82f6',
    textDecoration: 'none',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
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
    lineHeight: '1.6',
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
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #e2e8f0',
  },
  paginationButton: {
    padding: '0.75rem 1.5rem',
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  paginationNumbers: {
    display: 'flex',
    gap: '0.5rem',
  },
  paginationNumber: {
    padding: '0.75rem 1rem',
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '40px',
  },
  paginationNumberActive: {
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    color: 'white',
    borderColor: '#4a90e2',
  },
  insightsSection: {
    padding: '0 2rem',
    marginTop: '2rem',
    maxWidth: '1200px',
    margin: '2rem auto 0',
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
  loadingText: {
    color: 'white',
    fontSize: '1.1rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    marginBottom: '1rem',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  modalBody: {
    marginBottom: '2rem',
  },
  modalText: {
    color: '#6b7280',
    lineHeight: '1.5',
  },
  modalFooter: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  modalCancel: {
    padding: '0.75rem 1.5rem',
    background: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: '500',
  },
  modalDelete: {
    padding: '0.75rem 1.5rem',
    background: '#ef4444',
    border: '1px solid #dc2626',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default Transactions;