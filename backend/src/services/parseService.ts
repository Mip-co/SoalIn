import { extractTextFromPdf } from './pdfService';
import { extractTextFromDocx } from './docxReaderService';
import { sanitizeText } from '../utils/textCleaner';
import { ExtractTextResponse } from '../types';

export async function parseUploadedFile(
  buffer: Buffer,
  mimetype: string
): Promise<ExtractTextResponse> {
  let rawText: string;
  let source: 'pdf' | 'docx';

  if (mimetype === 'application/pdf') {
    rawText = await extractTextFromPdf(buffer);
    source = 'pdf';
  } else {
    rawText = await extractTextFromDocx(buffer);
    source = 'docx';
  }

  const extractedText = sanitizeText(rawText);

  return {
    extractedText,
    charCount: extractedText.length,
    source,
  };
}
