import {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, ImageRun,
} from 'docx';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import {
  Question, ExportMetadata, MultipleChoiceQuestion, EssayQuestion, TrueFalseQuestion,
} from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function base64ToBuffer(base64: string): { buffer: Buffer; ext: string } {
  const match = base64.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/);
  if (!match) throw new Error('Format gambar tidak valid');
  return { buffer: Buffer.from(match[2], 'base64'), ext: match[1] === 'jpg' ? 'jpeg' : match[1] };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── XML Builder ─────────────────────────────────────────────────────────────

function xmlParagraph(text: string, opts: {
  bold?: boolean; size?: number; indent?: number; color?: string; italic?: boolean;
} = {}): string {
  const { bold = false, size = 22, indent = 0, color, italic = false } = opts;
  const rPr = [
    bold ? '<w:b/>' : '',
    italic ? '<w:i/>' : '',
    color ? `<w:color w:val="${color}"/>` : '',
    `<w:sz w:val="${size}"/>`,
    `<w:szCs w:val="${size}"/>`,
    '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>',
  ].join('');

  const pPr = indent > 0
    ? `<w:pPr><w:ind w:left="${indent}"/></w:pPr>`
    : '';

  return `
    <w:p>
      ${pPr}
      <w:r>
        <w:rPr>${rPr}</w:rPr>
        <w:t xml:space="preserve">${escapeXml(text)}</w:t>
      </w:r>
    </w:p>`;
}

function xmlEmptyParagraph(): string {
  return '<w:p><w:r><w:t></w:t></w:r></w:p>';
}

function xmlSectionHeader(label: string): string {
  return xmlParagraph(label, { bold: true, size: 24 });
}

function xmlLine(): string {
  return `
    <w:p>
      <w:pPr>
        <w:pBdr>
          <w:bottom w:val="single" w:sz="4" w:space="1" w:color="000000"/>
        </w:pBdr>
      </w:pPr>
      <w:r><w:t></w:t></w:r>
    </w:p>`;
}

// ─── Question XML ─────────────────────────────────────────────────────────────

function buildQuestionXml(question: Question, number: number, includeAnswerKey: boolean): string {
  let xml = '';

  // Question text
  xml += xmlParagraph(`${number}. ${question.text}`);

  // Multiple choice
  if (question.type === 'multiple_choice') {
    const mc = question as MultipleChoiceQuestion;
    mc.options.forEach((opt) => {
      xml += xmlParagraph(opt, { indent: 720 });
    });
    if (includeAnswerKey) {
      xml += xmlParagraph(`Jawaban: ${mc.answer}`, { bold: true, color: '0000FF', indent: 720, size: 20 });
    }
  }

  // Essay
  if (question.type === 'essay') {
    const eq = question as EssayQuestion;
    for (let i = 0; i < 4; i++) {
      xml += xmlParagraph('_'.repeat(80), { size: 20 });
    }
    if (includeAnswerKey) {
      xml += xmlParagraph(`Kunci: ${eq.answer}`, { bold: true, color: '0000FF', indent: 720, size: 20 });
    }
  }

  // True/false
  if (question.type === 'true_false') {
    const tf = question as TrueFalseQuestion;
    if (includeAnswerKey) {
      xml += xmlParagraph(`Jawaban: ${tf.answer ? 'Benar' : 'Salah'}`, { bold: true, color: '0000FF', indent: 720, size: 20 });
    }
  }

  xml += xmlEmptyParagraph();
  return xml;
}

