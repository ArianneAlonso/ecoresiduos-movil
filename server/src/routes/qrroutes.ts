import { Router } from 'express';
import { generateQRCode, scanQRCode } from '../controllers/qrcontroller';
import { protect, isDriver } from '../middlewares/authmiddleware';

const router = Router();

// --- Driver ---
router.post('/generate', protect, isDriver, generateQRCode);

// --- User ---
router.post('/scan', protect, scanQRCode);

export default router;