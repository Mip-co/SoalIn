import { Request, Response, NextFunction } from 'express';
import { buildDocx } from '../services/docxExportService';
import { createError } from '../middleware/errorHandler';

export async function exportDocx(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const questionsRaw = req.body.questions;
    const metadataRaw = req.body.metadata;
    const includeAnswerKey = req.body.includeAnswerKey === 'true' || req.body.includeAnswerKey === true;

    if (!questionsRaw || !metadataRaw) {
      throw createError('Data soal atau metadata tidak lengkap', 400);
    }

    const questions = typeof questionsRaw === 'string' ? JSON.parse(questionsRaw) : questionsRaw;
    const metadata = typeof metadataRaw === 'string' ? JSON.parse(metadataRaw) : metadataRaw;

    if (!questions || questions.length === 0) {
      throw createError('Tidak ada soal untuk diexport', 400);
    }

    // Template kop (opsional)
    const templateBuffer = req.file ? req.file.buffer : undefined;

    const buffer = await buildDocx(questions, metadata, includeAnswerKey, templateBuffer);

    const filename = `Soal_${metadata.subject || 'Ujian'}_${metadata.classLevel || ''}_${metadata.date || ''}.docx`
      .replace(/\s+/g, '_');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
