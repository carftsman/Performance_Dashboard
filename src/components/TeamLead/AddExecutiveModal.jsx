import React, { useState } from 'react';
import  teamLeadService  from '../../Services/teamlead.service';
// import './AddExecutiveModal.css';

const AddExecutiveModal = ({ isOpen, onClose, onExecutiveAdded }) => {
  const [newExecutive, setNewExecutive] = useState({
    executiveCode: '',
    name: '',
    phone: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExecutive(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!newExecutive.executiveCode || !newExecutive.name || !newExecutive.phone) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return false;
    }
    if (!/^\d{10}$/.test(newExecutive.phone)) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsAdding(true);
      setMessage(null);
      
      await teamLeadService.createExecutive(newExecutive);
      
      setMessage({ 
        type: 'success', 
        text: 'Executive created successfully!' 
      });

      setTimeout(() => {
        onClose();
        setNewExecutive({ executiveCode: '', name: '', phone: '' });
        setMessage(null);
        onExecutiveAdded();
      }, 2000);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to create executive. Please try again.' 
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Add New Executive</h2>
          <button 
            onClick={onClose}
            className="modal-close"
            disabled={isAdding}
          >
            ×
          </button>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="executiveCode">Executive Code *</label>
            <input
              type="text"
              id="executiveCode"
              name="executiveCode"
              value={newExecutive.executiveCode}
              onChange={handleInputChange}
              placeholder="Enter executive code"
              disabled={isAdding}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newExecutive.name}
              onChange={handleInputChange}
              placeholder="Enter executive name"
              disabled={isAdding}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={newExecutive.phone}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number"
              pattern="[0-9]{10}"
              maxLength="10"
              disabled={isAdding}
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add Executive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExecutiveModal;