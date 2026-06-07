import { Router } from 'express';
import { exportDocx } from '../controllers/exportController';
import { upload } from '../middleware/upload';

const router = Router();

// upload.single('template') — opsional, file kop sekolah .docx
router.post('/docx', upload.single('template'), exportDocx);

export default router;
