import express from 'express';

const router = express.Router();

// TODO: Implement authentication endpoints
router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/refresh', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
