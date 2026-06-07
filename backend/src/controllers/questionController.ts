import { Request, Response, NextFunction } from 'express';
import { parseUploadedFile } from '../services/parseService';
import { generateQuestions, regenerateSingleQuestion } from '../services/geminiService';
import { generateRequestSchema } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';

export async function uploadAndExtract(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw createError('Tidak ada file yang diupload', 400);
    }

    const result = await parseUploadedFile(req.file.buffer, req.file.mimetype);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function generate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = generateRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      throw createError(parsed.error.errors[0].message, 400);
    }

    const { kisiKisi, settings } = parsed.data;
    const questions = await generateQuestions(kisiKisi, settings);

    res.json({
      success: true,
      data: {
        questions,
        totalGenerated: questions.length,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function regenerate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { originalQuestion, kisiKisi, settings } = req.body;

    if (!originalQuestion || !kisiKisi || !settings) {
      throw createError('Data tidak lengkap untuk regenerasi soal', 400);
    }

    const question = await regenerateSingleQuestion(originalQuestion, kisiKisi, settings);

    res.json({
      success: true,
      data: { question },
    });
  } catch (err) {
    next(err);
  }
}
