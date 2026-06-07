import { z } from 'zod';

export const questionSettingsSchema = z.object({
  pgCount: z.number().min(0).max(50),
  essayCount: z.number().min(0).max(20),
  tfCount: z.number().min(0).max(30),
  classLevel: z.string().min(1),
  difficulty: z.enum(['Mudah', 'Sedang', 'Sulit']),
  subject: z.string().min(1),
});

export const generateRequestSchema = z.object({
  kisiKisi: z.string().min(10, 'Kisi-kisi terlalu singkat').max(15000),
  settings: questionSettingsSchema,
}).refine(
  (data) => data.settings.pgCount + data.settings.essayCount + data.settings.tfCount > 0,
  { message: 'Minimal 1 soal harus dipilih' }
);

export const exportRequestSchema = z.object({
  metadata: z.object({
    schoolName: z.string().min(1),
    subject: z.string().min(1),
    classLevel: z.string().min(1),
    date: z.string().min(1),
    teacherName: z.string().optional(),
    duration: z.string().optional(),
  }),
  questions: z.array(z.any()).min(1, 'Tidak ada soal untuk diexport'),
  includeAnswerKey: z.boolean(),
});
