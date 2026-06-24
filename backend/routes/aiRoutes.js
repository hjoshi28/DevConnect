import express from 'express';
import { uploadAndAnalyzeResume, getSkillGap } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

import multer from 'multer';

const router = express.Router();
const uploadMem = multer({ storage: multer.memoryStorage() });

router.post('/analyze-resume', protect, uploadMem.single('resume'), uploadAndAnalyzeResume);
router.post('/skill-gap', protect, getSkillGap);

export default router;
