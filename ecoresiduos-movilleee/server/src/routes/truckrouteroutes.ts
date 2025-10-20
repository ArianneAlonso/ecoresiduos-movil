import { Router } from 'express';
import { createRoute, startRoute, getActiveRouteForZone } from '../controllers/truckroutecontroller';
import { protect, isAdmin, isDriver } from '../middlewares/authmiddleware';

const router = Router();

// --- Admin ---
router.post('/', protect, isAdmin, createRoute);

// --- Driver ---
router.post('/:id/start', protect, isDriver, startRoute);

// --- User ---
router.get('/active', protect, getActiveRouteForZone);

export default router;