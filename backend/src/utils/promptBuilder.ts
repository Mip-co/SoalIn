import { QuestionSettings } from '../types';

export function buildGeneratePrompt(kisiKisi: string, settings: QuestionSettings): string {
  const { pgCount, essayCount, tfCount, classLevel, difficulty, subject } = settings;

  const questionSpec: string[] = [];
  if (pgCount > 0) questionSpec.push(`- ${pgCount} soal Pilihan Ganda (4 opsi: A, B, C, D)`);
  if (essayCount > 0) questionSpec.push(`- ${essayCount} soal Essay`);
  if (tfCount > 0) questionSpec.push(`- ${tfCount} soal Benar/Salah`);

  return `Kamu adalah asisten pembuat soal ujian profesional untuk guru Indonesia.

Buat soal ujian berdasarkan kisi-kisi berikut:

=== KISI-KISI ===
${kisiKisi}
=================

Ketentuan soal:
${questionSpec.join('\n')}
- Mata Pelajaran: ${subject}
- Kelas: ${classLevel}
- Tingkat Kesulitan: ${difficulty}
- Bahasa: Indonesia
- Soal harus sesuai dengan kurikulum dan usia peserta didik

Kembalikan HANYA JSON valid tanpa markdown, tanpa penjelasan, tanpa backtick, langsung JSON dengan format berikut:

{
  "questions": [
    {
      "id": "uuid-string",
      "type": "multiple_choice",
      "text": "Teks pertanyaan di sini?",
      "options": ["A. Opsi pertama", "B. Opsi kedua", "C. Opsi ketiga", "D. Opsi keempat"],
      "answer": "A",
      "explanation": "Penjelasan singkat mengapa jawaban ini benar"
    },
    {
      "id": "uuid-string",
      "type": "essay",
      "text": "Teks pertanyaan essay di sini?",
      "answer": "Kunci jawaban atau panduan penilaian"
    },
    {
      "id": "uuid-string",
      "type": "true_false",
      "text": "Pernyataan yang harus dinilai benar atau salah.",
      "answer": true,
      "explanation": "Penjelasan singkat"
    }
  ]
}

PENTING: 
- Setiap soal HARUS memiliki "id" unik (gunakan format "q1", "q2", dst)
- type harus salah satu dari: "multiple_choice", "essay", "true_false"
- Untuk multiple_choice, "answer" adalah huruf pilihan (A/B/C/D)
- Untuk true_false, "answer" adalah true atau false (boolean)
- Jangan tambahkan field lain di luar format di atas`;
}

export function buildRegeneratePrompt(
  originalQuestion: string,
  kisiKisi: string,
  settings: QuestionSettings,
  questionType: string
): string {
  return `Kamu adalah asisten pembuat soal ujian profesional untuk guru Indonesia.

Buat 1 soal BARU dengan tipe "${questionType}" berdasarkan kisi-kisi yang sama, namun BERBEDA dari soal sebelumnya.

=== KISI-KISI ===
${kisiKisi}
=================

Soal sebelumnya (jangan buat soal yang sama):
${originalQuestion}

Ketentuan:
- Mata Pelajaran: ${settings.subject}
- Kelas: ${settings.classLevel}
- Tingkat Kesulitan: ${settings.difficulty}
- Bahasa: Indonesia

Kembalikan HANYA JSON valid tanpa markdown:

${
  questionType === 'multiple_choice'
    ? `{
  "id": "q-new",
  "type": "multiple_choice",
  "text": "Pertanyaan baru?",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "answer": "A",
  "explanation": "Penjelasan jawaban"
}`
    : questionType === 'essay'
    ? `{
  "id": "q-new",
  "type": "essay",
  "text": "Pertanyaan essay baru?",
  "answer": "Panduan jawaban"
}`
    : `{
  "id": "q-new",
  "type": "true_false",
  "text": "Pernyataan baru.",
  "answer": true,
  "explanation": "Penjelasan"
}`
}`;
}
