// controllers/userController.js
const userService = require('../../src/api/services/userService');
const { validationResult } = require('express-validator');

/**
 * User Controller
 * จัดการ HTTP requests สำหรับ user management
 * ให้ 80% - นักศึกษาเพิ่ม error handling และ response formatting
 */
const userController = {
  /**
   * GET /api/users
   * Get all users
   */
  getAllUsers: async (req, res) => {
    try {
      // Get query parameters for filtering
      const { role, status, teamId } = req.query;
      
      const users = await userService.getAllUsers({
        role,
        status,
        teamId
      });

      res.status(200).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  },

  /**
   * GET /api/users/:id
   * Get user by ID
   */
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in getUserById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  },

  /**
   * POST /api/users
   * Create new user
   */
  createUser: async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userData = req.body;
      
      // TODO: นักศึกษาเพิ่ม validation เพิ่มเติม
      // - Check username format (AGxxx, SPxxx, ADxxx)
      // - Check if username already exists
      // - Validate role-specific rules

      const newUser = await userService.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      console.error('Error in createUser:', error);
      
      // TODO: นักศึกษาปรับปรุง error handling
      // - Handle duplicate username error
      // - Handle validation errors
      // - Return appropriate status codes
      
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  },

  /**
   * PUT /api/users/:id
   * Update existing user
   */
  updateUser: async (req, res) => {
    // TODO: นักศึกษาเขียน implementation
    // Hint: ดึง id จาก req.params
    // Hint: ดึง updated data จาก req.body
    // Hint: ตรวจสอบว่า user มีอยู่จริง
    // Hint: เรียก userService.updateUser()
    // Hint: return updated user
    try {
      res.status(501).json({
        success: false,
        message: 'Not implemented - TODO by student'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  },

  /**
   * DELETE /api/users/:id
   * Delete user (soft delete)
   */
  deleteUser: async (req, res) => {
    // TODO: นักศึกษาเขียน implementation
    // Hint: ดึง id จาก req.params
    // Hint: ตรวจสอบว่า user มีอยู่จริง
    // Hint: เรียก userService.deleteUser() (จะทำ soft delete)
    // Hint: return success message
    try {
      res.status(501).json({
        success: false,
        message: 'Not implemented - TODO by student'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      });
    }
  },

  /**
   * PATCH /api/users/:id/toggle-status
   * Toggle user status (active/inactive)
   */
  toggleUserStatus: async (req, res) => {
    // TODO: นักศึกษาเขียน implementation (optional feature)
    try {
      res.status(501).json({
        success: false,
        message: 'Not implemented - TODO by student'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to toggle user status',
        error: error.message
      });
    }
  }
};

module.exports = userController;