// components/UserActionButtons.js
import React from 'react';

const UserActionButtons = ({ user, onEdit, onDelete }) => {
  const handleDelete = () => {
    // TODO: นักศึกษาเพิ่ม confirmation dialog
    if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      onDelete();
    }
  };

  return React.createElement('div', { className: 'action-buttons' },
    React.createElement('button', {
      className: 'btn-action btn-edit',
      onClick: onEdit,
      title: 'Edit user'
    }, '✏️ Edit'),
    React.createElement('button', {
      className: 'btn-action btn-delete',
      onClick: handleDelete,
      title: 'Delete user'
    }, '🗑️ Delete')
  );
};

export default UserActionButtons;