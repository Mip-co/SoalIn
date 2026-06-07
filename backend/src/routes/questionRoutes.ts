import { Router } from 'express';
import { upload } from '../middleware/upload';
import { uploadAndExtract, generate, regenerate } from '../controllers/questionController';
import { generateLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/upload', upload.single('file'), uploadAndExtract);
router.post('/generate', generateLimiter, generate);
router.post('/regenerate', generateLimiter, regenerate);

export default router;
