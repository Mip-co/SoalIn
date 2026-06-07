import { Router, Request, Response } from 'express';
import questionRoutes from './questionRoutes';
import exportRoutes from './exportRoutes';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
  });
});

router.use('/questions', questionRoutes);
router.use('/export', exportRoutes);

export default router;
