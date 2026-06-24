import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-applications', protect, getMyApplications);

router.post('/:jobId', protect, applyToJob);

router.get('/job/:jobId', protect, getJobApplicants);

router.put('/:id/status', protect, updateApplicationStatus);

export default router;
