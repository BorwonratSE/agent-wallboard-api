// services/userAPI.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const userAPI = {
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get user, status: ${response.status}`);
      }

      const data = await response.json();

      // Response validation example
      if (!data || typeof data !== 'object' || !data.id) {
        throw new Error('Invalid user data received');
      }

      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      // Simple input validation example
      if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid user data');
      }
      if (!userData.name || typeof userData.name !== 'string') {
        throw new Error('User name is required and should be a string');
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }
      if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid user data');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user with ID ${userId}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete user with ID ${userId}`);
      }

      // soft delete => no content expected, just return
      return;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  toggleUserStatus: async (userId) => {
    try {
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to toggle status for user with ID ${userId}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }
};

// Helper function for error handling
export const handleAPIError = (error) => {
  if (!error) return 'An unexpected error occurred';

  // Network error (e.g. no response)
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Network error: Unable to reach the server. Please check your connection.';
  }

  // HTTP error with message
  if (error.message) {
    // Example: if token expired
    if (error.message.toLowerCase().includes('401')) {
      return 'Unauthorized. Please login again.';
    }
    if (error.message.toLowerCase().includes('403')) {
      return 'Forbidden. You do not have permission.';
    }
    if (error.message.toLowerCase().includes('validation')) {
      return `Validation error: ${error.message}`;
    }
    return error.message;
  }

  return 'An unexpected error occurred';
};
