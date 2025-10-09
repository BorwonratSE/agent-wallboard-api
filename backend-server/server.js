// server.js - Phase 2: Main application server with MongoDB + WebSocket
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const path = require('path');

// Import configurations
const databaseConnection = require('../config/database');
const socketServer = require('../websocket/socketServer');

// Import routes
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agents');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users'); // 🆕 เพิ่มบรรทัดนี้

// Import error handlers and middleware
const { globalErrorHandler, notFoundHandler, performanceMonitor } = require('../middleware/errorHandler');

// Import models for migration
const { agents } = require('../models/Agent'); // Phase 1 in-memory data
const AgentMongo = require('../models/AgentMongo'); // Phase 2 MongoDB model

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Route หลัก → ส่ง index.html
app.get('/test-websocket.html', (req, res) => {
  res.sendFile(path.join(__dirname,'test-websocket.html'));
});

// Initialize WebSocket
const io = socketServer.initialize(server);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (เฉพาะ development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Performance monitoring
app.use(performanceMonitor);

// WebSocket middleware - เพิ่ม io instance ใน request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Agent Wallboard API Phase 2 - Database + WebSocket',
    version: '2.0.0',
    phase: 2,
    features: [
      'MongoDB persistence',
      'Real-time WebSocket communication', 
      'Message system',
      'Agent status tracking',
      'Dashboard statistics'
    ],
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api/docs',
    health: '/api/health',
    endpoints: {
      agents: '/api/agents',
      messages: '/api/messages',
      users: '/api/users', // 🆕 เพิ่มใน endpoint list
      health: '/api/health',
      docs: '/api/docs'
    },
    websocket: {
      url: `ws://localhost:${PORT}`,
      events: ['agentStatusChanged', 'newMessage', 'dashboardUpdate']
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes); // 🆕 เพิ่มบรรทัดนี้

// Error handlers (ต้องอยู่ท้ายสุด)
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Data migration function
async function migrateFromMemoryToMongo() {
  try {
    console.log('🔄 Starting migration from in-memory to MongoDB...');
    
    if (agents.size === 0) {
      console.log('⚠️ No in-memory agents to migrate');
      return;
    }
    
    await AgentMongo.migrateFromMemory(agents);
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    // Don't stop server if migration fails
  }
}

// Start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Agent Wallboard API Phase 2...');
    
    // Connect to MongoDB
    await databaseConnection.connect();
    
    // Migrate data from Phase 1 (if exists)
    await migrateFromMemoryToMongo();
    
    // Start listening
    server.listen(PORT, () => {
      console.log('🎯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🌟                PHASE 2 READY!                🌟');
      console.log('🎯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log(`🔌 WebSocket server active on ws://localhost:${PORT}`);
      console.log('📚 API Endpoints:');
      console.log(`   👤 Agents: http://localhost:${PORT}/api/agents`);
      console.log(`   💬 Messages: http://localhost:${PORT}/api/messages`);
      console.log(`   👥 Users: http://localhost:${PORT}/api/users`); // 🆕
      console.log(`   🏥 Health: http://localhost:${PORT}/api/health`);
      console.log(`   📖 Docs: http://localhost:${PORT}/api/docs`);
      console.log('🔥 New Features:');
      console.log('   ✅ MongoDB persistence');
      console.log('   ✅ Real-time WebSocket');
      console.log('   ✅ Message system');
      console.log('   ✅ Online/offline tracking');
      console.log('🎯━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  
  if (io) {
    io.close();
  }
  
  await databaseConnection.disconnect();
  
  server.close(() => {
    console.log('✅ Process terminated gracefully');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  
  if (io) {
    io.close();
  }
  
  await databaseConnection.disconnect();
  
  server.close(() => {
    console.log('✅ Process terminated gracefully');
    process.exit(0);
  });
});

startServer();

module.exports = { app, server, io };
