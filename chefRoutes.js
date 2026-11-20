import express from 'express';
import { askChef, getChefStatus } from '../controllers/chefController.js';

const router = express.Router();

// POST /api/chef/solve - Real-time problem solving
router.post('/solve', askChef);

// GET /api/chef/status - Check SLM availability
router.get('/status', getChefStatus);

export default router;