const sql = require('mssql');
const dbConfig = require('../config/database');

const userRepository = {
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

  update: async (userId, userData) => {
    try {
      const pool = await sql.connect(dbConfig);

      let setClause = 'updatedAt = GETDATE()';
      const request = pool.request().input('userId', sql.Int, userId);

      if (userData.fullName !== undefined) {
        setClause += ', fullName = @fullName';
        request.input('fullName', sql.NVarChar, userData.fullName);
      }

      if (userData.role !== undefined) {
        setClause += ', role = @role';
        request.input('role', sql.NVarChar, userData.role);
      }

      if (userData.teamId !== undefined) {
        setClause += ', teamId = @teamId';
        request.input('teamId', sql.Int, userData.teamId);
      }

      if (userData.status !== undefined) {
        setClause += ', status = @status';
        request.input('status', sql.NVarChar, userData.status);
      }

      const updateQuery = `
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

      const result = await request.query(updateQuery);
      return result.recordset[0];
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  softDelete: async (userId) => {
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
