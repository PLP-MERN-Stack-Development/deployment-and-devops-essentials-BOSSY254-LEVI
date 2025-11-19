import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [quickAmounts, setQuickAmounts] = useState([10, 20, 50, 100, 200]);

  const navigate = useNavigate();

  const categories = {
    expense: [
      { value: 'Food', icon: '🍔', color: '#ef4444', subcategories: ['Groceries', 'Restaurant', 'Coffee', 'Takeout'] },
      { value: 'Transportation', icon: '🚗', color: '#3b82f6', subcategories: ['Fuel', 'Public Transport', 'Taxi', 'Maintenance'] },
      { value: 'Entertainment', icon: '🎬', color: '#8b5cf6', subcategories: ['Movies', 'Games', 'Concerts', 'Streaming'] },
      { value: 'Bills', icon: '📱', color: '#06b6d4', subcategories: ['Electricity', 'Water', 'Internet', 'Phone'] },
      { value: 'Shopping', icon: '🛍️', color: '#f59e0b', subcategories: ['Clothing', 'Electronics', 'Home', 'Gifts'] },
      { value: 'Healthcare', icon: '🏥', color: '#10b981', subcategories: ['Doctor', 'Medicine', 'Insurance', 'Fitness'] },
      { value: 'Education', icon: '📚', color: '#6366f1', subcategories: ['Books', 'Courses', 'Software', 'Workshops'] },
      { value: 'Travel', icon: '✈️', color: '#ec4899', subcategories: ['Flights', 'Hotels', 'Food', 'Activities'] },
      { value: 'Personal', icon: '👤', color: '#f97316', subcategories: ['Personal Care', 'Hobbies', 'Grooming', 'Subscriptions'] }
    ],
    income: [
      { value: 'Salary', icon: '💰', color: '#22c55e', subcategories: ['Monthly', 'Bonus', 'Commission'] },
      { value: 'Freelance', icon: '💼', color: '#84cc16', subcategories: ['Project', 'Consulting', 'Contract'] },
      { value: 'Investment', icon: '📈', color: '#14b8a6', subcategories: ['Stocks', 'Dividends', 'Interest'] },
      { value: 'Gift', icon: '🎁', color: '#f97316', subcategories: ['Birthday', 'Holiday', 'Bonus'] },
      { value: 'Business', icon: '🏢', color: '#8b5cf6', subcategories: ['Sales', 'Services', 'Products'] },
      { value: 'Other', icon: '📦', color: '#64748b', subcategories: ['Refund', 'Rebate', 'Miscellaneous'] }
    ]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Update quick amounts based on transaction type
  useEffect(() => {
    if (formData.type === 'income') {
      setQuickAmounts([100, 200, 500, 1000, 2000]);
    } else {
      setQuickAmounts([10, 20, 50, 100, 200]);
    }
  }, [formData.type]);

  // Generate preview
  useEffect(() => {
    if (formData.amount && formData.description) {
      const selectedCategory = categories[formData.type]?.find(cat => cat.value === formData.category);
      setPreview({
        category: selectedCategory,
        amount: formData.amount,
        type: formData.type
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.amount, formData.description, formData.category, formData.type]);

  const handleQuickAmount = (amount) => {
    setFormData({
      ...formData,
      amount: amount.toString()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transactionData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/transactions');
      } else {
        setError(data.message || 'Failed to add transaction');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerText}>
            <h1 style={styles.title}>
              {formData.type === 'income' ? 'Add Income 💰' : 'Add Expense 💸'}
            </h1>
            <p style={styles.subtitle}>
              {formData.type === 'income' 
                ? 'Record your income and track your earnings' 
                : 'Record your expense and manage your spending'
              }
            </p>
          </div>
          <button
            style={styles.backButton}
            onClick={() => navigate('/transactions')}
          >
            ← Back to Transactions
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Form Section */}
        <div style={styles.formSection}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <div style={styles.formIcon}>
                {formData.type === 'income' ? '💰' : '💸'}
              </div>
              <h2 style={styles.formTitle}>Transaction Details</h2>
              <p style={styles.formDescription}>
                {formData.type === 'income' 
                  ? 'Record money coming in' 
                  : 'Track money going out'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {error && (
                <div style={styles.errorAlert}>
                  <span style={styles.errorIcon}>⚠️</span>
                  {error}
                </div>
              )}

              {/* Transaction Type Toggle */}
              <div style={styles.typeToggle}>
                <label
                  style={{
                    ...styles.typeOption,
                    ...(formData.type === 'expense' ? styles.typeOptionSelected : {}),
                    ...(formData.type === 'expense' ? styles.typeOptionExpense : {})
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={handleChange}
                    style={styles.radioInput}
                  />
                  <span style={styles.typeIcon}>💸</span>
                  <span style={styles.typeLabel}>Expense</span>
                </label>
                <label
                  style={{
                    ...styles.typeOption,
                    ...(formData.type === 'income' ? styles.typeOptionSelected : {}),
                    ...(formData.type === 'income' ? styles.typeOptionIncome : {})
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={handleChange}
                    style={styles.radioInput}
                  />
                  <span style={styles.typeIcon}>💰</span>
                  <span style={styles.typeLabel}>Income</span>
                </label>
              </div>

              {/* Amount Section */}
              <div style={styles.formGroup}>
                <label htmlFor="amount" style={styles.formLabel}>
                  Amount
                </label>
                <div style={styles.inputContainer}>
                  <span style={styles.inputIcon}>💵</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    style={styles.formInput}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                {/* Quick Amount Buttons */}
                <div style={styles.quickAmounts}>
                  <span style={styles.quickAmountsLabel}>Quick select:</span>
                  <div style={styles.quickAmountsGrid}>
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        style={styles.quickAmountButton}
                        onClick={() => handleQuickAmount(amount)}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={styles.formGroup}>
                <label htmlFor="description" style={styles.formLabel}>
                  Description
                </label>
                <div style={styles.inputContainer}>
                  <span style={styles.inputIcon}>📝</span>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder={
                      formData.type === 'income' 
                        ? 'e.g. Salary, Freelance Payment, Bonus...' 
                        : 'e.g. Groceries, Dinner, Movie Tickets...'
                    }
                    required
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Category</label>
                <div style={styles.categoryGrid}>
                  {categories[formData.type]?.map((category) => (
                    <label
                      key={category.value}
                      style={{
                        ...styles.categoryOption,
                        ...(formData.category === category.value ? styles.categoryOptionSelected : {}),
                        borderColor: formData.category === category.value ? category.color : '#e2e8f0'
                      }}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={formData.category === category.value}
                        onChange={handleChange}
                        style={styles.radioInput}
                      />
                      <span style={styles.categoryIcon}>{category.icon}</span>
                      <span style={styles.categoryLabel}>{category.value}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date and Tags */}
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label htmlFor="date" style={styles.formLabel}>
                    Date
                  </label>
                  <div style={styles.inputContainer}>
                    <span style={styles.inputIcon}>📅</span>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      style={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="tags" style={styles.formLabel}>
                    Tags
                  </label>
                  <div style={styles.inputContainer}>
                    <span style={styles.inputIcon}>🏷️</span>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      style={styles.formInput}
                      placeholder="e.g. lunch, work, monthly"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtons}>
                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    ...(loading ? styles.submitButtonDisabled : {}),
                    ...(formData.type === 'income' ? styles.submitButtonIncome : styles.submitButtonExpense)
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div style={styles.loadingSpinner}></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <span style={styles.buttonIcon}>
                        {formData.type === 'income' ? '💰' : '💸'}
                      </span>
                      {formData.type === 'income' ? 'Add Income' : 'Add Expense'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => navigate('/transactions')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div style={styles.previewSection}>
          <div style={styles.previewCard}>
            <h3 style={styles.previewTitle}>Transaction Preview</h3>
            {preview ? (
              <div style={styles.previewContent}>
                <div style={styles.previewHeader}>
                  <div style={{
                    ...styles.typeBadge,
                    ...(formData.type === 'income' ? styles.typeBadgeIncome : styles.typeBadgeExpense)
                  }}>
                    <span style={styles.typePreviewIcon}>
                      {formData.type === 'income' ? '💰' : '💸'}
                    </span>
                    <span style={styles.typePreviewText}>
                      {formData.type === 'income' ? 'Income' : 'Expense'}
                    </span>
                  </div>
                  <div style={{
                    ...styles.categoryBadge,
                    backgroundColor: `${preview.category.color}20`,
                    borderColor: preview.category.color
                  }}>
                    <span style={styles.categoryPreviewIcon}>{preview.category.icon}</span>
                    <span style={styles.categoryPreviewText}>{preview.category.value}</span>
                  </div>
                </div>

                <div style={styles.previewDetails}>
                  <h4 style={styles.transactionDescription}>{formData.description}</h4>
                  
                  <div style={{
                    ...styles.amountDisplay,
                    color: formData.type === 'income' ? '#22c55e' : '#ef4444'
                  }}>
                    <span style={styles.amountSymbol}>
                      {formData.type === 'income' ? '+' : '-'}$
                    </span>
                    <span style={styles.amountValue}>
                      {parseFloat(formData.amount).toLocaleString()}
                    </span>
                  </div>

                  <div style={styles.dateInfo}>
                    <div style={styles.dateIcon}>📅</div>
                    <div style={styles.dateText}>
                      {new Date(formData.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  {formData.tags && (
                    <div style={styles.tagsPreview}>
                      <div style={styles.tagsLabel}>Tags:</div>
                      <div style={styles.tagsList}>
                        {formData.tags.split(',').map((tag, index) => (
                          <span key={index} style={styles.tag}>
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={styles.impactPreview}>
                    <div style={styles.impactIcon}>
                      {formData.type === 'income' ? '📈' : '📉'}
                    </div>
                    <div style={styles.impactInfo}>
                      <span style={styles.impactText}>
                        This will {formData.type === 'income' ? 'increase' : 'decrease'} your balance
                      </span>
                      <span style={styles.impactSubtext}>
                        {formData.type === 'income' 
                          ? 'Money added to your account' 
                          : 'Money deducted from your account'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.emptyPreview}>
                <div style={styles.emptyIcon}>💳</div>
                <p style={styles.emptyText}>Fill in the form to see transaction preview</p>
              </div>
            )}
          </div>

          {/* Quick Tips Card */}
          <div style={styles.tipsCard}>
            <h4 style={styles.tipsTitle}>💡 Quick Tips</h4>
            <div style={styles.tipsList}>
              <div style={styles.tipItem}>
                <span style={styles.tipIcon}>⏰</span>
                <span>Record transactions immediately for accuracy</span>
              </div>
              <div style={styles.tipItem}>
                <span style={styles.tipIcon}>🏷️</span>
                <span>Use tags to easily search and filter later</span>
              </div>
              <div style={styles.tipItem}>
                <span style={styles.tipIcon}>📊</span>
                <span>Regular tracking helps identify spending patterns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  backButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    padding: '0 2rem 2rem',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  formCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  formIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  formTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.5rem',
  },
  formDescription: {
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
  typeToggle: {
    display: 'flex',
    background: '#f7fafc',
    borderRadius: '16px',
    padding: '4px',
    border: '2px solid #e2e8f0',
  },
  typeOption: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'transparent',
  },
  typeOptionSelected: {
    background: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  typeOptionExpense: {
    color: '#ef4444',
  },
  typeOptionIncome: {
    color: '#22c55e',
  },
  radioInput: {
    display: 'none',
  },
  typeIcon: {
    fontSize: '1.2rem',
  },
  typeLabel: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: '0',
  },
  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#4a5568',
    fontWeight: '600',
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
  quickAmounts: {
    marginTop: '0.75rem',
  },
  quickAmountsLabel: {
    fontSize: '0.8rem',
    color: '#718096',
    marginBottom: '0.5rem',
    display: 'block',
  },
  quickAmountsGrid: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  quickAmountButton: {
    padding: '0.5rem 1rem',
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '0.75rem',
  },
  categoryOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'white',
  },
  categoryOptionSelected: {
    background: '#f7fafc',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  categoryIcon: {
    fontSize: '1.5rem',
  },
  categoryLabel: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#4a5568',
    textAlign: 'center',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  submitButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  submitButtonExpense: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  submitButtonIncome: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
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
  cancelButton: {
    padding: '1rem 1.5rem',
    background: 'white',
    color: '#4a5568',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  previewSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  previewCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  previewTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  previewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  previewHeader: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
  },
  typeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  typeBadgeExpense: {
    background: '#fef2f2',
    border: '2px solid #ef4444',
    color: '#ef4444',
  },
  typeBadgeIncome: {
    background: '#f0fdf4',
    border: '2px solid #22c55e',
    color: '#22c55e',
  },
  typePreviewIcon: {
    fontSize: '1rem',
  },
  typePreviewText: {
    fontWeight: '600',
  },
  categoryBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    border: '2px solid',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  categoryPreviewIcon: {
    fontSize: '1rem',
  },
  categoryPreviewText: {
    color: '#4a5568',
  },
  previewDetails: {
    textAlign: 'center',
  },
  transactionDescription: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '1rem',
  },
  amountDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '0.25rem',
    marginBottom: '1.5rem',
    fontSize: '2rem',
    fontWeight: '700',
  },
  amountSymbol: {
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
  },
  dateInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    background: '#f7fafc',
    borderRadius: '12px',
  },
  dateIcon: {
    fontSize: '1.2rem',
  },
  dateText: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#4a5568',
  },
  tagsPreview: {
    marginBottom: '1.5rem',
  },
  tagsLabel: {
    fontSize: '0.8rem',
    color: '#718096',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  tagsList: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    padding: '0.25rem 0.75rem',
    background: '#e2e8f0',
    color: '#4a5568',
    borderRadius: '16px',
    fontSize: '0.7rem',
    fontWeight: '500',
  },
  impactPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
  },
  impactIcon: {
    fontSize: '1.5rem',
  },
  impactInfo: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  impactText: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  impactSubtext: {
    fontSize: '0.8rem',
    color: '#64748b',
  },
  emptyPreview: {
    textAlign: 'center',
    padding: '3rem 2rem',
    color: '#a0aec0',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: '0.5',
  },
  emptyText: {
    margin: 0,
    fontSize: '0.9rem',
  },
  tipsCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  tipsTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '1rem',
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
    padding: '0.75rem',
    background: '#f7fafc',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#4a5568',
  },
  tipIcon: {
    fontSize: '1.1rem',
  },
};

export default AddTransaction;