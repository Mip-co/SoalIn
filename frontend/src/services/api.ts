import axios from 'axios';
import { Question, QuestionSettings, ExportMetadata } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
});

// Upload PDF/DOCX kisi-kisi
export async function uploadFile(file: File): Promise<{ extractedText: string; charCount: number; source: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/questions/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

// Generate soal
export async function generateQuestions(kisiKisi: string, settings: QuestionSettings): Promise<Question[]> {
  const res = await api.post('/questions/generate', { kisiKisi, settings });
  return res.data.data.questions;
}

// Regenerate satu soal
export async function regenerateQuestion(
  originalQuestion: Question,
  kisiKisi: string,
  settings: QuestionSettings
): Promise<Question> {
  const res = await api.post('/questions/regenerate', { originalQuestion, kisiKisi, settings });
  return res.data.data.question;
}

// Export ke DOCX (dengan atau tanpa template kop)
export async function exportToDocx(
  questions: Question[],
  metadata: ExportMetadata,
  includeAnswerKey: boolean,
  templateFile?: File
): Promise<void> {
  const formData = new FormData();
  formData.append('questions', JSON.stringify(questions));
  formData.append('metadata', JSON.stringify(metadata));
  formData.append('includeAnswerKey', String(includeAnswerKey));
  if (templateFile) {
    formData.append('template', templateFile);
  }

  const res = await api.post('/export/docx', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  const filename = `Soal_${metadata.subject}_${metadata.classLevel}_${metadata.date}.docx`.replace(/\s+/g, '_');
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
