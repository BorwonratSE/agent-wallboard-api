// services/userService.js
const userRepository = require('../repositories/userRepository');

/**
 * User Service
 * Business logic layer สำหรับ user operations
 * ให้ 70% - นักศึกษาเพิ่ม business rules และ validations
 */
const userService = {
  /**
   * Get all users with optional filtering
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of users
   */
  getAllUsers: async (filters = {}) => {
    try {
      const users = await userRepository.findAll(filters);
      
      // TODO: นักศึกษาเพิ่ม business logic
      // - Filter sensitive data (e.g., password hashes)
      // - Add computed fields (e.g., fullName from firstName + lastName)
      // - Sort by specific criteria
      
      return users;
    } catch (error) {
      console.error('Error in getAllUsers service:', error);
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
      const user = await userRepository.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Remove sensitive data
      delete user.passwordHash;
      
      return user;
    } catch (error) {
      console.error('Error in getUserById service:', error);
      throw error;
    }
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  createUser: async (userData) => {
    try {
      // TODO: นักศึกษาเพิ่ม validations
      // 1. Validate username format
      const usernameRegex = /^(AG|SP|AD)\d{3}$/;
      if (!usernameRegex.test(userData.username)) {
        throw new Error('Invalid username format. Use AGxxx, SPxxx, or ADxxx');
      }

      // 2. Check if username already exists
      // TODO: เรียก userRepository.findByUsername()
      // TODO: ถ้าเจอ throw error 'Username already exists'

      // 3. Validate role-specific rules
      // TODO: ถ้า role = 'Agent' หรือ 'Supervisor' ต้องมี teamId
      // TODO: ถ้า role = 'Admin' ไม่ต้องมี teamId

      // 4. Set default values
      const userToCreate = {
        ...userData,
        status: userData.status || 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create user
      const newUser = await userRepository.create(userToCreate);
      
      // Remove sensitive data
      delete newUser.passwordHash;
      
      return newUser;
    } catch (error) {
      console.error('Error in createUser service:', error);
      throw error;
    }
  },

  /**
   * Update existing user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated data
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (userId, userData) => {
    // TODO: นักศึกษาเขียน implementation
    // 1. ตรวจสอบว่า user มีอยู่จริง (เรียก getUserById)
    // 2. ตรวจสอบว่าไม่มีการเปลี่ยน username
    // 3. Validate updated data (role, teamId, status, etc.)
    // 4. เรียก userRepository.update()
    // 5. return updated user
    throw new Error('Not implemented - TODO by student');
  },

  /**
   * Delete user (soft delete)
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  deleteUser: async (userId) => {
    // TODO: นักศึกษาเขียน implementation
    // 1. ตรวจสอบว่า user มีอยู่จริง
    // 2. ตรวจสอบว่าไม่ใช่ current user (ไม่สามารถลบตัวเองได้)
    // 3. Soft delete: set status = 'Inactive', deletedAt = current timestamp
    // 4. เรียก userRepository.softDelete()
    throw new Error('Not implemented - TODO by student');
  },

  /**
   * Validate username format
   * @param {string} username - Username to validate
   * @returns {boolean} Is valid
   */
  validateUsername: (username) => {
    // TODO: นักศึกษาเขียน validation logic
    // Format: AGxxx (Agent), SPxxx (Supervisor), ADxxx (Admin)
    // xxx = 001-999
    const regex = /^(AG|SP|AD)(00[1-9]|0[1-9]\d|[1-9]\d{2})$/;
    return regex.test(username);
  },

  /**
   * Check if user can be deleted
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Can delete
   */
  canDeleteUser: async (userId) => {
    // TODO: นักศึกษาเขียน business rules
    // - ตรวจสอบว่า user มี active sessions หรือไม่
    // - ตรวจสอบว่า user เป็น owner ของ data อื่นหรือไม่
    // - Return true/false
    return true;
  }
};

module.exports = userService;