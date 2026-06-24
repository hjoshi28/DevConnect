import express from 'express';
import { syncGithub, syncLeetCode, getGithubData, getLeetCodeData } from '../controllers/integrationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/github', protect, syncGithub);
router.post('/leetcode', protect, syncLeetCode);
router.get('/github/:username', getGithubData);
router.get('/leetcode/:username', getLeetCodeData);

export default router;
