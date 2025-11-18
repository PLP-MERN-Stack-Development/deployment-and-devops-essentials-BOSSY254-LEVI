import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBudget = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    alerts: {
      enabled: true,
      threshold: 80
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

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

  const periods = [
    { value: 'weekly', label: 'Weekly', icon: '📅' },
    { value: 'monthly', label: 'Monthly', icon: '🗓️' },
    { value: 'yearly', label: 'Yearly', icon: '📊' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'alerts.enabled') {
      setFormData({
        ...formData,
        alerts: {
          ...formData.alerts,
          enabled: checked
        }
      });
    } else if (name === 'alerts.threshold') {
      setFormData({
        ...formData,
        alerts: {
          ...formData.alerts,
          threshold: parseInt(value)
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseFloat(value) : value
      });
    }
  };

  // Auto-calculate end date based on period
  useEffect(() => {
    if (formData.startDate && formData.period) {
      const start = new Date(formData.startDate);
      let end = new Date(start);

      switch (formData.period) {
        case 'weekly':
          end.setDate(start.getDate() + 7);
          break;
        case 'monthly':
          end.setMonth(start.getMonth() + 1);
          break;
        case 'yearly':
          end.setFullYear(start.getFullYear() + 1);
          break;
        default:
          end.setMonth(start.getMonth() + 1);
      }

      setFormData(prev => ({
        ...prev,
        endDate: end.toISOString().split('T')[0]
      }));
    }
  }, [formData.startDate, formData.period]);

  // Generate preview
  useEffect(() => {
    if (formData.name && formData.amount) {
      const selectedCategory = categories.find(cat => cat.value === formData.category);
      const selectedPeriod = periods.find(p => p.value === formData.period);
      
      setPreview({
        category: selectedCategory,
        period: selectedPeriod,
        amount: formData.amount,
        alerts: formData.alerts
      });
    }
  }, [formData.name, formData.amount, formData.category, formData.period, formData.alerts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      };

      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(budgetData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/budgets');
      } else {
        setError(data.message || 'Failed to add budget');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.value === formData.category);
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
            <h1 style={styles.title}>Create New Budget</h1>
            <p style={styles.subtitle}>Plan your finances and track your spending with smart budgets</p>
          </div>
          <button
            style={styles.backButton}
            onClick={() => navigate('/budgets')}
          >
            ← Back to Budgets
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Form Section */}
        <div style={styles.formSection}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <div style={styles.formIcon}>💰</div>
              <h2 style={styles.formTitle}>Budget Details</h2>
              <p style={styles.formDescription}>
                Set up your budget with custom categories and alerts
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {error && (
                <div style={styles.errorAlert}>
                  <span style={styles.errorIcon}>⚠️</span>
                  {error}
                </div>
              )}

              {/* Budget Name */}
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.formLabel}>
                  Budget Name
                </label>
                <div style={styles.inputContainer}>
                  <span style={styles.inputIcon}>📝</span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="e.g. Monthly Food Budget, Vacation Savings..."
                    required
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Category</label>
                <div style={styles.categoryGrid}>
                  {categories.map((category) => (
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

              {/* Amount and Period */}
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label htmlFor="amount" style={styles.formLabel}>
                    Budget Amount
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
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Period</label>
                  <div style={styles.periodOptions}>
                    {periods.map((period) => (
                      <label
                        key={period.value}
                        style={{
                          ...styles.periodOption,
                          ...(formData.period === period.value ? styles.periodOptionSelected : {})
                        }}
                      >
                        <input
                          type="radio"
                          name="period"
                          value={period.value}
                          checked={formData.period === period.value}
                          onChange={handleChange}
                          style={styles.radioInput}
                        />
                        <span style={styles.periodIcon}>{period.icon}</span>
                        <span style={styles.periodLabel}>{period.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label htmlFor="startDate" style={styles.formLabel}>
                    Start Date
                  </label>
                  <div style={styles.inputContainer}>
                    <span style={styles.inputIcon}>📅</span>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      style={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="endDate" style={styles.formLabel}>
                    End Date
                  </label>
                  <div style={styles.inputContainer}>
                    <span style={styles.inputIcon}>⏰</span>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      style={styles.formInput}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Alerts Section */}
              <div style={styles.alertsSection}>
                <div style={styles.alertsHeader}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="alerts.enabled"
                      checked={formData.alerts.enabled}
                      onChange={handleChange}
                      style={styles.checkboxInput}
                    />
                    <span style={styles.checkmark}></span>
                    <span style={styles.alertsTitle}>Enable Budget Alerts</span>
                  </label>
                  <span style={styles.alertsBadge}>Smart Feature</span>
                </div>

                {formData.alerts.enabled && (
                  <div style={styles.alertSettings}>
                    <label htmlFor="alertThreshold" style={styles.formLabel}>
                      Alert Threshold
                    </label>
                    <div style={styles.thresholdContainer}>
                      <input
                        type="range"
                        id="alertThreshold"
                        name="alerts.threshold"
                        value={formData.alerts.threshold}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        style={styles.rangeInput}
                      />
                      <span style={styles.thresholdValue}>
                        {formData.alerts.threshold}%
                      </span>
                    </div>
                    <p style={styles.thresholdHint}>
                      Get notified when you reach {formData.alerts.threshold}% of your budget
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtons}>
                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    ...(loading ? styles.submitButtonDisabled : {})
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div style={styles.loadingSpinner}></div>
                      Creating Budget...
                    </>
                  ) : (
                    <>
                      <span style={styles.buttonIcon}>🚀</span>
                      Create Budget
                    </>
                  )}
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => navigate('/budgets')}
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
            <h3 style={styles.previewTitle}>Budget Preview</h3>
            {preview ? (
              <div style={styles.previewContent}>
                <div style={styles.previewHeader}>
                  <div style={{
                    ...styles.categoryBadge,
                    backgroundColor: `${preview.category.color}20`,
                    borderColor: preview.category.color
                  }}>
                    <span style={styles.categoryPreviewIcon}>{preview.category.icon}</span>
                    <span style={styles.categoryPreviewText}>{preview.category.value}</span>
                  </div>
                  <div style={styles.periodBadge}>
                    <span style={styles.periodPreviewIcon}>{preview.period.icon}</span>
                    <span style={styles.periodPreviewText}>{preview.period.label}</span>
                  </div>
                </div>

                <div style={styles.previewDetails}>
                  <h4 style={styles.budgetName}>{formData.name}</h4>
                  <div style={styles.amountDisplay}>
                    <span style={styles.amountCurrency}>$</span>
                    <span style={styles.amountValue}>{parseFloat(formData.amount).toLocaleString()}</span>
                  </div>
                  
                  <div style={styles.dateRange}>
                    <div style={styles.dateItem}>
                      <span style={styles.dateLabel}>Starts</span>
                      <span style={styles.dateValue}>
                        {new Date(formData.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={styles.dateItem}>
                      <span style={styles.dateLabel}>Ends</span>
                      <span style={styles.dateValue}>
                        {new Date(formData.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {preview.alerts.enabled && (
                    <div style={styles.alertPreview}>
                      <div style={styles.alertIcon}>🔔</div>
                      <div style={styles.alertInfo}>
                        <span style={styles.alertText}>Alerts at {preview.alerts.threshold}%</span>
                        <span style={styles.alertSubtext}>You'll be notified before overspending</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={styles.emptyPreview}>
                <div style={styles.emptyIcon}>📊</div>
                <p style={styles.emptyText}>Fill in the form to see your budget preview</p>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div style={styles.tipsCard}>
            <h4 style={styles.tipsTitle}>💡 Budgeting Tips</h4>
            <div style={styles.tipsList}>
              <div style={styles.tipItem}>
                <span style={styles.tipIcon}>🎯</span>
                <span>Set realistic goals based on your income</span>
              </div>
              <div style={styles.tipItem}>
                <span style={styles.tipIcon}>📱</span>
                <span>Enable alerts to avoid overspending</span>
              </div>
              <div style={styles.tipItem}>
                <span style={styles.tipIcon}>🔄</span>
                <span>Review and adjust budgets monthly</span>
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
  radioInput: {
    display: 'none',
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
  periodOptions: {
    display: 'flex',
    gap: '0.5rem',
  },
  periodOption: {
    flex: 1,
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
  periodOptionSelected: {
    background: '#f7fafc',
    borderColor: '#4a90e2',
    transform: 'translateY(-2px)',
  },
  periodIcon: {
    fontSize: '1.5rem',
  },
  periodLabel: {
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#4a5568',
  },
  alertsSection: {
    padding: '1.5rem',
    background: '#f7fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  alertsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    color: '#4a5568',
    fontSize: '1rem',
    fontWeight: '600',
    position: 'relative',
  },
  checkboxInput: {
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer',
  },
  checkmark: {
    width: '20px',
    height: '20px',
    border: '2px solid #cbd5e0',
    borderRadius: '4px',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  alertsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  alertsBadge: {
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: '500',
  },
  alertSettings: {
    marginTop: '1rem',
  },
  thresholdContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  rangeInput: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: '#e2e8f0',
    outline: 'none',
  },
  thresholdValue: {
    background: '#4a90e2',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    minWidth: '50px',
    textAlign: 'center',
  },
  thresholdHint: {
    color: '#718096',
    fontSize: '0.8rem',
    margin: 0,
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
    background: 'linear-gradient(135deg, #4a90e2, #357abd)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
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
  periodBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: '#f7fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  periodPreviewIcon: {
    fontSize: '1rem',
  },
  periodPreviewText: {
    color: '#4a5568',
  },
  previewDetails: {
    textAlign: 'center',
  },
  budgetName: {
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
  },
  amountCurrency: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  amountValue: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  dateRange: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  dateItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: '0.8rem',
    color: '#718096',
    marginBottom: '0.25rem',
  },
  dateValue: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  alertPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '12px',
  },
  alertIcon: {
    fontSize: '1.5rem',
  },
  alertInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  alertText: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#0369a1',
  },
  alertSubtext: {
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
  },
  tipIcon: {
    fontSize: '1.1rem',
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

// Add hover effects using the same approach
const addHoverEffects = () => {
  const hoverStyles = `
    .back-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
    .form-input:focus {
      outline: none;
      border-color: #4a90e2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    }
    .category-option:hover {
      background: #f7fafc;
      transform: translateY(-1px);
    }
    .period-option:hover {
      background: #f7fafc;
      transform: translateY(-1px);
    }
    .submit-button:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(74, 144, 226, 0.3);
    }
    .cancel-button:hover {
      background: #f7fafc;
      border-color: #cbd5e0;
      transform: translateY(-1px);
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
  `;

  const hoverStyleElement = document.createElement('style');
  hoverStyleElement.textContent = hoverStyles;
  document.head.appendChild(hoverStyleElement);
};

// Initialize hover effects
addHoverEffects();

export default AddBudget;