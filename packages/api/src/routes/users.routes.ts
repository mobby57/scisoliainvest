import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all user routes
router.use(authMiddleware);

// TODO: Implement user endpoints
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
