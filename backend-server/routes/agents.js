const express = require('express');
const agentController = require('../controllers/agentControllerMongo');
const { validateAgent, validateStatusUpdate } = require('../middleware/validation');

const router = express.Router();

// Routes
router.get('/', agentController.getAllAgents);
router.get('/status/summary', agentController.getStatusSummary);
router.get('/:id/history', agentController.getAgentStatusHistory);
router.get('/:id', agentController.getAgentById);
router.post('/', validateAgent, agentController.createAgent);
router.put('/:id', agentController.updateAgent);
router.patch('/:id/status', validateStatusUpdate, agentController.updateAgentStatus);
router.delete('/:id', agentController.deleteAgent);

module.exports = router;
