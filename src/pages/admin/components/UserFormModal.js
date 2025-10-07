// components/UserFormModal.js
import React, { useState, useEffect } from 'react';

const UserFormModal = ({ user, onClose, onSave }) => {
  // Initialize form data
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    role: 'Agent',
    teamId: '',
    status: 'Active'
  });

  // TODO: นักศึกษาเพิ่ม form validation state
  const [errors, setErrors] = useState({});

  // Load user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        teamId: user.teamId || '',
        status: user.status
      });
    }
  }, [user]);

  // TODO: นักศึกษาเขียน handleChange function
  const handleChange = (e) => {
    // TODO: อัพเดท formData state
    // TODO: เคลียร์ error ของ field ที่แก้ไข
  };

  // TODO: นักศึกษาเขียน validateForm function
  const validateForm = () => {
    // TODO: ตรวจสอบ required fields
    // TODO: ตรวจสอบรูปแบบ username (AGxxx, SPxxx, ADxxx)
    // TODO: ตรวจสอบความยาว fullName
    // TODO: return true/false
  };

  // TODO: นักศึกษาเขียน handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: validate form
    // TODO: ถ้าผ่าน validation เรียก onSave(formData)
    // TODO: ถ้าไม่ผ่าน แสดง error messages
  };

  return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
    React.createElement('div', {
      className: 'modal-content',
      onClick: (e) => e.stopPropagation()
    },
      // Modal Header
      React.createElement('div', { className: 'modal-header' },
        React.createElement('h2', null, user ? 'Edit User' : 'Add New User'),
        React.createElement('button', {
          className: 'btn-close',
          onClick: onClose
        }, '×')
      ),

      // Modal Body (Form)
      React.createElement('form', { onSubmit: handleSubmit, className: 'user-form' },
        // Username field
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'username' },
            'Username ',
            React.createElement('span', { className: 'required' }, '*')
          ),
          React.createElement('input', {
            type: 'text',
            id: 'username',
            name: 'username',
            value: formData.username,
            onChange: handleChange,
            placeholder: 'e.g., AG001, SP001, AD001',
            disabled: !!user, // disabled เมื่อแก้ไข
            className: errors.username ? 'error' : ''
          }),
          React.createElement('small', { className: 'hint' },
            'Format: AG001-AG999 (Agent), SP001-SP999 (Supervisor), AD001-AD999 (Admin)'
          ),
          errors.username && React.createElement('span', { className: 'error-message' },
            errors.username
          )
        ),

        // Full Name field
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'fullName' },
            'Full Name ',
            React.createElement('span', { className: 'required' }, '*')
          ),
          React.createElement('input', {
            type: 'text',
            id: 'fullName',
            name: 'fullName',
            value: formData.fullName,
            onChange: handleChange,
            placeholder: 'Enter full name',
            className: errors.fullName ? 'error' : ''
          }),
          errors.fullName && React.createElement('span', { className: 'error-message' },
            errors.fullName
          )
        ),

        // Role field
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'role' },
            'Role ',
            React.createElement('span', { className: 'required' }, '*')
          ),
          React.createElement('select', {
            id: 'role',
            name: 'role',
            value: formData.role,
            onChange: handleChange,
            className: errors.role ? 'error' : ''
          },
            React.createElement('option', { value: 'Agent' }, 'Agent'),
            React.createElement('option', { value: 'Supervisor' }, 'Supervisor'),
            React.createElement('option', { value: 'Admin' }, 'Admin')
          )
        ),

        // Team field (optional for Agent/Supervisor)
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'teamId' }, 'Team'),
          React.createElement('select', {
            id: 'teamId',
            name: 'teamId',
            value: formData.teamId,
            onChange: handleChange
          },
            React.createElement('option', { value: '' }, '-- Select Team --'),
            React.createElement('option', { value: '1' }, 'Team Alpha'),
            React.createElement('option', { value: '2' }, 'Team Beta'),
            React.createElement('option', { value: '3' }, 'Team Gamma')
          ),
          React.createElement('small', { className: 'hint' },
            'Optional: Assign user to a team'
          )
        ),

        // Status field
        React.createElement('div', { className: 'form-group' },
          React.createElement('label', { htmlFor: 'status' },
            'Status ',
            React.createElement('span', { className: 'required' }, '*')
          ),
          React.createElement('select', {
            id: 'status',
            name: 'status',
            value: formData.status,
            onChange: handleChange
          },
            React.createElement('option', { value: 'Active' }, 'Active'),
            React.createElement('option', { value: 'Inactive' }, 'Inactive')
          )
        ),

        // Form Actions
        React.createElement('div', { className: 'form-actions' },
          React.createElement('button', {
            type: 'button',
            className: 'btn btn-secondary',
            onClick: onClose
          }, 'Cancel'),
          React.createElement('button', {
            type: 'submit',
            className: 'btn btn-primary'
          }, user ? 'Update User' : 'Create User')
        )
      )
    )
  );
};

export default UserFormModal;