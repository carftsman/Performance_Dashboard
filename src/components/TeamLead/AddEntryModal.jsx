import React, { useState, useEffect } from 'react';

// import './AddEntryModal.css';

const AddEntryModal = ({ isOpen, onClose, executive, user, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    location: '',
    remarks: '',
    status: 'PENDING',
    executiveId: executive?.id || '',
    executiveName: executive?.name || '',
    teamleadId: user?.id || 19,
    teamleadName: user?.userCode || 'Naveen'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (executive) {
      setFormData(prev => ({
        ...prev,
        executiveId: executive.id,
        executiveName: executive.name
      }));
    }
  }, [executive]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setMessage({ type: 'error', text: 'Customer name is required' });
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setMessage({ type: 'error', text: 'Phone number is required' });
      return false;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number' });
      return false;
    }
    if (!formData.location.trim()) {
      setMessage({ type: 'error', text: 'Location is required' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setMessage(null);

      // API call would go here
      // const response = await teamLeadService.addEntry(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ 
        type: 'success', 
        text: 'Entry added successfully!' 
      });

      setTimeout(() => {
        onClose();
        setFormData({
          customerName: '',
          phoneNumber: '',
          location: '',
          remarks: '',
          status: 'PENDING',
          executiveId: executive?.id || '',
          executiveName: executive?.name || '',
          teamleadId: user?.id || 19,
          teamleadName: user?.userCode || 'Naveen'
        });
        setMessage(null);
        if (onSubmitSuccess) onSubmitSuccess();
      }, 2000);

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to add entry. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-lg">
        <div className="modal-header">
          <h2 className="modal-title">Add New Entry for {executive?.name}</h2>
          <button 
            onClick={onClose}
            className="modal-close"
            disabled={isSubmitting}
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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName">Customer Name *</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
                disabled={isSubmitting}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter 10-digit phone number"
                pattern="[0-9]{10}"
                maxLength="10"
                disabled={isSubmitting}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                disabled={isSubmitting}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="form-select"
              >
                <option value="PENDING">Pending</option>
                <option value="INTERESTED">Interested</option>
                <option value="ONBOARDED">Onboarded</option>
                <option value="NOT_INTERESTED">Not Interested</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="remarks">Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="Enter any additional remarks"
              disabled={isSubmitting}
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;