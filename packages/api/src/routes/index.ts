import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './users.routes.js';
import documentsRoutes from './documents.routes.js';
import distributionRoutes from './distribution.routes.js';
import financialFlowRoutes from './financial-flow.routes.js';

const router = express.Router();

// Authentication routes (public)
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', userRoutes);
router.use('/documents', documentsRoutes);
router.use('/distribution', distributionRoutes);
router.use('/financial-flow', financialFlowRoutes);

export default router;
