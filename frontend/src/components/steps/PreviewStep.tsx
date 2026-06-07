import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RefreshCw, Download, ArrowLeft, ChevronDown, ChevronUp, ImagePlus, X } from 'lucide-react';
import { Question, QuestionSettings, ExportMetadata, MultipleChoiceQuestion } from '@/types';
import { regenerateQuestion, exportToDocx } from '@/services/api';
import ExportModal from '@/components/shared/ExportModal';

interface PreviewStepProps {
  questions: Question[];
  setQuestions: (qs: Question[]) => void;
  kisiKisi: string;
  settings: QuestionSettings;
  onBack: () => void;
}

function QuestionCard({
  question, index, onDelete, onRegenerate, onEdit, isRegenerating,
}: {
  question: Question; index: number; onDelete: () => void;
  onRegenerate: () => void; onEdit: (q: Question) => void; isRegenerating: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editingText, setEditingText] = useState(question.text);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const typeLabel = {
    multiple_choice: '🔤 Pilihan Ganda',
    essay: '✍️ Essay',
    true_false: '✅ Benar/Salah',
  }[question.type];

  const handleTextBlur = () => onEdit({ ...question, text: editingText });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Ukuran gambar maksimal 5MB'); return; }
    const reader = new FileReader();
    reader.onload = () => onEdit({ ...question, text: editingText, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="card mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center">{index + 1}</span>
          <span className="text-xs font-medium text-text-secondary bg-background px-2 py-1 rounded-lg">{typeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-xl text-text-secondary hover:text-purple-500 hover:bg-purple-50 transition-all" title="Tambah gambar">
            <ImagePlus size={16} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <button onClick={onRegenerate} disabled={isRegenerating} className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-blue-50 transition-all disabled:opacity-50" title="Generate ulang">
            <RefreshCw size={16} className={isRegenerating ? 'animate-spin' : ''} />
          </button>
          <button onClick={onDelete} className="p-2 rounded-xl text-text-secondary hover:text-red-500 hover:bg-red-50 transition-all" title="Hapus soal">
            <Trash2 size={16} />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-xl text-text-secondary hover:bg-background">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div>
          <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} onBlur={handleTextBlur} rows={2} className="input-base text-sm mb-3 resize-none" />

          {question.image ? (
            <div className="relative mb-3 inline-block">
              <img src={question.image} alt="Gambar soal" className="max-h-48 rounded-xl border border-border object-contain" />
              <button onClick={() => onEdit({ ...question, image: undefined })} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow">
                <X size={12} />
              </button>
            </div>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} className="mb-3 flex items-center gap-2 text-xs text-text-secondary hover:text-purple-500 border border-dashed border-border hover:border-purple-300 px-3 py-2 rounded-xl transition-all">
              <ImagePlus size={14} /> Tambah gambar ke soal ini (opsional)
            </button>
          )}

          {question.type === 'multiple_choice' && (
            <div className="space-y-1 mb-3">
              {(question as MultipleChoiceQuestion).options.map((opt, i) => (
                <div key={i} className={`px-3 py-2 rounded-xl text-sm flex items-center gap-2 ${(question as MultipleChoiceQuestion).answer === opt[0] ? 'bg-green-50 border border-green-300 text-green-700' : 'bg-background text-text-secondary'}`}>
                  {opt}
                  {(question as MultipleChoiceQuestion).answer === opt[0] && <span className="ml-auto text-xs font-semibold text-green-600">✓ Kunci</span>}
                </div>
              ))}
            </div>
          )}

          {question.type === 'essay' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm text-blue-800">
              <span className="font-semibold">Panduan Jawaban:</span> {question.answer}
            </div>
          )}

          {question.type === 'true_false' && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm text-green-800">
              <span className="font-semibold">Jawaban:</span> {question.answer ? 'Benar' : 'Salah'}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function PreviewStep({ questions, setQuestions, kisiKisi, settings, onBack }: PreviewStepProps) {
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDelete = (id: string) => setQuestions(questions.filter((q) => q.id !== id));
  const handleEdit = (updated: Question) => setQuestions(questions.map((q) => (q.id === updated.id ? updated : q)));

  const handleRegenerate = async (question: Question) => {
    setRegeneratingId(question.id);
    try {
      const newQ = await regenerateQuestion(question, kisiKisi, settings);
      setQuestions(questions.map((q) => (q.id === question.id ? { ...newQ, id: question.id } : q)));
    } catch { alert('Gagal generate ulang soal. Coba lagi.'); }
    finally { setRegeneratingId(null); }
  };

  const handleExport = async (metadata: ExportMetadata, includeAnswerKey: boolean, templateFile?: File) => {
    setIsExporting(true);
    try {
      await exportToDocx(questions, metadata, includeAnswerKey, templateFile);
      setShowExportModal(false);
    } catch { alert('Gagal export soal. Coba lagi.'); }
    finally { setIsExporting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-text-primary">Preview Soal ({questions.length} soal)</h2>
          <p className="text-text-secondary text-sm">Klik teks untuk mengedit. 🖼️ tambah gambar. 🔄 generate ulang.</p>
        </div>
        <button onClick={() => setShowExportModal(true)} disabled={questions.length === 0} className="btn-primary flex items-center gap-2">
          <Download size={18} /> Download DOCX
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="card text-center py-12 text-text-secondary">Semua soal telah dihapus. Kembali untuk generate ulang.</div>
      ) : (
        <AnimatePresence>
          {questions.map((q, idx) => (
            <QuestionCard key={q.id} question={q} index={idx}
              onDelete={() => handleDelete(q.id)}
              onRegenerate={() => handleRegenerate(q)}
              onEdit={handleEdit}
              isRegenerating={regeneratingId === q.id}
            />
          ))}
        </AnimatePresence>
      )}

      <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border text-text-secondary hover:bg-background transition-all mt-2">
        <ArrowLeft size={18} /> Kembali
      </button>

      {showExportModal && (
        <ExportModal settings={settings} onExport={handleExport} onClose={() => setShowExportModal(false)} isLoading={isExporting} />
      )}
    </div>
  );
}
