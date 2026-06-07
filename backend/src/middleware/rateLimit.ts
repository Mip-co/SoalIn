import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100,
  message: {
    success: false,
    error: 'Terlalu banyak permintaan. Coba lagi dalam 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: 'Terlalu banyak permintaan generate soal. Coba lagi dalam 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
