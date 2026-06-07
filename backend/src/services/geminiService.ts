import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, QuestionSettings } from '../types';
import { buildGeneratePrompt, buildRegeneratePrompt } from '../utils/promptBuilder';

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY tidak ditemukan di environment variables');
  return new GoogleGenerativeAI(apiKey);
};

function parseJsonResponse(text: string): any {
  const cleaned = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  return JSON.parse(cleaned);
}

export async function generateQuestions(
  kisiKisi: string,
  settings: QuestionSettings
): Promise<Question[]> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8192,
    },
  });

  const prompt = buildGeneratePrompt(kisiKisi, settings);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed = parseJsonResponse(text);
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Format respons AI tidak valid');
    }

    // Assign proper IDs
    const questions: Question[] = parsed.questions.map((q: any, index: number) => ({
      ...q,
      id: `q${index + 1}-${Date.now()}`,
    }));

    return questions;
  } catch {
    throw new Error('Gagal memproses respons dari AI. Coba lagi.');
  }
}

export async function regenerateSingleQuestion(
  originalQuestion: Question,
  kisiKisi: string,
  settings: QuestionSettings
): Promise<Question> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const prompt = buildRegeneratePrompt(
    JSON.stringify(originalQuestion, null, 2),
    kisiKisi,
    settings,
    originalQuestion.type
  );

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed = parseJsonResponse(text);
    return {
      ...parsed,
      id: `q-regen-${Date.now()}`,
    } as Question;
  } catch {
    throw new Error('Gagal memproses respons dari AI. Coba lagi.');
  }
}
