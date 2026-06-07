import mammoth from 'mammoth';

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('File DOCX tidak mengandung teks yang dapat dibaca.');
    }
    return result.value;
  } catch (err: any) {
    if (err.message.includes('tidak mengandung')) throw err;
    throw new Error('Gagal membaca file DOCX. Pastikan file tidak rusak.');
  }
}
