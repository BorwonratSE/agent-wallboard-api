// UserManagementPage.js
import React, { useState, useEffect } from 'react';
import UserTable from './components/UserTable';
import UserFormModal from './components/UserFormModal';
import { userAPI } from './services/userAPI';

// Props: None (top-level page component)
// State: users, loading, error, selectedUser, isModalOpen

const UserManagementPage = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TODO: นักศึกษาเพิ่ม useEffect สำหรับ load users เมื่อ component mount
  // TODO: นักศึกษาเขียน handleCreateUser function
  // TODO: นักศึกษาเขียน handleEditUser function  
  // TODO: นักศึกษาเขียน handleDeleteUser function
  // TODO: นักศึกษาเขียน handleSaveUser function (create or update)

  return React.createElement('div', { className: 'user-management-page' },
    // Header section
    React.createElement('div', { className: 'page-header' },
      React.createElement('h1', null, 'User Management'),
      React.createElement('button', {
        className: 'btn btn-primary',
        onClick: () => {
          setSelectedUser(null);
          setIsModalOpen(true);
        }
      }, '+ Add New User')
    ),

    // Error display (if any)
    error && React.createElement('div', { className: 'alert alert-error' }, error),

    // Loading state
    loading ? 
      React.createElement('div', { className: 'loading' }, 'Loading users...') :
      // User table
      React.createElement(UserTable, {
        users: users,
        onEdit: (user) => {
          // TODO: นักศึกษาเขียน logic เปิด modal สำหรับแก้ไข
        },
        onDelete: (userId) => {
          // TODO: นักศึกษาเขียน logic ลบ user
        }
      }),

    // User form modal
    isModalOpen && React.createElement(UserFormModal, {
      user: selectedUser,
      onClose: () => setIsModalOpen(false),
      onSave: (userData) => {
        // TODO: นักศึกษาเขียน logic save user
      }
    })
  );
};

export default UserManagementPage;