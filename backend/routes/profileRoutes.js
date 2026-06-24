import express from 'express';
import {
  getMyProfile,
  upsertProfile,
  getProfiles,
  getProfileByUserId
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProfiles)
  .post(protect, upsertProfile);

router.get('/me', protect, getMyProfile);
router.get('/user/:user_id', getProfileByUserId);

export default router;
