// repositories/userRepository.js
const sql = require('mssql');
const dbConfig = require('../config/database');

/**
 * User Repository
 * Data access layer สำหรับ Users table
 * ให้ 90% - นักศึกษาเพิ่ม error handling
 */
const userRepository = {
  /**
   * Find all users with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of users
   */
  findAll: async (filters = {}) => {
    try {
      const pool = await sql.connect(dbConfig);
      
      let query = `
        SELECT 
          u.id,
          u.username,
          u.fullName,
          u.role,
          u.teamId,
          t.teamName,
          u.status,
          u.createdAt,
          u.updatedAt,
          u.lastLoginAt
        FROM Users u
        LEFT JOIN Teams t ON u.teamId = t.id
        WHERE u.deletedAt IS NULL
      `;
      
      const params = [];
      
      // Add filters
      if (filters.role) {
        query += ' AND u.role = @role';
        params.push({ name: 'role', type: sql.NVarChar, value: filters.role });
      }
      
      if (filters.status) {
        query += ' AND u.status = @status';
        params.push({ name: 'status', type: sql.NVarChar, value: filters.status });
      }
      
      if (filters.teamId) {
        query += ' AND u.teamId = @teamId';
        params.push({ name: 'teamId', type: sql.Int, value: parseInt(filters.teamId) });
      }
      
      query += ' ORDER BY u.createdAt DESC';
      
      const request = pool.request();
      params.forEach(param => {
        request.input(param.name, param.type, param.value);
      });
      
      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  },

  /**
   * Find user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User object
   */
  findById: async (userId) => {
    try {
      const pool = await sql.connect(dbConfig);
      
      const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          SELECT 
            u.id,
            u.username,
            u.fullName,
            u.role,
            u.teamId,
            t.teamName,
            u.status,
            u.createdAt,
            u.updatedAt,
            u.lastLoginAt
          FROM Users u
          LEFT JOIN Teams t ON u.teamId = t.id
          WHERE u.id = @userId AND u.deletedAt IS NULL
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  },

  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} User object
   */
  findByUsername: async (username) => {
    try {
      const pool = await sql.connect(dbConfig);
      
      const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query(`
          SELECT 
            u.id,
            u.username,
            u.fullName,
            u.role,
            u.teamId,
            t.teamName,
            u.status,
            u.createdAt,
            u.updatedAt,
            u.lastLoginAt
          FROM Users u
          LEFT JOIN Teams t ON u.teamId = t.id
          WHERE u.username = @username AND u.deletedAt IS NULL
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in findByUsername:', error);
      throw error;
    }
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  create: async (userData) => {
    try {
      const pool = await sql.connect(dbConfig);
      
      const result = await pool.request()
        .input('username', sql.NVarChar, userData.username)
        .input('fullName', sql.NVarChar, userData.fullName)
        .input('role', sql.NVarChar, userData.role)
        .input('teamId', sql.Int, userData.teamId || null)
        .input('status', sql.NVarChar, userData.status || 'Active')
        .query(`
          INSERT INTO Users (username, fullName, role, teamId, status, createdAt, updatedAt)
          VALUES (@username, @fullName, @role, @teamId, @status, GETDATE(), GETDATE());
          
          SELECT 
            u.id,
            u.username,
            u.fullName,
            u.role,
            u.teamId,
            t.teamName,
            u.status,
            u.createdAt,
            u.updatedAt
          FROM Users u
          LEFT JOIN Teams t ON u.teamId = t.id
          WHERE u.id = SCOPE_IDENTITY();
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  /**
   * Update user
   * @param {number} userId - User ID
   * @param {Object} userData - Updated data
   * @returns {Promise<Object>} Updated user
   */
  update: async (userId, userData) => {
    // TODO: นักศึกษาเขียน implementation
    // Hint: สร้าง dynamic UPDATE query
    // Hint: อัพเดตเฉพาะ fields ที่ส่งมา
    // Hint: ต้องอัพเดต updatedAt ด้วย
    // Hint: return updated user object
    try {
      const pool = await sql.connect(dbConfig);
      
      // TODO: Build dynamic SET clause based on userData
      let setClause = 'updatedAt = GETDATE()';
      const request = pool.request().input('userId', sql.Int, userId);
      
      if (userData.fullName !== undefined) {
        setClause += ', fullName = @fullName';
        request.input('fullName', sql.NVarChar, userData.fullName);
      }
      
      // TODO: Add other fields (role, teamId, status)
      
      const query = `
        UPDATE Users 
        SET ${setClause}
        WHERE id = @userId AND deletedAt IS NULL;
        
        SELECT 
          u.id,
          u.username,
          u.fullName,
          u.role,
          u.teamId,
          t.teamName,
          u.status,
          u.createdAt,
          u.updatedAt
        FROM Users u
        LEFT JOIN Teams t ON u.teamId = t.id
        WHERE u.id = @userId;
      `;
      
      const result = await request.query(query);
      return result.recordset[0];
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  /**
   * Soft delete user
   * @param {number} userId - User ID
   * @returns {Promise<void>}
   */
  softDelete: async (userId) => {
    // TODO: นักศึกษาเขียน implementation
    // Hint: UPDATE Users SET status = 'Inactive', deletedAt = GETDATE()
    // Hint: WHERE id = @userId
    try {
      const pool = await sql.connect(dbConfig);
      
      await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          UPDATE Users 
          SET status = 'Inactive', 
              deletedAt = GETDATE(),
              updatedAt = GETDATE()
          WHERE id = @userId
        `);
      
      return true;
    } catch (error) {
      console.error('Error in softDelete:', error);
      throw error;
    }
  },

  /**
   * Update last login timestamp
   * @param {number} userId - User ID
   * @returns {Promise<void>}
   */
  updateLastLogin: async (userId) => {
    try {
      const pool = await sql.connect(dbConfig);
      
      await pool.request()
        .input('userId', sql.Int, userId)
        .query(`
          UPDATE Users 
          SET lastLoginAt = GETDATE()
          WHERE id = @userId
        `);
      
      return true;
    } catch (error) {
      console.error('Error in updateLastLogin:', error);
      throw error;
    }
  },

  /**
   * Check if username exists
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} Exists or not
   */
  usernameExists: async (username) => {
    try {
      const pool = await sql.connect(dbConfig);
      
      const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query(`
          SELECT COUNT(*) as count 
          FROM Users 
          WHERE username = @username AND deletedAt IS NULL
        `);
      
      return result.recordset[0].count > 0;
    } catch (error) {
      console.error('Error in usernameExists:', error);
      throw error;
    }
  }
};

module.exports = userRepository;