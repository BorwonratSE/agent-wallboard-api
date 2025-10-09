const Agent = require('../models/agent');

const agentController = {
  getAllAgents: async (req, res) => {
    try {
      const agents = await Agent.find();
      res.json(agents);
    } catch (err) {
      console.error('Error getting agents:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getStatusSummary: async (req, res) => {
    try {
      // ตัวอย่างสรุปสถานะแบบง่าย
      const summary = await Agent.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      res.json(summary);
    } catch (err) {
      console.error('Error getting status summary:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getAgentById: async (req, res) => {
    try {
      const agent = await Agent.findById(req.params.id);
      if (!agent) return res.status(404).json({ message: 'Agent not found' });
      res.json(agent);
    } catch (err) {
      console.error('Error getting agent by ID:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getAgentStatusHistory: async (req, res) => {
    try {
      const agent = await Agent.findById(req.params.id).select('statusHistory');
      if (!agent) return res.status(404).json({ message: 'Agent not found' });
      res.json(agent.statusHistory);
    } catch (err) {
      console.error('Error getting agent status history:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createAgent: async (req, res) => {
    try {
      const agentData = req.body;
      const newAgent = new Agent(agentData);
      await newAgent.save();
      res.status(201).json(newAgent);
    } catch (err) {
      console.error('Error creating agent:', err);
      res.status(500).json({ message: 'Server error while creating agent' });
    }
  },

  updateAgent: async (req, res) => {
    try {
      const updatedAgent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedAgent) return res.status(404).json({ message: 'Agent not found' });
      res.json(updatedAgent);
    } catch (err) {
      console.error('Error updating agent:', err);
      res.status(500).json({ message: 'Server error while updating agent' });
    }
  },

  updateAgentStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const agent = await Agent.findById(req.params.id);
      if (!agent) return res.status(404).json({ message: 'Agent not found' });

      // Update status and push to history
      agent.status = status;
      agent.statusHistory.push({ status, updatedAt: new Date() });
      await agent.save();

      res.json(agent);
    } catch (err) {
      console.error('Error updating agent status:', err);
      res.status(500).json({ message: 'Server error while updating status' });
    }
  },

  deleteAgent: async (req, res) => {
    try {
      const deletedAgent = await Agent.findByIdAndDelete(req.params.id);
      if (!deletedAgent) return res.status(404).json({ message: 'Agent not found' });
      res.json({ message: 'Agent deleted successfully' });
    } catch (err) {
      console.error('Error deleting agent:', err);
      res.status(500).json({ message: 'Server error while deleting agent' });
    }
  }
};

module.exports = agentController;
