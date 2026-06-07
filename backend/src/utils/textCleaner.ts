export function cleanText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\x20-\x7E\n\u00C0-\u024F\u0100-\u017E]/g, '')
    .trim();
}

export function truncateText(text: string, maxChars: number = 12000): string {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars) + '\n\n[Teks dipotong karena terlalu panjang]';
}

export function sanitizeText(text: string): string {
  const cleaned = cleanText(text);
  return truncateText(cleaned);
}
