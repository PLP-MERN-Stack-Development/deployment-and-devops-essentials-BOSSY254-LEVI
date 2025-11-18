import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading budgets...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Budgets</h1>
        <Link to="/budgets/add" className="btn btn-primary">Add Budget</Link>
      </div>

      <div className="card">
        {budgets.length > 0 ? (
          <div className="budget-list">
            {budgets.map(budget => {
              const percentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
              const isOverBudget = percentage > 100;
              const isNearLimit = percentage > 80;

              return (
                <div key={budget._id} className="budget-item">
                  <div className="budget-header">
                    <h3>{budget.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{budget.category}</span>
                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '5px 10px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="budget-progress">
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${isOverBudget ? 'danger' : isNearLimit ? 'warning' : ''}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="budget-stats">
                    <span>${budget.spent?.toFixed(2) || '0.00'} spent</span>
                    <span>${budget.amount.toFixed(2)} budget</span>
                    <span style={{ color: isOverBudget ? '#dc3545' : isNearLimit ? '#ffc107' : '#28a745' }}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>

                  {isOverBudget && (
                    <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                      ⚠️ Over budget by ${(budget.spent - budget.amount).toFixed(2)}
                    </div>
                  )}

                  {budget.alerts?.enabled && percentage >= budget.alerts.threshold && !isOverBudget && (
                    <div style={{ color: '#ffc107', fontSize: '14px', marginTop: '5px' }}>
                      ⚠️ Budget alert: {percentage.toFixed(1)}% used
                    </div>
                  )}

                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    {budget.period} • {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No budgets found. <Link to="/budgets/add">Create your first budget</Link></p>
        )}
      </div>
    </div>
  );
};

export default Budgets;
