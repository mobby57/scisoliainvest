import { Router } from 'express';
import { createSci, getSciList, getSciById, updateSci, deleteSci } from '../controllers/sci.controller';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateJWT);

// SCI CRUD routes
router.post('/', createSci);
router.get('/', getSciList);
router.get('/:id', getSciById);
router.put('/:id', updateSci);
router.delete('/:id', deleteSci);

export default router;