function buildAllQuestionsXml(questions: Question[], includeAnswerKey: boolean): string {
  const pg = questions.filter((q): q is MultipleChoiceQuestion => q.type === 'multiple_choice');
  const essay = questions.filter((q): q is EssayQuestion => q.type === 'essay');
  const tf = questions.filter((q): q is TrueFalseQuestion => q.type === 'true_false');

  let xml = '';
  let num = 1;

  if (pg.length > 0) {
    xml += xmlSectionHeader('A. PILIHAN GANDA');
    xml += xmlParagraph('Pilihlah jawaban yang paling tepat!', { italic: true });
    xml += xmlEmptyParagraph();
    pg.forEach((q) => { xml += buildQuestionXml(q, num++, includeAnswerKey); });
  }

  if (essay.length > 0) {
    xml += xmlSectionHeader('B. ESSAY');
    xml += xmlParagraph('Jawablah pertanyaan berikut dengan benar dan lengkap!', { italic: true });
    xml += xmlEmptyParagraph();
    essay.forEach((q) => { xml += buildQuestionXml(q, num++, includeAnswerKey); });
  }

  if (tf.length > 0) {
    xml += xmlSectionHeader('C. BENAR / SALAH');
    xml += xmlParagraph('Tuliskan B jika Benar dan S jika Salah!', { italic: true });
    xml += xmlEmptyParagraph();
    tf.forEach((q) => {
      const tfQ = { ...q, text: `( B / S )  ${q.text}` };
      xml += buildQuestionXml(tfQ as Question, num++, includeAnswerKey);
    });
  }

  return xml;
}

// ─── Template Injection ───────────────────────────────────────────────────────

async function injectIntoTemplate(
  templateBuffer: Buffer,
  questionsXml: string
): Promise<Buffer> {
  const zip = await JSZip.loadAsync(templateBuffer);

  const docXmlFile = zip.file('word/document.xml');
  if (!docXmlFile) throw new Error('File template tidak valid (word/document.xml tidak ditemukan)');

  let docXml = await docXmlFile.async('string');

  // Sisipkan soal tepat sebelum </w:body>
  // sectPr adalah tag terakhir sebelum </w:body> yang berisi pengaturan halaman
  // Kita sisipkan soal sebelum <w:sectPr> agar orientasi halaman tetap dari template
  if (docXml.includes('<w:sectPr')) {
    // Sisipkan sebelum sectPr terakhir
    const sectPrIndex = docXml.lastIndexOf('<w:sectPr');
    docXml = docXml.slice(0, sectPrIndex) + questionsXml + docXml.slice(sectPrIndex);
  } else if (docXml.includes('</w:body>')) {
    // Fallback: sisipkan sebelum </w:body>
    docXml = docXml.replace('</w:body>', questionsXml + '</w:body>');
  } else {
    throw new Error('Struktur file template tidak dikenali');
  }

  zip.file('word/document.xml', docXml);

  const result = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  return result;
}

// ─── Auto Header (fallback tanpa template) ────────────────────────────────────

function createAutoHeader(metadata: ExportMetadata): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: metadata.schoolName.toUpperCase(), bold: true, size: 28, font: 'Times New Roman' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `SOAL UJIAN ${metadata.subject.toUpperCase()}`, bold: true, size: 24, font: 'Times New Roman' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({
        text: `Kelas: ${metadata.classLevel}  |  Tanggal: ${metadata.date}${metadata.duration ? `  |  Waktu: ${metadata.duration}` : ''}`,
        size: 22, font: 'Times New Roman',
      })],
    }),
    new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '000000' } }, children: [] }),
    new Paragraph({ children: [] }),
  ];

  if (metadata.teacherName || metadata.subject) {
    const infoLine = [
      metadata.subject ? `Mata Pelajaran: ${metadata.subject}` : '',
      metadata.teacherName ? `Guru: ${metadata.teacherName}` : '',
    ].filter(Boolean).join('   |   ');
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: infoLine, size: 22, font: 'Times New Roman' })],
    }));
    paragraphs.push(new Paragraph({ children: [] }));
  }

  return paragraphs;
}

