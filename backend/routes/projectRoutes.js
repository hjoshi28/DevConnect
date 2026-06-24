import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  deleteProject,
  toggleLikeProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.post('/:id/like', protect, toggleLikeProject);

router.route('/:id')
  .get(getProjectById)
  .delete(protect, deleteProject);

export default router;
