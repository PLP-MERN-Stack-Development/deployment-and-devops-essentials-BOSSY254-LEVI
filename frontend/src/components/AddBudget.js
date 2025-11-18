import React, { useState } from 'react';
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

  const navigate = useNavigate();

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
  React.useEffect(() => {
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

  return (
    <div>
      <h1>Add Budget</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="card">
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Budget Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Monthly Food Budget"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Budget Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="period">Period</label>
            <select
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              required
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="alerts.enabled"
                checked={formData.alerts.enabled}
                onChange={handleChange}
              />
              Enable budget alerts
            </label>
          </div>

          {formData.alerts.enabled && (
            <div className="form-group">
              <label htmlFor="alertThreshold">Alert Threshold (%)</label>
              <input
                type="number"
                id="alertThreshold"
                name="alerts.threshold"
                value={formData.alerts.threshold}
                onChange={handleChange}
                min="1"
                max="100"
                required
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Budget'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/budgets')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudget;
