import { Router } from 'express';
import { handleImageUpload } from '../controllers/geminicontroller';
import { upload } from '../middlewares/geminimiddleware';

const router = Router();

router.post('/upload-image', upload.single('file'), handleImageUpload);

export default router;