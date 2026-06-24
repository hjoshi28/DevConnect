import express from 'express';
import { getNetworkUsers, getCandidates } from '../controllers/networkController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, getNetworkUsers);
router.get('/candidates', protect, authorize('recruiter', 'admin'), getCandidates);

export default router;
