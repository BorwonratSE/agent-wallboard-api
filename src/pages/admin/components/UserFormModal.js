import React, { useState, useEffect } from 'react';

const teamOptions = [
  { value: '', label: '-- Select Team --' },
  { value: '1', label: 'Team Alpha' },
  { value: '2', label: 'Team Beta' },
  { value: '3', label: 'Team Gamma' },
];

const UserFormModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    role: 'Agent',
    teamId: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  // Load user data when editing
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        fullName: user.fullName || '',
        role: user.role || 'Agent',
        teamId: user.teamId || '',
        status: user.status || 'Active',
      });
      setErrors({});
    } else {
      // Clear form when adding new user
      setFormData({
        username: '',
        fullName: '',
        role: 'Agent',
        teamId: '',
        status: 'Active',
      });
      setErrors({});
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Username validation: AGxxx, SPxxx, ADxxx (001-999)
    const usernamePattern = /^(AG|SP|AD)(00[1-9]|0[1-9]\d|[1-9]\d{2})$/;
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!usernamePattern.test(formData.username)) {
      newErrors.username = 'Username must be AGxxx, SPxxx, or ADxxx (001-999)';
    }

    // Full name validation (min 2 chars)
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Role-specific validation: Agent and Supervisor require teamId
    if ((formData.role === 'Agent' || formData.role === 'Supervisor') && !formData.teamId) {
      newErrors.teamId = 'Team is required for Agent and Supervisor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={overlayStyle}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={modalStyle}
      >
        <div className="modal-header" style={headerStyle}>
          <h2>{user ? 'Edit User' : 'Add New User'}</h2>
          <button className="btn-close" onClick={onClose} style={closeBtnStyle}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">
              Username <span className="required">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g., AG001, SP001, AD001"
              disabled={!!user} // disabled when editing
              className={errors.username ? 'error' : ''}
            />
            <small className="hint">
              Format: AG001-AG999 (Agent), SP001-SP999 (Supervisor), AD001-AD999 (Admin)
            </small>
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">
              Role <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'error' : ''}
            >
              <option value="Agent">Agent</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Team (required if Agent or Supervisor) */}
          {(formData.role === 'Agent' || formData.role === 'Supervisor') && (
            <div className="form-group">
              <label htmlFor="teamId">Team <span className="required">*</span></label>
              <select
                id="teamId"
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                className={errors.teamId ? 'error' : ''}
              >
                {teamOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.teamId && <div className="error-message">{errors.teamId}</div>}
            </div>
          )}

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">
              Status <span className="required">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ marginRight: '0.5rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Simple inline styles for demo (replace with your CSS or styled-components)
const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '6px',
  width: '400px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  position: 'relative',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  lineHeight: 1,
};

export default UserFormModal;
