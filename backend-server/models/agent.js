const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^(AG|SP|AD)(00[1-9]|0[1-9]\d|[1-9]\d{2})$/
  },
  fullName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  role: {
    type: String,
    required: true,
    enum: ['Agent', 'Supervisor', 'Admin']
  },
  teamId: {
    type: Number,
    required: function() {
      return this.role === 'Agent' || this.role === 'Supervisor';
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  statusHistory: [
    {
      status: String,
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Agent', AgentSchema);
