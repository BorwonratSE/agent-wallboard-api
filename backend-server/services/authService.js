// services/authService.js
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

/**
 * Authentication Service
 * Handle login without password
 * ให้ 80% - นักศึกษาเพิ่ม JWT token generation
 */
const authService = {
  /**
   * Login without password (using username only)
   * @param {string} username - User username/code
   * @returns {Promise<Object>} Auth result with token
   */
  loginWithoutPassword: async (username) => {
    try {
      // 1. Find user by username
      const user = await userRepository.findByUsername(username);
      
      if (!user) {
        throw new Error('Invalid username');
      }

      // 2. Check if user is active
      if (user.status !== 'Active') {
        throw new Error('User account is inactive');
      }

      // 3. Generate JWT token
      // TODO: นักศึกษาเพิ่ม JWT token generation
      // Payload should include: userId, username, role
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // 4. Update last login timestamp
      await userRepository.updateLastLogin(user.id);

      // 5. Return user data และ token
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          teamId: user.teamId
        },
        token: token,
        expiresIn: JWT_EXPIRES_IN
      };
    } catch (error) {
      console.error('Error in loginWithoutPassword:', error);
      throw error;
    }
  },

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },

  /**
   * Validate user code format
   * @param {string} username - Username/code
   * @returns {boolean} Is valid format
   */
  validateUserCode: (username) => {
    // TODO: นักศึกษาเขียน validation
    // Format: AGxxx, SPxxx, ADxxx (xxx = 001-999)
    const regex = /^(AG|SP|AD)(00[1-9]|0[1-9]\d|[1-9]\d{2})$/;
    return regex.test(username);
  },

  /**
   * Get user role from username prefix
   * @param {string} username - Username/code
   * @returns {string} Role name
   */
  getRoleFromUsername: (username) => {
    if (username.startsWith('AG')) return 'Agent';
    if (username.startsWith('SP')) return 'Supervisor';
    if (username.startsWith('AD')) return 'Admin';
    return null;
  }
};

module.exports = authService;