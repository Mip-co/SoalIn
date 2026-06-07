import pdfParse from 'pdf-parse';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF tidak mengandung teks yang dapat dibaca. Pastikan PDF bukan hasil scan gambar.');
    }
    return data.text;
  } catch (err: any) {
    if (err.message.includes('tidak mengandung')) throw err;
    throw new Error('Gagal membaca file PDF. Pastikan file tidak rusak.');
  }
}
