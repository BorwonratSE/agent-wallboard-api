// services/userAPI.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * User API Service
 * ให้โครงสร้างหลัก 80%, นักศึกษาเพิ่ม error handling และ loading states
 */
export const userAPI = {
  /**
   * Get all users
   * @returns {Promise<Array>} List of users
   */
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
      // TODO: นักศึกษาเพิ่ม error handling ที่ดีกว่า
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // TODO: นักศึกษาเพิ่ม response validation
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Create new user
   * @param {Object} userData - User data object
   * @returns {Promise<Object>} Created user
   */
  createUser: async (userData) => {
    try {
      // TODO: นักศึกษาเพิ่ม input validation ก่อนส่ง API
      
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
      // TODO: นักศึกษาปรับปรุง error handling
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update existing user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (userId, userData) => {
    // TODO: นักศึกษาเขียน implementation
    // Hint: ใช้ PUT method
    // Hint: ส่ง userId ใน URL และ userData ใน body
    // Hint: ต้องมี Authorization header
    throw new Error('Not implemented - TODO by student');
  },

  /**
   * Delete user (soft delete)
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  deleteUser: async (userId) => {
    // TODO: นักศึกษาเขียน implementation
    // Hint: ใช้ DELETE method
    // Hint: ส่ง userId ใน URL
    // Hint: Backend จะทำ soft delete (set status = 'inactive')
    throw new Error('Not implemented - TODO by student');
  },

  /**
   * Toggle user status (active/inactive)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user
   */
  toggleUserStatus: async (userId) => {
    // TODO: นักศึกษาเขียน implementation (optional feature)
    // Hint: ใช้ PATCH method
    // Endpoint: /users/:id/toggle-status
    throw new Error('Not implemented - TODO by student');
  }
};

// Helper function for error handling
// TODO: นักศึกษาเขียน helper function สำหรับจัดการ error messages
export const handleAPIError = (error) => {
  // TODO: แปลง error object เป็น user-friendly message
  // TODO: จัดการ different error types (network, validation, auth, etc.)
  return error.message || 'An unexpected error occurred';
};