function buildQuestionParagraphs(question: Question, number: number, includeAnswerKey: boolean): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(new Paragraph({
    children: [new TextRun({ text: `${number}. ${question.text}`, size: 22, font: 'Times New Roman' })],
  }));

  if (question.image) {
    try {
      const { buffer, ext } = base64ToBuffer(question.image);
      paragraphs.push(new Paragraph({
        indent: { left: 720 },
        children: [new ImageRun({ data: buffer, transformation: { width: 300, height: 200 }, type: ext as any })],
      }));
    } catch { /* skip */ }
  }

  if (question.type === 'multiple_choice') {
    const mc = question as MultipleChoiceQuestion;
    mc.options.forEach((opt) => {
      paragraphs.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: opt, size: 22, font: 'Times New Roman' })] }));
    });
    if (includeAnswerKey) {
      paragraphs.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: `Jawaban: ${mc.answer}`, bold: true, color: '0000FF', size: 20, font: 'Times New Roman' })] }));
    }
  }

  if (question.type === 'essay') {
    const eq = question as EssayQuestion;
    for (let i = 0; i < 4; i++) {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '_'.repeat(80), size: 20, font: 'Times New Roman' })] }));
    }
    if (includeAnswerKey) {
      paragraphs.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: `Kunci: ${eq.answer}`, bold: true, color: '0000FF', size: 20, font: 'Times New Roman' })] }));
    }
  }

  if (question.type === 'true_false') {
    const tf = question as TrueFalseQuestion;
    if (includeAnswerKey) {
      paragraphs.push(new Paragraph({ indent: { left: 720 }, children: [new TextRun({ text: `Jawaban: ${tf.answer ? 'Benar' : 'Salah'}`, bold: true, color: '0000FF', size: 20, font: 'Times New Roman' })] }));
    }
  }

  paragraphs.push(new Paragraph({ children: [] }));
  return paragraphs;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function buildDocx(
  questions: Question[],
  metadata: ExportMetadata,
  includeAnswerKey: boolean,
  templateBuffer?: Buffer
): Promise<Buffer> {

  // Jika ada template → inject XML soal langsung ke dalam template
  if (templateBuffer) {
    try {
      const questionsXml = buildAllQuestionsXml(questions, includeAnswerKey);
      return await injectIntoTemplate(templateBuffer, questionsXml);
    } catch (err: any) {
      throw new Error(`Gagal memproses template: ${err.message}`);
    }
  }

  // Fallback: buat DOCX dari scratch dengan header otomatis
  const pg = questions.filter((q): q is MultipleChoiceQuestion => q.type === 'multiple_choice');
  const essay = questions.filter((q): q is EssayQuestion => q.type === 'essay');
  const tf = questions.filter((q): q is TrueFalseQuestion => q.type === 'true_false');

  const allParagraphs: Paragraph[] = [...createAutoHeader(metadata)];
  let num = 1;

  if (pg.length > 0) {
    allParagraphs.push(new Paragraph({ children: [new TextRun({ text: 'A. PILIHAN GANDA', bold: true, size: 24, font: 'Times New Roman' })] }));
    allParagraphs.push(new Paragraph({ children: [new TextRun({ text: 'Pilihlah jawaban yang paling tepat!', italics: true, size: 22, font: 'Times New Roman' })] }));
    allParagraphs.push(new Paragraph({ children: [] }));
    pg.forEach((q) => { allParagraphs.push(...buildQuestionParagraphs(q, num++, includeAnswerKey)); });
  }

  if (essay.length > 0) {
    allParagraphs.push(new Paragraph({ children: [new TextRun({ text: 'B. ESSAY', bold: true, size: 24, font: 'Times New Roman' })] }));
    allParagraphs.push(new Paragraph({ children: [new TextRun({ text: 'Jawablah pertanyaan berikut dengan benar dan lengkap!', italics: true, size: 22, font: 'Times New Roman' })] }));
    allParagraphs.push(new Paragraph({ children: [] }));
    essay.forEach((q) => { allParagraphs.push(...buildQuestionParagraphs(q, num++, includeAnswerKey)); });
  }

  if (tf.length > 0) {
    allParagraphs.push(new Paragraph({ children: [new TextRun({ text: 'C. BENAR / SALAH', bold: true, size: 24, font: 'Times New Roman' })] }));
    allParagraphs.push(new Paragraph({ children: [new TextRun({ text: 'Tuliskan B jika Benar dan S jika Salah!', italics: true, size: 22, font: 'Times New Roman' })] }));
    allParagraphs.push(new Paragraph({ children: [] }));
    tf.forEach((q) => {
      const tfQ = { ...q, text: `( B / S )  ${q.text}` };
      allParagraphs.push(...buildQuestionParagraphs(tfQ as Question, num++, includeAnswerKey));
    });
  }

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1080, bottom: 1440, left: 1440 } } },
      children: allParagraphs,
    }],
  });

  return await Packer.toBuffer(doc);
}
